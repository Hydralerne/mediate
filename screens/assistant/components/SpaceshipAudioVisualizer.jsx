import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer, TextureLoader, loadAsync } from 'expo-three';
import {
  AmbientLight,
  PerspectiveCamera,
  PointLight,
  Scene,
  BoxGeometry,
  MeshStandardMaterial,
  SphereGeometry,
  Group,
  Mesh,
  DirectionalLight,
  Vector3,
  Color,
  CylinderGeometry,
  TorusGeometry,
  RingGeometry,
} from 'three';

const { width, height } = Dimensions.get('window');

const SpaceshipAudioVisualizer = ({ audioLevel = 0 }) => {
  // Normalize audio level to ensure it's between 0 and 1
  const normalizedLevel = Math.min(Math.max(audioLevel, 0), 1);
  
  // Only respond to audio when it reaches threshold
  const isActive = normalizedLevel >= 0.6;
  const activeLevel = isActive ? (normalizedLevel - 0.6) / 0.4 : 0;
  
  // References for Three.js objects
  const glRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const objectsRef = useRef({
    ring: null,
    core: null,
    particles: null,
    lights: [],
  });
  
  // Animation frame and timing
  const rafIDRef = useRef(null);
  const lastUpdateTimeRef = useRef(0);

  // Setup 3D scene
  const onContextCreate = async (gl) => {
    // Save gl context
    glRef.current = gl;
    
    // Create renderer
    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    renderer.setClearColor('black');
    rendererRef.current = renderer;
    
    // Create scene
    const scene = new Scene();
    scene.background = new Color(0x000816);
    sceneRef.current = scene;
    
    // Create camera
    const camera = new PerspectiveCamera(
      75, 
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;
    
    // Create ambient light (weak overall light)
    const ambientLight = new AmbientLight(0x333333);
    scene.add(ambientLight);
    
    // Add directional light (main light source)
    const mainLight = new DirectionalLight(0x3a6eff, 1);
    mainLight.position.set(5, 5, 5);
    scene.add(mainLight);
    objectsRef.current.lights.push(mainLight);
    
    // Create point light at center (will pulse with audio)
    const centerLight = new PointLight(0x00a2ff, 2, 10);
    centerLight.position.set(0, 0, 0);
    scene.add(centerLight);
    objectsRef.current.lights.push(centerLight);
    
    // Create futuristic core sphere
    const coreGeometry = new SphereGeometry(0.5, 32, 32);
    const coreMaterial = new MeshStandardMaterial({
      color: 0x00a2ff,
      emissive: 0x0066cc,
      roughness: 0.2,
      metalness: 0.8,
    });
    const core = new Mesh(coreGeometry, coreMaterial);
    scene.add(core);
    objectsRef.current.core = core;
    
    // Create outer ring (like spaceship interface)
    const ringGeometry = new TorusGeometry(2, 0.1, 16, 50);
    const ringMaterial = new MeshStandardMaterial({
      color: 0x3a6eff,
      emissive: 0x001133,
      roughness: 0.5,
      metalness: 0.7,
    });
    const ring = new Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 3;
    scene.add(ring);
    objectsRef.current.ring = ring;
    
    // Create particle system (small cubes) that will respond to audio
    const particles = new Group();
    const particleCount = 50;
    const particleGeometry = new BoxGeometry(0.1, 0.1, 0.1);
    const particleMaterial = new MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x006666,
      roughness: 0.2,
      metalness: 0.8,
    });
    
    for (let i = 0; i < particleCount; i++) {
      const particle = new Mesh(particleGeometry, particleMaterial);
      
      // Place particles in circular pattern around the center
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 1.2;
      particle.position.x = Math.cos(angle) * radius;
      particle.position.y = Math.sin(angle) * radius;
      particle.position.z = (Math.random() - 0.5) * 0.5;
      
      // Store original position for animation
      particle.userData = {
        originalPosition: particle.position.clone(),
        speed: 0.01 + Math.random() * 0.02,
        angle,
      };
      
      particles.add(particle);
    }
    scene.add(particles);
    objectsRef.current.particles = particles;
    
    // Add energy beam in the center
    const beamGeometry = new CylinderGeometry(0.03, 0.03, 6, 8);
    const beamMaterial = new MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      transparent: true,
      opacity: 0.7,
    });
    const beam = new Mesh(beamGeometry, beamMaterial);
    beam.rotation.x = Math.PI / 2;
    scene.add(beam);
    objectsRef.current.beam = beam;
    
    // Start render loop
    const render = () => {
      const now = Date.now();
      const deltaTime = now - lastUpdateTimeRef.current;
      lastUpdateTimeRef.current = now;
      
      if (objectsRef.current) {
        updateAnimation(deltaTime / 1000);
      }
      
      renderer.render(scene, camera);
      gl.endFrameEXP();
      
      // Continue animation loop
      rafIDRef.current = requestAnimationFrame(render);
    };
    
    render();
  };
  
  // Update animation based on audio level
  const updateAnimation = (deltaTime) => {
    const { ring, core, particles, lights, beam } = objectsRef.current;
    
    // Rotate ring slowly regardless of audio
    if (ring) {
      ring.rotation.z += deltaTime * 0.1;
    }
    
    // Core pulses with audio level
    if (core) {
      const baseScale = 0.8;
      const pulseAmount = 0.2 + (activeLevel * 0.5);
      const pulseSpeed = 2 + (activeLevel * 4);
      
      // Pulse effect based on time
      const pulse = Math.sin(Date.now() / 200 * pulseSpeed) * pulseAmount;
      core.scale.set(baseScale + pulse, baseScale + pulse, baseScale + pulse);
      
      // Change color based on activity
      if (isActive) {
        const hue = 0.6 - (activeLevel * 0.6); // Blue to red
        core.material.emissive.setHSL(hue, 1, 0.5);
        core.material.color.setHSL(hue, 0.8, 0.5);
      }
    }
    
    // Update particle positions based on audio
    if (particles) {
      particles.children.forEach((particle, i) => {
        const { originalPosition, speed, angle } = particle.userData;
        
        // Base motion - subtle orbital movement
        particle.rotation.x += deltaTime * speed * 2;
        particle.rotation.y += deltaTime * speed;
        
        if (isActive) {
          // When active, particles move outward based on audio level
          const displacement = 0.5 + (activeLevel * 1.5);
          particle.position.x = originalPosition.x * displacement;
          particle.position.y = originalPosition.y * displacement;
          
          // Also pulse scale with audio
          const scale = 1 + (activeLevel * 1.5);
          particle.scale.set(scale, scale, scale);
          
          // Make particles glow brighter with higher audio
          particle.material.emissive.setRGB(
            0.1 + activeLevel * 0.9,
            0.4 + activeLevel * 0.6,
            0.6 + activeLevel * 0.4
          );
        } else {
          // When inactive, return to original positions
          particle.position.lerp(originalPosition, deltaTime * 2);
          particle.scale.lerp(new Vector3(1, 1, 1), deltaTime * 2);
          particle.material.emissive.set(0x006666);
        }
      });
    }
    
    // Update lights based on audio
    if (lights && lights.length > 0) {
      // Center light pulses with audio
      const centerLight = lights[1];
      if (centerLight) {
        centerLight.intensity = 1 + (isActive ? activeLevel * 4 : 0);
        
        if (isActive) {
          // Change color based on activity level
          const h = 0.6 - (activeLevel * 0.6); // 0.6 (blue) to 0 (red)
          centerLight.color.setHSL(h, 1, 0.5);
        } else {
          centerLight.color.set(0x00a2ff);
        }
      }
    }
    
    // Beam effect
    if (beam) {
      // Make beam pulse with audio
      const opacityBase = 0.3;
      const opacityPulse = isActive ? 0.3 + (activeLevel * 0.7) : 0.3;
      beam.material.opacity = opacityBase + Math.sin(Date.now() / 200) * opacityPulse;
      
      // Scale beam with audio
      const scaleBase = 1;
      const scaleBoost = isActive ? activeLevel * 3 : 0;
      beam.scale.set(scaleBase + scaleBoost, 1, scaleBase + scaleBoost);
      
      if (isActive) {
        // Change color based on activity level
        const h = 0.6 - (activeLevel * 0.6); // 0.6 (blue) to 0 (red)
        beam.material.emissive.setHSL(h, 1, 0.5);
        beam.material.color.setHSL(h, 0.8, 0.5);
      } else {
        beam.material.emissive.set(0x00ffff);
        beam.material.color.set(0x00ffff);
      }
    }
  };

  // Clean up resources on unmount
  useEffect(() => {
    return () => {
      if (rafIDRef.current) {
        cancelAnimationFrame(rafIDRef.current);
      }
      
      if (glRef.current) {
        const gl = glRef.current;
        gl.deleteFramebuffer(rendererRef.current?.properties.get(gl).__webglFramebuffer);
        gl.deleteRenderbuffer(rendererRef.current?.properties.get(gl).__webglRenderbuffer);
        gl.deleteTexture(rendererRef.current?.properties.get(gl).__webglTexture);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <GLView
        style={styles.glView}
        onContextCreate={onContextCreate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 300,
    backgroundColor: '#000',
  },
  glView: {
    width: '100%',
    height: '100%',
  },
});

export default SpaceshipAudioVisualizer; 