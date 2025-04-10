import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

/**
 * Handles audio recording functionality
 */
class AudioRecorder {
    constructor() {
        this.recording = null;
        this.audioFormat = 'wav';
        this.lastRecordingUri = null;
        this.interval = null;
    }

    setAudioFormat(format) {
        if (['wav', 'm4a', 'mp4'].includes(format)) {
            this.audioFormat = format;
            console.log(`[AudioRecorder] Audio format set to ${format}, note: wav is preferred for best results`);
        } else {
            console.log(`[AudioRecorder] Unsupported audio format: ${format}, using wav instead`);
            this.audioFormat = 'wav';
        }
    }

    async setupRecording() {
        try {
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
                staysActiveInBackground: true,
                shouldDuckAndroid: true,
                playThroughEarpieceAndroid: false,
                interruptionModeIOS: 2,
                interruptionModeAndroid: 2,
            });
            return true;
        } catch (error) {
            console.error('[AudioRecorder] Failed to set up recording:', error);
            return false;
        }
    }

    async startRecording(options = {}) {
        try {
            // Set up recording permissions and audio mode
            const setupSuccess = await this.setupRecording();
            if (!setupSuccess) return null;

            // Define base options structure expected by createAsync
            let recordingOptions = {
                isMeteringEnabled: true,
                android: {
                    extension: '.wav',
                    outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_DEFAULT,
                    audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC, // Default, needs check for PCM
                    sampleRate: 16000,
                    numberOfChannels: 1,
                    bitRate: 128000,
                    // Add any specific options passed via the 'options' parameter
                    ...options.android
                },
                ios: {
                    extension: '.wav',
                    audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
                    sampleRate: 16000,
                    numberOfChannels: 1,
                    bitRate: 128000, // Informational
                    linearPCMBitDepth: 16,
                    linearPCMIsBigEndian: false,
                    linearPCMIsFloat: false,
                    outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_LINEARPCM, // Force Linear PCM
                    // Add any specific options passed via the 'options' parameter
                    ...options.ios
                }
            };

            // Apply specific overrides passed directly in options (e.g., sampleRate from AudioStreamService)
            if (options.sampleRate) {
                recordingOptions.android.sampleRate = options.sampleRate;
                recordingOptions.ios.sampleRate = options.sampleRate;
            }
            if (options.numberOfChannels) {
                recordingOptions.android.numberOfChannels = options.numberOfChannels;
                recordingOptions.ios.numberOfChannels = options.numberOfChannels;
            }

            // Ensure critical options are set correctly for PCM 16kHz mono
            recordingOptions.android.sampleRate = 16000;
            recordingOptions.android.numberOfChannels = 1;
            recordingOptions.ios.sampleRate = 16000;
            recordingOptions.ios.numberOfChannels = 1;
            recordingOptions.ios.outputFormat = Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_LINEARPCM;
            recordingOptions.ios.linearPCMBitDepth = 16;
            recordingOptions.ios.linearPCMIsBigEndian = false;
            recordingOptions.ios.linearPCMIsFloat = false;

            // Add warning for Android PCM capability
            if (Platform.OS === 'android') {
                console.warn('[AudioRecorder] Android PCM recording requires careful configuration and might depend on device capabilities. Ensure encoder/format allows PCM S16LE if possible.');
            }

            if (Platform.OS === 'ios') {
                await Audio.setIsEnabledAsync(true);
            }

            // Small delay to ensure audio system is ready
            await new Promise(resolve => setTimeout(resolve, 300));

            const { recording } = await Audio.Recording.createAsync(recordingOptions);
            this.recording = recording;
            console.log('[AudioRecorder] Recording started');

            return recording;
        } catch (error) {
            console.error('[AudioRecorder] Error starting recording:', error);
            return null;
        }
    }

    async stopRecording() {
        if (!this.recording) {
            return null;
        }

        try {
            // Stop recording
            const recordingRef = this.recording;
            await recordingRef.stopAndUnloadAsync();
            const uri = recordingRef.getURI();
            this.lastRecordingUri = uri;

            // Get file info
            let info = { exists: false, size: 0, modificationTime: 0 };
            if (uri) {
                try {
                    info = await FileSystem.getInfoAsync(uri);
                } catch (e) {
                    console.warn(`[AudioRecorder] Could not get info for URI ${uri}:`, e);
                }
            }

            if (!info.exists) {
                console.error('[AudioRecorder] Recording file not found after stopping');
                return null;
            }

            console.log(`[AudioRecorder] Recording stopped, file size: ${info.size} bytes`);

            // Return audio file data
            return {
                uri,
                size: info.size,
                format: this.audioFormat,
                modificationTime: info.modificationTime
            };
        } catch (error) {
            console.error('[AudioRecorder] Error stopping recording:', error);
            return null;
        } finally {
            this.recording = null;
        }
    }

    async getMetering(setMetering) {
        if(this.interval) {
            clearInterval(this.interval);
        }
        this.interval = setInterval(async () => {
            try {
                const status = await this.recording.getStatusAsync();
                if (status.metering) {
                    setMetering(prev => [...prev.slice(-30), status.metering]);
                }
            } catch (e) {
                console.warn('Error reading metering:', e);
            }
        }, 500);
    }

    async getAudioFile() {
        if (!this.recording) return null;

        try {
            const uri = this.recording.getURI();
            if (!uri) return null;

            let info = { exists: false, size: 0, modificationTime: 0 };
            try {
                info = await FileSystem.getInfoAsync(uri);
            } catch (e) {
                console.warn(`[AudioRecorder] Could not get info for URI ${uri} in getAudioFile:`, e);
            }

            if (!info.exists) return null;

            return {
                uri,
                size: info.size,
                format: this.audioFormat,
                modificationTime: info.modificationTime
            };
        } catch (error) {
            console.error('[AudioRecorder] Error getting audio file info:', error);
            return null;
        }
    }

    cleanup() {
        clearInterval(this.interval);
        this.recording = null;
    }

    // Get the current recording instance for metering
    getRecording() {
        return this.recording;
    }
}

export default AudioRecorder; 