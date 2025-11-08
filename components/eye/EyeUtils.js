/**
 * EyeUtils.js
 * 
 * Provides utility functions, constants, and animations for the eye animation system.
 * This file defines all expressions, animations, and helper functions needed for eye rendering.
 */

import { eyeShapes, getExpressionShape, getExpressionSettings, getPositionAwarePath } from './EyeShapeConfigs';

// ========================================
// EYE PATH GENERATION
// ========================================

/**
 * Get the eye path based on shape and dimensions
 * Main function to get the appropriate eye shape path
 * 
 * @param {string} shape - The name of the eye shape
 * @param {number} width - The width of the eye
 * @param {number} height - The height of the eye
 * @param {number} squint - The amount of squint to apply
 * @param {string} position - 'left' or 'right' (for asymmetric shapes)
 * @returns {string} - SVG path string
 */
export const getEyePath = (shape, width, height, squint = 0, position = 'left') => {
  // First check if it's a predefined expression shape
  const lowerShape = typeof shape === 'string' ? shape.toLowerCase() : 'standard';
  
  if (eyeShapes[lowerShape]) {
    const shapeFunction = eyeShapes[lowerShape].getPath;
    
    // Use the position-aware path utility which handles:
    // 1. Built-in position parameter for shapes that support it
    // 2. Automatic mirroring for shapes that don't handle position
    return getPositionAwarePath(shapeFunction, width, height, position);
  }
  
  // If shape not found, use standard
  return getPositionAwarePath(eyeShapes.standard.getPath, width, height, position);
};

// ========================================
// ANIMATION AND HELPER FUNCTIONS
// ========================================

/**
 * Get pupil constraints for positioning
 * 
 * @param {object} expressionState - The current expression state
 * @returns {object} - X and Y constraints for pupil movement
 */
export const getPupilConstraints = (expressionState) => {
  const { pupilConstraintX = 0.7, pupilConstraintY = 0.7 } = expressionState;
  return { x: pupilConstraintX, y: pupilConstraintY };
};

/**
 * Calculate pupil size based on expression
 * 
 * @param {object} expressionState - The current expression state
 * @param {number} baseSize - The base size to scale
 * @returns {number} - The calculated pupil size
 */
export const calculatePupilSize = (expressionState, baseSize) => {
  const { pupilSize = 0.3 } = expressionState;
  return baseSize * pupilSize;
};

/**
 * Get eye height based on width and shape
 * 
 * @param {number} width - The width of the eye
 * @param {string} shape - The eye shape
 * @returns {number} - The calculated eye height
 */
export const getEyeHeight = (width, shape = 'circle') => {
  const lowerShape = shape.toLowerCase();

  switch (lowerShape) {
    case 'natural':
    case 'relaxed':
    case 'almond':
      return width * 0.5;
    case 'oval':
    case 'focused':
      return width * 0.6;
    case 'sleepy':
    case 'tired':
      return width * 0.4;
    case 'standard':
    case 'circle':
    default:
      return width; // Circle has 1:1 aspect ratio
  }
};

/**
 * Get squint amount for the given expression state
 * 
 * @param {object} expressionState - The current expression state
 * @returns {number} - The squint amount
 */
export const getSquintAmount = (expressionState) => {
  return expressionState.squint || 0;
};

/**
 * Generate a random eye motion sequence
 * 
 * @param {number} duration - Total duration of the sequence in ms
 * @param {number} segments - Number of movement segments
 * @returns {Array} - Array of motion keyframes
 */
export const generateRandomEyeMotion = (duration = 5000, segments = 3) => {
  const keyframes = [];
  const segmentDuration = duration / segments;
  
  // Every third frame returns to center to prevent drifting eyes
  for (let i = 0; i <= segments; i++) {
    // Less extreme ranges, especially for vertical movement
    let lookX, lookY;
    
    // More frequent returns to center - prevent infinite look
    if (i % 2 === 0) { // Every other frame is close to center
      // Slight variation around center
      lookX = (Math.random() * 0.08 - 0.04); // Very small range around center
      lookY = (Math.random() * 0.08 - 0.04); // Very small range around center
    } else {
      // Every 5th frame, return exactly to center
      if (i % 5 === 0) {
        lookX = 0;
        lookY = 0;
      } else {
        // Normal random movement, but less extreme
        lookX = (Math.random() * 2 - 1) * 0.12; // Range: -0.12 to 0.12 (more constrained)
        lookY = (Math.random() * 2 - 1) * 0.06; // Range: -0.06 to 0.06 (more constrained)
      }
    }
    
    keyframes.push({
      time: i * segmentDuration,
      lookX: lookX,
      lookY: lookY,
    });
  }
  
  // Add one more frame at the end that's always center
  keyframes.push({
    time: (segments + 1) * segmentDuration,
    lookX: 0,
    lookY: 0,
  });
  
  return keyframes;
};

/**
 * Generate a series of blinking patterns
 * 
 * @param {string} type - Type of blink pattern ('normal', 'rapid', 'tired')
 * @param {number} duration - Total duration in ms
 * @returns {Array} - Array of blink keyframes
 */
