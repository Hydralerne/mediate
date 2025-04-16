import ChatApi from '../services/ChatApi';

export const parseJsonStream = (text) => {
    if (!text || typeof text !== 'string') return [];

    const results = [];

    // Strategy 1: Direct JSON parse if it's a clean JSON object
    try {
        const directParsed = JSON.parse(text);
        if (directParsed && typeof directParsed === 'object' && directParsed.messageId && directParsed.text) {
            results.push(directParsed);
            return results;
        }
    } catch (e) {
        console.log('Error:', e);
    }

    // Strategy 2: Handle quoted strings that contain JSON
    if (text.startsWith('"') && text.endsWith('"')) {
        try {
            // This will handle escaped quotes within the string
            const unquoted = JSON.parse(text);
            if (typeof unquoted === 'string') {
                // Try parsing the unquoted content
                try {
                    const parsed = JSON.parse(unquoted);
                    if (parsed && typeof parsed === 'object' && parsed.messageId && parsed.text) {
                        results.push(parsed);
                        return results;
                    }
                } catch (innerErr) {}

                // If that failed, use the unquoted content for the next strategies
                text = unquoted;
            }
        } catch (e) {
            console.log('Error:', e);
        }
    }

    // Strategy 3: Handle SSE format with data: prefix
    if (text.includes('data:')) {
        const dataLines = text.split('\n')
            .filter(line => line.trim().startsWith('data:'));

        for (const line of dataLines) {
            try {
                const jsonPart = line.substring(line.indexOf(':') + 1).trim();
                const parsed = JSON.parse(jsonPart);
                if (parsed && typeof parsed === 'object' && parsed.messageId && parsed.text) {
                    results.push(parsed);
                }
            } catch (e) {}
        }

        if (results.length > 0) {
            return results;
        }
    }

    // Strategy 4: Extract any JSON-like structures in the string
    // Look specifically for chunk message JSON patterns to avoid parsing code blocks
    const possibleJsons = [];
    let startIdx = text.indexOf('{');
    
    while (startIdx !== -1) {
        let openBraces = 1;
        let endIdx = startIdx + 1;
        let inString = false;
        let escaped = false;
        
        // Find matching closing brace
        while (endIdx < text.length && openBraces > 0) {
            const char = text[endIdx];
            
            if (escaped) {
                escaped = false;
            } else if (char === '\\') {
                escaped = true;
            } else if (char === '"') {
                inString = !inString;
            } else if (!inString) {
                if (char === '{') openBraces++;
                else if (char === '}') openBraces--;
            }
            
            endIdx++;
        }
        
        if (openBraces === 0) {
            const jsonCandidate = text.substring(startIdx, endIdx);
            possibleJsons.push(jsonCandidate);
        }
        
        startIdx = text.indexOf('{', startIdx + 1);
    }
    
    for (const jsonStr of possibleJsons) {
        try {
            const parsed = JSON.parse(jsonStr);
            // Only consider it a valid message if it has the expected fields
            if (parsed && typeof parsed === 'object' && parsed.messageId && parsed.text) {
                results.push(parsed);
            }
        } catch (e) {
            console.log('Error:', e);
        }
    }

    return results;
};

// Generate a unique key for a message
export const generateUniqueKey = (messageId, messageKeyCounterRef) => {
    messageKeyCounterRef.current += 1;
    return `${messageId}-${messageKeyCounterRef.current}`;
};

// Process the pending chunks queue in a controlled manner
export const processChunkQueue = (messageId, isProcessingRef, pendingChunksRef, animationIntervalRef, setMessages) => {
    // If currently processing, don't start another interval
    if (isProcessingRef.current) return;

    if (!pendingChunksRef.current[messageId] ||
        pendingChunksRef.current[messageId].length === 0) {
        return;
    }

    isProcessingRef.current = true;

    // Clear any existing interval to avoid conflicts
    if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
    }

    // Start an interval to add words gradually
    animationIntervalRef.current = setInterval(() => {
        const pendingText = pendingChunksRef.current[messageId];

        if (!pendingText || pendingText.length === 0) {
            clearInterval(animationIntervalRef.current);
            animationIntervalRef.current = null;
            isProcessingRef.current = false;
            return;
        }

        // Take the next few words
        const words = pendingText.split(' ');
        const wordsToAdd = words.slice(0, 3).join(' ') + (words.length > 3 ? ' ' : '');

        // Update the pending text by removing the words we're adding
        pendingChunksRef.current[messageId] = pendingText.slice(wordsToAdd.length);

        // Update the message
        setMessages(currentMessages => {
            const updatedMessages = [...currentMessages];
            const msgIndex = updatedMessages.findIndex(msg => msg.messageId === messageId);

            if (msgIndex !== -1) {
                updatedMessages[msgIndex] = {
                    ...updatedMessages[msgIndex],
                    text: updatedMessages[msgIndex].text + wordsToAdd
                };
            }

            return updatedMessages;
        });

        // If the queue is nearly empty, check if there's another message to process
        if (pendingChunksRef.current[messageId].length === 0) {
            clearInterval(animationIntervalRef.current);
            animationIntervalRef.current = null;
            isProcessingRef.current = false;

            // Look for other message IDs with pending chunks
            const nextMessageId = Object.keys(pendingChunksRef.current).find(
                id => id !== messageId && pendingChunksRef.current[id].length > 0
            );

            if (nextMessageId) {
                setTimeout(() => processChunkQueue(nextMessageId, isProcessingRef, pendingChunksRef, animationIntervalRef, setMessages), 10);
            }
        }
    }, 20); // Speed of typing (ms)
};

