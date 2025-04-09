import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import colors from '../../../utils/colors';
import createStyles from '../../../utils/globalStyle';

const AssistantResponse = ({ message }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);
    
    let currentIndex = 0;
    let typingInterval;
    
    const startTyping = () => {
      typingInterval = setInterval(() => {
        if (currentIndex < message.length) {
          setDisplayedText(prev => prev + message[currentIndex]);
          currentIndex++;
          
          // Add gentle haptic feedback while typing (every 12 characters)
          if (currentIndex % 12 === 0) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
        } else {
          clearInterval(typingInterval);
          setIsComplete(true);
          // Final haptic feedback when typing is complete
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }, 20); // Faster typing speed for assistant responses
    };
    
    // Slight delay before starting to type - feels more natural
    setTimeout(() => {
      startTyping();
    }, 300);
    
    return () => {
      if (typingInterval) {
        clearInterval(typingInterval);
      }
    };
  }, [message]);
  
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons 
          name={isComplete ? "sparkles" : "ellipsis-horizontal"} 
          size={16} 
          color={colors.main} 
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          {displayedText}
          {!isComplete && <Text style={styles.cursor}>|</Text>}
        </Text>
      </View>
    </View>
  );
};

const styles = createStyles({
  container: {
    maxWidth: '80%',
    backgroundColor: colors.secoundBackground,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: 8,
    marginTop: 3,
  },
  textContainer: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    color: colors.mainColor,
    flex: 1,
    lineHeight: 22,
  },
  cursor: {
    opacity: 1,
    fontWeight: 'bold',
    color: colors.main,
  },
});

export default AssistantResponse; 