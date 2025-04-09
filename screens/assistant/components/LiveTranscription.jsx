import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence 
} from 'react-native-reanimated';
import colors from '../../../utils/colors';
import createStyles from '../../../utils/globalStyle';

const LiveTranscription = ({ text, isListening }) => {
  const pulseValue = useSharedValue(1);
  
  useEffect(() => {
    if (isListening) {
      pulseValue.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        -1,
        true
      );
    } else {
      pulseValue.value = withTiming(1);
    }
  }, [isListening]);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: isListening ? withTiming(1) : withTiming(0.7),
      transform: [{ scale: pulseValue.value }],
    };
  });
  
  const dotAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: isListening ? withTiming(1) : withTiming(0),
    };
  });
  
  if (!text && !isListening) return null;
  
  return (
    <View style={styles.container}>
      <View style={styles.transcriptionContainer}>
        <Animated.View style={[styles.iconContainer, animatedStyle]}>
          <Ionicons name="mic" size={16} color={colors.main} />
        </Animated.View>
        
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            {text || "Listening..."}
          </Text>
          
          {isListening && !text && (
            <Animated.View style={[styles.listeningDotsContainer, dotAnimatedStyle]}>
              <View style={styles.dot} />
              <View style={[styles.dot, styles.middleDot]} />
              <View style={styles.dot} />
            </Animated.View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = createStyles({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  transcriptionContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(57, 78, 255, 0.1)',
    borderRadius: 16,
    padding: 12,
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(57, 78, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  text: {
    color: colors.mainColor,
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
    opacity: 0.9,
  },
  listeningDotsContainer: {
    flexDirection: 'row',
    marginLeft: 4,
    alignItems: 'center',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.mainColor,
    marginHorizontal: 1,
    opacity: 0.7,
  },
  middleDot: {
    width: 5,
    height: 5,
    opacity: 0.9,
  },
});

export default LiveTranscription; 