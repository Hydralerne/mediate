import React, { memo, useState, useRef, useEffect } from 'react';
import { StyleSheet, StatusBar, View, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';

import colors from '@/utils/colors';
import Header from '@/components/home/Header';
import ChatInput from '@/components/home/ChatInput';
import AnalyzingEffect from '@/components/home/AnalyzingEffect';
import CaptionsViewer from '@/components/home/CaptionsViewer';
import WelcomeMessage from '@/components/home/WelcomeMessage';
import { PERFORMANCE_MODES } from '@/components/blob/BlobScene';
import BlobScene from '../components/blob/BlobScene';
import EyeMain from '@/components/eye/Main';
import { request } from '@/utils/requests';

const Main = ({ navigation }) => {

  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [analysing, setAnalysing] = useState(null);
  const [captionsData, setCaptionsData] = useState([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [mode, setMode] = useState('chat');
  const variationRef = useRef(0);

  // OPTIMIZED: Use ref for audio level (no re-renders, direct control)
  const audioLevelRef = useRef(0);

  // useEffect(() => {
  //   variationRef.current = 3
  //   setAnalysing('Analyzing your request and searching for the best answer');
  // }, []);

  // Use PERFORMANCE mode by default for better battery life and cooler device
  const performanceMode = PERFORMANCE_MODES.PERFORMANCE;

  // Handle input focus/blur to pause/resume WelcomeMessage animation
  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
  };

  const handleSendMessage = async (message) => {
    setIsLoading(true);
    variationRef.current = 3
    setAnalysing('Starting your research...');
    const token = await getToken();
   
  };

  const handleStopGeneration = () => {
    setIsLoading(false);
    variationRef.current = 0
    setAnalysing(null);
    // TODO: Cancel the API request
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <Header navigation={navigation} />

        {/* Chat content will go here in the future */}
        <View style={styles.chatContent}>

          <View style={styles.container}>
            <View style={styles.blobContainer}>
              {mode === 'eye' ?
                <EyeMain /> :
                <BlobScene
                  audioLevelRef={audioLevelRef}  // Pass ref directly to BlobScene
                  variationRef={variationRef}
                  performanceMode={performanceMode}
                  isPaused={isInputFocused}
                />}
            </View>
          </View>

          {captionsData.length > 0 ? (
            <CaptionsViewer
              captions={captionsData}
              onCaptionsEnd={() => { }}
            />
          ) :
            analysing ? (
              <AnalyzingEffect analysing={analysing} />
            ) : (
              <WelcomeMessage isPaused={isInputFocused} />
            )}
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
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
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
  container: {
    width: 400,
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginTop: 75,
    marginBottom: -25
  },
  blobContainer: {
    width: 380,
    height: 380,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 190,
    overflow: 'visible',
  },
  chatContent: {
    flex: 1,
    // This will contain the chat messages in the future
  },
});

export default memo(Main); 