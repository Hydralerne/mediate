import React, { memo, useState, useRef } from 'react';
import { StyleSheet, StatusBar, View, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';

import colors from '../utils/colors';
import Header from '../components/home/Header';
import ChatInput from '../components/home/ChatInput';
import Blob from '../components/blob';
import VoiceAssistant from './assistant/voice';

const Main = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const variationRef = useRef(2);
  
  const handleSendMessage = async (message) => {
    setIsLoading(true);
    console.log('Sending message:', message);
    setMessages([...messages, { id: Date.now(), text: message, sender: 'user' }]);
    
    // Simulate API call
    // TODO: Replace with actual medical research API
    setTimeout(() => {
      setIsLoading(false);
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        text: 'This is a simulated response. Connect your medical research API here.', 
        sender: 'ai' 
      }]);
    }, 3000);
  };

  const handleStopGeneration = () => {
    setIsLoading(false);
    console.log('Stopped generation');
    // TODO: Cancel the API request
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <Header navigation={navigation} />
        
        {/* Chat content will go here in the future */}
        <View style={styles.chatContent}>
          
        <VoiceAssistant variationRef={variationRef} />
        </View>

        {/* Chat Input at bottom */}
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <ChatInput 
            onSend={handleSendMessage}
            isLoading={isLoading}
            onStop={handleStopGeneration}
          />
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  chatContent: {
    flex: 1,
    // This will contain the chat messages in the future
  },
});

export default memo(Main); 