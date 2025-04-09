import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import WhisperAPIService from './WhisperAPIService';

// Import only what we need
import AudioRecorder from './AudioRecorder';

// Polyfill Buffer if needed
if (typeof Buffer === 'undefined') {
    global.Buffer = require('buffer').Buffer;
}

// Constants for the custom binary header
const HEADER_SIZE = 17;
const SESSION_INDEX = 0; // Per instructions
const WAV_HEADER_SKIP_BYTES = 44;

class AudioStreamService {
    constructor() {
        // Initialize recorder
        this.recorder = new AudioRecorder(); 
        
        // Service state
        this.isStreaming = false;
        this.isStopping = false;
        this.stopPromise = null;
        
        // Streaming parameters
        this.streamInterval = null;
        this.streamIntervalMs = 200; // Check for new data every 200ms
        this.lastPosition = WAV_HEADER_SKIP_BYTES; // Start reading *after* WAV header
        this.fixedChunkSize = 32768; // Send 32KB of raw PCM data per chunk (~1s at 16kHz/16bit/mono)
        this.chunkSequence = 0; // Sequence number for the custom header
        
        // Callbacks
        this.onTranscriptionCallback = null;
        this.onSpeechEndCallback = null;
        this.onErrorCallback = null;
    }

    setCallbacks({ onTranscription, onError, onSpeechEnd }) {
        this.onTranscriptionCallback = onTranscription;
        this.onErrorCallback = onError;
        this.onSpeechEndCallback = onSpeechEnd;
        
        // Set up WebSocket event listeners
        WhisperAPIService.on('transcription', (data) => {
            if (this.onTranscriptionCallback) {
                this.onTranscriptionCallback(data.transcription, data.isFinal);
            }
            
            if (data.shouldStop) {
                this.stopStreaming();
            }
        });
        
        WhisperAPIService.on('error', (error) => {
            if (this.onErrorCallback) {
                this.onErrorCallback(error.message || 'WebSocket error');
            }
        });
    }

    setAudioFormat(format) {
        this.recorder.setAudioFormat(format);
    }

    async startStreaming() {
        if (this.isStreaming) return false;
        if (this.isStopping && this.stopPromise) {
            await this.stopPromise;
        }

        try {
            // Reset state
            this.isStreaming = false;
            this.isStopping = false;
            this.lastPosition = WAV_HEADER_SKIP_BYTES;
            this.chunkSequence = 0; // Reset sequence number
            
            // Create WebSocket connection with known audio parameters
            const session = await WhisperAPIService.createSession({ 
                format: 'pcm_s16le', // Assuming server expects raw PCM 16-bit Little Endian
                sampleRate: 16000, // Match server expectation (e.g., 16000 Hz)
                language: 'en',
                numChannels: 1,
            });
            
            if (!session || !session.success) {
                const errorMsg = session?.error || 'Failed to create WebSocket session';
                console.error(`[AudioStreamService] ${errorMsg}`);
                if (this.onErrorCallback) {
                    this.onErrorCallback(errorMsg);
                }
                return false;
            }
            
            console.log(`[AudioStreamService] WebSocket connection established: ${session.sessionId}`);
            
            // Start recording - ENSURE recorder options match server (16kHz, mono, s16le)
            const recording = await this.recorder.startRecording({
                 sampleRate: 16000, // CRITICAL: Match server!
                 numberOfChannels: 1, // CRITICAL: Match server!
                 // Add other necessary options for PCM S16LE output if available
            });
            if (!recording) {
                console.error('[AudioStreamService] Failed to start recording.');
                WhisperAPIService.closeConnection();
                return false;
            }
            console.log('[AudioStreamService] Recording started.');
            
            // Start streaming immediately
            this.isStreaming = true;
            this.startDirectStreaming();
            
            return true;
        } catch (error) {
            console.error('[AudioStreamService] Error starting streaming:', error);
            WhisperAPIService.closeConnection();
            if (this.onErrorCallback) {
                this.onErrorCallback(`Failed to start streaming: ${error.message}`);
            }
            return false;
        }
    }

