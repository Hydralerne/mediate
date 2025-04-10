/**
 * EyeConfig.js
 * 
 * Centralized configuration file for the eye component.
 * Use this file to adjust overall eye behavior, appearance, and animations.
 */

// ========================================
// GENERAL CONFIGURATION
// ========================================

/**
 * Default appearance settings
 */
export const DEFAULT_CONFIG = {
  // Default size of each eye
  eyeSize: 100,
  
  // Default spacing between eyes
  eyeSpacing: 40,
  
  // Default color (use white for most cases)
  eyeColor: '#ffffff',
  
  // Default mood
  defaultMood: 'standard',
  
  // Default animation style
  defaultAnimation: 'idle',
  
  // Eye shadow effects
  shadowEnabled: true,
  shadowColor: 'rgba(0, 0, 0, 0.2)',
  shadowRadius: 4,
  shadowOffset: { width: 0, height: 2 },
  
  // Eye aspect ratio (width:height)
  eyeAspectRatio: 1,
  
  // Expression intensity (0-1)
  expressionIntensity: 0.8
};

/**
 * Animation timing settings
 */
export const ANIMATION_CONFIG = {
  // Duration for mood changes (ms)
  moodChangeDuration: 250,
  
  // Easing for mood changes
  moodChangeEasing: 'cubic',
  
  // Duration for blinking (ms)
  blinkDuration: {
    close: 80,
    open: 120
  },
  
  // Duration for looking at target (ms)
  lookAtDuration: 300,
  
  // Blink rate ranges (ms) for different states
  blinkRateRanges: {
    normal: [2000, 6000],
    rapid: [1000, 2000],
    tired: [1500, 4000],
    focused: [4000, 8000]
  }
};

/**
 * Debug options
 */
export const DEBUG_CONFIG = {
  // Enable debug mode to show extra information
  enabled: false,
  
  // Show eye boundaries
  showBoundaries: false,
  
  // Log mood and animation changes
  logChanges: false,
  
  // Override animation speed (0-1, 1 is normal)
  animationSpeedOverride: 1
};

// ========================================
// ADVANCED CONFIGURATION
// ========================================

/**
 * Advanced configuration for fine-tuning the eye behavior
 */
export const ADVANCED_CONFIG = {
  // Squint limits (how much eyes can squint/widen)
  squintLimits: {
    min: -0.5, // Negative means eyes widen
    max: 0.8   // Positive means eyes squint
  },
  
  // Max eye movement constraints (how far eyes can look)
  maxEyeMovement: {
    x: 0.4,  // 0.4 means 40% of eye width
    y: 0.25  // 0.25 means 25% of eye height
  },
  
  // Blink randomization (makes blinks more natural)
  blinkRandomization: {
    timingVariance: 0.2,    // Random variance in blink timing
    durationVariance: 0.15, // Random variance in blink duration
    doubleBlinkChance: 0.3  // Chance of double blink (0-1)
  },
  
  // How quickly eyes track movement (lower is slower)
  eyeTrackingSpeed: 0.8,
  
  // Expression settings
  expressions: {
    // Controls how much the eyes can transform vertically
    maxTransformY: 10,
    
    // Controls how much eyes can scale (0.5-1.5)
    scaleRange: [0.6, 1.3],
    
    // Smoothing for expression transitions
    transitionSmoothing: 0.8
  }
};

// Export all configurations together for easy imports
export default {
  DEFAULT_CONFIG,
  ANIMATION_CONFIG,
  DEBUG_CONFIG,
  ADVANCED_CONFIG
}; 