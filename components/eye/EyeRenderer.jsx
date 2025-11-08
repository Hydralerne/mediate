import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { getEyePath } from './EyeUtils';
import { DEFAULT_CONFIG, ADVANCED_CONFIG } from './EyeConfig';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const EyeRenderer = ({ 
  size = DEFAULT_CONFIG.eyeSize, 
  position = 'left', 
  color = DEFAULT_CONFIG.eyeColor,
  state,
  animations 
}) => {
  // Extract required state and animations
  const { 
    eyeShape = 'circle', 
    eyeScale = 1, 
    eyeTransformY = 0,
    squint = 0
  } = state || {};
  
  const {
    blinkAnim,
    squintAnim,
    lookXAnim,
    lookYAnim,
    expressionAnim
  } = animations || {};
  
  // Handle left/right specific properties
  const getScaleValue = () => {
    if (Array.isArray(eyeScale)) {
      return position === 'left' ? eyeScale[0] : eyeScale[1];
    }
    return eyeScale;
  };
  
  const getTransformYValue = () => {
    if (Array.isArray(eyeTransformY)) {
      return position === 'left' ? eyeTransformY[0] : eyeTransformY[1];
    }
    return eyeTransformY;
  };
  
  const getSquintValue = () => {
    if (Array.isArray(squint)) {
      return position === 'left' ? squint[0] : squint[1];
    }
    return squint;
  };
  
  // Combine animations
  const combinedScaleY = Animated.multiply(
    blinkAnim || new Animated.Value(1),
    new Animated.Value(getScaleValue())
  );
  
  // Apply squint if available
  const customSquintValue = getSquintValue();
  const squintScale = squintAnim ? 
    Animated.add(
      Animated.multiply(squintAnim, new Animated.Value(0.4)),
      new Animated.Value(customSquintValue)
    ) : 
    new Animated.Value(customSquintValue);
    
  // Final squint calculation
  const finalSquint = Animated.subtract(
    new Animated.Value(1),
    squintScale
  );
  
  // Final scale with squint applied - now only affects Y scale for vertical blink
  const finalScaleY = Animated.multiply(combinedScaleY, finalSquint);
  
  // Expression animation now only affects Y scale for vertical transitions
  const finalExpressionScale = expressionAnim || new Animated.Value(1);
  
  // Combine all vertical scales
  const verticalScale = Animated.multiply(finalScaleY, finalExpressionScale);
  
  // Apply lookAt transforms with constraints
  const lookXOffset = lookXAnim ? 
    Animated.multiply(
      lookXAnim,
      new Animated.Value(size * ADVANCED_CONFIG.maxEyeMovement.x)
    ) : 
    new Animated.Value(0);
    
  const lookYOffset = lookYAnim ? 
    Animated.multiply(
      lookYAnim,
      new Animated.Value(size * ADVANCED_CONFIG.maxEyeMovement.y)
    ) : 
    new Animated.Value(0);
  
  // If position is right, invert x movement for natural look
  const adjustedLookX = position === 'right' ? 
    Animated.multiply(lookXOffset, new Animated.Value(-1)) : 
    lookXOffset;
  
  // Get path for the shape
  const pathData = getEyePath(eyeShape, size, size, getSquintValue(), position);
  
  // Add a soft shadow effect for realistic depth
  const shadowColor = DEFAULT_CONFIG.shadowColor;
  const shadowOffset = DEFAULT_CONFIG.shadowOffset;
  const shadowRadius = DEFAULT_CONFIG.shadowRadius;
  
  // Calculate transform based on animation and constraints
  const maxTransformY = ADVANCED_CONFIG.expressions.maxTransformY;
  const transformY = Animated.add(
    lookYOffset, 
    new Animated.Value(Math.min(Math.max(getTransformYValue(), -maxTransformY), maxTransformY))
  );
  
  return (
    <Animated.View
      style={[
        styles.eyeContainer,
        {
          width: size,
          height: size,
          transform: [
            { translateX: adjustedLookX },
            { translateY: transformY },
            { scaleY: verticalScale },
          ]
        }
      ]}
    >
      {pathData ? (
        // Render SVG eye shape
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <AnimatedPath
            d={pathData}
            fill={color}
            strokeWidth="0.5"
            stroke={shadowColor}
          />
        </Svg>
      ) : (
        // Render circle eye shape (default)
        <Animated.View
          style={[
            styles.eye,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: color,
            }
          ]}
        />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  eyeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  eye: {
    backgroundColor: '#ffffff',
    position: 'absolute',
  }
});

export default EyeRenderer; 