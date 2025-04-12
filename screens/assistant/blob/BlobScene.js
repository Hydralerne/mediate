import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';

import fragmentShader from './shaders/fragmentShader.js';

// Animation patterns
const PATTERNS = {
  CIRCULAR: 'circular',
  WAVE: 'wave',
  RANDOM: 'random',
  SPIRAL: 'spiral'
};

// Animation functions for different patterns
const animationPatterns = {
  // Simple circular motion
  [PATTERNS.CIRCULAR]: (params) => {
    const { centerX, centerY, angle, baseR, maxRadiusPercent } = params;
    const x = centerX + Math.cos(angle) * (baseR * maxRadiusPercent);
    const y = centerY + Math.sin(angle) * (baseR * maxRadiusPercent);
    return { x, y };
  },

  // Wavy circular motion
  [PATTERNS.WAVE]: (params) => {
    const { centerX, centerY, angle, baseR, maxRadius, waveFrequency, waveAmplitude, audioFactor } = params;
    const waveOffset = Math.sin(angle * waveFrequency) * waveAmplitude * audioFactor;
    const x = centerX + Math.cos(angle) * Math.min(baseR + waveOffset, maxRadius);
    const y = centerY + Math.sin(angle) * Math.min(baseR + waveOffset, maxRadius);
    return { x, y };
  },

  // Random movement with coherence
  [PATTERNS.RANDOM]: (params) => {
    const { 
      centerX, centerY, angle, baseR, maxRadius, randomness, normalizedAudioLevel,
      currentRadius, updateRadius, updateAngle
    } = params;
    
    // Scale randomness by audio level - more contained at low levels
    const scaledRandomness = randomness * (0.2 + normalizedAudioLevel * 0.8);
    
    // Add some randomness to angle and radius
    const randomAngleOffset = (Math.random() * 2 - 1) * scaledRandomness * Math.PI;
    const randomRadiusOffset = (Math.random() * 2 - 1) * scaledRandomness * baseR;
    
    // Update angle
    updateAngle(randomAngleOffset);
    
    // Update radius with audio-based constraints
    const newRadius = currentRadius + randomRadiusOffset;
    updateRadius(Math.max(10, Math.min(newRadius, maxRadius)));
    
    // Calculate position with the constrained radius
    let x = centerX + Math.cos(angle) * currentRadius;
    let y = centerY + Math.sin(angle) * currentRadius;
    
    // Add stronger pull toward center when audio is low
    if (normalizedAudioLevel < 0.9) {
      const centerPull = 1 - normalizedAudioLevel;
      x = x * (1 - centerPull * 0.3) + centerX * (centerPull * 0.3);
      y = y * (1 - centerPull * 0.3) + centerY * (centerPull * 0.3);
    }
    
    return { x, y };
  },

  // Expanding/contracting spiral
  [PATTERNS.SPIRAL]: (params) => {
    const { 
      centerX, centerY, angle, baseR, maxRadius, spiralExpansion,
      deltaTime, normalizedAudioLevel, currentRadius, updateRadius
    } = params;
    
    // Update radius for spiral, constrained by max radius
    const newSpiralRadius = currentRadius + 
      spiralExpansion * baseR * deltaTime * (1 + normalizedAudioLevel * 5);
    
    // Constrain spiral radius by audio level
    updateRadius(Math.min(newSpiralRadius, maxRadius));
    
    // Reset spiral when it gets too large
    if (currentRadius > maxRadius * 0.95) {
      updateRadius(10);
    }
    
    const x = centerX + Math.cos(angle) * currentRadius;
    const y = centerY + Math.sin(angle) * currentRadius;
    
    return { x, y };
  }
};

