
class AudioMeteringService {
    constructor() {
        // Audio metering data
        this.meterInterval = null;
        this.meterIntervalMs = 100; // Update metering at 10Hz (every 100ms)
        this.metering = {
            levels: [], // Store audio level history
            maxLevels: 100, // Maximum number of levels to store
            currentLevel: 0, // Most recent audio level
        };
        this.onMeteringUpdateCallback = null;
        this.recorder = null;
    }

    // Set the recorder instance from AudioStreamService
    setRecorder(recorder) {
        this.recorder = recorder;
    }

    // Register callback for when audio levels update
    setMeteringCallback(callback) {
        this.onMeteringUpdateCallback = callback;
    }

    // Start monitoring audio levels
    startMetering() {
        console.log('[AudioMeteringService] Starting metering');
        if (this.meterInterval) {
            this.stopMetering();
        }

        // Reset metering data
        this.metering.levels = [];
        this.metering.currentLevel = 0;

        // Start interval to monitor audio levels
        this.meterInterval = setInterval(async () => {
            await this.updateAudioLevels();
        }, this.meterIntervalMs);

        return true;
    }

    // Stop monitoring audio levels
    stopMetering() {
        if (this.meterInterval) {
            clearInterval(this.meterInterval);
            this.meterInterval = null;
        }
    }

    // Update audio levels from current recording
    async updateAudioLevels() {
        if (!this.recorder || !this.recorder.getRecording) {
            return;
        }

        try {
            const recording = this.recorder.getRecording();
            
            if (!recording) {
                return;
            }

            // Get metering info from Expo Audio recording
            const status = await recording.getStatusAsync();
            if (!status.metering) {
                return;
            }

            // Get the current metering level (in dB, typically between -160 and 0)
            // Convert from dB to amplitude percentage (0-1)
            const dbLevel = status.metering || -160;
            const normalizedLevel = Math.max(0, (dbLevel + 160) / 160); // Normalize to 0-1
            
            // Add level to history
            this.metering.levels.push(normalizedLevel);
            
            // Keep only the most recent levels (for visualization)
            if (this.metering.levels.length > this.metering.maxLevels) {
                this.metering.levels.shift();
            }
            
            // Update current level
            this.metering.currentLevel = normalizedLevel;

            // Notify listeners
            if (this.onMeteringUpdateCallback) {
                this.onMeteringUpdateCallback({
                    level: normalizedLevel, 
                    levels: [...this.metering.levels],
                });
            }
        } catch (error) {
            console.error('[AudioMeteringService] Error getting audio levels:', error);
        }
    }

    // Get current audio level (0-1)
    getCurrentLevel() {
        return this.metering.currentLevel;
    }

    // Get array of recent audio levels for waveform visualization
    getLevelHistory() {
        return [...this.metering.levels];
    }

    // Reset all metering data
    resetMetering() {
        this.metering.levels = [];
        this.metering.currentLevel = 0;
        
        if (this.onMeteringUpdateCallback) {
            this.onMeteringUpdateCallback({
                level: 0,
                levels: [],
            });
        }
    }
}

export default new AudioMeteringService(); 