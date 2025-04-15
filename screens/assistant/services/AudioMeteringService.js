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
        this.activeType = null; // Track which type is currently active
        
        // Separate configs for player and recorder
        this.recorderConfig = {
            minDb: -60,          // Minimum dB value (silence)
            maxDb: -10,          // Maximum dB value (loudest)
            powerFactor: 1.5,    // Power factor for curve shaping
            minLevel: 0.05,      // Minimum output level
            maxLevel: 1.0        // Maximum output level
        };
        
        this.playerConfig = {
            minDb: -60,          // Minimum dB value (silence)
            maxDb: -10,          // Maximum dB value (loudest)
            powerFactor: 1.2,    // Power factor for curve shaping
            minLevel: 0.05,      // Minimum output level
            maxLevel: 1.0,       // Maximum output level
            scaleFactor: 1.85    // Additional scaling for player output (1.0/0.54)
        };
    }

    // Start monitoring audio levels
    async startMetering(type, callback, soundObject, meteringData) {        
        // Ensure previous metering is fully stopped
        this.stopMetering();
        
        // Set active type
        this.activeType = type;

        if (callback) {
            this.onMeteringUpdateCallback = callback;
        }

        // Reset metering data
        this.metering.levels = [];
        this.metering.currentLevel = 0;

        if (type === 'recording') {
            // Start interval to monitor audio levels
            this.meterInterval = setInterval(async () => {
                try {
                    // Check if we're still in recording mode
                    if (this.activeType !== 'recording') {
                        return;
                    }
                    
                    const recording = soundObject.getRecording();
                    if (!recording) {
                        return;
                    }
                    // Get metering info from Expo Audio recording
                    const status = await recording.getStatusAsync();
                    if (!status.metering) {
                        return;
                    }

                    // Get the dB value from Expo Recording
                    const metering = status.metering;
                    
                    // Process it using the recorder config (isPlayer = false)
                    const normalizedLevel = await this.updateAudioLevels(metering, false);
                } catch (error) {
                    console.error('[AudioMeteringService] Error in recording meter interval:', error);
                }
            }, this.meterIntervalMs);
        }

        if (type === 'player') {
            clearInterval(this.meterInterval);
            this.meterInterval = setInterval(async () => {
                try {
                    // Check if we're still in player mode
                    if (this.activeType !== 'player') {
                        return;
                    }
                    
                    await this.updateMetering(soundObject, meteringData.frames);
                } catch (error) {
                    console.error('[AudioMeteringService] Error in player meter interval:', error);
                }
            }, this.meterIntervalMs);
        }

        return true;
    }

    async updateMetering(soundObject, meteringData) {
        try {
            // Verify the sound object is still valid
            if (!soundObject) return;
            
            const status = await soundObject.getStatusAsync();
            const duration = status.durationMillis;
            const positionMillis = status.positionMillis || 0;

            let meteringValue = 0;
            if (meteringData && meteringData.length > 0) {
                // Use percentage-based approach for more accurate timing
                const totalSamples = meteringData.length;
                const pctComplete = duration > 0 ? positionMillis / duration : 0;
                const safeIndex = Math.min(Math.floor(pctComplete * totalSamples), totalSamples - 1);
                
                if (safeIndex >= 0 && safeIndex < meteringData.length) {
                    const volumeDb = meteringData[safeIndex];
                    
                    // Use the player normalization
                    meteringValue = this.normalizeDbToLevel(volumeDb, true);
                }
            }
            // Pass isPlayer=true to ensure correct processing
            await this.updateAudioLevels(meteringValue, true);

            return {
                duration,
                position: positionMillis,
                metering: meteringValue
            };
        } catch (error) {
            console.error('[AudioMeteringService] Error updating metering:', error);
        }
    }

    // Stop monitoring audio levels
    stopMetering() {
        if (this.meterInterval) {
            clearInterval(this.meterInterval);
            this.meterInterval = null;
        }
        this.activeType = null;
        console.log('[AudioMeteringService] Stopped metering');
    }

    // Update audio levels from current recording
    async updateAudioLevels(metering, isPlayer = false) {
        if (!metering && metering !== 0) {
            return;
        }

        try {
            let normalizedLevel;
            
            // Handle values differently based on whether it's from player or recording
            if (typeof metering === 'number' && metering >= 0 && metering <= 1) {
                // Value is already normalized (0-1) from player metering
                normalizedLevel = metering;
            } else {
                // Value is raw dB from recording - use the central normalization method
                normalizedLevel = this.normalizeDbToLevel(metering, isPlayer);
            }

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

            return normalizedLevel;
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

        this.stopMetering();

        if (this.onMeteringUpdateCallback) {
            this.onMeteringUpdateCallback({
                level: 0,
                levels: [],
            });
        }
    }

    // Utility function to process waveform amplitude data into dB, matching our scale
    // This can be used as a reference for external processing functions
    processAmplitudeToDb(amplitude, maxAmplitude = 255) {
        // Convert amplitude (0-maxAmplitude) to dB range we use (-60 to -10dB)
        // where 0 amplitude = -60dB (silence), max amplitude = -10dB (loudest)
        const volumeDb = amplitude === 0 ? -60 : -60 + (amplitude / maxAmplitude * 50);
        return volumeDb;
    }

    // Convert dB value to normalized level (0-1)
    normalizeDbToLevel(dbValue, isPlayer = false) {
        // Use the appropriate config based on the source
        const config = isPlayer ? this.playerConfig : this.recorderConfig;
        const { minDb, maxDb, powerFactor, minLevel, maxLevel, scaleFactor } = config;
        
        // Handle edge cases
        if (!dbValue && dbValue !== 0) return minLevel;
        if (dbValue <= minDb) return minLevel;
        if (dbValue >= maxDb) return maxLevel;
        
        // Calculate normalized value with power curve
        const range = maxDb - minDb;
        let normalized = Math.pow((dbValue - minDb) / range, powerFactor);
        
        // Apply additional scaling only for player if configured
        if (isPlayer && scaleFactor) {
            normalized = Math.min(maxLevel, normalized * scaleFactor);
        }
        
        return Math.max(minLevel, Math.min(maxLevel, normalized));
    }

    // Set new configuration values for recorder
    updateConfig(newConfig = {}) {
        this.recorderConfig = {
            ...this.recorderConfig,
            ...newConfig
        };
        
        console.log('[AudioMeteringService] Updated recorder config:', this.recorderConfig);
        return this.recorderConfig;
    }
    
    // Set new configuration values for player
    updatePlayerConfig(newConfig = {}) {
        this.playerConfig = {
            ...this.playerConfig,
            ...newConfig
        };
        
        console.log('[AudioMeteringService] Updated player config:', this.playerConfig);
        return this.playerConfig;
    }
}

export default new AudioMeteringService(); 