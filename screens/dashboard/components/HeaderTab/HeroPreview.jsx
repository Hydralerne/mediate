import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// HeroPreview component for one-page minisite header visualization
const HeroPreview = memo(({ headerData }) => {
  const { 
    heroLayout = 'fullWidth',
    backgroundColor = '#212529',
    textColor = '#FFFFFF',
    displayMode = 'centered'
  } = headerData || {};

  // Render wireframe hero element based on selected layout
  const renderHeroWireframe = () => {
    switch (heroLayout) {
      case 'circleLeft':
        return (
          <View style={styles.wireframeContainer}>
            <View style={styles.circleHeroWireframe}>
              <Ionicons name="image-outline" size={28} color="rgba(255,255,255,0.3)" />
            </View>
            <View style={[styles.wireframeContentArea, styles.leftContent]}>
              <View style={[styles.wireframeLine, { width: '70%' }]} />
              <View style={[styles.wireframeLine, { width: '50%' }]} />
            </View>
          </View>
        );
      case 'squareLeft':
        return (
          <View style={styles.wireframeContainer}>
            <View style={styles.squareHeroWireframe}>
              <Ionicons name="image-outline" size={28} color="rgba(255,255,255,0.3)" />
            </View>
            <View style={[styles.wireframeContentArea, styles.leftContent]}>
              <View style={[styles.wireframeLine, { width: '70%' }]} />
              <View style={[styles.wireframeLine, { width: '50%' }]} />
            </View>
          </View>
        );
      case 'fullWidth':
      default:
        return (
          <View style={styles.wireframeContainer}>
            <View style={styles.fullWidthHeroWireframe}>
              <View style={styles.fullWidthIconContainer}>
                <Ionicons name="image-outline" size={32} color="rgba(255,255,255,0.3)" />
              </View>
              <LinearGradient
                colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.3)', backgroundColor]}
                style={styles.wireframeGradient}
                start={{ x: 0, y: 0.4 }}
                end={{ x: 0, y: 1 }}
              />
            </View>
            <View style={[styles.wireframeContentArea, styles.fullWidthContent]}>
              <View style={[styles.wireframeLine, { width: '70%' }]} />
              <View style={[styles.wireframeLine, { width: '50%' }]} />
            </View>
          </View>
        );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.previewOverlay}>
        <Text style={styles.previewText}>PREVIEW</Text>
      </View>
      
      {renderHeroWireframe()}
      
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    height: 200,
    width: '100%',
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'flex-start'
  },
  wireframeContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidthHeroWireframe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  fullWidthIconContainer: {
    position: 'absolute',
    top: 80,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleHeroWireframe: {
    position: 'absolute',
    top: 40,
    left: 30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  squareHeroWireframe: {
    position: 'absolute',
    top: 40,
    left: 30,
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wireframeGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 150,
  },
  wireframeContentArea: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
  },
  fullWidthContent: {
    top: '60%',
    left: 0,
    right: 0,
  },
  leftContent: {
    top: '25%',
    left: 150,
    right: 20,
    alignItems: 'flex-start'
  },
  wireframeLine: {
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 6,
    marginVertical: 6,
  },
  callToAction: {
    width: '100%',
    alignItems: 'center',
    position: 'absolute',
    bottom: 16,
  },
  cta: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 4,
    zIndex: 10,
  },
  previewText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  wireframeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 4,
    alignItems: 'center',
  },
  indicatorLine: {
    width: 30,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: 3,
    borderRadius: 1,
  }
});

export default HeroPreview; 