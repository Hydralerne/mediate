"use client";

import { getToken } from "@/utils/request";

class WebSocketService {
    constructor({ socketUrl } = {}) {
        this.socket = null;
        this.listeners = new Map();
        this.bufferedEvents = new Map();
        this.bufferableEventTypes = new Set(['indexing_status']);
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5000;
        this.reconnectTimeout = 3000; // Start with 3 seconds
        this.socketUrl = socketUrl;
        this.requireAppRunning = null;
    }

    _processBinaryData(arrayBuffer) {
        // Just pass through the raw binary data
        this.notifyListeners('binary', {
            data: arrayBuffer
        });
    }

    async connect(token, params = []) {
        if (this.socket) {
            this.disconnect();
        }
        
        if(!token) {
            token = await getToken();
        }

        return new Promise(async (resolve, reject) => {
            try {
                const url = new URL(this.socketUrl + '?token=' + token + '&' + params.join('&'));
                console.log('urlsssss', params);
                this.socket = new WebSocket(url);
                this.socket.onopen = () => {
                    console.log('WebSocket connection established');
                    // Reset reconnect attempts on successful connection
                    this.reconnectAttempts = 0;
                    this.reconnectTimeout = 3000;
                    // Notify listeners of connection
                    this.notifyListeners('connect', { connected: true });
                    resolve(true);
                };

                this.socket.onmessage = async (event) => {
                    try {
                        // Handle Blob messages
                        if (event.data instanceof Blob) {
                            const reader = new FileReader();
                            reader.onload = () => {
                                this._processBinaryData(reader.result);
                            };
                            reader.readAsArrayBuffer(event.data);
                            return;
                        }

                        // Handle ArrayBuffer messages
                        if (event.data instanceof ArrayBuffer) {
                            this._processBinaryData(event.data);
                            return;
                        }

                        // Handle text messages
                        if (typeof event.data === 'string') {
                            console.log('WebSocket text message received:', event.data);

                            const data = JSON.parse(event.data);
                            // Check if this is a response to a pending request
                            const isHandled = this._checkPendingRequests(data);
                            if (isHandled) return;
                            // Continue with normal message processing if not handled as a response
                            // or if we want to process responses through normal channels too
                            this.notifyListeners('message', data);
                            const shouldCallRequireApp = (this.requireAppRunning?.events.includes(data.type) && !this.listeners.has(data?.type) && data?.type && this.requireAppRunning && this.requireAppRunning?.status !== 'running')
                            if (shouldCallRequireApp) {
                                await this.requireAppRunning.callback(data);
                            }

                            if (data.type) {
                                this.notifyListeners(data.type, data);
                            }

                            return;
                        }
                    } catch (error) {
                        console.error('Error handling WebSocket message:', error);
                    }
                };

                this.socket.onclose = (event) => {
                    console.log('WebSocket connection closed', event.code, event.reason);
                    this.notifyListeners('disconnect', { code: event.code, reason: event.reason });

                    // Attempt to reconnect if not intentionally closed
                    if (event.code !== 1000) {
                        this.attemptReconnect(token, params);
                    }
                };

                this.socket.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    this.notifyListeners('error', error);
                };

            } catch (error) {
                console.error('Failed to establish WebSocket connection:', error);
            }
        })
    }

    disconnect() {
        if (this.socket) {
            this.notifyListeners('close', { code: 1000, reason: 'User disconnected' });
            this.socket.close(1000, 'User disconnected');
            this.socket = null;
        }
    }

    attemptReconnect(token, params) {
        if (this.reconnectAttempts < this.maxReconnectAttempts && this.socket) {
            this.reconnectAttempts++;
            console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

            // Notify listeners about reconnection attempt
            this.notifyListeners('reconnectAttempt', { attempts: this.reconnectAttempts });

            setTimeout(() => {
                this.connect(token, params);
            }, this.reconnectTimeout);
        } else {
            console.log('Max reconnect attempts reached.');
            this.notifyListeners('reconnectFailed', { attempts: this.reconnectAttempts });
        }
    }

    isConnected() {
        return this.socket && this.socket.readyState === WebSocket.OPEN;
    }

    sendAsync(data, timeout = 30000) {
        return new Promise((resolve, reject) => {
            if (!this.isConnected()) {
                return reject(new Error('WebSocket is not connected'));
            }

            // Generate a unique request ID if not provided
            const requestId = data.requestId || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const payload = { ...data, requestId };

            // If we don't have a pending requests Map, create one
            if (!this.pendingRequests) {
                this.pendingRequests = new Map();
            }

            // Store the resolve/reject handlers with the request ID
            this.pendingRequests.set(requestId, {
                resolve,
                reject,
                timeoutId: setTimeout(() => {
                    if (this.pendingRequests.has(requestId)) {
                        this.pendingRequests.delete(requestId);
                        reject(new Error(`Request ${requestId} timed out after ${timeout}ms`));
                    }
                }, timeout)
            });

            // Send the request
            this.send(payload);
        });
    }

    // Process incoming messages for pending requests
    _checkPendingRequests(data) {
        if (!this.pendingRequests || !data.requestId) {
            return false;
        }

        const pending = this.pendingRequests.get(data.requestId);
        if (pending) {
            // Clear the timeout and resolve the promise
            clearTimeout(pending.timeoutId);
            this.pendingRequests.delete(data.requestId);
            pending.resolve(data);
            return true;
        }

        return false;
    }

    send(data) {
        if (this.isConnected()) {
            this.socket.send(JSON.stringify(data));
            return true;
        }
        console.error('Cannot send message, WebSocket is not connected.');
        return false;
    }

    // Add event listener
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);

        // Flush buffered messages if any
        if (this.bufferedEvents.has(event)) {
            const buffered = this.bufferedEvents.get(event);
            buffered.forEach((data) => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error flushing buffered ${event}:`, error);
                }
            });
            this.bufferedEvents.delete(event); // Clear buffer
        }

        // Return unsubscribe
        return () => this.off(event, callback);
    }

    // Remove event listener
    off(event, callback) {
        if (!this.listeners.has(event)) return;

        const callbacks = this.listeners.get(event);
        const index = callbacks.indexOf(callback);

        if (index !== -1) {
            callbacks.splice(index, 1);
        }

        if (callbacks.length === 0) {
            this.listeners.delete(event);
        }
    }

    // Notify all listeners for a specific event
    notifyListeners(event, data) {
        const hasListeners = this.listeners.has(event);
        if (!hasListeners && this.bufferableEventTypes.has(event)) {
            // Buffer the event if no listener yet
            if (!this.bufferedEvents.has(event)) {
                this.bufferedEvents.set(event, []);
            }
            this.bufferedEvents.get(event).push(data);
            return;
        }

        if (hasListeners) {
            this.listeners.get(event).forEach((callback) => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in ${event} listener:`, error);
                }
            });
        }
    }

    setAppServerStatus(status) {
        this.requireAppRunning.status = status;
    }


    setRequireAppRunning(events, callback, status) {
        this.requireAppRunning = { events, callback, status };
        return () => {
            this.requireAppRunning = null;
        }
    }
}

// Create a singleton instance
const webSocketService = new WebSocketService({ socketUrl: 'wss://api.oblien.com' });
export default webSocketService; 