import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import colors from '../../../utils/colors';
import TouchableButton from '../../../components/global/ButtonTap';

const WelcomeMessage = ({ username = 'there', onSuggestionPress }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [typingComplete, setTypingComplete] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Split message into two parts for better typography
  const greeting = `Hello, ${username}`;
  const message = `I'm Oblien AI Assistant. How can I help you today?`;
  const fullMessage = message;
  
  const typingInterval = useRef(null);
  const currentIndex = useRef(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    // Start typing animation on mount with a small delay to ensure proper initialization
    setTimeout(() => {
      startTypingAnimation();
    }, 100);
    
    // Start cursor pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true
        })
      ])
    ).start();
    
    return () => {
      // Clean up interval on unmount
      if (typingInterval.current) {
        clearInterval(typingInterval.current);
      }
    };
  }, []);
  
  const startTypingAnimation = () => {
    // Reset state and refs
    currentIndex.current = 0;
    setDisplayedText('');
    setTypingComplete(false);
    setShowSuggestions(false);
    
    // Clear any existing interval
    if (typingInterval.current) {
      clearInterval(typingInterval.current);
    }
    
    // Add the first character immediately to ensure it's displayed
    if (fullMessage.length > 0) {
      setDisplayedText(fullMessage[0]);
      currentIndex.current = 1;
      
      // Provide initial haptic feedback
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // Set new interval for typing effect starting from the second character
    typingInterval.current = setInterval(() => {
      if (currentIndex.current < fullMessage.length) {
        // Safely add the next character
        const nextChar = fullMessage[currentIndex.current] || '';
        setDisplayedText(prev => prev + nextChar);
        currentIndex.current++;
        
        // Add haptic feedback every other character for better feel
        if (currentIndex.current % 2 === 0) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      } else {
        // Typing is complete
        clearInterval(typingInterval.current);
        
        // Make sure the full text is set correctly without any undefined
        setDisplayedText(fullMessage);
        setTypingComplete(true);
        
        // Add success haptic when typing completes
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        // Fade in suggestions after typing is complete
        setTimeout(() => {
          setShowSuggestions(true);
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
          }).start();
        }, 300);
      }
    }, 20); // Fast typing speed
  };
  
  const suggestions = [
    "Help me create a professional website",
    "Recommend portfolio templates",
    "How to improve SEO",
    "Set up an online store"
  ];
  
  return (
    <View style={styles.welcomeContainer}>
      <View style={styles.assistantIconContainer}>
        <Animated.View style={{ opacity: pulseAnim }}>
          <Ionicons name="sparkles" size={36} color="#fff" />
        </Animated.View>
      </View>
      
      <View style={styles.typingContainer}>
        <Text style={styles.greetingText}>{greeting}</Text>
        <View style={styles.messageWrapper}>
          <Text style={styles.welcomeMessage}>
            {displayedText}
          </Text>
          {!typingComplete && (
            <Animated.View style={[styles.cursorContainer, { opacity: pulseAnim }]}>
              <View style={styles.cursor} />
            </Animated.View>
          )}
        </View>
      </View>
      
      {showSuggestions && (
        <Animated.View style={[
          styles.suggestionContainer,
          { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0]
          })}] }
        ]}>
          {suggestions.map((suggestion, index) => (
            <TouchableButton 
              key={index} 
              style={styles.suggestionButton}
              onPress={() => onSuggestionPress(suggestion)}
            >
              <Text style={styles.suggestionText}>{suggestion}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.main} />
            </TouchableButton>
          ))}
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 40,
    width: '100%',
  },
  assistantIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.main,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    shadowColor: colors.main,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 12,
  },
  typingContainer: {
    marginBottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.mainColor,
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  messageWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeMessage: {
    fontSize: 24,
    color: colors.mainColor,
    textAlign: 'center',
    lineHeight: 34,
    fontWeight: '400',
    opacity: 0.9,
  },
  cursorContainer: {
    height: 24,
    justifyContent: 'center',
    marginLeft: 2,
  },
  cursor: {
    width: 3,
    height: 24,
    backgroundColor: colors.main,
    borderRadius: 2,
  },
  suggestionContainer: {
    width: '100%',
    marginTop: 10,
  },
  suggestionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  suggestionText: {
    fontSize: 16,
    color: colors.mainColor,
    fontWeight: '500',
  },
});

export default WelcomeMessage; 