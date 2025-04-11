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
  }
};

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
const createRenderer = (gl, touchPositionRef) => {
        // Setup scene
        const scene = new THREE.Scene();
        const vMouseDamp = new THREE.Vector2();
        const vResolution = new THREE.Vector2();

        const variation = 1;

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
                u_pixelRatio: { value: 2 }
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

        const update = () => {
            // calculate delta time
            time = performance.now() * 0.001;
            const dt = time - lastTime;
            lastTime = time;
    
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
const BlobScene = ({ audioLevel = 0, edgePoints = [] }) => {
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
  
  // Update refs when props change without causing re-renders
  useEffect(() => {
    audioLevelRef.current = audioLevel;
  }, [audioLevel]);
  
  useEffect(() => {
    edgePointsRef.current = edgePoints;
  }, [edgePoints]);

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
    
    // Create renderer
    const renderer = createRenderer(gl, touchPositionRef);
    
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