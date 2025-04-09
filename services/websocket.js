import { getToken } from '../utils/token';
import { handleAudioStreamStart, handleAudioStreamEnd, handleAudioChunk, handleAudioStreamFile } from './audioStream';

class WebSocketService {
    constructor() {
        this.socket = null;
        this.baseUrl = 'wss://api.oblien.com';
        this.debugMode = false;
        this.isConnecting = false;
        this.connectionTimeout = null;
        this.pingInterval = null;
        this.reconnectTimeout = null;
        this.eventListeners = {};
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 2000;
        this.pingIntervalTime = 30000;
        this.lastPongTime = null;
        this.autoReconnectEnabled = false;
        
        // Audio streaming state
        this.currentAudioSession = null;
        this.isAudioStreamActive = false;
    }

    /**
     * Initialize the WebSocket service and establish connection
     * @returns {Promise<Object>} - Connection result
     */
    initialize() {
        return this.connect();
    }

    setDebugMode(enabled) {
        this.debugMode = enabled;
    }

    /**
     * Configure auto-reconnect behavior
     * @param {Object} config - Reconnection configuration
     * @param {boolean} config.enabled - Whether to enable auto-reconnect
     * @param {number} [config.maxAttempts] - Maximum number of reconnection attempts
     * @param {number} [config.initialDelay] - Initial delay in milliseconds between attempts
     * @param {number} [config.maxDelay] - Maximum delay in milliseconds between attempts
     */
    configureReconnect(config) {
        this.autoReconnectEnabled = config.enabled;

        if (typeof config.maxAttempts === 'number' && config.maxAttempts > 0) {
            this.maxReconnectAttempts = config.maxAttempts;
        }

        if (typeof config.initialDelay === 'number' && config.initialDelay > 0) {
            this.reconnectDelay = config.initialDelay;
        }

        if (typeof config.maxDelay === 'number' && config.maxDelay > 0) {
            this.maxReconnectDelay = config.maxDelay;
        }
    }

