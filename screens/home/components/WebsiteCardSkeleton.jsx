import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const WebsiteCardSkeleton = () => {
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Create a pulsing animation
    const pulse = Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.6,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0.3,
        duration: 800,
        useNativeDriver: true,
      }),
    ]);

    // Loop the animation
    Animated.loop(pulse).start();

    // Cleanup animation on unmount
    return () => {
      fadeAnim.stopAnimation();
    };
  }, [fadeAnim]);

  return (
    <Animated.View 
      style={[
        styles.card,
        { opacity: fadeAnim }
      ]}
    >
      <View style={styles.cardContent}>
        {/* Image placeholder - same dimensions as WebsiteCard */}
        <View style={styles.imageContainer}>
          <View style={styles.imagePlaceholder} />
        </View>

        {/* Info container - matches WebsiteCard structure */}
        <View style={styles.infoContainer}>
          {/* Name placeholder */}
          <View style={styles.namePlaceholder} />
          
          {/* Domain placeholder */}
          <View style={styles.domainPlaceholder} />

          {/* Stats row */}
          <View style={styles.statsRow}>
            {/* Visits stat placeholder */}
            <View style={styles.statPlaceholder} />
            
            {/* Divider */}
            <View style={styles.divider} />
            
            {/* Status placeholder */}
            <View style={styles.statusPlaceholder} />
          </View>
        </View>

        {/* Action button placeholder */}
        <View style={styles.actionButtonPlaceholder} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  imageContainer: {
    marginRight: 12,
  },
  imagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  namePlaceholder: {
    height: 16,
    width: '70%',
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 2,
  },
  domainPlaceholder: {
    height: 13,
    width: '50%',
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statPlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 13,
    width: 80,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  divider: {
    width: 1,
    height: 14,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginHorizontal: 10,
  },
  statusPlaceholder: {
    height: 13,
    width: 60,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  actionButtonPlaceholder: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
  },
});

export default WebsiteCardSkeleton; 