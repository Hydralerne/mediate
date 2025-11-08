import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import colors from '@/utils/colors';
import TouchableButton from '@/components/global/ButtonTap';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WelcomeMessage = ({ 
  username = 'there', 
  onSuggestionPress,
  typingSpeed = 20,           // ms per character when typing
  backspaceSpeed = 5,        // ms per character when backspacing (faster than typing)
  pauseAfterTyping = 3000,    // ms to show complete message before backspacing
  delayBeforeNext = 300,      // ms delay before next message starts typing
  isPaused = false,           // Control to pause/resume animation
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [typingComplete, setTypingComplete] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isInitialMount, setIsInitialMount] = useState(true);
  const isPausedRef = useRef(isPaused);

  // Split message into two parts for better typography
  const greeting = `Hello, ${username}`;

  const messages = [
    "Let's create a medical research paper",
    "Let's generate a clinical case report",
    "Let's draft a scientific publication",
    "Let's summarize the latest study",
    "Let's prepare a systematic review",
    "Let's write a medical journal article",
    "Let's create a patient information sheet",
    "Let's generate a clinical trial overview",
    "Let's write a grant proposal",
    "Let's build a medical presentation",
  ];

  const fullMessage = messages[currentMessageIndex];

  const typingInterval = useRef(null);
  const backspaceInterval = useRef(null);
  const currentIndex = useRef(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const cycleTimeout = useRef(null);

  // Update pause ref when prop changes
  useEffect(() => {
    isPausedRef.current = isPaused;
    
    // If pausing, clear all intervals and timeouts
    if (isPaused) {
      if (typingInterval.current) {
        clearInterval(typingInterval.current);
      }
      if (backspaceInterval.current) {
        clearInterval(backspaceInterval.current);
      }
      if (cycleTimeout.current) {
        clearTimeout(cycleTimeout.current);
      }
    } else {
      // If resuming and not initial mount, restart animation
      if (!isInitialMount) {
        startTypingAnimation();
      }
    }
  }, [isPaused]);

  useEffect(() => {
    // Start typing animation on mount with a small delay to ensure proper initialization
    setTimeout(() => {
      if (!isPausedRef.current) {
        startTypingAnimation();
      }
      setIsInitialMount(false); // Mark initial mount complete
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
      // Clean up intervals and timeout on unmount
      if (typingInterval.current) {
        clearInterval(typingInterval.current);
      }
      if (backspaceInterval.current) {
        clearInterval(backspaceInterval.current);
      }
      if (cycleTimeout.current) {
        clearTimeout(cycleTimeout.current);
      }
    };
  }, []);

  // Restart typing animation when message index changes (after initial mount)
  useEffect(() => {
    if (!isInitialMount && !isPausedRef.current) {
      startTypingAnimation();
    }
  }, [currentMessageIndex]);

  const startTypingAnimation = () => {
    // Don't start if paused
    if (isPausedRef.current) return;
    
    // Reset state and refs
    currentIndex.current = 0;
    setDisplayedText('');
    setTypingComplete(false);
    setShowSuggestions(false);

    // Clear any existing intervals and timeout
    if (typingInterval.current) {
      clearInterval(typingInterval.current);
    }
    if (backspaceInterval.current) {
      clearInterval(backspaceInterval.current);
    }
    if (cycleTimeout.current) {
      clearTimeout(cycleTimeout.current);
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
      // Check if paused during typing
      if (isPausedRef.current) {
        clearInterval(typingInterval.current);
        return;
      }
      
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

        // Schedule transition to next message (only if not paused)
        if (!isPausedRef.current) {
          cycleTimeout.current = setTimeout(() => {
            transitionToNextMessage();
          }, pauseAfterTyping);
        }
      }
    }, typingSpeed);
  };

  const transitionToNextMessage = () => {
    // Don't start if paused
    if (isPausedRef.current) return;
    
    // Start backspacing animation
    setTypingComplete(false); // Show cursor during backspace
    
    backspaceInterval.current = setInterval(() => {
      // Check if paused during backspace
      if (isPausedRef.current) {
        clearInterval(backspaceInterval.current);
        return;
      }
      
      setDisplayedText(prev => {
        const currentLength = prev.length;
        
        if (currentLength > 0) {
          // Remove last character
          const newText = prev.slice(0, -1);
          
          // Add haptic feedback for backspace (lighter than typing)
          if (currentLength % 3 === 0) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          
          // Check if we just cleared the last character
          if (newText.length === 0) {
            // Backspacing complete - stop interval and move to next message
            clearInterval(backspaceInterval.current);
            
            // Small delay before starting next message (only if not paused)
            if (!isPausedRef.current) {
              setTimeout(() => {
                setCurrentMessageIndex((prevIndex) => {
                  const nextIndex = (prevIndex + 1) % messages.length;
                  return nextIndex;
                });
              }, delayBeforeNext);
            }
          }
          
          return newText;
        }
        
        return prev;
      });
    }, backspaceSpeed);
  };

  return (
    <View style={styles.welcomeContainer}>
      <View style={styles.typingContainer}>
        <Text style={styles.greetingText}>{greeting}</Text>
        <View style={styles.messageWrapper}>
          <Text style={styles.welcomeMessage}>
            {displayedText}
            {!typingComplete && (
              <Animated.Text style={[styles.cursorText, { opacity: pulseAnim }]}>
                |
              </Animated.Text>
            )}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({

  welcomeContainer: {
    alignItems: 'center',
    marginTop: 300,
    width: '100%',
    position: 'absolute',
    top: 0,
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
    marginTop: 150,
    marginBottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 34,
    fontWeight: '300',
    color: colors.mainColor,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  messageWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeMessage: {
    fontSize: 22,
    color: colors.mainColor,
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '300',
    opacity: 0.9,
    paddingHorizontal: 50,
  },
  cursorText: {
    fontSize: 22,
    color: colors.main,
    fontWeight: '400',
    marginLeft: 1,
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