import React, { useRef, useEffect, memo } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { GLView } from 'expo-gl';
import * as THREE from 'three';

import { createRenderer } from './render.js';

import { normalizeAudioLevel, PATTERNS, getWindowDimensions, generateColors, createTouchSimulator } from './utils.js';


// Main component
const BlobScene = ({ 
  audioLevel = 0, 
  edgePoints = [],
  primaryColor = { r: 1.0, g: 1.0, b: 1.0 },
  secondaryColor = { r: 0.0, g: 0.5, b: 1.0 },
  colorMix = 0.5,
  useCustomColors = false, // If true, use the provided colors; if false, generate dynamically
  blurIntensity = 0.5,
  effectIntensity = 1.0,
  variationRef
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

  console.log('audioLevel', audioLevel, 'variationRef', variationRef, 'audioLevelRef', audioLevelRef.current);
  
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
      effectIntensityRef,
      variationRef
    });
    
    // Start animation timer - separated from the render loop
    // This ensures touch movement continues even if audio causes parent re-render
    const { width: windowWidth, height: windowHeight } = getWindowDimensions();
    
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

    // Set up animation loops with performance optimizations
    const simulationTimer = setInterval(() => {
      // Check if component is still mounted via a ref
      if (!glRef.current) {
        clearInterval(simulationTimer);
        return;
      }
      
      // Get normalized audio level
      const rawAudio = audioLevelRef.current;
      const normalizedAudio = normalizeAudioLevel(rawAudio);
      // Only generate dynamic colors if not using custom colors
      if (!useCustomColorsRef.current) {
        const time = performance.now() * 0.001;
        const { primaryColor, secondaryColor, colorMix } = generateColors(normalizedAudio, time);
        
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
    }, 100); // 60fps instead of 100fps for better performance
    
    // More efficient render loop with frame limiting
    let lastRenderTime = 0;
    const targetFrameTime = 1000 / 60; // 60 FPS
    let animationFrameId = null;

    const renderFrame = (timestamp) => {
      // Early exit if component unmounted
      if (!glRef.current) {
        return;
      }
      
      // Calculate elapsed time since last render
      const elapsed = timestamp - lastRenderTime;
      
      // Only render if enough time has passed (frame limiting)
      if (elapsed >= targetFrameTime) {
        // Adjust for dropped frames by aligning to frame boundaries
        lastRenderTime = timestamp - (elapsed % targetFrameTime);
        
        // Perform the render
        if (renderer && typeof renderer.update === 'function') {
          renderer.update();
        }
      }
      
      // Schedule next frame *after* processing - safer, cleaner approach
      animationFrameId = requestAnimationFrame(renderFrame);
      requestRef.current.animationFrame = animationFrameId;
    };

    // Start the render loop
    animationFrameId = requestAnimationFrame(renderFrame);

    // Store references for cleanup
    requestRef.current = { 
      simulationTimer,
      animationFrame: animationFrameId,
      renderer, // Store renderer for proper disposal
      gl // Store GL context for proper cleanup
    };
  };

  // Clean up on unmount only - not on every prop change
  useEffect(() => {
    return () => {
      if (requestRef.current) {
        // Cancel animation frame if it exists
        if (requestRef.current.animationFrame) {
          cancelAnimationFrame(requestRef.current.animationFrame);
        }
        
        // Clear the simulation timer
        if (requestRef.current.simulationTimer) {
          clearInterval(requestRef.current.simulationTimer);
        }
        
        // Proper THREE.js and WebGL cleanup
        if (requestRef.current.renderer) {
          const { renderer, gl } = requestRef.current;
          
          try {
            // Get all materials from the scene
            const materials = [];
            const textures = [];
            
            // Find and collect all scene objects that need disposal
            if (renderer.scene && typeof renderer.scene.traverse === 'function') {
              renderer.scene.traverse((object) => {
              if (object.material) {
                if (Array.isArray(object.material)) {
                  object.material.forEach(material => materials.push(material));
                } else {
                  materials.push(object.material);
                }
              }
              
              // Dispose of geometry
              if (object.geometry) {
                object.geometry.dispose();
              }
            });
            }
            
            // Dispose materials and their textures
            materials.forEach(material => {
              if (material.map) textures.push(material.map);
              if (material.lightMap) textures.push(material.lightMap);
              if (material.bumpMap) textures.push(material.bumpMap);
              if (material.normalMap) textures.push(material.normalMap);
              if (material.specularMap) textures.push(material.specularMap);
              if (material.envMap) textures.push(material.envMap);
              
              material.dispose();
            });
            
            // Dispose textures
            textures.forEach(texture => {
              if (texture && typeof texture.dispose === 'function') {
              texture.dispose();
              }
            });

            if(typeof renderer === 'function') {
              renderer.dispose();
            }

            gl.flush();
            
            // Explicitly clear the reference
            glRef.current = null;
            requestRef.current = null;

            console.log('glunmount');
          } catch (e) {
            console.log('Error during cleanup:', e);
          }
        }
      }
    };
  }, []);

  // Render component
  return (
    <View 
      style={styles.container}
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchStart}
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

export default memo(BlobScene);