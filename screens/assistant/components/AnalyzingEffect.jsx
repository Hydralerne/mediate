import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

const AnalyzingEffect = ({ analysing = "Processing your request and searching" }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-250, 400],
  });

  return (
    <View style={styles.container}>
      {/* Base low-opacity text */}
      <Text style={[styles.title, { color: 'rgba(255,255,255,0.3)' }]}>
        Analyzing
      </Text>

      {/* Shimmer highlight */}
      <MaskedView
        style={StyleSheet.absoluteFill}
        maskElement={
          <Text style={[styles.title, { backgroundColor: 'transparent' }]}>
            Analyzing
          </Text>
        }
      >
        <Animated.View style={{ transform: [{ translateX }] }}>
          <LinearGradient
            colors={['transparent', '#ffffff', 'transparent']}
            locations={[0.3, 0.5, 0.7]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.shimmer}
          />
        </Animated.View>
      </MaskedView>
      <View style={styles.BreakerContainer}>
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.25)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientBreaker}
        />
      </View>
      <Text style={styles.description}>{analysing ? analysing.toUpperCase() : 'ANALYZING'}, PLEASE WAIT</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  BreakerContainer: {
    width: '120%',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 0,
  },
  gradientBreaker: {
    height: 1,
    width: '100%',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    marginTop: 400,
    top: 0,
  },
  title: {
    fontSize: 38,
    fontWeight: '200',
    textAlign: 'center',
    letterSpacing: 1,
  },
  shimmer: {
    width: 200, // width of shimmer pass
    height: 40, // match or exceed font size
  },
  description: {
    marginTop: 20,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '100',
    opacity: 0.5,
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Lato',
    paddingHorizontal: 16,
  },
});

export default AnalyzingEffect;
