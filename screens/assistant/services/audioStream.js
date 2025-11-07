import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import AudioMeteringService from './AudioMeteringService';

class AudioStreamService {
    constructor() {
        this.soundObject = null;
        this.audioBuffer = [];
        this.initialized = false;
        this.totalExpectedChunks = 0;
        this.receivedChunks = 0;
        this.onMeteringUpdateCallback = null;
        this.meteringMap = {};
        this.currentAudioKey = null;
        this.audioCaptionsMap = {};
        this.onCaptionsCallback = null;
        this._audioQueue = [];
        this._isPlaybackActive = false;
        this.onSpeachStartCallback = null;
        this.onSpeachEndCallback = null;
        this.onAgentSwitchCallback = null;
    }

    async initialize() {
        if (this.initialized) return;

        try {
            await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
                staysActiveInBackground: true,
                interruptionModeIOS: 1,
                interruptionModeAndroid: 1,
                shouldDuckAndroid: false,
                playThroughEarpieceAndroid: false,
            });

            this.soundObject = new Audio.Sound();
            this.initialized = true;
        } catch (error) {
            console.error('[AudioStreamService] Failed to initialize:', error);
        }
    }

    setCallbacks({ onMeteringUpdate, onCaptions, onSpeechStart, onSpeachEnd, onAgentSwitch }) {
        this.onMeteringUpdateCallback = onMeteringUpdate;
        this.onCaptionsCallback = onCaptions;
        this.onSpeachStartCallback = onSpeechStart;
        this.onSpeachEndCallback = onSpeachEnd;
        this.onAgentSwitchCallback = onAgentSwitch;
    }

    handleAudioStreamStart(data) {
        this.audioBuffer = [];
        this.totalExpectedChunks = data.totalChunks;
        this.receivedChunks = 0;
    }

    async handleAudioChunk(chunk) {
        try {
            this.audioBuffer.push(chunk);
            this.receivedChunks++;
        } catch (error) {
            console.error('[AudioStreamService] Error handling chunk:', error);
        }
    }

    async handleAudioStreamEnd() {
        if (this.onSpeachEndCallback) {
            this.onSpeachEndCallback();
        }
    }

    async handleAudioStreamFiles(response) {
        const data = response.data;

        if (!data || data.length === 0) return;

        // Queue of audio files to play
        this._audioQueue = data.map(item => item.audioKey);

        console.log('audioQueue', this._audioQueue);

        // Track if playback is active to prevent multiple playNextAudio calls
        this._isPlaybackActive = false;

        // Function to play the next audio in the queue
        const playNextAudio = async () => {
            if (!this._audioQueue || this._audioQueue.length === 0) {
                console.log('[AudioStreamService] No more audio files in queue');
                return;
            }

            if (this._isPlaybackActive) {
                console.log('[AudioStreamService] Playback already active, not starting next audio yet');
                return;
            }

            this._isPlaybackActive = true;

            if (this.onSpeachStartCallback) {
                this.onSpeachStartCallback();
            }

            // Clean up previous sound object if it exists
            if (this.soundObject) {
                try {
                    await this.soundObject.unloadAsync();
                } catch (error) {
                    console.log('[AudioStreamService] Error unloading previous sound:', error);
                }
                this.soundObject = null;
            }

            this.currentAudioKey = this._audioQueue.shift();
            const fileUri = `https://api.oblien.com/ai/audio/${this.currentAudioKey}`;
            console.log('[AudioStreamService] Playing audio stream file:', fileUri, 'Remaining in queue:', this._audioQueue.length);

            try {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: false,
                    playsInSilentModeIOS: true,
                    shouldDuckAndroid: true,
                    staysActiveInBackground: true,
                    playThroughEarpieceAndroid: false,
                });

                const { sound } = await Audio.Sound.createAsync(
                    { uri: fileUri },
                    { shouldPlay: true }
                );

                this.soundObject = sound;

                await sound.playAsync();
                console.log('[AudioStreamService] Audio playback started for:', this.currentAudioKey);

                sound.setOnPlaybackStatusUpdate((status) => {
                    if (status.didJustFinish) {
                        console.log('[AudioStreamService] Audio stream file finished:', this.currentAudioKey);

                        if (this.onSpeachEndCallback) {
                            this.onSpeachEndCallback();
                        }


                        // Store reference to currentAudioKey before cleaning up
                        const finishedAudioKey = this.currentAudioKey;

                        // Clean up metering and captions for the finished audio
                        AudioMeteringService.stopMetering();
                        AudioMeteringService.resetMetering();
                        delete this.meteringMap[finishedAudioKey];
                        delete this.audioCaptionsMap[finishedAudioKey];

                        // Clear captions by passing null
                        if (this.onCaptionsCallback) {
                            this.onCaptionsCallback(null, null);
                        }

                        // Allow next audio to play
                        this._isPlaybackActive = false;

                        if (this._audioQueue.length > 0) {
                            if (this.onAgentSwitchCallback) {
                                this.onAgentSwitchCallback();
                            }
                            // Schedule the next audio to play with a slight delay
                            setTimeout(() => playNextAudio(), 1000);
                        }
                    }
                });

                if (this.meteringMap[this.currentAudioKey]) {
                    AudioMeteringService.startMetering('player', this.onMeteringUpdateCallback, sound, this.meteringMap[this.currentAudioKey]);
                }

                if (this.audioCaptionsMap[this.currentAudioKey]) {
                    // Make sure captions are passed in the correct format
                    const captionsData = this.audioCaptionsMap[this.currentAudioKey];
                    if (this.onCaptionsCallback && typeof this.onCaptionsCallback === 'function') {
                        console.log('Sending captions to callback:', captionsData.length);
                        this.onCaptionsCallback(captionsData, sound);
                    }
                }

            } catch (error) {
                console.error('[AudioStreamService] Error playing audio stream file:', error);
                // Reset active flag and try to continue with next audio even if current one fails
                this._isPlaybackActive = false;
                setTimeout(() => playNextAudio(), 300);
            }
        };

        // Start playing the first audio
        playNextAudio();
    }

    updateAudioCaptions(captions) {
        const data = captions.data;
        data.forEach(item => {
            this.audioCaptionsMap[item.key] = item.captions;
            if (item.key === this.currentAudioKey && this.soundObject) {
                this.onCaptionsCallback(this.audioCaptionsMap[this.currentAudioKey], this.soundObject);
            }
        });
    }

    async updateMetering(metering) {
        const data = metering.data;
        data.forEach(item => {
            this.meteringMap[item.key] = item.levels;
            console.log(item.key, this.currentAudioKey, item.key === this.currentAudioKey)
            if (item.key === this.currentAudioKey && this.soundObject) {
                AudioMeteringService.startMetering('player', this.onMeteringUpdateCallback, this.soundObject, this.meteringMap[this.currentAudioKey]);
            }
        });
    }

    arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;

        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }

        return btoa(binary);
    }

    combineArrayBuffers(buffers) {
        const totalLength = buffers.reduce((total, buffer) => total + buffer.byteLength, 0);
        const combinedBuffer = new Uint8Array(totalLength);

        let offset = 0;
        for (const buffer of buffers) {
            combinedBuffer.set(new Uint8Array(buffer), offset);
            offset += buffer.byteLength;
        }

        return combinedBuffer.buffer;
    }


    cleanupAfterStop() {
        // Reset audio metering
        if (this.soundObject) {
            try {
                this.soundObject.unloadAsync();
            } catch (error) {
                console.log('[AudioStreamService] Error unloading sound during cleanup:', error);
            }
        }

        this.soundObject = null;
        this.audioBuffer = [];
        this.totalExpectedChunks = 0;
        this.receivedChunks = 0;
        this.currentAudioKey = null;

        // Make sure we don't leave any audioQueue dangling
        if (this._audioQueue && this._audioQueue.length > 0) {
            this._audioQueue = [];
        }

        AudioMeteringService.stopMetering();
        AudioMeteringService.resetMetering();
    }

    async stopAudio() {
        console.log('[AudioStreamService] Stopping all audio playback');

        // Stop any active playback and unload sound object
        if (this.soundObject) {
            try {
                // First stop the audio playback
                await this.soundObject.stopAsync()
                    .catch(error => console.log('[AudioStreamService] Error stopping sound:', error));

                // Then unload to release resources
                await this.soundObject.unloadAsync()
                    .catch(error => console.log('[AudioStreamService] Error unloading sound:', error));

                console.log('[AudioStreamService] Successfully stopped and unloaded audio');
            } catch (error) {
                console.error('[AudioStreamService] Error during audio cleanup:', error);
            }
        }

        // Reset playback state
        this.soundObject = null;
        this.currentAudioKey = null;
        this._isPlaybackActive = false;

        // Clear the audio queue to prevent further playback
        if (this._audioQueue && this._audioQueue.length > 0) {
            console.log('[AudioStreamService] Clearing remaining queue of', this._audioQueue.length, 'items');
            this._audioQueue = [];
        }

        // Stop and reset audio metering
        AudioMeteringService.stopMetering();
        AudioMeteringService.resetMetering();

        // Clear captions display
        if (this.onCaptionsCallback) {
            this.onCaptionsCallback(null, null);
        }

        return true;
    }
}

const audioStreamService = new AudioStreamService();

audioStreamService.initialize().catch(error => {
    console.error('[AudioStreamService] Initialization error:', error);
});

export default audioStreamService;

export const handleAudioStreamStart = audioStreamService.handleAudioStreamStart.bind(audioStreamService);
export const handleAudioChunk = audioStreamService.handleAudioChunk.bind(audioStreamService);
export const handleAudioStreamEnd = audioStreamService.handleAudioStreamEnd.bind(audioStreamService);
export const handleAudioStreamFiles = audioStreamService.handleAudioStreamFiles.bind(audioStreamService);
export const setCallbacks = audioStreamService.setCallbacks.bind(audioStreamService);
export const updateMetering = audioStreamService.updateMetering.bind(audioStreamService);
export const updateAudioCaptions = audioStreamService.updateAudioCaptions.bind(audioStreamService);
export const stopAudio = audioStreamService.stopAudio.bind(audioStreamService);