import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence, 
  withDelay 
} from 'react-native-reanimated';
import colors from '../../../utils/colors';
import createStyles from '../../../utils/globalStyle';

const BAR_COUNT = 5;

const VoiceWaveform = () => {
  const animatedValues = Array(BAR_COUNT)
    .fill(0)
    .map(() => useSharedValue(0.3));

  useEffect(() => {
    // Create animations with different delays and durations for a natural effect
    animatedValues.forEach((av, index) => {
      const delay = 100 * index;
      const duration = 700 + Math.random() * 300;
      
      av.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(1, { duration: duration * 0.5 }),
            withTiming(0.3, { duration: duration * 0.5 })
          ),
          -1,
          true
        )
      );
    });
  }, []);

  const animatedStyles = animatedValues.map((av) =>
    useAnimatedStyle(() => ({
      height: `${av.value * 100}%`,
      opacity: av.value,
    }))
  );

  return (
    <View style={styles.container}>
      {animatedStyles.map((style, index) => (
        <Animated.View key={index} style={[styles.bar, style]} />
      ))}
    </View>
  );
};

const styles = createStyles({
  container: {
    width: 60,
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bar: {
    width: 4,
    backgroundColor: colors.main,
    borderRadius: 2,
  },
});

export default VoiceWaveform; 