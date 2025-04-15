import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

const TintBlur = ({ 
  direction = 'bottom', 
  locations = [0, 0.25], 
  intensity = 25, 
  tint = 'light',
  style = {}
}) => {
  // Determine gradient direction based on the direction prop
  const getGradientProps = () => {
    switch (direction) {
      case 'top':
        return {
          colors: ['white', 'transparent'],
          start: { x: 0, y: 1 },
          end: { x: 0, y: 0 }
        };
      case 'bottom':
        return {
          colors: ['transparent', 'white'],
          start: { x: 0, y: 0 },
          end: { x: 0, y: 1 }
        };
      case 'left':
        return {
          colors: ['white', 'transparent'],
          start: { x: 1, y: 0 },
          end: { x: 0, y: 0 }
        };
      case 'right':
        return {
          colors: ['transparent', 'white'],
          start: { x: 0, y: 0 },
          end: { x: 1, y: 0 }
        };
      default:
        return {
          colors: ['transparent', 'white'],
          start: { x: 0, y: 0 },
          end: { x: 0, y: 1 }
        };
    }
  };

  const gradientProps = getGradientProps();

  return (
    <View style={[styles.container, style]}>
      <MaskedView
        style={styles.maskedBlur}
        maskElement={
          <LinearGradient
            colors={gradientProps.colors}
            locations={locations}
            start={gradientProps.start}
            end={gradientProps.end}
            style={styles.maskGradient}
          />
        }
      >
        <BlurView intensity={intensity} tint={tint} style={styles.blurView} />
      </MaskedView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  maskedBlur: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  maskGradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  blurView: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default TintBlur; 