// Utility functions
const utils = {
  // Normalize audio level to 0-1 scale based on min-max range
  normalizeAudioLevel: (audioLevel) => {
    return Math.max(0, Math.min(1, (audioLevel - 0.7) / 0.45));
  },
  
  // Apply edge point influence based on angle
  applyEdgePointInfluence: (position, edgePoints, angle, normalizedAudioLevel) => {
    if (edgePoints.length === 0 || normalizedAudioLevel <= 0.7) {
      return position;
    }
    
    // Find the closest edge point based on current angle
    const sectorSize = Math.PI * 2 / edgePoints.length;
    const sectorIndex = Math.floor((angle % (Math.PI * 2)) / sectorSize);
    const edgePoint = edgePoints[sectorIndex % edgePoints.length];
    
    if (!edgePoint) {
      return position;
    }
    
    // Apply influence from the edge point - stronger at high audio levels
    const influenceFactor = Math.max(0, (normalizedAudioLevel - 0.7) * 2) * 0.3;
    position.x += (edgePoint.x - position.x) * influenceFactor;
    position.y += (edgePoint.y - position.y) * influenceFactor;
    
    return position;
  },
  
  // Get window dimensions
  getWindowDimensions: () => {
    return {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height
    };
  },
  
  // Generate colors based on audio level and time
  generateColors: (normalizedAudioLevel, time) => {
    // Generate primary color that changes with audio level
    // Higher audio = more vibrant colors
    const hue1 = (time * 0.05) % 1.0;
    const saturation1 = 0.5 + normalizedAudioLevel * 0.5;
    const lightness1 = 0.3 + normalizedAudioLevel * 0.4;
    
    // Generate complementary color for secondary
    const hue2 = (hue1 + 0.5) % 1.0; 
    const saturation2 = 0.7 + normalizedAudioLevel * 0.3;
    const lightness2 = 0.2 + normalizedAudioLevel * 0.2;
    
    // Convert HSL to RGB for primary color
    const primaryColor = hslToRgb(hue1, saturation1, lightness1);
    
    // Convert HSL to RGB for secondary color
    const secondaryColor = hslToRgb(hue2, saturation2, lightness2);
    
    // Calculate color mix based on audio level
    // Higher audio = more dynamic mixing
    const colorMix = 0.3 + normalizedAudioLevel * 0.7;
    
    return {
      primaryColor,
      secondaryColor,
      colorMix
    };
  },
  
  // Convert HSL color values to RGB
  // h, s, l values in range 0-1
  hslToRgb: (h, s, l) => {
    let r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return { r, g, b };
  }
};

// Alias for the HSL to RGB function for easier access
const hslToRgb = utils.hslToRgb;

// Main touch movement simulation controller
const createTouchSimulator = (refs) => {
  const {
    touchPositionRef,
    animationStateRef,
    audioLevelRef,
    edgePointsRef,
    lastUpdateTimeRef
  } = refs;
  
  return {
    // Main simulation function
    simulate: (params = {}) => {
      // Get current audio level from ref and normalize
      const rawAudioLevel = audioLevelRef.current;
      const normalizedAudioLevel = utils.normalizeAudioLevel(rawAudioLevel);
      
      const {
        centerX = Dimensions.get('window').width / 2,
        centerY = Dimensions.get('window').height / 2,
        baseRadius = 100,
        radiusMultiplier = 1.5,
        speed = 5.0,
        pattern = PATTERNS.RANDOM,
        waveAmplitude = 50,
        waveFrequency = 2,
        randomness = 0.3,
        spiralExpansion = 0.05
      } = params;

      // Store center position in animation state
      animationStateRef.current.centerX = centerX;
      animationStateRef.current.centerY = centerY;

      // Get current time for animation
      const now = performance.now();
      const deltaTime = (now - lastUpdateTimeRef.current) / 1000; // in seconds
      lastUpdateTimeRef.current = now;

      // Increase the effective speed significantly
      const effectiveSpeed = speed * 3;
      
      // Update animation angle with faster speed
      animationStateRef.current.angle += effectiveSpeed * deltaTime;
      
      // Calculate radius based on normalized audio level
      // Constrain the radius more when audio level is low
      const audioFactor = normalizedAudioLevel >= 0.9 ? radiusMultiplier * 2 : 
                         (0.2 + normalizedAudioLevel * 0.8) * radiusMultiplier;
      const maxRadiusPercent = normalizedAudioLevel >= 0.9 ? 1.0 : 
                              0.2 + (normalizedAudioLevel * 0.8);
      const baseR = baseRadius * audioFactor;
      
      // The maximum allowed radius - only reach edges on high audio
      const maxRadius = baseRadius * maxRadiusPercent;
      
      // Initialize radius if needed
      if (!animationStateRef.current.radius) {
        animationStateRef.current.radius = baseR * 0.3; // Start closer to center
      }
      
      // Helper functions for pattern handlers
      const updateRadius = (newRadius) => {
        animationStateRef.current.radius = newRadius;
      };
      
      const updateAngle = (angleOffset) => {
        animationStateRef.current.angle += angleOffset;
      };
      
      // Create common parameters for pattern functions
      const patternParams = {
        centerX,
        centerY,
        angle: animationStateRef.current.angle,
        baseR,
        maxRadius,
        maxRadiusPercent,
        waveFrequency,
        waveAmplitude,
        audioFactor,
        normalizedAudioLevel,
        randomness,
        spiralExpansion,
        deltaTime,
        currentRadius: animationStateRef.current.radius,
        updateRadius,
        updateAngle
      };
      
      // Get the appropriate animation pattern function
      const patternFunction = animationPatterns[pattern] || animationPatterns[PATTERNS.RANDOM];
      
      // Calculate position using the selected pattern
      let position = patternFunction(patternParams);
      
      // Apply edge point influence
      position = utils.applyEdgePointInfluence(
        position, 
        edgePointsRef.current, 
        animationStateRef.current.angle, 
        normalizedAudioLevel
      );

      // Update the touch position ref
      touchPositionRef.current.set(position.x, position.y);
    }
  };
};