export const generateBlinkPattern = (type = 'normal', duration = 10000) => {
  const blinks = [];
  let time = 0;

  switch (type) {
    case 'rapid':
      // Rapid blinks close together
      while (time < duration) {
        time += Math.random() * 300 + 200; // 200-500ms between blinks
        const isDouble = Math.random() > 0.5; // 50% chance of double blink

        blinks.push({
          time,
          duration: 80,
          isDouble,
        });

        // Jump ahead more after a group of blinks
        if (blinks.length % 3 === 0) {
          time += Math.random() * 2000 + 1000;
        }
      }
      break;

    case 'tired':
      // Slower, longer blinks
      while (time < duration) {
        time += Math.random() * 2000 + 1000;
        blinks.push({
          time,
          duration: 120, // Longer close time
          holdClosed: Math.random() * 100 + 50, // Hold closed briefly
          isDouble: Math.random() > 0.7,
        });
      }
      break;

    case 'normal':
    default:
      // Normal blinking pattern
      while (time < duration) {
        time += Math.random() * 4000 + 2000; // 2-6 seconds between blinks
        blinks.push({
          time,
          duration: 100,
          isDouble: Math.random() > 0.7,
        });
      }
  }

  return blinks;
};

// ========================================
// ANIMATION CONFIGURATIONS
// ========================================

/**
 * Animation settings for different behaviors
 */
export const ANIMATIONS = {
  // Default idle animation - occasional blinks, natural eye movements
  idle: {
    blinkInterval: [3000, 6000],
    blinkSpeed: 1,
    eyeMovement: 'natural',
    lookAroundInterval: [4000, 8000],
    lookSpeed: 0.8,
    doubleBlinkChance: 0.2
  },

  // Active animation - more frequent blinks and movements
  active: {
    blinkInterval: [2000, 4000],
    blinkSpeed: 1.2,
    eyeMovement: 'quick',
    lookAroundInterval: [2000, 5000],
    lookSpeed: 1.2,
    doubleBlinkChance: 0.3
  },

  // Sleepy animation - slow, heavy blinks
  sleepy: {
    blinkInterval: [2000, 4000],
    blinkSpeed: 0.8,
    eyeMovement: 'slow',
    lookAroundInterval: [5000, 8000],
    lookSpeed: 0.7,
    doubleBlinkChance: 0.1
  },

  // Alert animation - quick reactions, wide eyes
  alert: {
    blinkInterval: [4000, 8000],
    blinkSpeed: 1.5,
    eyeMovement: 'reactive',
    lookAroundInterval: [1500, 3000],
    lookSpeed: 1.4,
    doubleBlinkChance: 0.15
  },

  // Focused animation - minimal blinking, stable gaze
  focused: {
    blinkInterval: [5000, 10000],
    blinkSpeed: 1,
    eyeMovement: 'fixated',
    lookAroundInterval: [8000, 15000],
    lookSpeed: 0.6,
    doubleBlinkChance: 0.1
  },

  // Nervous animation - rapid blinks, quick movements
  nervous: {
    blinkInterval: [1000, 2500],
    blinkSpeed: 1.4,
    eyeMovement: 'jittery',
    lookAroundInterval: [1000, 2000],
    lookSpeed: 1.5,
    doubleBlinkChance: 0.4
  },

  // Confused animation - asymmetric blinking, unpredictable movements
  confused: {
    blinkInterval: [2000, 5000],
    blinkSpeed: 1.1,
    eyeMovement: 'uncertain',
    lookAroundInterval: [2000, 4000],
    lookSpeed: 0.9,
    doubleBlinkChance: 0.3
  }
};

/**
 * Get emotion configuration with intensity adjustment
 * 
 * @param {string} emotion - The emotion to display
 * @param {object} config - Configuration options (intensity)
 * @returns {object} - Animation values for the emotion
 */
export const getEmotionConfig = (emotion, config = {}) => {
  const defaultIntensity = config.intensity || 1;
  const lowerEmotion = typeof emotion === 'string' ? emotion.toLowerCase() : 'standard';

  // Get the base expression settings
  const baseSettings = getExpressionSettings(lowerEmotion);

  // Create a deep copy to avoid modifying the original
  const expressionConfig = JSON.parse(JSON.stringify(baseSettings));

  // Apply intensity to all numeric values
  Object.keys(expressionConfig).forEach(key => {
    const value = expressionConfig[key];

    if (typeof value === 'number') {
      // Apply intensity but preserve sign
      expressionConfig[key] = value * defaultIntensity * (value < 0 ? -1 : 1);
    } else if (Array.isArray(value)) {
      // Apply intensity to arrays (for asymmetric values)
      expressionConfig[key] = value.map(v =>
        typeof v === 'number' ? v * defaultIntensity * (v < 0 ? -1 : 1) : v
      );
    }
  });

  // Add eye shape to config
  expressionConfig.eyeShape = lowerEmotion;

  return expressionConfig;
};

// Mood constants - Map mood names to eye states
export const MOODS = Object.keys(eyeShapes).reduce((acc, key) => {
  // Get shape settings and add the eyeShape attribute
  const settings = { 
    ...eyeShapes[key].settings, 
    eyeShape: key,
    // Include blinking properties if available
    blinking: eyeShapes[key].blinking || {
      type: 'sync',
      speed: 'normal',
      blinkCloseSpeed: 80,
      blinkOpenSpeed: 120
    }
  };
  acc[key] = settings;
  return acc;
}, {});
