import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const ActivityItemSkeleton = () => {
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Create a pulsing animation
    const pulse = Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.6,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0.3,
        duration: 800,
        useNativeDriver: true,
      }),
    ]);

    // Loop the animation
    Animated.loop(pulse).start();

    // Cleanup animation on unmount
    return () => {
      fadeAnim.stopAnimation();
    };
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.timelineContainer}>
        <View style={styles.dot} />
        <View style={styles.timeline} />
      </View>
      
      <View style={styles.content}>
        <View style={styles.titlePlaceholder} />
        <View style={styles.timePlaceholder} />
      </View>
      
      <View style={styles.moreButton} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  timelineContainer: {
    alignItems: 'center',
    width: 20,
    marginRight: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 6,
    backgroundColor: '#f0f0f0',
  },
  timeline: {
    width: 2,
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  titlePlaceholder: {
    height: 14,
    width: '80%',
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 4,
  },
  timePlaceholder: {
    height: 12,
    width: '40%',
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  moreButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f0f0f0',
    marginLeft: 8,
  },
});

export default ActivityItemSkeleton; 