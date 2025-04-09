import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform, ScrollView, Keyboard, Alert, Dimensions, StatusBar, ActivityIndicator } from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat, 
  withSequence, 
  cancelAnimation 
} from 'react-native-reanimated';

import colors from '../../utils/colors';
import createStyles from '../../utils/globalStyle';
import TouchableButton from '../../components/global/ButtonTap';
import MessageBubble from './components/MessageBubble';
import AssistantResponse from './components/AssistantResponse';
import WelcomeMessage from './components/WelcomeMessage';
import AudioStreamService from './services/AudioStreamService';
import AssistantAPI from './services/AssistantAPI';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const Main = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [liveTranscription, setLiveTranscription] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [username, setUsername] = useState('there'); // Default username
  
  const scrollViewRef = useRef(null);
  const textInputRef = useRef(null);
  const contentHeight = useRef(0);
  const insets = useSafeAreaInsets();
  
  const pulseValue = useSharedValue(1);
  
  useEffect(() => {
    // Set up keyboard listeners
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        setKeyboardVisible(true);
        setTimeout(() => {
          scrollToBottom();
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
    
    // Set up callbacks for the audio streaming service
    AudioStreamService.setCallbacks({
      onTranscription: handleLiveTranscription,
      onError: handleError,
      onSpeechEnd: () => setIsProcessing(false)
    });
    
    AudioStreamService.setAudioFormat('wav'); // Use WAV format for better quality

    // You could fetch the username from user context/async storage here
    // For example:
    // const fetchUsername = async () => {
    //   try {
    //     const storedUsername = await AsyncStorage.getItem('username');
    //     if (storedUsername) {
    //       setUsername(storedUsername);
    //     }
    //   } catch (e) {
    //     console.error('Failed to fetch username', e);
    //   }
    // };
    // fetchUsername();
    
    return () => {
      // Clean up
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
      
      if (isRecording) {
        AudioStreamService.stopStreaming();
      }
    };
  }, []);
  
  useEffect(() => {
    if (isRecording) {
      pulseValue.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 800 }),
          withTiming(1, { duration: 800 })
        ),
        -1,
        true
      );
    } else {
      cancelAnimation(pulseValue);
      pulseValue.value = withTiming(1);
    }
  }, [isRecording]);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseValue.value }],
    };
  });
  
  const handleLiveTranscription = async (data, isFinal) => {
    console.log('data', data)

    return

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
  
  // Simple component to display transcription
  const SimpleTranscription = ({ text }) => (
    <View style={styles.simpleTranscription}>
      <Ionicons name="mic" size={16} color={colors.main} style={{ marginRight: 8 }} />
      <Text style={styles.transcriptionText}>{text || "Listening..."}</Text>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Oblien Assistant</Text>
      </View>
      
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
              paddingBottom: keyboardVisible ? (keyboardHeight > 0 ? keyboardHeight - insets.bottom : 20) : 100
            }
          ]}
          showsVerticalScrollIndicator={false}
          onLayout={handleContentLayout}
        >
          {messages.length === 0 ? (
            <View style={styles.emptyState}>
              <WelcomeMessage 
                username={username} 
                onSuggestionPress={handleSuggestionPress}
              />
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
        
        {/* Live transcription area - simplified */}
        {(isTranscribing || liveTranscription) && (
          <SimpleTranscription text={liveTranscription} />
        )}
        
        <View style={styles.inputContainer}>
          {isAndroid ? '' : <BlurView intensity={35} tint={colors.blurTint} style={styles.inputBlur} />}
          
          <View style={styles.inputWrapper}>
            <TextInput
              ref={textInputRef}
              style={styles.textInput}
              placeholder="Type a message..."
              placeholderTextColor="#999"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              editable={!isRecording && !isProcessing}
            />
            
            {inputText.length > 0 ? (
              <TouchableButton 
                style={styles.sendButton} 
                onPress={handleSendMessage}
              >
                <Ionicons name="send" size={20} color={colors.main} />
              </TouchableButton>
            ) : (
              <Animated.View style={animatedStyle}>
                <TouchableButton
                  style={[
                    styles.micButton,
                    isRecording && styles.recordingButton,
                    isProcessing && styles.processingButton
                  ]}
                  onPress={isRecording ? stopRecording : startRecording}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <Ionicons name="hourglass-outline" size={22} color="#fff" />
                  ) : (
                    <Ionicons name={isRecording ? "radio" : "mic"} size={22} color={isRecording ? "#fff" : colors.main} />
                  )}
                </TouchableButton>
              </Animated.View>
            )}
          </View>
          
          {isRecording && (
            <View style={styles.recordingIndicator}>
              <ActivityIndicator color={colors.main} style={styles.activityIndicator} />
              <Text style={styles.recordingText}>Streaming audio...</Text>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const isAndroid = Platform.OS === 'android';

const styles = createStyles({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.lightBorder,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.mainColor,
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
  inputContainer: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: colors.lightBorder,
    padding: 12,
  },
  inputBlur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secoundBackground,
    borderRadius: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.lightBorder,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    color: colors.mainColor,
    fontSize: 16,
    paddingVertical: 10,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingButton: {
    backgroundColor: colors.main,
  },
  processingButton: {
    backgroundColor: '#ff9500',
  },
  recordingIndicator: {
    width: '100%',
    height: 40,
    marginTop: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  activityIndicator: {
    marginRight: 10,
  },
  recordingText: {
    color: colors.mainColor,
    fontSize: 14,
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
  simpleTranscription: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    backgroundColor: 'rgba(57, 78, 255, 0.1)',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  transcriptionText: {
    color: colors.mainColor,
    fontSize: 14,
    fontStyle: 'italic',
  },
});

export default Main; 