    /**
     * Connect to the WebSocket server
     * @param {Object} options - Connection options
     * @param {boolean} options.autoReconnect - Whether to auto-reconnect on disconnection (overrides class setting)
     * @returns {Promise<Object>} - Connection result
     */
    connect(options = {}) {
        return new Promise(async (resolve, reject) => {
            if (this.isConnected()) {
                return resolve({ success: true, connection: this.socket });
            }

            if (this.isConnecting) {
                return reject({ success: false, error: 'Connection already in progress' });
            }

            this.isConnecting = true;

            if (this.reconnectTimeout) {
                clearTimeout(this.reconnectTimeout);
                this.reconnectTimeout = null;
            }

            this.connectionTimeout = setTimeout(() => {
                this.isConnecting = false;
                reject({
                    success: false,
                    error: "WebSocket connection timeout"
                });
            }, 10000);

            const token = await getToken();

            if (!token) {
                this.isConnecting = false;
                clearTimeout(this.connectionTimeout);
                reject({
                    success: false,
                    error: "No authorization token available"
                });
                return;
            }

            try {
                this.socket = new WebSocket(this.baseUrl, null, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                this.socket.binaryType = 'arraybuffer';
            } catch (error) {
                console.log('error', error);
                this.isConnecting = false;
                clearTimeout(this.connectionTimeout);
                reject({
                    success: false,
                    error: `Failed to create WebSocket: ${error.message}`
                });
                return;
            }

            this.socket.onopen = () => {
                console.log('websocket connected');
                clearTimeout(this.connectionTimeout);
                this.isConnecting = false;
                this.reconnectAttempts = 0;
                this._startPingPong();

                if (this.eventListeners.open) {
                    this._triggerEvent('open', {
                        type: 'open',
                        state: 'connected'
                    });
                }

                resolve({ success: true, connection: this.socket });
            };

            this.socket.onmessage = (event) => {
                try {
                    if (typeof event.data === 'string') {
                        const response = JSON.parse(event.data);
                        const messageType = response.type || 'unknown';

                        console.log('websocket message', messageType, response);

                        if (messageType === 'pong') {
                            this.lastPongTime = Date.now();
                            return;
                        }

                        if(messageType === 'audio_stream_file') {
                            handleAudioStreamFile(response);
                        }
                        // Handle audio stream events
                        if (messageType === 'audio_stream_start') {
                            this.isAudioStreamActive = true;
                            this.currentAudioSession = response.sessionId;                            
                            try {
                                handleAudioStreamStart(response);
                            } catch (error) {
                                console.error('[WebSocketService] Error in handleAudioStreamStart:', error);
                            }
                        }

                        if (messageType === 'audio_stream_end') {
                            try {
                                handleAudioStreamEnd();
                            } catch (error) {
                                console.error('[WebSocketService] Error in handleAudioStreamEnd:', error);
                            }
                            
                            this.isAudioStreamActive = false;
                            this.currentAudioSession = null;
                        }

                        if (this.eventListeners[messageType]) {
                            this._triggerEvent(messageType, response);
                        }

                        if (this.eventListeners.message) {
                            this._triggerEvent('message', response);
                        }
                    } else if (event.data instanceof ArrayBuffer) {
                        // Pass binary data to binary listeners
                        if (this.eventListeners.binary) {
                            this._triggerEvent('binary', event.data);
                        }
                        if (this.isAudioStreamActive) {
                            try {
                                handleAudioChunk(event.data);
                            } catch (error) {
                                console.error('[WebSocketService] Error in handleAudioChunk:', error);
                            }
                        }
                    }
                } catch (error) {
                    console.error('[WebSocketService] Error parsing WebSocket message:', error);
                }
            };

            this.socket.onerror = (error) => {
                console.log('websocket error', error);
                clearTimeout(this.connectionTimeout);
                this.isConnecting = false;

                if (this.eventListeners.error) {
                    this._triggerEvent('error', { message: "WebSocket connection error" });
                }

                reject({
                    success: false,
                    error: "WebSocket connection error"
                });
            };

            this.socket.onclose = (event) => {
                console.log('websocket closed', event);
                clearTimeout(this.connectionTimeout);
                this._clearPingPong();
                this.isConnecting = false;

                const wasIntentional = event.code === 1000 || event.code === 1001;
                const isAuthError = event.code === 1008;

                // Reset audio streaming state
                this.isAudioStreamActive = false;
                this.currentAudioSession = null;

                if (this.eventListeners.close) {
                    this._triggerEvent('close', event);
                }

                const shouldReconnect = !wasIntentional &&
                    !isAuthError &&
                    (options.autoReconnect ?? this.autoReconnectEnabled);

                if (shouldReconnect) {
                    this._scheduleReconnect();
                }
            };
        });
    }

    /**
     * Send a message through the WebSocket
     * @param {Object|ArrayBuffer} message - Message to send
     * @param {Object} options - Send options
     * @param {boolean} options.autoConnect - Whether to auto-connect if not connected (overrides class setting)
     * @returns {Promise<boolean>} - Success status
     */
    async send(message, options = {}) {
        try {
            if (!this.isConnected()) {
                const shouldAutoConnect = options.autoConnect ?? this.autoReconnectEnabled;
                if (shouldAutoConnect) {
                    const connectResult = await this.connect({
                        autoReconnect: shouldAutoConnect
                    });
                    if (!connectResult.success) {
                        throw new Error('Failed to establish connection');
                    }
                } else {
                    throw new Error('WebSocket not connected');
                }
            }

            if (message instanceof ArrayBuffer || message instanceof Uint8Array) {
                const buffer = message instanceof Uint8Array ? message.buffer : message;
                this.socket.send(buffer);
            } else if (message !== null && typeof message === 'object') {
                try {
                    this.socket.send(JSON.stringify(message));
                } catch (jsonError) {
                    throw new Error(`Failed to stringify message: ${jsonError.message}`);
                }
            } else if (typeof message === 'string') {
                this.socket.send(message);
            } else {
                throw new Error(`Unsupported message type: ${typeof message}`);
            }

            return true;
        } catch (error) {
            if (this.debugMode) {
                console.error('Error sending message:', error);
            }

            if (this.eventListeners.error) {
                this._triggerEvent('error', { message: `Error sending message: ${error.message}` });
            }

            return false;
        }
    }

    /**
     * Check if the WebSocket is connected
     * @returns {boolean} - Connection status
     */
    isConnected() {
        return this.socket && this.socket.readyState === WebSocket.OPEN;
    }

    /**
     * Get the current connection state
     * @returns {string} - Connection state
     */
    getState() {
        if (!this.socket) return 'CLOSED';

        switch (this.socket.readyState) {
            case WebSocket.CONNECTING: return 'CONNECTING';
            case WebSocket.OPEN: return 'OPEN';
            case WebSocket.CLOSING: return 'CLOSING';
            case WebSocket.CLOSED: return 'CLOSED';
            default: return 'UNKNOWN';
        }
    }

    /**
     * Register event listeners - supports multiple listeners per event type
     * @param {string} event - Event type
     * @param {Function} callback - Callback function
     * @returns {string} - Listener ID that can be used to remove this specific listener
     */
    on(event, callback) {
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = [];
        }

        const listenerId = `${event}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        this.eventListeners[event].push({
            id: listenerId,
            callback
        });

        return listenerId;
    }

    /**
     * Remove an event listener
     * @param {string} event - Event type to remove
     * @param {string|Function} [idOrCallback] - Specific listener ID or callback to remove
     *                                      If omitted, removes all listeners for the event
     * @returns {boolean} - Whether any listeners were removed
     */
    off(event, idOrCallback) {
        if (!this.eventListeners[event]) {
            return false;
        }

        if (!idOrCallback) {
            delete this.eventListeners[event];
            return true;
        }

        const originalLength = this.eventListeners[event].length;
        if (typeof idOrCallback === 'string') {
            this.eventListeners[event] = this.eventListeners[event].filter(
                listener => listener.id !== idOrCallback
            );
        } else if (typeof idOrCallback === 'function') {
            this.eventListeners[event] = this.eventListeners[event].filter(
                listener => listener.callback !== idOrCallback
            );
        }

        if (this.eventListeners[event].length === 0) {
            delete this.eventListeners[event];
        }

        return originalLength > (this.eventListeners[event]?.length || 0);
    }

    /**
     * Trigger event listeners for a specific event
     * @param {string} event - Event type
     * @param {any} data - Data to pass to the listeners
     * @private
     */
    _triggerEvent(event, data) {        
        if (!this.eventListeners[event]) {
            return;
        }
        
        if (this.eventListeners[event].length === 0) {
            return;
        }

        for (const listener of this.eventListeners[event]) {
            try {
                listener.callback(data);
            } catch (error) {
                console.error(`[WebSocketService] Error in ${event} listener:`, error);
            }
        }
    }

    /**
     * Close the WebSocket connection
     * @param {number} code - Close code
     * @param {string} reason - Close reason
     */
    close(code = 1000, reason = 'Client closed connection') {
        if (this.connectionTimeout) {
            clearTimeout(this.connectionTimeout);
            this.connectionTimeout = null;
        }

        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }

        this._clearPingPong();

        // Reset audio streaming state
        this.isAudioStreamActive = false;
        this.currentAudioSession = null;

        if (this.socket) {
            try {
                if (this.socket.readyState === WebSocket.OPEN ||
                    this.socket.readyState === WebSocket.CONNECTING) {
                    this.socket.close(code, reason);
                }
            } catch (error) {
                if (this.debugMode) {
                    console.error('Error closing WebSocket:', error);
                }
            }

            this.socket = null;
        }

        this.isConnecting = false;
        this.reconnectAttempts = 0;
    }

    /**
     * Start the ping-pong mechanism to keep the connection alive
     * @private
     */
    _startPingPong() {
        this._clearPingPong();
        this.lastPongTime = Date.now();

        const jitteredInterval = this.pingIntervalTime * (0.9 + Math.random() * 0.2);

        this.pingInterval = setInterval(() => {
            if (!this.isConnected()) {
                this._clearPingPong();
                return;
            }

            const pongTimeout = this.pingIntervalTime * 2.5;
            if (this.lastPongTime && Date.now() - this.lastPongTime > pongTimeout) {
                this.close(4000, 'No pong response');
                return;
            }

            try {
                this.send({
                    type: 'ping',
                    timestamp: Date.now()
                });
            } catch (error) {
                if (this.debugMode) {
                    console.error('Error sending ping:', error);
                }
            }
        }, jitteredInterval);
    }

    /**
     * Clear the ping-pong mechanism
     * @private
     */
    _clearPingPong() {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
        }
    }

    /**
     * Schedule a reconnection attempt
     * @private
     */
    _scheduleReconnect() {
        if (!this.autoReconnectEnabled) {
            return;
        }

        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
        }

        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            if (this.eventListeners.reconnectFailed) {
                this._triggerEvent('reconnectFailed', {
                    message: `Maximum reconnect attempts (${this.maxReconnectAttempts}) reached`
                });
            }
            return;
        }

        const delay = Math.min(
            30000,
            this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts) * (0.9 + Math.random() * 0.2)
        );

        this.reconnectAttempts++;

        if (this.eventListeners.reconnecting) {
            this._triggerEvent('reconnecting', {
                attempt: this.reconnectAttempts,
                maxAttempts: this.maxReconnectAttempts,
                delay: Math.round(delay)
            });
        }

        this.reconnectTimeout = setTimeout(() => {
            this.connect({ autoReconnect: true }).catch(() => { });
        }, delay);
    }
}

// Create and export a singleton instance
const webSocketService = new WebSocketService();

// Automatically initialize the service when imported
setTimeout(() => {
    webSocketService.initialize().catch(() => { });
}, 0);

export default webSocketService;