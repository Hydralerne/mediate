import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import EyeRenderer from './EyeRenderer';
import { useEyeController } from './EyeController';
import { eyeShapes } from './EyeShapeConfigs';
import { DEFAULT_CONFIG } from './EyeConfig';
import { Animated } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';


const Main = ({
  style,
  size = DEFAULT_CONFIG.eyeSize * 2.8,
  color = DEFAULT_CONFIG.eyeColor,
  mood = DEFAULT_CONFIG.defaultMood,
  leftMood,  // Optional prop for left eye mood
  rightMood, // Optional prop for right eye mood
  animation = DEFAULT_CONFIG.defaultAnimation,
  spacing = DEFAULT_CONFIG.eyeSpacing,
  onExpressionChange = null

}) => {
  // Use the eye controller hook for more advanced control
  const {
    leftEyeState,
    rightEyeState,
    leftEyeAnimations,
    rightEyeAnimations,
    setMood,
    setEyeMood,
    setAnimation,
    triggerBlink,
    lookAt
  } = useEyeController();

  // Validate mood for both eyes
  useEffect(() => {
    if (leftMood || rightMood) {
      // Individual eye moods specified
      if (leftMood) {
        const lowerLeftMood = leftMood.toLowerCase();
        if (eyeShapes[lowerLeftMood]) {
          setEyeMood(lowerLeftMood, 'left');
          if (onExpressionChange && typeof onExpressionChange === 'function') {
            onExpressionChange({ left: lowerLeftMood });
          }
        } else {
          console.warn(`Unknown mood for left eye: ${leftMood}, falling back to 'standard'`);
          setEyeMood('standard', 'left');
        }
      }

      if (rightMood) {
        const lowerRightMood = rightMood.toLowerCase();
        if (eyeShapes[lowerRightMood]) {
          setEyeMood(lowerRightMood, 'right');
          if (onExpressionChange && typeof onExpressionChange === 'function') {
            onExpressionChange({ right: lowerRightMood });
          }
        } else {
          console.warn(`Unknown mood for right eye: ${rightMood}, falling back to 'standard'`);
          setEyeMood('standard', 'right');
        }
      }
    } else if (mood) {
      // Apply mood to both eyes
      const lowerMood = typeof mood === 'string' ? mood.toLowerCase() : 'standard';
      if (eyeShapes[lowerMood]) {
        setMood(lowerMood);
        if (onExpressionChange && typeof onExpressionChange === 'function') {
          onExpressionChange(lowerMood);
        }
      } else {
        console.warn(`Unknown mood: ${mood}, falling back to 'standard'`);
        setMood('standard');
      }
    }
  }, [mood, leftMood, rightMood]);

  // Set animation when it changes
  useEffect(() => {
    setAnimation(animation);
  }, [animation]);

  // Handle touch on eyes to look at touch point
  const handleEyeAreaTouch = (position) => {
    // const { locationX, locationY } = event.nativeEvent;
    // const centerX = size / 2;
    // const centerY = size * 0.25; // Approximate center Y of eyes

    // Convert to normalized coordinates (-1 to 1)
    // const normalizedX = (locationX - centerX) / (size / 2);
    // const normalizedY = (locationY - centerY) / (size / 2);

    // Look at touch point
    // lookAt(normalizedX, normalizedY, { duration: 300 });

    if (position === 'left') {
      // Close left eye immediately
      Animated.timing(leftEyeAnimations.blinkAnim, {
        toValue: 0.05,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
    if (position === 'right') {
      // Close right eye immediately
      Animated.timing(rightEyeAnimations.blinkAnim, {
        toValue: 0.05,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
    // Close both eyes immediately
    if (position === 'both') {
      Animated.parallel([
        Animated.timing(leftEyeAnimations.blinkAnim, {
          toValue: 0.05,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(rightEyeAnimations.blinkAnim, {
          toValue: 0.05,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handleEyeAreaTouchEnd = () => {
    // Open both eyes when touch ends
    Animated.parallel([
      Animated.timing(leftEyeAnimations.blinkAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(rightEyeAnimations.blinkAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Calculate eye size based on container size
  const eyeSize = Math.min(size * 0.35, DEFAULT_CONFIG.eyeSize);
  const eyeSpacing = Math.min(spacing, size * 0.15);

  return (
    <View style={[styles.container, style, { width: size - 40 }]}>
      {/* Left eye */}

      <TouchableWithoutFeedback
        onPressIn={() => handleEyeAreaTouch('left')}
        onPressOut={handleEyeAreaTouchEnd}
      >
        <EyeRenderer
          size={eyeSize}
          position="left"
          color={color}
          state={leftEyeState}
          animations={leftEyeAnimations}
        />
      </TouchableWithoutFeedback>
      {/* Right eye */}
      <TouchableWithoutFeedback
        onPressIn={() => handleEyeAreaTouch('right')}
        onPressOut={handleEyeAreaTouchEnd}
      >
        <EyeRenderer
          size={eyeSize}
          position="right"
          color={color}
          state={rightEyeState}
          animations={rightEyeAnimations}
        />
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  displayArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 10,
  }
});

export default Main;


