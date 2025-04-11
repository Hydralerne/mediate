import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform, ScrollView, Keyboard, Alert, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import colors from '../../utils/colors';
import MessageBubble from './components/MessageBubble';
import AssistantResponse from './components/AssistantResponse';
import WelcomeMessage from './components/WelcomeMessage';
import AudioStreamService from './services/AudioStreamService';
import AssistantAPI from './services/AssistantAPI';
import AIView from './components/AIView';
import Header from './components/Header';
import BottomController from './components/BottomController';
import webSocketService from '../../services/websocket';

const Main = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [liveTranscription, setLiveTranscription] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const scrollViewRef = useRef(null);
  const textInputRef = useRef(null);
  const contentHeight = useRef(0);
  const insets = useSafeAreaInsets();
  
  // Add a ref to track if callbacks have been initialized
  const callbacksInitializedRef = useRef(false);
  
  // Create stable callback functions using useCallback
  const handleLiveTranscriptionCallback = useRef((data, isFinal) => {
    // NOT USED NOW AS  WE ARE USING THE URL TO GET THE TRANSCRIPTION
    return;

    setLiveTranscription(data.text);
    setIsTranscribing(true);

    if (isFinal) {
      // Clear the live transcription area
      setIsTranscribing(false);
      setLiveTranscription('');

      // Add the final transcription as a user message
      handleUserMessage(data.text);

      try {
        // Wait a moment for UI to update
        setTimeout(async () => {
          // Get response from assistant API
          const response = await AssistantAPI.sendVoiceTranscription(data.text);
          handleAssistantResponse(response);
        }, 300);
      } catch (error) {
        handleError(error.message);
      }
    }
  }).current;
  
  const handleErrorCallback = useRef((message) => {
    setIsRecording(false);
    setIsProcessing(false);
    setIsTranscribing(false);
    Alert.alert('Error', message);
  }).current;
  
  const handleSpeechEndCallback = useRef(() => {
    setIsProcessing(false);
  }).current;
  
  const handleMeteringUpdateCallback = useRef((data) => {
    console.log('data', data.level);
    setAudioLevel(data.level);
  }).current;
  
  const handleWebSocketMessageCallback = useRef((response) => {
    // Handle the event data
    const data = response?.data;
    if(!data) return;
    if (data?.trigger?.name == 'perviewWebsite') {
      navigation.navigate('WebsitePreview', { websiteDomain: data?.trigger?.data?.url });
    }
  }).current;

  useEffect(() => {
    // Set up keyboard listeners
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        setKeyboardVisible(true);
        setTimeout(() => {
          // scrollToBottom();
        }, 100);
      }
    );

    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
        setKeyboardVisible(false);
      }
    );

    // Only set up callbacks once
    if (!callbacksInitializedRef.current) {
      // Set up callbacks for the audio streaming service
      AudioStreamService.setCallbacks({
        onTranscription: handleLiveTranscriptionCallback,
        onError: handleErrorCallback,
        onSpeechEnd: handleSpeechEndCallback,
        onMeteringUpdate: handleMeteringUpdateCallback
      });

      // Subscribe to a specific event type
      webSocketService.on('message', handleWebSocketMessageCallback);

      // Mark callbacks as initialized
      callbacksInitializedRef.current = true;
    }

    AudioStreamService.setAudioFormat('wav'); // Use WAV format for better quality

    return () => {
      // Clean up
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();

      if (isRecording) {
        AudioStreamService.stopStreaming();
      }
    };
  }, []);

  const handleLiveTranscription = async (data, isFinal) => {
    // NOT USED NOW AS  WE ARE USING THE URL TO GET THE TRANSCRIPTION
    return;

    setLiveTranscription(data.text);
    setIsTranscribing(true);

    if (isFinal) {
      // Clear the live transcription area
      setIsTranscribing(false);
      setLiveTranscription('');

      // Add the final transcription as a user message
      handleUserMessage(data.text);

      try {
        // Wait a moment for UI to update
        await new Promise(resolve => setTimeout(resolve, 300));

        // Get response from assistant API
        const response = await AssistantAPI.sendVoiceTranscription(data.text);
        handleAssistantResponse(response);
      } catch (error) {
        handleError(error.message);
      }
    }
  };

  const handleError = (message) => {
    setIsRecording(false);
    setIsProcessing(false);
    setIsTranscribing(false);
    Alert.alert('Error', message);
  };

  const startRecording = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsRecording(true);
    setLiveTranscription('');
    setIsTranscribing(true);

    const success = await AudioStreamService.startStreaming();
    if (!success) {
      setIsRecording(false);
      setIsTranscribing(false);
    }
  };

  const stopRecording = async () => {
    if (!isRecording) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsRecording(false);
    setIsProcessing(true);

    await AudioStreamService.stopStreaming();
  };

  const handleUserMessage = (text) => {
    const newMessages = [...messages, { id: Date.now().toString(), text, sender: 'user' }];
    setMessages(newMessages);
    setInputText('');

    scrollToBottom();
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    }, 100);
  };

  const handleAssistantResponse = (responseText) => {
    setIsTyping(true);

    // Simulate assistant typing with a realistic delay based on text length
    const typingDelay = Math.min(500 + responseText.length * 5, 1500);

    setTimeout(() => {
      setIsTyping(false);

      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          text: responseText,
          sender: 'assistant'
        }
      ]);

      scrollToBottom();
    }, typingDelay);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const messageText = inputText.trim();
    handleUserMessage(messageText);
    Keyboard.dismiss();

    try {
      setIsTyping(true);
      const response = await AssistantAPI.sendMessage(messageText);
      handleAssistantResponse(response);
    } catch (error) {
      handleError('Failed to get a response. Please try again.');
      setIsTyping(false);
    }
  };

  const handleSuggestionPress = async (suggestion) => {
    handleUserMessage(suggestion);

    try {
      setIsTyping(true);
      const response = await AssistantAPI.sendMessage(suggestion);
      handleAssistantResponse(response);
    } catch (error) {
      handleError('Failed to get a response. Please try again.');
      setIsTyping(false);
    }
  };

  // Calculate the main content height
  const handleContentLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    contentHeight.current = height;
  };


  return (
    <View style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <Header />
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={[
            styles.messagesContent,
            {
              paddingTop: 60,
              paddingBottom: keyboardVisible ? (keyboardHeight > 0 ? keyboardHeight - insets.bottom : 20) : 100
            }
          ]}
          showsVerticalScrollIndicator={false}
          onLayout={handleContentLayout}
        >
          {messages.length === 0 ? (
            <View style={styles.emptyState}>
              <AIView audioLevel={audioLevel} />
              <WelcomeMessage />
            </View>
          ) : (
            <>
              {messages.map((message) => (
                <View key={message.id} style={[styles.messageRow, message.sender === 'user' ? styles.userRow : styles.assistantRow]}>
                  {message.sender === 'assistant' ? (
                    <AssistantResponse message={message.text} />
                  ) : (
                    <MessageBubble text={message.text} isUser={true} />
                  )}
                </View>
              ))}

              {isTyping && (
                <View style={[styles.messageRow, styles.assistantRow]}>
                  <View style={styles.typingContainer}>
                    <View style={styles.typingDot} />
                    <View style={[styles.typingDot, styles.typingDotMiddle]} />
                    <View style={styles.typingDot} />
                  </View>
                </View>
              )}
            </>
          )}
        </ScrollView>

        <BottomController
          inputText={inputText}
          setInputText={setInputText}
          isRecording={isRecording}
          isProcessing={isProcessing}
          handleSendMessage={handleSendMessage}
          startRecording={startRecording}
          stopRecording={stopRecording}
          textInputRef={textInputRef}
          keyboardVisible={keyboardVisible}
        />

      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  messageRow: {
    width: '100%',
    marginBottom: 16,
    flexDirection: 'row',
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  assistantRow: {
    justifyContent: 'flex-start',
  },
  emptyState: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 500,
  },
  typingContainer: {
    flexDirection: 'row',
    backgroundColor: colors.secoundBackground,
    padding: 12,
    borderRadius: 16,
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.lightBorder,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.mainColor,
    opacity: 0.5,
    marginHorizontal: 3,
  },
  typingDotMiddle: {
    opacity: 0.7,
  },
});

export default Main; 