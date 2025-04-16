import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, Platform, KeyboardAvoidingView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../../utils/colors';
import AIResponse from './AIResponse';
import StartChat from './StartChat';
import { onSendMessage } from './utils';

// User message component - simple bubble with text
const UserMessage = ({ message }) => {
    return (
        <View style={styles.userMessageContainer}>
            <View style={styles.messageBubble}>
                <Text style={styles.messageText}>
                    {message.text}
                </Text>
            </View>
        </View>
    );
};

const Main = ({ scrollViewRef }) => {
    const insets = useSafeAreaInsets();
    const sessionRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    
    // Reference to generate unique keys
    const messageKeyCounterRef = useRef(0);
    
    // Queue for storing incoming text chunks
    const pendingChunksRef = useRef({});
    // Flag to track if we're currently processing the queue
    const isProcessingRef = useRef(false);
    // Track the animation interval
    const animationIntervalRef = useRef(null);
    // Track created message IDs to avoid duplicates
    const createdMessageIdsRef = useRef(new Set());

    useEffect(() => {
        if (messages.length > 0 && scrollViewRef?.current) {
            setTimeout(() => {
                scrollViewRef.current.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [messages]);
    
    // Cleanup animation interval on unmount
    useEffect(() => {
        return () => {
            if (animationIntervalRef.current) {
                clearInterval(animationIntervalRef.current);
            }
        };
    }, []);
    

    const renderMessage = ({ item }) => {
        if (item.sender === 'user') {
            return <UserMessage message={item} />;
        } else {
            return <AIResponse message={item} />;
        }
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container]}
            behavior={Platform.OS === 'ios' ? 'padding' : null}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
        >
            <FlatList
                ref={scrollViewRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.uniqueKey || item.id || `msg-${item.messageId}-${Math.random().toString(36).substring(2, 9)}`}
                contentContainerStyle={[styles.chatContainer, { paddingTop: insets.top + 100 }]}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                    <StartChat onSendMessage={(message) => onSendMessage(message, setMessages, setInputText, createdMessageIdsRef, messageKeyCounterRef, isProcessingRef, pendingChunksRef, animationIntervalRef, sessionRef)} />
                )}
                extraData={messages}
            />
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background || '#000',
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    chatContainer: {
        paddingHorizontal: 20,
        paddingTop: 80,
        paddingBottom: 60, // Extra space for input area
    },
    // User message styles
    userMessageContainer: {
        marginBottom: 16,
        maxWidth: '80%',
        alignSelf: 'flex-end',
    },
    messageBubble: {
        borderRadius: 18,
        padding: 14,
        backgroundColor: colors.secoundBackground || '#2C2C2E',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
        color: '#fff',
        letterSpacing: 0.2,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        height: 300,
    },
    emptyText: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 16,
    },
});

export default Main;