    startDirectStreaming() {
        if (this.streamInterval) {
            clearInterval(this.streamInterval);
        }
        
        this.streamInterval = setInterval(async () => {
            if (!this.isStreaming || this.isStopping) {
                clearInterval(this.streamInterval);
                this.streamInterval = null;
                return;
            }
            
            // Direct streaming of any new audio data
            await this.streamDirectAudio();
        }, this.streamIntervalMs);
    }
    
    async streamDirectAudio() {
        if (!this.isStreaming) return;
        
        try {
            const audioFile = await this.recorder.getAudioFile();
            if (!audioFile || !audioFile.uri) return;
            
            const info = await FileSystem.getInfoAsync(audioFile.uri);
            // Ensure file exists, has size, and there's data beyond the WAV header start position
            if (!info.exists || info.size === undefined || info.size <= WAV_HEADER_SKIP_BYTES) return;

            // --- Fixed-size chunking logic for PCM ---
            // Process all available full chunks since the last check
            while (info.size - this.lastPosition >= this.fixedChunkSize) {
                const chunkSize = this.fixedChunkSize;
                const currentPosition = this.lastPosition;
                
                try {
                    // Read raw PCM data chunk (skipping WAV header initially)
                    const base64Data = await FileSystem.readAsStringAsync(audioFile.uri, {
                        encoding: FileSystem.EncodingType.Base64,
                        position: currentPosition,
                        length: chunkSize
                    });
                    
                    if (!base64Data) {
                        console.warn(`[AudioStreamService] Failed to read chunk data at position ${currentPosition}`);
                        break; // Stop processing chunks in this interval if read fails
                    }
                    
                    // Convert base64 PCM data to binary (ArrayBuffer)
                    const pcmData = this._base64ToBinary(base64Data);
                    if (pcmData.byteLength === 0) {
                        console.warn(`[AudioStreamService] Empty PCM data for chunk sequence ${this.chunkSequence} at position ${currentPosition}`);
                        // Advance position even if data is empty to avoid getting stuck
                        this.lastPosition += chunkSize; 
                        continue; // Try next potential chunk
                    }
                    
                    // Create the custom header for this chunk
                    const header = this._createHeader(this.chunkSequence, false); // false: not last chunk
                    
                    // Combine header + PCM data into a single ArrayBuffer
                    const combinedBuffer = new ArrayBuffer(HEADER_SIZE + pcmData.byteLength);
                    const combinedView = new Uint8Array(combinedBuffer);
                    combinedView.set(new Uint8Array(header), 0);
                    combinedView.set(new Uint8Array(pcmData), HEADER_SIZE);

                    // Diagnostic log (optional, shows first 4 bytes of PCM data)
                    // const firstBytes = combinedView.slice(HEADER_SIZE, HEADER_SIZE + 4);
                    // console.log(`[AudioStreamService] Sending Chunk #${this.chunkSequence} - PCM Size: ${pcmData.byteLength}, StartBytes: [${firstBytes.join(',')}]`);
                    
                    // Send combined data (Header + PCM)
                    const success = WhisperAPIService.streamAudio(combinedBuffer);
                    
                    if (success) {
                        // console.log(`[AudioStreamService] Chunk #${this.chunkSequence} sent (${combinedBuffer.byteLength} bytes total)`);
                        this.lastPosition += chunkSize; // Move position *after* successful send
                        this.chunkSequence++;
                    } else {
                        console.warn(`[AudioStreamService] Failed to send chunk #${this.chunkSequence}. Stopping chunk processing for this interval.`);
                        break; // Stop trying in this interval if WebSocket send fails
                    }
                } catch (error) {
                    console.error(`[AudioStreamService] Error processing chunk sequence ${this.chunkSequence} at position ${currentPosition}:`, error);
                    // Attempt to advance position past potentially corrupted chunk to avoid infinite loop
                    this.lastPosition += chunkSize; 
                    console.warn(`[AudioStreamService] Advanced position past potentially problematic chunk`);
                    break; // Stop trying in this interval on error
                }
                // Loop continues if more full chunks are available based on initial info.size
            } 
            
        } catch (error) {
            // Catch errors from getAudioFile or getInfoAsync
            console.error('[AudioStreamService] Error in streamDirectAudio main loop:', error);
        }
    }
    
