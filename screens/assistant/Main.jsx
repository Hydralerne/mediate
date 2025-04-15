import React, { useState, useRef, useEffect, memo } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform, ScrollView, Keyboard, Alert, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import colors from '../../utils/colors';
import WelcomeMessage from './components/WelcomeMessage';
import AudioStreamService from './services/AudioStreamService';
import AssistantAPI from './services/AssistantAPI';
import AIView from './components/AIView';
import Header from './components/Header';
import BottomController from './components/BottomController';
import webSocketService from '../../services/websocket';
import AudioPlayerService from './services/audioStream';
import CaptionsViewer from './components/CaptionsViewer';
import AnalyzingEffect from './components/AnalyzingEffect';
import Chat from './chat/Main';

const Main = ({ navigation }) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const scrollViewRef = useRef(null);
  const textInputRef = useRef(null);
  const contentHeight = useRef(0);
  const insets = useSafeAreaInsets();
  const variationRef = useRef(0);
  const [captionsData, setCaptionsData] = useState(null);
  const [captionsSound, setCaptionsSound] = useState(null);
  const [analysing, setAnalysing] = useState(null);
  const [messages, setMessages] = useState([]);

  const tasks = useRef([]);

  // Add a ref to track if callbacks have been initialized
  const callbacksInitializedRef = useRef(false);

  // Create stable callback functions using useCallback
  const handleLiveTranscriptionCallback = useRef((data, isFinal) => {
  }).current;

  const handleErrorCallback = useRef((message) => {
    setIsRecording(false);
    setIsProcessing(false);
    setIsTranscribing(false);
    Alert.alert('Error', message);
  }).current;

  const handleSpeechEndCallback = useRef(() => {
    setIsProcessing(false);
    if (tasks.current?.length > 0) {
      setAnalysing(tasks.current[0].data.description);
      variationRef.current = 3;
      tasks.current.shift();
    }
    console.log('speeeeech end', tasks.current);
    if (tasks.current?.length === 0) {
      variationRef.current = 0;
    }
  }).current;

  const handleSpeechStartCallback = useRef(() => {
    setIsProcessing(false);
    variationRef.current = 1;
  }).current;

  const handleMeteringUpdateCallback = useRef((data) => {
    setAudioLevel(data.level);
  }).current;

  const handleAgentSwitchCallback = useRef((data) => {

  }).current;

  const taskRef = useRef(null);

  const handleWebSocketMessageCallback = useRef((response) => {
    // Handle the event data
    if (taskRef.current) return
    if (response.type == 'triggering_task') {
      setTimeout(() => {
        variationRef.current = 3;
        setAnalysing(response.data.description);
      }, 5000)
      setTimeout(() => {
        navigation.navigate('WebsitePreview', { websiteDomain: 'https://hydra.obl.ee' });
        setAnalysing(null);
      }, 20000);
      setTimeout(() => {
        webSocketService.socket.send(JSON.stringify({
          type: 'audio:test',
        }));
      }, 25000);
      taskRef.current = true;
      console.log('tasks saknssssdafsasssskd', tasks.current);
    }
  }).current;

  const handleCaptionsCallback = useRef((captions, sound) => {
    setCaptionsData(captions);
    setCaptionsSound(sound);
  }).current;

  // Add a handler for when captions end
  const handleCaptionsEnd = () => {
    setCaptionsData(null);
    setCaptionsSound(null);
  };

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
        onMeteringUpdate: handleMeteringUpdateCallback
      });

      AudioPlayerService.setCallbacks({
        onSpeechStart: handleSpeechStartCallback,
        onSpeechEnd: handleSpeechEndCallback,
        onMeteringUpdate: handleMeteringUpdateCallback,
        onCaptions: handleCaptionsCallback,
        onAgentSwitch: handleAgentSwitchCallback
      });

      AudioStreamService.setAudioFormat('wav');

      // Subscribe to a specific event type
      webSocketService.on('message', handleWebSocketMessageCallback);

      // Mark callbacks as initialized
      callbacksInitializedRef.current = true;
    }


    return () => {
      // Clean up
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();

      if (isRecording) {
        AudioStreamService.stopStreaming();
        AudioPlayerService.stop();
        AudioPlayerService.setCallbacks({});
        AudioPlayerService.stopAudio();
      }
    };
  }, []);

  const handleError = (message) => {
    setIsRecording(false);
    setIsProcessing(false);
    setIsTranscribing(false);
    Alert.alert('Error', message);
  };

  const startRecording = async () => {
    variationRef.current = 0;
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
    variationRef.current = 2;
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    }, 100);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

  };

  // Calculate the main content height
  const handleContentLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    contentHeight.current = height;
  };

  const voiceAssistant = () => (
    <View style={styles.emptyState}>
      <AIView audioLevel={audioLevel} variationRef={variationRef} />
      {captionsData && captionsSound ? (
        <CaptionsViewer
          captions={captionsData}
          soundObject={captionsSound}
          onCaptionsEnd={handleCaptionsEnd}
        />
      ) :
        analysing ? (
          <AnalyzingEffect analysing={analysing} />
        ) : (
          <WelcomeMessage />
        )}
    </View>
  )

  return (
    <View style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <Header />
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        <Chat />
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
  keyboardAvoid: {
    flex: 1,
  }
});

export default memo(Main); 