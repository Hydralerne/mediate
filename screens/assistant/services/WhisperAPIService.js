import WebSocketService from '../../../services/websocket';

class WhisperAPIService {
    constructor() {
        this.debugMode = false;
        this.testMode = false;
        this.listeners = {};
        this.finalizationTimeout = null;
        this.eventHandlerIds = {}; // To track WebSocketService listener IDs
        this.audioSessionId = null;
        this.sessionId = null;
        // Use the imported WebSocketService
        this.wsService = WebSocketService;
    }

    setDebugMode(enabled) {
        this.debugMode = enabled;
        this.wsService.setDebugMode(enabled);
    }

    getSessionId() {
        return this.sessionId;
    }

    setSessionId(sessionId) {
        this.sessionId = sessionId;
    }
    
    /**
     * Set the authentication token for WebSocket connection
     * @param {string} token - Authentication token
     */
    setAuthToken(token) {
        this.wsService.setAuthToken(token);
    }

    /**
     * Create a new WebSocket session for audio streaming
     * @param {Object} options - Session options
     * @param {string} options.format - Audio format ('wav', 'm4a', etc.)
     * @param {number} options.sampleRate - Sample rate in Hz
     * @param {string} options.language - Language code (e.g., 'en')
     * @param {string} options.authToken - Authentication token (optional)
     * @returns {Promise<Object>} - Session details
     */
    async createSession(options) {
       if(this.testMode) {
        return {success: true, audioSessionId: '123'};
       }
        try {
            // First, clean up any existing session
            this._cleanupEventHandlers();
            
            // Set auth token if provided in options
            if (options.authToken) {
                this.setAuthToken(options.authToken);
            }
            
            // Ensure WebSocket is connected
            if (!this.wsService.isConnected()) {
                try {
                    const connectionResult = await this.wsService.connect({
                        autoReconnect: true
                    });
                    
                    if (!connectionResult.success) {
                        return { success: false, error: 'Failed to establish WebSocket connection' };
                    }
                } catch (connectError) {
                    return { success: false, error: `WebSocket connection error: ${connectError.message}` };
                }
            }
            
            return new Promise((resolve, reject) => {
                // Setup response handlers one time for this session
                const onInitialized = (response) => {
                    this.audioSessionId = response.audioSessionId;
                    if(!this.sessionId && response.sessionId) {
                        this.sessionId = response.sessionId;
                    }
                    // Remove the one-time handler
                    if (this.eventHandlerIds['audio:initialized']) {
                        this.wsService.off('audio:initialized', this.eventHandlerIds['audio:initialized']);
                        delete this.eventHandlerIds['audio:initialized'];
                    }
                    
                    resolve({
                        success: true,
                        audioSessionId: response.audioSessionId,
                        sessionId: response.sessionId,
                        format: response.format,
                        sampleRate: response.sampleRate
                    });
                };
                
                const onTranscription = (response) => {
                    if (this.listeners.transcription) {
                        this.listeners.transcription(response);
                    }
                };
                
                const onError = (response) => {
                    if (this.listeners.error) {
                        this.listeners.error(response);
                    }
                    reject({
                        success: false,
                        error: response.error || 'Unknown WebSocket error'
                    });
                };
                
                // Register message handlers and store their IDs
                this.eventHandlerIds['audio:initialized'] = 
                    this.wsService.on('audio:initialized', onInitialized);
                this.eventHandlerIds['audio:transcription'] = 
                    this.wsService.on('audio:transcription', onTranscription);
                this.eventHandlerIds['audio:error'] = 
                    this.wsService.on('audio:error', onError);
                
                // Send initialization message
                this.wsService.send({
                    type: "audio:init",
                    format: options.format || 'wav',
                    sampleRate: options.sampleRate || 16000,
                    language: options.language || 'en',
                    audioSessionId: this.audioSessionId,
                    sessionId: this.sessionId
                }).catch(error => {
                    // Clean up listeners if send fails
                    this._cleanupEventHandlers();
                    
                    reject({
                        success: false,
                        error: `Failed to send initialization message: ${error.message}`
                    });
                });
                
                if (this.debugMode) {
                    console.log('Sent audio initialization message');
                }
            });
        } catch (error) {
            this._cleanupEventHandlers();
            return { success: false, error: error.message };
        }
    }

    /**
     * Stream raw audio data directly to the WebSocket
     * @param {ArrayBuffer} audioBuffer - Raw binary audio data buffer (WAV format)
     * @returns {Promise<boolean>} - Success status
     */
    async streamAudio(audioBuffer) {
        if(this.testMode) {
            return true;
        }
        // Check for active session
        if (!this.audioSessionId) {
            if (this.debugMode) {
                console.warn('No active session for streaming audio');
            }
            return false;
        }
        
        try {
            // Ensure the data is in the correct format for binary WebSocket
            if (!(audioBuffer instanceof ArrayBuffer)) {
                if (this.debugMode) {
                    console.warn('Audio data is not an ArrayBuffer, attempting to convert');
                }
                
                // Try to convert if it's not already an ArrayBuffer
                if (typeof audioBuffer === 'string') {
                    // If it's a base64 string, convert to binary
                    const binaryString = atob(audioBuffer);
                    const bytes = new Uint8Array(binaryString.length);
                    for (let i = 0; i < binaryString.length; i++) {
                        bytes[i] = binaryString.charCodeAt(i);
                    }
                    audioBuffer = bytes.buffer;
                } else {
                    throw new Error('Unsupported audio data format');
                }
            }

            // Send binary data through WebSocketService
            // The WebSocketService's send method will auto-reconnect if needed
            const result = await this.wsService.send(audioBuffer, { autoConnect: true });
            
            if (this.debugMode && audioBuffer.byteLength > 0 && result) {
                console.log(`Streamed ${audioBuffer.byteLength} bytes of binary audio data`);
            }
            
            return result;
        } catch (error) {
            if (this.debugMode) {
                console.error("Error streaming audio:", error);
            }
            
            if (this.listeners.error) {
                this.listeners.error({ message: `Error streaming audio: ${error.message}` });
            }
            
            return false;
        }
    }

