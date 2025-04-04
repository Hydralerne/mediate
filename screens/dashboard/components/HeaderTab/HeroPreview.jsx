import React, { memo } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// HeroPreview component for one-page minisite header visualization
const HeroPreview = memo(({ headerData }) => {
  const { 
    title, 
    logo, 
    tagline, 
    displayMode = 'centered',
    heroImage, 
    backgroundColor = '#212529',
    textColor = '#FFFFFF',
    useLogo = false,
    tintLogo = false
  } = headerData || {};

  // Determine the content styles based on display mode
  const getContentStyle = () => {
    switch (displayMode) {
      case 'left':
        return {
          alignItems: 'flex-start',
          paddingHorizontal: 24
        };
      case 'overlay':
        return {
          position: 'absolute',
          bottom: 60,
          left: 0,
          right: 0,
          padding: 20
        };
      case 'centered':
      default:
        return {
          alignItems: 'center',
          paddingHorizontal: 24
        };
    }
  };

  // Get text color based on display mode
  const getTextColor = () => {
    if (displayMode === 'overlay') {
      return '#FFFFFF';
    }
    return textColor;
  };

  // Render content (logo or title+tagline)
  const renderContent = () => (
    <View style={[styles.contentContainer, getContentStyle()]}>
      {useLogo && logo ? (
        <View style={styles.logoContainer}>
          <Image 
            source={{ uri: logo }} 
            style={[
              styles.logoImage,
              tintLogo && { tintColor: getTextColor() }
            ]}
            resizeMode="contain"
          />
          {tagline && (
            <Text 
              style={[
                styles.tagline,
                { color: getTextColor() },
                displayMode === 'left' && styles.leftAlignedTagline
              ]}
              numberOfLines={2}
            >
              {tagline}
            </Text>
          )}
        </View>
      ) : (
        <>
          <Text 
            style={[
              styles.title, 
              { color: getTextColor() },
              displayMode === 'left' && styles.leftAlignedTitle
            ]}
            numberOfLines={2}
          >
            {title || 'Your Brand'}
          </Text>
          
          {tagline && (
            <Text 
              style={[
                styles.tagline,
                { color: getTextColor() },
                displayMode === 'left' && styles.leftAlignedTagline
              ]}
              numberOfLines={2}
            >
              {tagline}
            </Text>
          )}
        </>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.previewOverlay}>
        <Text style={styles.previewText}>PREVIEW ONLY - NOT FINAL APPEARANCE</Text>
      </View>
      
      {heroImage ? (
        <>
          <View style={styles.heroImageContainer}>
            <Image 
              source={{ uri: heroImage }} 
              style={styles.heroImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', backgroundColor]}
              style={styles.gradient}
              start={{ x: 0, y: 0.7 }}
              end={{ x: 0, y: 1 }}
            />
          </View>
          {renderContent()}
        </>
      ) : (
        <>
          <View style={styles.heroImageContainer} />
          {renderContent()}
        </>
      )}
      
      <View style={styles.callToAction}>
        <View style={[styles.cta, { backgroundColor: `${getTextColor()}20` }]}>
          <Ionicons 
            name="chevron-down" 
            size={18} 
            color={getTextColor()} 
          />
        </View>
      </View>
      
      <View style={styles.wireframeIndicator}>
        <View style={styles.wireframeLine} />
        <View style={styles.wireframeLine} />
        <View style={styles.wireframeLine} />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    height: 300,
    width: '100%',
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'flex-start'
  },
  heroImageContainer: {
    height: '90%',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
  },
  contentContainer: {
    width: '100%',
    position: 'absolute',
    top: '45%',
    transform: [{ translateY: -25 }]
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  leftAlignedTitle: {
    textAlign: 'left',
  },
  tagline: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    opacity: 0.8,
    marginTop: 8,
  },
  leftAlignedTagline: {
    textAlign: 'left',
  },
  logoContainer: {
    alignItems: 'center',
    width: '100%',
  },
  logoImage: {
    width: '60%',
    height: 60,
    backgroundColor: 'transparent',
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
  wireframeLine: {
    width: 30,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: 3,
    borderRadius: 1,
  }
});

export default HeroPreview; 