    // Direct base64 to binary conversion
    _base64ToBinary(base64) {
        try {
            // Use Buffer polyfill for robust base64 decoding
            const buffer = Buffer.from(base64, 'base64');
            // Return ArrayBuffer
            return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
        } catch (error) {
            console.error('[AudioStreamService] Binary conversion error:', error);
            return new ArrayBuffer(0);
        }
    }

    async stopStreaming() {
        if (!this.isStreaming || this.isStopping) {
            return;
        }

        console.log('[AudioStreamService] Stopping streaming...');
        this.isStopping = true;

        this.stopPromise = new Promise(async (resolve) => {
            try {
                if (this.streamInterval) {
                    clearInterval(this.streamInterval);
                    this.streamInterval = null;
                }

                this.isStreaming = false;
                
                const audioFile = await this.recorder.stopRecording();
                console.log(`[AudioStreamService] Recording stopped, file size: ${audioFile?.size}`);
                
                if (audioFile && audioFile.uri) {
                    // Send any remaining audio data as the final chunk
                    await this.sendRemainingAudio(audioFile);
                    
                    // Finalize the session - server might expect this or the flag in the last header
                    // await this.finalizeSession(); // Keep or remove based on server protocol
                    console.log('[AudioStreamService] Final audio sent.');
                    resolve(audioFile.uri);
                } else {
                    console.warn('[AudioStreamService] No audio file available after stopping.');
                    this.cleanupAfterStop();
                    resolve(null);
                }
            } catch (error) {
                console.error('[AudioStreamService] Error stopping streaming:', error);
                this.cleanupAfterStop();
                if (this.onErrorCallback) {
                    this.onErrorCallback('Failed to finalize recording');
                }
                resolve(null);
            } finally {
                WhisperAPIService.closeConnection(); // Ensure connection is closed
            }
        });

        return this.stopPromise;
    }
    
    async sendRemainingAudio(audioFile) {
        console.log('[AudioStreamService] Preparing to send remaining audio data...');
        try {
            const info = await FileSystem.getInfoAsync(audioFile.uri);
            if (!info.exists || info.size === undefined) {
                 console.warn('[AudioStreamService] Final audio file info not available.');
                 // Optionally send an empty final chunk if required by server
                 // await this.sendFinalChunkMarker();
                 this.cleanupAfterStop();
                 return;
            }

            // Calculate remaining PCM data size (after skipping header and processing full chunks)
            const remainingSize = info.size - this.lastPosition;
                    
            if (remainingSize > 0) {
                console.log(`[AudioStreamService] Reading final ${remainingSize} bytes of PCM data`);
                    
                try {
                    const remainingBase64 = await FileSystem.readAsStringAsync(audioFile.uri, {
                        encoding: FileSystem.EncodingType.Base64,
                        position: this.lastPosition,
                        length: remainingSize
                    });
                    
                    if (!remainingBase64) { 
                        console.warn('[AudioStreamService] Failed to read final audio data chunk.');
                        this.cleanupAfterStop();
                        return;
                    }
                    
                    const finalPcm = this._base64ToBinary(remainingBase64);
                    if (finalPcm.byteLength === 0) {
                        console.warn('[AudioStreamService] Final PCM data chunk is empty after conversion.');
                         // Optionally send an empty final chunk if required by server
                        // await this.sendFinalChunkMarker();
                        this.cleanupAfterStop();
                        return;
                    }
                    
                    // Create the custom header for the FINAL chunk
                    const finalHeader = this._createHeader(this.chunkSequence, true); // true: this IS the last chunk
                    
                    // Combine header + final PCM data
                    const finalCombinedBuffer = new ArrayBuffer(HEADER_SIZE + finalPcm.byteLength);
                    const finalCombinedView = new Uint8Array(finalCombinedBuffer);
                    finalCombinedView.set(new Uint8Array(finalHeader), 0);
                    finalCombinedView.set(new Uint8Array(finalPcm), HEADER_SIZE);

                    // Diagnostic log for final chunk (optional)
                    // const firstBytes = finalCombinedView.slice(HEADER_SIZE, HEADER_SIZE + 4);
                    // console.log(`[AudioStreamService] Sending Final Chunk #${this.chunkSequence} - PCM Size: ${finalPcm.byteLength}, StartBytes: [${firstBytes.join(',')}]`);
                    
                    // Send the final combined data
                    const success = WhisperAPIService.streamAudio(finalCombinedBuffer);
                    
                    if (success) {
                         console.log(`[AudioStreamService] Sent final chunk #${this.chunkSequence} (${finalCombinedBuffer.byteLength} bytes total)`);
                    } else {
                         console.warn(`[AudioStreamService] Failed to send final chunk #${this.chunkSequence}.`);
                    }

                } catch (error) {
                    console.error(`[AudioStreamService] Error processing final chunk #${this.chunkSequence}:`, error);
                }
            } else {
                console.log('[AudioStreamService] No remaining audio data after last full chunk.');
                // Send an empty final chunk marker if the server requires it
                await this.sendFinalChunkMarker();
            }

        } catch (error) {
            console.error('[AudioStreamService] Error getting info for remaining audio:', error);
        } finally {
             this.cleanupAfterStop(); // Ensure cleanup happens regardless of success/failure
        }
    }

