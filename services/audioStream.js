import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

class AudioStreamService {
    constructor() {
        this.soundObject = null;
        this.audioBuffer = [];
        this.initialized = false;
        this.totalExpectedChunks = 0;
        this.receivedChunks = 0;
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
        if (this.audioBuffer.length > 0) {
            await this.playCompleteAudio();
        }
    }

    async handleAudioStreamFile(data) {
        const { audioKey } = data;


        const fileUri = `https://api.oblien.com/ai/audio/${audioKey}`;
        console.log('[AudioStreamService] Playing audio stream file:', fileUri);

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

        sound.playAsync();

        sound.setOnPlaybackStatusUpdate((status) => {
            if (status.didJustFinish) {
                    console.log('audio stream file finished');
                }
            });
        } catch (error) {
            console.error('[AudioStreamService] Error playing audio stream file:', error);
        }
    }

    async playCompleteAudio() {
        try {
            const combinedBuffer = this.combineArrayBuffers(this.audioBuffer);
            const base64Data = this.arrayBufferToBase64(combinedBuffer);
            const fileUri = `${FileSystem.cacheDirectory}complete-audio-${Date.now()}.wav`;
            
            await FileSystem.writeAsStringAsync(fileUri, base64Data, { 
                encoding: FileSystem.EncodingType.Base64 
            });
            
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

            sound.playAsync();

            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) {
                    FileSystem.deleteAsync(fileUri, { idempotent: true })
                        .catch(() => {});
                }
            });
            
        } catch (error) {
            console.error('[AudioStreamService] Error playing complete audio:', error);
        } finally {
            this.audioBuffer = [];
            this.receivedChunks = 0;
        }
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
}

const audioStreamService = new AudioStreamService();

audioStreamService.initialize().catch(error => {
    console.error('[AudioStreamService] Initialization error:', error);
});

export default audioStreamService;

export const handleAudioStreamStart = audioStreamService.handleAudioStreamStart.bind(audioStreamService);
export const handleAudioChunk = audioStreamService.handleAudioChunk.bind(audioStreamService);
export const handleAudioStreamEnd = audioStreamService.handleAudioStreamEnd.bind(audioStreamService);
export const handleAudioStreamFile = audioStreamService.handleAudioStreamFile.bind(audioStreamService);