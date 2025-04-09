import React, { useEffect, useState } from 'react';
import { View, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat,
  withSequence,
  Easing
} from 'react-native-reanimated';
import colors from '../../../utils/colors';
import createStyles from '../../../utils/globalStyle';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BAR_COUNT = 30;
const BAR_WIDTH = 3;
const BAR_GAP = 3;
const CONTAINER_WIDTH = (BAR_WIDTH + BAR_GAP) * BAR_COUNT;

const LiveAudioVisualizer = ({ isRecording, audioLevel = 0 }) => {
  const [bars] = useState(Array(BAR_COUNT).fill(0).map((_, i) => i));
  const animatedBars = bars.map(() => useSharedValue(0.1));
  
  // Update animated values when recording state changes
  useEffect(() => {
    if (isRecording) {
      // Create random animations for each bar to simulate audio activity
      bars.forEach((_, index) => {
        const randomizeBar = () => {
          const randomHeight = Math.random() * 0.8 + 0.2; // Values between 0.2 and 1
          const duration = 150 + Math.random() * 200; // Random duration
          
          // Apply the random height with timing animation
          animatedBars[index].value = withTiming(randomHeight, {
            duration,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          });
          
          // Schedule the next animation
          setTimeout(randomizeBar, duration);
        };
        
        // Start the animation loop
        randomizeBar();
      });
    } else {
      // Reset all bars to minimal height when not recording
      bars.forEach((_, index) => {
        animatedBars[index].value = withTiming(0.1, { duration: 300 });
      });
    }
    
    // Cleanup on unmount
    return () => {
      // No cleanup needed as animations will stop when component unmounts
    };
  }, [isRecording, audioLevel]);
  
  // Generate animated styles for all bars
  const animatedStyles = bars.map((_, index) => 
    useAnimatedStyle(() => {
      return {
        height: `${animatedBars[index].value * 100}%`,
        opacity: animatedBars[index].value * 0.8 + 0.2,
        backgroundColor: animatedBars[index].value > 0.7 ? colors.main : `rgba(${colors.main.replace(/[^\d,]/g, '')}, ${0.5 + animatedBars[index].value * 0.5})`,
      };
    })
  );
  
  return (
    <View style={styles.container}>
      {bars.map((_, index) => (
        <Animated.View 
          key={index} 
          style={[
            styles.bar,
            animatedStyles[index],
          ]} 
        />
      ))}
    </View>
  );
};

const styles = createStyles({
  container: {
    width: CONTAINER_WIDTH,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  bar: {
    width: BAR_WIDTH,
    borderRadius: BAR_WIDTH / 2,
    marginHorizontal: BAR_GAP / 2,
  },
});

export default LiveAudioVisualizer; 