    // Helper to send an empty chunk with the 'isLastChunk' flag set
    async sendFinalChunkMarker() {
         console.log(`[AudioStreamService] Sending empty final chunk marker (sequence ${this.chunkSequence}).`);
         try {
             const finalHeaderOnly = this._createHeader(this.chunkSequence, true);
             const success = WhisperAPIService.streamAudio(finalHeaderOnly);
             if (!success) {
                 console.warn('[AudioStreamService] Failed to send empty final chunk marker.');
             }
         } catch(error) {
             console.error('[AudioStreamService] Error sending empty final chunk marker:', error);
         }
    }

    // Commented out finalizeSession as it might be redundant if the last chunk flag handles it
    // async finalizeSession() { ... }

    cleanupAfterStop() {
        console.log('[AudioStreamService] Cleaning up...');
        // Reset state
        this.recorder.cleanup();
        // Ensure connection is closed in stopStreaming finally block
        // WhisperAPIService.closeConnection(); 
        this.lastPosition = WAV_HEADER_SKIP_BYTES;
        this.chunkSequence = 0;
        this.isStreaming = false; // Ensure state reflects stopped
        this.isStopping = false;
        this.stopPromise = null;
        
        // Ensure streaming interval is stopped
        if (this.streamInterval) {
            clearInterval(this.streamInterval);
            this.streamInterval = null;
        }

        if (this.onSpeechEndCallback) {
            this.onSpeechEndCallback();
        }
        console.log('[AudioStreamService] Cleanup complete.');
    }

    // Helper to create the 17-byte binary header
    _createHeader(sequenceNumber, isLastChunk) {
        const header = new ArrayBuffer(HEADER_SIZE);
        const view = new DataView(header);

        // Session Index (1 byte)
        view.setUint8(0, SESSION_INDEX);

        // Timestamp (8 bytes, BigUInt64LE)
        try {
            const timestamp = BigInt(Date.now());
            view.setBigUint64(1, timestamp, true); // true for little-endian
        } catch (e) { 
             console.error("[AudioStreamService] Error setting timestamp BigInt:", e);
             // Set to 0 or another default if BigInt fails unexpectedly
             view.setBigUint64(1, BigInt(0), true);
        }

        // Sequence Number (8 bytes, BigUInt64LE)
        try {
            view.setBigUint64(9, BigInt(sequenceNumber), true); // true for little-endian
        } catch (e) {
             console.error(`[AudioStreamService] Error setting sequence BigInt (${sequenceNumber}):`, e);
             view.setBigUint64(9, BigInt(0), true);
        }

        // Flags (1 byte)
        const flags = isLastChunk ? 0x01 : 0x00;
        view.setUint8(16, flags);

        return header;
    }
}

// Polyfill for atob/btoa and Buffer if needed in React Native environment
if (typeof Buffer === 'undefined') {
  global.Buffer = require('buffer').Buffer;
}
if (typeof btoa === 'undefined') {
  global.btoa = function (str) {
    return Buffer.from(str, 'binary').toString('base64');
  };
}
if (typeof atob === 'undefined') {
  global.atob = function (b64Encoded) {
    return Buffer.from(b64Encoded, 'base64').toString('binary');
  };
}


export default new AudioStreamService(); 