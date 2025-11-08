import { useState, useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';
import { 
  MOODS, 
  ANIMATIONS, 
  getEmotionConfig, 
  generateRandomEyeMotion, 
  generateBlinkPattern 
} from './EyeUtils';

export const useEyeController = () => {
  // Animation values - separate for left and right eyes
  const leftBlinkAnim = useRef(new Animated.Value(1)).current;
  const rightBlinkAnim = useRef(new Animated.Value(1)).current;
  const leftSquintAnim = useRef(new Animated.Value(0)).current;
  const rightSquintAnim = useRef(new Animated.Value(0)).current;
  const leftLookXAnim = useRef(new Animated.Value(0)).current;
  const rightLookXAnim = useRef(new Animated.Value(0)).current;
  const leftLookYAnim = useRef(new Animated.Value(0)).current;
  const rightLookYAnim = useRef(new Animated.Value(0)).current;
  const leftExpressionAnim = useRef(new Animated.Value(1)).current;
  const rightExpressionAnim = useRef(new Animated.Value(1)).current;
  
  // State - separate for left and right eyes
  const [leftEyeMood, setLeftEyeMood] = useState('standard');
  const [rightEyeMood, setRightEyeMood] = useState('standard');
  const [currentAnimation, setCurrentAnimation] = useState('idle');
  const [isLeftBlinking, setIsLeftBlinking] = useState(false);
  const [isRightBlinking, setIsRightBlinking] = useState(false);
  const [isLookingAround, setIsLookingAround] = useState(false);
  const [leftEyeState, setLeftEyeState] = useState(MOODS.standard);
  const [rightEyeState, setRightEyeState] = useState(MOODS.standard);
  
  // Animation timers
  const blinkTimerRef = useRef(null);
  const lookAroundTimerRef = useRef(null);
  const expressionTimerRef = useRef(null);
  const motionSequenceRef = useRef([]);
  const currentMotionIndexRef = useRef(0);
  
  // Set mood for both eyes (backward compatibility)
  const setMood = (mood) => {
    setEyeMood(mood, 'both');
  };
  
  // Set mood for a specific eye or both
  const setEyeMood = (mood, eye = 'both') => {
    const lowerMood = typeof mood === 'string' ? mood.toLowerCase() : 'standard';
    
    if (!MOODS[lowerMood]) {
      console.warn(`Unknown mood: ${mood}`);
      return;
    }
    
    const applyToLeftEye = eye === 'left' || eye === 'both';
    const applyToRightEye = eye === 'right' || eye === 'both';
    
    // Update state for appropriate eye(s)
    if (applyToLeftEye) {
      setLeftEyeMood(lowerMood);
      
      // Apply left eye mood with animation
      Animated.timing(leftExpressionAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        setLeftEyeState(MOODS[lowerMood]);
        
        Animated.timing(leftExpressionAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }).start();
        
        // Set squint based on mood
        Animated.timing(leftSquintAnim, {
          toValue: MOODS[lowerMood].squint || 0,
          duration: 250,
          useNativeDriver: true,
        }).start();
        
        // Set eye target position if defined
        if (MOODS[lowerMood].lookTargetX !== undefined || MOODS[lowerMood].lookTargetY !== undefined) {
          Animated.parallel([
            Animated.timing(leftLookXAnim, {
              toValue: MOODS[lowerMood].lookTargetX || 0,
              duration: 300,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(leftLookYAnim, {
              toValue: MOODS[lowerMood].lookTargetY || 0,
              duration: 300,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            })
          ]).start();
        }
      });
    }
    
    if (applyToRightEye) {
      setRightEyeMood(lowerMood);
      
      // Apply right eye mood with animation
      Animated.timing(rightExpressionAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        setRightEyeState(MOODS[lowerMood]);
        
        Animated.timing(rightExpressionAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }).start();
        
        // Set squint based on mood
        Animated.timing(rightSquintAnim, {
          toValue: MOODS[lowerMood].squint || 0,
          duration: 250,
          useNativeDriver: true,
        }).start();
        
        // Set eye target position if defined
        if (MOODS[lowerMood].lookTargetX !== undefined || MOODS[lowerMood].lookTargetY !== undefined) {
          Animated.parallel([
            Animated.timing(rightLookXAnim, {
              toValue: MOODS[lowerMood].lookTargetX || 0,
              duration: 300,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(rightLookYAnim, {
              toValue: MOODS[lowerMood].lookTargetY || 0,
              duration: 300,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            })
          ]).start();
        }
      });
    }
  };
  
  // Set animation mode - controls blink rate and look around behavior
  const setAnimation = (animation) => {
    if (!ANIMATIONS[animation]) {
      console.warn(`Unknown animation: ${animation}`);
      return;
    }
    
    setCurrentAnimation(animation);
    
    // Reset and restart animation loops
    resetAnimationTimers();
    startAnimationLoops(animation);
  };
  
  // Reset all animation timers
  const resetAnimationTimers = () => {
    if (blinkTimerRef.current) {
      clearTimeout(blinkTimerRef.current);
    }
    if (lookAroundTimerRef.current) {
      clearTimeout(lookAroundTimerRef.current);
    }
    if (expressionTimerRef.current) {
      clearTimeout(expressionTimerRef.current);
    }
    
    // Clear motion sequence
    motionSequenceRef.current = [];
    currentMotionIndexRef.current = 0;
  };
  
  // Start animation loops based on current animation
  const startAnimationLoops = (animationType) => {
    const config = ANIMATIONS[animationType];
    
    // Only start blinking loop, skip eye motion
    scheduleNextBlink(config);
  };
  
  // Execute eye motion sequence
  const executeEyeMotionSequence = () => {
    const sequence = motionSequenceRef.current;
    if (!sequence || sequence.length === 0) return;
    
    const currentIndex = currentMotionIndexRef.current;
    const nextIndex = (currentIndex + 1) % sequence.length;
    
    const currentFrame = sequence[currentIndex];
    const nextFrame = sequence[nextIndex];
    
    if (!currentFrame || !nextFrame) return;
    
    // Calculate duration until next frame
    const duration = nextFrame.time - currentFrame.time;
    if (duration <= 0) return;
    
    // More constrained eye movements to prevent going to sleep
    // Limit vertical movement range and add more frequent returns to center
    const lookX = Math.min(Math.max(nextFrame.lookX, -0.3), 0.3); // More constrained X
    const lookY = Math.min(Math.max(nextFrame.lookY, -0.2), 0.2); // More constrained Y
    
    // Mirror the X position for the right eye to keep eyes synchronized
    const rightX = -lookX;
    
    // Every 4th frame, return closer to center
    if (currentIndex % 4 === 0) {
      const centerX = lookX * 0.3; // Closer to center X
      const centerY = lookY * 0.3; // Closer to center Y
      const rightCenterX = -centerX; // Mirror for right eye
      
      // Animate to next position but nearer to center - both eyes
      Animated.parallel([
        // Left eye
        Animated.timing(leftLookXAnim, {
          toValue: centerX,
          duration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(leftLookYAnim, {
          toValue: centerY,
          duration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        // Right eye
        Animated.timing(rightLookXAnim, {
          toValue: rightCenterX,
          duration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(rightLookYAnim, {
          toValue: centerY,
          duration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate to next position - both eyes
      Animated.parallel([
        // Left eye
        Animated.timing(leftLookXAnim, {
          toValue: lookX,
          duration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(leftLookYAnim, {
          toValue: lookY,
          duration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        // Right eye
        Animated.timing(rightLookXAnim, {
          toValue: rightX,
          duration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(rightLookYAnim, {
          toValue: lookY,
          duration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
    
    // Move to next frame in sequence
    currentMotionIndexRef.current = nextIndex;
    
    // Schedule next frame
    lookAroundTimerRef.current = setTimeout(() => {
      // If we've reached the end of the sequence, generate a new one
      if (nextIndex === sequence.length - 1) {
        motionSequenceRef.current = generateRandomEyeMotion(15000, 8);
        currentMotionIndexRef.current = 0;
      }
      
      executeEyeMotionSequence();
    }, duration);
  };
  
  // Schedule the next blink
  const scheduleNextBlink = (config) => {
    const minInterval = config.blinkInterval[0];
    const maxInterval = config.blinkInterval[1];
    const nextBlinkTime = minInterval + Math.random() * (maxInterval - minInterval);
    
    // Clear any existing blink timer to prevent infinite blinking
    if (blinkTimerRef.current) {
      clearTimeout(blinkTimerRef.current);
      blinkTimerRef.current = null;
    }
    
    // Check if we have eyeShapes properties for blinking
    const leftShape = leftEyeState.eyeShape?.toLowerCase();
    const rightShape = rightEyeState.eyeShape?.toLowerCase();
    
    // Get the blinking type from shape properties
    let useAsyncBlinking = false;
    
    // Only check if both eyes have shapes defined
    if (leftShape && rightShape && MOODS[leftShape] && MOODS[rightShape]) {
      const leftBlinking = MOODS[leftShape].blinking || { type: 'sync' };
      const rightBlinking = MOODS[rightShape].blinking || { type: 'sync' };
      
      // If either eye is set to async blinking, use async
      if (leftBlinking.type === 'async' || rightBlinking.type === 'async') {
        useAsyncBlinking = Math.random() > 0.5; // 50% chance to use async even for async shapes
      }
    }
    
    // Schedule next blink with safety check
    blinkTimerRef.current = setTimeout(() => {
      if (useAsyncBlinking) {
        const leftFirst = Math.random() > 0.5;
        
        if (leftFirst) {
          // Left eye blinks first, then right after a short delay
          executeBlink('left', config.doubleBlinkChance);
          
          // Set timeout for the second eye with safety check
          const secondEyeTimeout = setTimeout(() => {
            executeBlink('right', config.doubleBlinkChance * 0.5); // Less chance of double-blink for second eye
          }, Math.random() * 300 + 150); // 150-450ms delay between eyes
        } else {
          // Right eye blinks first, then left after a short delay
          executeBlink('right', config.doubleBlinkChance);
          
          // Set timeout for the second eye with safety check
          const secondEyeTimeout = setTimeout(() => {
            executeBlink('left', config.doubleBlinkChance * 0.5);
          }, Math.random() * 300 + 150);
        }
      } else {
        // Normal synchronized blinking (both eyes)
        executeBlink('both', config.doubleBlinkChance);
      }
    }, nextBlinkTime);
  };
  
  // Execute a blink animation for specific eye(s)
  const executeBlink = (eye = 'both', doubleBlinkChance = 0.3) => {
    // Determine blink speeds from shape properties
    let leftBlinkSpeed = 80;  // Default blink close speed
    let rightBlinkSpeed = 80; // Default blink close speed
    let leftOpenSpeed = 120;  // Default blink open speed
    let rightOpenSpeed = 120; // Default blink open speed
    
    // Get shapes
    const leftShape = leftEyeState.eyeShape?.toLowerCase();
    const rightShape = rightEyeState.eyeShape?.toLowerCase();
    
    // Get blink properties from shapes if available
    if (leftShape && MOODS[leftShape]?.blinking) {
      const blinking = MOODS[leftShape].blinking;
      
      // Set speeds based on shape's blinking properties
      if (blinking.speed === 'fast') {
        leftBlinkSpeed = blinking.blinkCloseSpeed || 60;
        leftOpenSpeed = blinking.blinkOpenSpeed || 90;
      } else if (blinking.speed === 'slow') {
        leftBlinkSpeed = blinking.blinkCloseSpeed || 110;
        leftOpenSpeed = blinking.blinkOpenSpeed || 150;
      } else {
        // Normal speed
        leftBlinkSpeed = blinking.blinkCloseSpeed || 80;
        leftOpenSpeed = blinking.blinkOpenSpeed || 120;
      }
    }
    
    if (rightShape && MOODS[rightShape]?.blinking) {
      const blinking = MOODS[rightShape].blinking;
      
      // Set speeds based on shape's blinking properties
      if (blinking.speed === 'fast') {
        rightBlinkSpeed = blinking.blinkCloseSpeed || 60;
        rightOpenSpeed = blinking.blinkOpenSpeed || 90;
      } else if (blinking.speed === 'slow') {
        rightBlinkSpeed = blinking.blinkCloseSpeed || 110;
        rightOpenSpeed = blinking.blinkOpenSpeed || 150;
      } else {
        // Normal speed
        rightBlinkSpeed = blinking.blinkCloseSpeed || 80;
        rightOpenSpeed = blinking.blinkOpenSpeed || 120;
      }
    }
    
    // Standard blink behavior
    const blinkLeft = eye === 'left' || eye === 'both';
    const blinkRight = eye === 'right' || eye === 'both';
    
    // Check if already blinking - prevent double blinking
    if ((blinkLeft && isLeftBlinking) || (blinkRight && isRightBlinking)) {
      // Schedule next blink if we're skipping this one
      setTimeout(() => {
        scheduleNextBlink(ANIMATIONS[currentAnimation]);
      }, 1000); // Fallback timer if we skip blinking
      return;
    }
    
    // Set blinking state
    if (blinkLeft) setIsLeftBlinking(true);
    if (blinkRight) setIsRightBlinking(true);
    
    const isDouble = Math.random() < doubleBlinkChance;
    
    // Keep track of completed animations
    let leftCompleted = !blinkLeft;
    let rightCompleted = !blinkRight;
    
    // Function to check if both animations completed and schedule next blink
    const checkCompletion = () => {
      if (leftCompleted && rightCompleted) {
        // Safety check for animation completion
        setIsLeftBlinking(false);
        setIsRightBlinking(false);
        scheduleNextBlink(ANIMATIONS[currentAnimation]);
      }
    };
    
    // Execute left eye blink animation
    if (blinkLeft) {
      Animated.sequence([
        // Close eyes
        Animated.timing(leftBlinkAnim, {
          toValue: 0.05,
          duration: leftBlinkSpeed,
          useNativeDriver: true,
        }),
        // Open eyes
        Animated.timing(leftBlinkAnim, {
          toValue: 1,
          duration: leftOpenSpeed,
          useNativeDriver: true,
        }),
        // If double-blink, add a short pause then another blink
        ...(isDouble ? [
          Animated.delay(150),
          Animated.timing(leftBlinkAnim, {
            toValue: 0.05,
            duration: leftBlinkSpeed,
            useNativeDriver: true,
          }),
          Animated.timing(leftBlinkAnim, {
            toValue: 1,
            duration: leftOpenSpeed,
            useNativeDriver: true,
          }),
        ] : []),
      ]).start(() => {
        setIsLeftBlinking(false);
        leftCompleted = true;
        checkCompletion();
      });
    }
    
    // Execute right eye blink animation
    if (blinkRight) {
      Animated.sequence([
        // Close eyes
        Animated.timing(rightBlinkAnim, {
          toValue: 0.05,
          duration: rightBlinkSpeed,
          useNativeDriver: true,
        }),
        // Open eyes
        Animated.timing(rightBlinkAnim, {
          toValue: 1,
          duration: rightOpenSpeed,
          useNativeDriver: true,
        }),
        // If double-blink, add a short pause then another blink
        ...(isDouble ? [
          Animated.delay(150),
          Animated.timing(rightBlinkAnim, {
            toValue: 0.05,
            duration: rightBlinkSpeed,
            useNativeDriver: true,
          }),
          Animated.timing(rightBlinkAnim, {
            toValue: 1,
            duration: rightOpenSpeed,
            useNativeDriver: true,
          }),
        ] : []),
      ]).start(() => {
        setIsRightBlinking(false);
        rightCompleted = true;
        checkCompletion();
      });
    }
  };
  
  // Look at a specific target point with specific eye(s)
  const lookAt = (x, y, options = {}) => {
    const { 
      duration = 300, 
      eye = 'both',
      independent = false // New option to control independent eye movement
    } = options;
    
    // Constrain values between -1 and 1
    const constrainedX = Math.max(-1, Math.min(1, x));
    const constrainedY = Math.max(-1, Math.min(1, y));
    
    const lookWithLeft = eye === 'left' || eye === 'both';
    const lookWithRight = eye === 'right' || eye === 'both';
    
    // For synchronized movement (default), right eye mirrors left eye's movement
    const rightX = independent ? constrainedX : -constrainedX;
    
    // Prepare animations for applicable eyes
    const animations = [];
    
    if (lookWithLeft) {
      animations.push(
        Animated.timing(leftLookXAnim, {
          toValue: constrainedX,
          duration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(leftLookYAnim, {
          toValue: constrainedY,
          duration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        })
      );
    }
    
    if (lookWithRight) {
      animations.push(
        Animated.timing(rightLookXAnim, {
          toValue: rightX, // Use mirrored X position for right eye
          duration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(rightLookYAnim, {
          toValue: constrainedY,
          duration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        })
      );
    }
    
    // Animate eyes to look at target
    if (animations.length > 0) {
      Animated.parallel(animations).start();
    }
    
    // Reset motion sequence after a manual look
    setTimeout(() => {
      // Only restart the sequence if we're still in an automated mode
      if (!isLookingAround) {
        motionSequenceRef.current = generateRandomEyeMotion(15000, 8);
        currentMotionIndexRef.current = 0;
        executeEyeMotionSequence();
      }
    }, duration + 2000);
  };
  
  // Trigger a blink manually for specific eye(s)
  const triggerBlink = (options = {}) => {
    const { isDouble = false, eye = 'both' } = typeof options === 'boolean' 
      ? { isDouble: options, eye: 'both' } // backward compatibility
      : options;
    
    // Cancel any scheduled blinks
    if (blinkTimerRef.current) {
      clearTimeout(blinkTimerRef.current);
    }
    
    // Execute blink now
    executeBlink(eye, isDouble ? 1 : 0);
  };
  
  // Trigger a brief expression for specific eye(s)
  const triggerExpression = (mood, options = {}) => {
    const { duration = 1000, eye = 'both' } = typeof options === 'number'
      ? { duration: options, eye: 'both' } // backward compatibility
      : options;
    
    const lowerMood = typeof mood === 'string' ? mood.toLowerCase() : 'standard';
    
    if (!MOODS[lowerMood]) {
      console.warn(`Unknown mood: ${mood}`);
      return;
    }
    
    // Store the current moods
    const previousLeftMood = leftEyeMood;
    const previousRightMood = rightEyeMood;
    
    // Set the new mood
    setEyeMood(lowerMood, eye);
    
    // Clear any existing expression timer
    if (expressionTimerRef.current) {
      clearTimeout(expressionTimerRef.current);
    }
    
    // Schedule return to previous moods
    expressionTimerRef.current = setTimeout(() => {
      if (eye === 'left' || eye === 'both') {
        setEyeMood(previousLeftMood, 'left');
      }
      if (eye === 'right' || eye === 'both') {
        setEyeMood(previousRightMood, 'right');
      }
    }, duration);
  };
  
  // Apply a custom eye configuration with intensity for specific eye(s)
  const applyEmotion = (emotion, options = {}) => {
    const { 
      intensity = 1, 
      duration = 0, 
      eye = 'both' 
    } = typeof options === 'number' 
      ? { intensity: options, duration: arguments[2] || 0, eye: 'both' } // backward compatibility
      : options;
    
    const lowerEmotion = typeof emotion === 'string' ? emotion.toLowerCase() : 'standard';
    
    if (!MOODS[lowerEmotion]) {
      console.warn(`Unknown emotion: ${emotion}`);
      return;
    }
    
    // Get scaled emotion config
    const config = getEmotionConfig(lowerEmotion, { intensity });
    
    const applyToLeft = eye === 'left' || eye === 'both';
    const applyToRight = eye === 'right' || eye === 'both';
    
    // Apply to left eye
    if (applyToLeft) {
      // Store previous state
      const previousLeftState = leftEyeState;
      
      // Apply to eye state
      setLeftEyeState(config);
      
      // Update animations to match
      const leftAnimations = [
        Animated.timing(leftSquintAnim, {
          toValue: config.squint || 0,
          duration: 250,
          useNativeDriver: true,
        })
      ];
      
      if (config.lookTargetX !== undefined) {
        leftAnimations.push(
          Animated.timing(leftLookXAnim, {
            toValue: config.lookTargetX || 0,
            duration: 300,
            useNativeDriver: true,
          })
        );
      }
      
      if (config.lookTargetY !== undefined) {
        leftAnimations.push(
          Animated.timing(leftLookYAnim, {
            toValue: config.lookTargetY || 0,
            duration: 300,
            useNativeDriver: true,
          })
        );
      }
      
      Animated.parallel(leftAnimations).start();
      
      // If duration is specified, revert after timeout
      if (duration > 0) {
        setTimeout(() => {
          setLeftEyeState(previousLeftState);
          
          // Animate back to previous state
          Animated.parallel([
            Animated.timing(leftSquintAnim, {
              toValue: previousLeftState.squint || 0,
              duration: 250,
              useNativeDriver: true,
            })
          ]).start();
        }, duration);
      }
    }
    
    // Apply to right eye
    if (applyToRight) {
      // Store previous state
      const previousRightState = rightEyeState;
      
      // Apply to eye state
      setRightEyeState(config);
      
      // Update animations to match
      const rightAnimations = [
        Animated.timing(rightSquintAnim, {
          toValue: config.squint || 0,
          duration: 250,
          useNativeDriver: true,
        })
      ];
      
      if (config.lookTargetX !== undefined) {
        rightAnimations.push(
          Animated.timing(rightLookXAnim, {
            toValue: config.lookTargetX || 0,
            duration: 300,
            useNativeDriver: true,
          })
        );
      }
      
      if (config.lookTargetY !== undefined) {
        rightAnimations.push(
          Animated.timing(rightLookYAnim, {
            toValue: config.lookTargetY || 0,
            duration: 300,
            useNativeDriver: true,
          })
        );
      }
      
      Animated.parallel(rightAnimations).start();
      
      // If duration is specified, revert after timeout
      if (duration > 0) {
        setTimeout(() => {
          setRightEyeState(previousRightState);
          
          // Animate back to previous state
          Animated.parallel([
            Animated.timing(rightSquintAnim, {
              toValue: previousRightState.squint || 0,
              duration: 250,
              useNativeDriver: true,
            })
          ]).start();
        }, duration);
      }
    }
  };
  
  // Setup and cleanup timers
  useEffect(() => {
    // Start animation loops
    startAnimationLoops(currentAnimation);
    
    // Cleanup timers
    return () => {
      resetAnimationTimers();
    };
  }, []);
  
  // Return values and functions required by components
  return {
    // State values
    leftEyeState,
    rightEyeState,
    leftEyeMood,
    rightEyeMood,
    currentAnimation,
    isLeftBlinking,
    isRightBlinking,
    isLookingAround,
    
    // Animation values bundled for left eye
    leftEyeAnimations: {
      blinkAnim: leftBlinkAnim,
      squintAnim: leftSquintAnim,
      lookXAnim: leftLookXAnim,
      lookYAnim: leftLookYAnim,
      expressionAnim: leftExpressionAnim
    },
    
    // Animation values bundled for right eye
    rightEyeAnimations: {
      blinkAnim: rightBlinkAnim,
      squintAnim: rightSquintAnim,
      lookXAnim: rightLookXAnim,
      lookYAnim: rightLookYAnim,
      expressionAnim: rightExpressionAnim
    },
    
    // Backward compatibility - combined animations and state
    eyeState: leftEyeState, // Use left eye state for backward compatibility
    eyeAnimations: {
      blinkAnim: leftBlinkAnim,
      squintAnim: leftSquintAnim,
      lookXAnim: leftLookXAnim,
      lookYAnim: leftLookYAnim,
      expressionAnim: leftExpressionAnim
    },
    currentMood: leftEyeMood,
    
    // Control functions
    setMood, // Sets mood for both eyes (backward compatibility)
    setEyeMood, // Sets mood for specific eye(s)
    setAnimation,
    lookAt,
    triggerBlink,
    triggerExpression,
    applyEmotion,
    
    // Utility functions
    resetAnimations: resetAnimationTimers
  };
}; 