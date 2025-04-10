import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const AIWaveVisualizer = ({ audioLevel = 0, width = 300, height = 150, color = '#2196F3' }) => {
  // Normalize audio level to ensure it's between 0 and 1
  const normalizedLevel = Math.min(Math.max(audioLevel, 0), 1);
  
  // Only animate when audio level is above threshold
  const isActive = normalizedLevel >= 0.6;
  
  // Create animated values for each bar
  const [animatedValues] = useState(() => {
    // Create 12 bars with different animations
    return Array(12).fill().map(() => new Animated.Value(0));
  });

  // Wave animation effect
  useEffect(() => {
    // Cancel any running animations
    animatedValues.forEach(anim => anim.stopAnimation());
    
    if (isActive) {
      // Scale animation based on audio level (higher level = more intense)
      const intensity = Math.min(1, (normalizedLevel - 0.6) / 0.4); // Scale 0.6-1.0 to 0-1
      
      // Create wave-like animation for each bar
      const animations = animatedValues.map((anim, index) => {
        // Different timing for each bar to create wave effect
        const delay = index * 50;
        const duration = 700 - (intensity * 300); // Faster animation with higher intensity
        
        return Animated.sequence([
          Animated.timing(anim, {
            toValue: 0.7 + (intensity * 0.3), // Higher peaks with higher intensity
            duration: duration / 2,
            delay: delay,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: duration / 2,
            useNativeDriver: true,
          }),
        ]);
      });

      // Run all animations in parallel with loop
      Animated.loop(
        Animated.stagger(50, animations)
      ).start();
    } else {
      // Reset all animations when inactive
      animatedValues.forEach(anim => {
        Animated.timing(anim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }
    
    return () => {
      // Cleanup animations on unmount
      animatedValues.forEach(anim => anim.stopAnimation());
    };
  }, [isActive, normalizedLevel, animatedValues]);

  // Calculate dimensions for bars
  const barCount = animatedValues.length;
  const barWidth = (width * 0.9) / barCount;
  const barGap = barWidth * 0.3;
  const maxBarHeight = height * 0.8;
  const minBarHeight = height * 0.2;

  // Determine color based on activity
  const baseColor = isActive ? color : '#8CBAF0';
  
  // Linear gradient-like effect with opacity
  const getBarColor = (index) => {
    // Create a gradient-like effect from center outward
    const centerIndex = Math.floor(barCount / 2);
    const distanceFromCenter = Math.abs(index - centerIndex);
    const maxDistance = Math.max(centerIndex, barCount - centerIndex - 1);
    const opacity = 1 - (distanceFromCenter / maxDistance) * 0.6;
    
    return { 
      backgroundColor: baseColor,
      opacity: opacity
    };
  };

  return (
    <View style={[styles.container, { width, height }]}>
      {animatedValues.map((anim, index) => {
        // Use scaleY transform instead of height property
        const scaleY = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.2, 1], // Scale from 20% to 100%
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.bar,
              getBarColor(index),
              {
                width: barWidth,
                height: maxBarHeight, // Fixed height
                marginHorizontal: barGap / 2,
                transform: [
                  { scaleY }, 
                  { translateY: maxBarHeight * 0.5 * (1 - scaleY) } // Keep bar bottom aligned
                ],
              }
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end', // Align bars to bottom
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingBottom: 20, // Add padding at bottom
  },
  bar: {
    borderRadius: 4,
    // Height is set via props
  },
});

export default AIWaveVisualizer; 