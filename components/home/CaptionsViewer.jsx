import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const MAX_WORDS =4; // Increased from 4 to 6
const CHECK_INTERVAL = 10; // More frequent checking in ms
const FADE_DURATION = 100; // Duration for fade animations in ms

const CaptionsViewer = ({ captions, soundObject, onCaptionsEnd }) => {
  const [displayedWords, setDisplayedWords] = useState([]);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const lastProcessedIdRef = useRef(-1);
  const lastTimeRef = useRef(0);
  const checkIntervalRef = useRef(null);
  
  // Reset state when captions or sound change
  useEffect(() => {
    setDisplayedWords([]);
    lastProcessedIdRef.current = -1;
    lastTimeRef.current = 0;
    
    if (!captions || !captions.length || !soundObject) {
      return;
    }
    
    // Create a more responsive polling approach for smoother transitions
    const checkCaptions = async () => {
      try {
        const status = await soundObject.getStatusAsync();
        
        if (status.didJustFinish) {
          fadeOutAndClear();
          return;
        }
        
        if (!status.isPlaying) {
          return;
        }
        
        const currentTime = status.positionMillis;
        
        // Skip if time hasn't changed significantly (avoid over-processing)
        if (Math.abs(currentTime - lastTimeRef.current) < 5) {
          return;
        }
        
        lastTimeRef.current = currentTime;
        
        // Process captions in correct order
        let hasProcessedWord = false;
        
        for (let i = 0; i < captions.length; i++) {
          // Skip captions we've already processed
          if (i <= lastProcessedIdRef.current) continue;
          
          const caption = captions[i];
          
          // Check if this caption should be active now
          if (currentTime >= caption.start && currentTime <= caption.end) {
            // Mark as processed
            lastProcessedIdRef.current = i;
            hasProcessedWord = true;
            
            // Add the word
            setDisplayedWords(prev => {
              // If we already have MAX_WORDS, clear and start fresh with this word
              if (prev.length >= MAX_WORDS) {
                return [caption.text];
              }
              
              // Otherwise append the word
              return [...prev, caption.text];
            });
            
            // Only process one caption per update
            break;
          }
        }
      } catch (error) {
        console.error("Error in caption processing:", error);
      }
    };
    
    // Use both the event handler and interval for better capture
    const handlePlaybackStatusUpdate = (status) => {
      if (status.didJustFinish) {
        fadeOutAndClear();
      }
    };
    
    // Set up polling for more frequent checks
    checkIntervalRef.current = setInterval(checkCaptions, CHECK_INTERVAL);
    
    // Also keep the event handler for end detection
    soundObject.setOnPlaybackStatusUpdate(handlePlaybackStatusUpdate);
    
    // Clean up
    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
      soundObject.setOnPlaybackStatusUpdate(null);
    };
  }, [captions, soundObject]);
  
  const fadeOutAndClear = () => {
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
    }
    
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: FADE_DURATION,
      useNativeDriver: true
    }).start(() => {
      setDisplayedWords([]);
      fadeAnim.setValue(1);
      lastProcessedIdRef.current = -1;
      
      if (onCaptionsEnd) {
        onCaptionsEnd();
      }
    });
  };
  
  // If no words to display, render empty view
  if (displayedWords.length === 0) {
    return null;
  }
  
  // Convert to uppercase for display
  const displayText = displayedWords.join(' ').toUpperCase();
  
  return (
    <View style={styles.container}>
      <Text style={styles.captionText}>
        {displayText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    marginTop: 350,
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  captionText: {
    color: 'white',
    fontSize: 30,
    fontWeight: '600',
    textAlign: 'center',
    opacity: 0.35,
    textTransform: 'uppercase',
  }
});

export default CaptionsViewer;