// GL rendering setup and animation loop
const createRenderer = (gl, touchPositionRef, colorRefs) => {
        // Setup scene
        const scene = new THREE.Scene();
        const vMouseDamp = new THREE.Vector2();
        const vResolution = new THREE.Vector2();
        const vPrimaryColor = new THREE.Vector3(1.0, 1.0, 1.0); // Default to white
        const vSecondaryColor = new THREE.Vector3(0.0, 0.5, 1.0); // Default to blue
        
        // Start with variation 1 (will be dynamic later)
        let variation = 1

        // Get dimensions
        const w = gl.drawingBufferWidth;
        const h = gl.drawingBufferHeight;

        vResolution.set(w, h);

        const aspect = w / h;
        const camera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0.1, 1000);

        const renderer = new Renderer({ gl });
        renderer.setSize(w, h);
        renderer.setClearColor(0x000000, 0);

        // Create geometry and material
        const geo = new THREE.PlaneGeometry(3, 3);  // Scaled to cover full viewport
        const mat = new THREE.ShaderMaterial({
            vertexShader: /* glsl */`
                varying vec2 v_texcoord;
                void main() {
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    v_texcoord = uv;
                }`,
            fragmentShader, // most of the action happening in the fragment
            uniforms: {
                u_mouse: { value: vMouseDamp },
                u_resolution: { value: vResolution },
                u_pixelRatio: { value: 2 },
                u_primaryColor: { value: vPrimaryColor },
                u_secondaryColor: { value: vSecondaryColor },
                u_colorMix: { value: 0.5 },
                u_time: { value: 0.0 },
                u_blurIntensity: { value: 0.5 },
                u_effectIntensity: { value: 1.0 }
            },
            defines: {
                VAR: variation
            }
        });

        // Mesh creation
        const quad = new THREE.Mesh(geo, mat);
        scene.add(quad);
  
        // Camera position and orientation
        camera.position.z = 1;

        // Animation loop for rendering
        let time = 0, lastTime = 0;
        let lastVariationChange = 0;
        let currentVariation = variation;

        const update = () => {
            // calculate delta time
            time = performance.now() * 0.001;
            const dt = time - lastTime;
            lastTime = time;
    
            // Update time uniform
            mat.uniforms.u_time.value = time;
            
            // Update color uniforms if refs are provided
            if (colorRefs && colorRefs.primaryColorRef && colorRefs.primaryColorRef.current) {
                const primaryColor = colorRefs.primaryColorRef.current;
                vPrimaryColor.set(primaryColor.r, primaryColor.g, primaryColor.b);
            }
            
            if (colorRefs && colorRefs.secondaryColorRef && colorRefs.secondaryColorRef.current) {
                const secondaryColor = colorRefs.secondaryColorRef.current;
                vSecondaryColor.set(secondaryColor.r, secondaryColor.g, secondaryColor.b);
            }
            
            if (colorRefs && colorRefs.colorMixRef) {
                mat.uniforms.u_colorMix.value = colorRefs.colorMixRef.current || 0.5;
            }
            
            // Update blur and effect intensity if provided
            if (colorRefs && colorRefs.blurIntensityRef) {
                mat.uniforms.u_blurIntensity.value = colorRefs.blurIntensityRef.current || 0.5;
            }
            
            if (colorRefs && colorRefs.effectIntensityRef) {
                mat.uniforms.u_effectIntensity.value = colorRefs.effectIntensityRef.current || 1.0;
            }
            
            // Update shader variation based on audio level with cooldown
            if (colorRefs && colorRefs.audioLevelRef && time - lastVariationChange > 2.0) {
                const audioLevel = colorRefs.audioLevelRef.current;
                const normalizedAudio = utils.normalizeAudioLevel(audioLevel);
                
                // Only change variation on significant audio level changes
                if (normalizedAudio > 0.8) {
                    // Randomly switch between variations on high audio peaks
                    const newVariation = Math.floor(Math.random() * 4); // 0-3
                    
                    if (newVariation !== currentVariation) {
                        currentVariation = newVariation;
                        mat.defines.VAR = currentVariation;
                        mat.needsUpdate = true;
                        lastVariationChange = time;
                    }
                }
            }
    
            // Get current touch position from the ref
            const currentTouch = touchPositionRef.current;
            
            // ease touch motion with damping
            for (const k in currentTouch) {
                if (k == 'x' || k == 'y') {
                    vMouseDamp[k] = THREE.MathUtils.damp(vMouseDamp[k], currentTouch[k], 8, dt);
                }
            }

            // Update resolution if needed
            if (w !== gl.drawingBufferWidth || h !== gl.drawingBufferHeight) {
                const newW = gl.drawingBufferWidth;
                const newH = gl.drawingBufferHeight;
                vResolution.set(newW, newH);
                renderer.setSize(newW, newH);
            }

            // render scene
            gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
            renderer.render(scene, camera);
            gl.flush();
            gl.endFrameEXP();
        };
  
        return { update };
};