    /**
     * Register event listeners for the WebSocket connection
     * @param {string} event - Event type ('transcription', 'close', 'error')
     * @param {Function} callback - Callback function
     */
    on(event, callback) {
        this.listeners[event] = callback;
        
        // Forward relevant events to WebSocketService
        if (event === 'error' || event === 'close') {
            // Remove previous handler if exists
            if (this.eventHandlerIds[event]) {
                this.wsService.off(event, this.eventHandlerIds[event]);
            }
            
            // Add new handler and store its ID
            this.eventHandlerIds[event] = this.wsService.on(event, callback);
        }
    }

    /**
     * Remove an event listener
     * @param {string} event - Event type to remove
     */
    off(event) {
        delete this.listeners[event];
        
        // Remove from WebSocketService if needed
        if (this.eventHandlerIds[event]) {
            this.wsService.off(event, this.eventHandlerIds[event]);
            delete this.eventHandlerIds[event];
        }
    }

    /**
     * Finalize the transcription session
     * @returns {Promise<Object>} - Final transcription result
     */
    async finalizeSession() {
        try {
            if (!this.audioSessionId || this.testMode) {
                return { success: false, error: 'No active transcription session' };
            }
            
            // WebSocketService's send method will handle reconnection if needed
            return new Promise((resolve, reject) => {
                // Set timeout for finalization
                this.finalizationTimeout = setTimeout(() => {
                    if (this.debugMode) {
                        console.warn('Finalization timeout reached');
                    }
                    
                    // Clean up the temporary listener
                    if (this.eventHandlerIds['finalTranscription']) {
                        this.wsService.off('audio:transcription', this.eventHandlerIds['finalTranscription']);
                        delete this.eventHandlerIds['finalTranscription'];
                    }
                    
                    const originalListener = this.listeners.transcription;
                    this.listeners.transcription = originalListener;
                    
                    resolve({
                        success: false,
                        error: 'Finalization timeout exceeded'
                    });
                }, 10000); // 10 second timeout
                
                // Set up one-time listener for final result
                const originalListener = this.listeners.transcription;
                
                // Create a temporary listener that will look for the final transcription
                const finalTranscriptionHandler = (response) => {
                    if (response.isFinal) {
                        clearTimeout(this.finalizationTimeout);
                        
                        // Restore original listener
                        if (this.eventHandlerIds['finalTranscription']) {
                            this.wsService.off('audio:transcription', this.eventHandlerIds['finalTranscription']);
                            delete this.eventHandlerIds['finalTranscription'];
                        }
                        
                        this.listeners.transcription = originalListener;
                        
                        // Clean up session
                        this.audioSessionId = null;
                        
                        resolve({
                            success: true,
                            transcription: response.transcription
                        });
                    } else if (originalListener) {
                        // Continue forwarding non-final updates
                        originalListener(response);
                    }
                };
                
                // Replace the current transcription listener
                this.listeners.transcription = finalTranscriptionHandler;
                
                // Register the final transcription handler
                this.eventHandlerIds['finalTranscription'] = 
                    this.wsService.on('audio:transcription', finalTranscriptionHandler);
                
                // Send finalize message through WebSocketService with auto-reconnect
                this.wsService.send({
                    type: "audio:finalize"
                }, { autoConnect: true }).catch(error => {
                    clearTimeout(this.finalizationTimeout);
                    
                    // Restore original listener
                    if (this.eventHandlerIds['finalTranscription']) {
                        this.wsService.off('audio:transcription', this.eventHandlerIds['finalTranscription']);
                        delete this.eventHandlerIds['finalTranscription'];
                    }
                    
                    this.listeners.transcription = originalListener;
                    
                    reject({
                        success: false,
                        error: `Error sending finalization request: ${error.message}`
                    });
                });
                
                if (this.debugMode) {
                    console.log('Sent finalization request');
                }
            });
        } catch (error) {
            if (this.debugMode) {
                console.error('Error finalizing session:', error);
            }
            
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    /**
     * Clean up all registered event handlers
     * @private
     */
    _cleanupEventHandlers() {
        // Clean up all registered event handlers
        Object.entries(this.eventHandlerIds).forEach(([event, id]) => {
            if (id) {
                this.wsService.off(event, id);
            }
        });
        
        // Reset the handler IDs object
        this.eventHandlerIds = {};
    }
    
    /**
     * Close the WebSocket connection and clean up resources
     */
    closeConnection() {
        // Clear any timeouts
        if (this.finalizationTimeout) {
            clearTimeout(this.finalizationTimeout);
            this.finalizationTimeout = null;
        }
        
        // Clean up all event handlers
        this._cleanupEventHandlers();
        
        // We no longer close the WebSocket here as it's managed by WebSocketService
        // Just clean up our local resources
        this.audioSessionId = null;
    }
}

export default new WhisperAPIService(); 