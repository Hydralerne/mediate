import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ChatInput = ({ onSend, onStop, isLoading = false, disabled = false }) => {
  const [message, setMessage] = useState('');
  const insets = useSafeAreaInsets();

  const handleSend = () => {
    if (message.trim() && !disabled && !isLoading) {
      onSend && onSend(message.trim());
      setMessage('');
    }
  };

  const isButtonActive = message.trim().length > 0 && !disabled && !isLoading;

  // Show stop button when loading
  if (isLoading) {
    return (
      <View style={[styles.container, { paddingBottom: insets.bottom + 10 }]}>
        <View style={styles.loadingContainer}>
          <TouchableOpacity
            style={styles.stopButton}
            onPress={onStop}
          >
            <View style={styles.stopIcon} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 10 }]}>
      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add your research topic..."
          placeholderTextColor="rgba(255, 255, 255, 0.4)"
          value={message}
          onChangeText={setMessage}
          multiline
          maxLength={1000}
          editable={!disabled}
          returnKeyType="default"
        />

        {/* Send Button */}
        <TouchableOpacity
          style={[
            styles.sendButton,
            isButtonActive && styles.sendButtonActive
          ]}
          onPress={handleSend}
          disabled={!isButtonActive}
        >
          <Image 
            source={require('@/assets/icons/login/flow right-143-1696832127.png')} 
            style={[
              styles.sendIcon,
              isButtonActive && styles.sendIconActive
            ]} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingTop: 15,
    backgroundColor: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 50,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonActive: {
    backgroundColor: '#fff',
  },
  sendIcon: {
    width: 20,
    height: 20,
    tintColor: 'rgba(255, 255, 255, 0.4)',
  },
  sendIconActive: {
    tintColor: '#000',
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  stopButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopIcon: {
    width: 14,
    height: 14,
    backgroundColor: '#000',
    borderRadius: 2,
  },
});

export default ChatInput;