export const onSendMessage = async (message, setMessages, setInputText, createdMessageIdsRef, messageKeyCounterRef, isProcessingRef, pendingChunksRef, animationIntervalRef, sessionRef) => {
    if (!message.trim()) return;

    const userMessage = {
        id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        sender: 'user',
        text: message
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);

    if (typeof setInputText === 'function') {
        setInputText('');
    }

    // Reset created message IDs for this new conversation
    createdMessageIdsRef.current = new Set();

    // Collect all received chunks for debugging
    let allReceivedChunks = [];
    let processedMessageIds = new Set();

    ChatApi.sendMessage(message, (text) => {
        try {
            allReceivedChunks.push(text);

            if (!text || typeof text !== 'string') return;

            // Brute force fallback - look for JSON objects surrounded by {} in the text
            // This helps catch chunks that might be missed by the parser
            if (text.includes('{') && text.includes('}')) {
                const potentialJson = text.substring(
                    text.indexOf('{'),
                    text.lastIndexOf('}') + 1
                );

                try {
                    const forceParsed = JSON.parse(potentialJson);
                    // Verify this is a message chunk and not JSON code in a code block
                    if (forceParsed && 
                        forceParsed.messageId && 
                        forceParsed.text && 
                        typeof forceParsed.messageId !== 'undefined' && 
                        typeof forceParsed.text === 'string') {
                        
                        const { text: messageText, messageId } = forceParsed;
                        processedMessageIds.add(messageId);

                        // Check if we've already created a message for this ID
                        const isFirstChunk = !createdMessageIdsRef.current.has(messageId);

                        if (isFirstChunk) {
                            // Mark this message ID as created
                            createdMessageIdsRef.current.add(messageId);

                            // Generate a unique key just once per message ID
                            const uniqueKey = generateUniqueKey(messageId, messageKeyCounterRef);

                            setMessages(prevMessages => [
                                ...prevMessages,
                                {
                                    sender: 'ai',
                                    text: '',
                                    messageId,
                                    uniqueKey
                                }
                            ]);

                            // Initialize the queue for this message ID
                            pendingChunksRef.current[messageId] = '';
                        }

                        // Add the new text to the pending queue
                        pendingChunksRef.current[messageId] =
                            (pendingChunksRef.current[messageId] || '') + messageText;

                        // Start processing the queue if not already processing
                        if (!isProcessingRef.current) {
                            processChunkQueue(messageId, isProcessingRef, pendingChunksRef, animationIntervalRef, setMessages);
                        }

                        return; // Skip the regular parsing if brute force worked
                    }
                } catch (e) {}
            }

            // Regular parsing approach
            const jsonObjects = parseJsonStream(text);

            // Process each valid JSON object
            jsonObjects.forEach(data => {
                if (!data || typeof data !== 'object') return;

                const { text: messageText, type, sessionId, messageId } = data;

                if (!messageText || !messageId) return;

                processedMessageIds.add(messageId);

                if (sessionId) {
                    sessionRef.current = sessionId;
                }

                if (type === 'chunk') {
                    // Check if we've already created a message for this ID
                    const isFirstChunk = !createdMessageIdsRef.current.has(messageId);

                    if (isFirstChunk) {
                        // Mark this message ID as created
                        createdMessageIdsRef.current.add(messageId);

                        // Create a new message with empty text initially and a unique key
                        const uniqueKey = generateUniqueKey(messageId, messageKeyCounterRef);

                        setMessages(prevMessages => [
                            ...prevMessages,
                            {
                                sender: 'ai',
                                text: '',
                                messageId,
                                uniqueKey
                            }
                        ]);

                        // Initialize the queue for this message ID
                        pendingChunksRef.current[messageId] = '';
                    }

                    // Add the new text to the pending queue
                    pendingChunksRef.current[messageId] =
                        (pendingChunksRef.current[messageId] || '') + messageText;

                    if (!isProcessingRef.current) {
                        processChunkQueue(messageId, isProcessingRef, pendingChunksRef, animationIntervalRef, setMessages);
                    }
                }
            });

            // If no JSON was parsed successfully, extract any text content directly as a last resort
            if (jsonObjects.length === 0 && text.includes('data:')) {
                const textMatch = text.match(/text":"([^"]+)"/);
                if (textMatch && textMatch[1]) {
                    const extractedText = textMatch[1];

                    // Look for message ID too
                    const idMatch = text.match(/messageId":(\d+)/);
                    const messageId = idMatch ? parseInt(idMatch[1]) : 'fallback-' + Date.now();

                    // Check if we've already created a message for this ID
                    const isFirstChunk = !createdMessageIdsRef.current.has(messageId);

                    if (isFirstChunk) {
                        // Mark this message ID as created
                        createdMessageIdsRef.current.add(messageId);

                        const uniqueKey = generateUniqueKey(messageId, messageKeyCounterRef);

                        setMessages(prevMessages => [
                            ...prevMessages,
                            {
                                sender: 'ai',
                                text: '',
                                messageId,
                                uniqueKey
                            }
                        ]);

                        pendingChunksRef.current[messageId] = '';
                    }

                    // Add the extracted text to the pending queue
                    pendingChunksRef.current[messageId] =
                        (pendingChunksRef.current[messageId] || '') + extractedText;

                    // Start processing the queue
                    if (!isProcessingRef.current) {
                        processChunkQueue(messageId, isProcessingRef, pendingChunksRef, animationIntervalRef, setMessages);
                    }
                }
            }
        } catch (e) {
            console.log('Error:', e);
        }
    }).then(() => {
        // Empty then block
    });
};