// Main component
const BlobScene = ({ 
  audioLevel = 0, 
  edgePoints = [],
  primaryColor = { r: 1.0, g: 1.0, b: 1.0 },
  secondaryColor = { r: 0.0, g: 0.5, b: 1.0 },
  colorMix = 0.5,
  useCustomColors = false, // If true, use the provided colors; if false, generate dynamically
  blurIntensity = 0.5,
  effectIntensity = 1.0
}) => {
  // Create refs to store state
  const touchPositionRef = useRef(new THREE.Vector2());
  const glRef = useRef(null);
  const requestRef = useRef(null);
  const lastUpdateTimeRef = useRef(0);
  const animationStateRef = useRef({
    angle: 0,
    radius: 0,
    centerX: 0,
    centerY: 0
  });
  
  // Store audioLevel and edgePoints in refs to prevent re-renders
  const audioLevelRef = useRef(audioLevel);
  const edgePointsRef = useRef(edgePoints);
  
  // Flag for using custom colors vs. dynamic colors
  const useCustomColorsRef = useRef(useCustomColors);
  
  // Color refs to update shader without re-rendering
  const primaryColorRef = useRef(primaryColor);
  const secondaryColorRef = useRef(secondaryColor);
  const colorMixRef = useRef(colorMix);
  
  // Effect control refs
  const blurIntensityRef = useRef(blurIntensity);
  const effectIntensityRef = useRef(effectIntensity);
  
  // Update refs when props change without causing re-renders
  useEffect(() => {
    audioLevelRef.current = audioLevel;
  }, [audioLevel]);
  
  useEffect(() => {
    edgePointsRef.current = edgePoints;
  }, [edgePoints]);
  
  // Update color refs when props change
  useEffect(() => {
    useCustomColorsRef.current = useCustomColors;
  }, [useCustomColors]);
  
  useEffect(() => {
    if (useCustomColorsRef.current) {
      primaryColorRef.current = primaryColor;
    }
  }, [primaryColor, useCustomColors]);
  
  useEffect(() => {
    if (useCustomColorsRef.current) {
      secondaryColorRef.current = secondaryColor;
    }
  }, [secondaryColor, useCustomColors]);
  
  useEffect(() => {
    if (useCustomColorsRef.current) {
      colorMixRef.current = colorMix;
    }
  }, [colorMix, useCustomColors]);
  
  // Update effect control refs when props change
  useEffect(() => {
    blurIntensityRef.current = blurIntensity;
  }, [blurIntensity]);
  
  useEffect(() => {
    effectIntensityRef.current = effectIntensity;
  }, [effectIntensity]);

  // Create touch simulator
  const touchSimulator = useRef(
    createTouchSimulator({
      touchPositionRef,
      animationStateRef,
      audioLevelRef,
      edgePointsRef,
      lastUpdateTimeRef
    })
  ).current;

  // Handle touch events
  const handleTouchStart = (event) => {
    if (event.nativeEvent.touches.length > 0) {
      const touch = event.nativeEvent.touches[0];
      touchPositionRef.current.set(touch.pageX, touch.pageY);
      
      // Reset animation center to the touch point
      animationStateRef.current.centerX = touch.pageX;
      animationStateRef.current.centerY = touch.pageY;
      console.log('touch', touch.pageX, touch.pageY);
    }
  };

  // center the blob to the screen
  
  useEffect(() => {
      touchPositionRef.current.set(280, 280);
      animationStateRef.current.centerX = 280;
      animationStateRef.current.centerY = 280;
  }, []);

  const handleTouchMove = (event) => {
    if (event.nativeEvent.touches.length > 0) {
      const touch = event.nativeEvent.touches[0];
      touchPositionRef.current.set(touch.pageX, touch.pageY);
    }
  };

  // Context creation handler for GL rendering
  const onContextCreate = async (gl) => {
    glRef.current = gl;
    
    // Create renderer with color refs and audio level
    const renderer = createRenderer(gl, touchPositionRef, {
      primaryColorRef,
      secondaryColorRef,
      colorMixRef,
      audioLevelRef,
      blurIntensityRef,
      effectIntensityRef
    });
    
    // Start animation timer - separated from the render loop
    // This ensures touch movement continues even if audio causes parent re-render
    const { width: windowWidth, height: windowHeight } = utils.getWindowDimensions();
    
    // Initialize center if not already set
    if (!animationStateRef.current.centerX) {
      animationStateRef.current.centerX = windowWidth / 2;
      animationStateRef.current.centerY = windowHeight / 2;
    }
    
    // Set initial touch position to center of screen
    touchPositionRef.current.set(windowWidth / 2, windowHeight / 2);
    
    // Function to determine pattern based on audio level
    const getPatternForAudioLevel = (audioLevel) => {
      // All patterns set to random as requested, but could be customized
      if (audioLevel > 0.7) return PATTERNS.RANDOM;
      if (audioLevel > 0.4) return PATTERNS.RANDOM;
      if (audioLevel > 0.2) return PATTERNS.RANDOM;
      return PATTERNS.RANDOM;
    };
    
    // Set up animation loops
    const simulationTimer = setInterval(() => {
      // Get normalized audio level
      const rawAudio = audioLevelRef.current;
      const normalizedAudio = utils.normalizeAudioLevel(rawAudio);
      
      // Only generate dynamic colors if not using custom colors
      if (!useCustomColorsRef.current) {
        const time = performance.now() * 0.001;
        const { primaryColor, secondaryColor, colorMix } = utils.generateColors(normalizedAudio, time);
        
        // Update color refs
        primaryColorRef.current = primaryColor;
        secondaryColorRef.current = secondaryColor;
        colorMixRef.current = colorMix;
      }
      
      // Update effect intensity based on audio level if in dynamic mode
      if (!useCustomColorsRef.current) {
        // Slightly increase blur intensity with audio level for more dynamic effect
        blurIntensityRef.current = Math.min(1.0, 0.3 + normalizedAudio * 0.7);
        
        // Increase effect intensity with audio level
        effectIntensityRef.current = Math.min(1.5, 0.6 + normalizedAudio * 0.9);
      }
      
      // Simulate movement with parameters adjusted for desired behavior
      touchSimulator.simulate({
        centerX: animationStateRef.current.centerX,
        centerY: animationStateRef.current.centerY,
        baseRadius: Math.min(windowWidth, windowHeight) * 0.8, // Larger potential radius
        radiusMultiplier: 2.5,
        speed: 4.0 + normalizedAudio * 4, // Much higher base speed
        pattern: getPatternForAudioLevel(normalizedAudio),
        waveAmplitude: 30 + normalizedAudio * 100,
        waveFrequency: 3 + normalizedAudio * 5,
        randomness: 0.3 + normalizedAudio * 0.7, // More randomness at higher audio
        spiralExpansion: 0.05 + normalizedAudio * 0.2
      });
    }, 10); // ~100fps for smoother animation
    
    // Render loop
    const renderFrame = () => {
      renderer.update();
      return requestAnimationFrame(renderFrame);
    };
    
    // Start the loops
    const animationFrame = renderFrame();
    
    // Store timers in a ref so they can be cleaned up even if component re-renders
    requestRef.current = { 
      simulationTimer,
      animationFrame
    };
  };

  // Clean up on unmount only - not on every prop change
  useEffect(() => {
    return () => {
      if (requestRef.current) {
        if (requestRef.current.animationFrame) {
          cancelAnimationFrame(requestRef.current.animationFrame);
        }
        if (requestRef.current.simulationTimer) {
          clearInterval(requestRef.current.simulationTimer);
        }
      }
    };
  }, []);

  // Render component
  return (
    <View 
      style={styles.container}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <GLView
        style={styles.glView}
        onContextCreate={onContextCreate}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    glView: {
        flex: 1,
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
});

export default BlobScene;