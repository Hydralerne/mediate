import React, { useState, useEffect, useRef, memo } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import BlobScene from '@/components/blob/BlobScene';

const BlobWrapper = ({ audioLevel = 0, variationRef, performanceMode }) => {
  const [currentAudioLevel, setCurrentAudioLevel] = useState(audioLevel);
  const audioLevelRef = useRef(new Animated.Value(audioLevel)).current;

  // Smooth audio transitions for more natural response
  useEffect(() => {
    // Create target audio level based on interaction state
    const targetLevel = audioLevel;

    // Animate to the new level with spring physics for more organic feel
    Animated.spring(audioLevelRef, {
      toValue: targetLevel,
      friction: 7,
      tension: 55,
      useNativeDriver: false,
    }).start();

    // Set up value listener to update state
    const listener = audioLevelRef.addListener(({ value }) => {
      setCurrentAudioLevel(value);
    });

    // Cleanup listener
    return () => {
      audioLevelRef.removeListener(listener);
    };
  }, [audioLevel, audioLevelRef]);

  return (
    <View style={styles.container}>
      <View style={styles.blobContainer}>
        <BlobScene 
          audioLevel={currentAudioLevel} 
          variationRef={variationRef}
          performanceMode={performanceMode}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 400,
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  blobContainer: {
    width: 380,
    height: 380,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 190,
    overflow: 'visible',
  }
});

export default memo(BlobWrapper); 