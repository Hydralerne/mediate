import React, { memo, useEffect, useRef } from "react";
import { View, StyleSheet, Dimensions, Animated } from "react-native"
const { width } = Dimensions.get('window');
import Blob from "../blob";

// Configuration for audio-to-scale mapping
const AUDIO_SCALE_CONFIG = {
    // Audio level threshold to start scaling
    threshold: 0.2,

    // Scale range
    minScale: 0.9,   // Scale at or below threshold
    maxScale: 1,   // Scale at max audio level (1.0)

    // Animation parameters
    animDuration: 60,   // Animation duration in ms (reduced for responsiveness)
    springFriction: 4,   // Spring physics: lower = more bouncy (reduced for faster response)
    springTension: 80,   // Spring physics: higher = faster (increased for responsiveness)
    
    // Animation type - can be 'timing', 'spring', or 'immediate'
    animationType: 'spring',

    // Customize the mapping function if needed
    mapAudioToScale: (audioLevel, config) => {
        const { threshold, minScale, maxScale } = config;
        if (audioLevel < threshold) return minScale;
        // Map value from threshold-1.0 range to minScale-maxScale range
        const normalizedValue = (audioLevel - threshold) / (1.0 - threshold);
        return minScale + normalizedValue * (maxScale - minScale);
    }
};

const AIView = ({ audioLevel = 10, scaleConfig = AUDIO_SCALE_CONFIG, variationRef }) => {
    console.log(variationRef);
    return (
        <View style={styles.container}>
            {/* <RobotEye style={{ zIndex: 1000, marginTop: -20, transform: [{ scale: 0.5 }] }} /> */}
            <VideoBack audioLevel={audioLevel} variationRef={variationRef} scaleConfig={scaleConfig} />
        </View>
    )
}

const VideoBack = ({ audioLevel, scaleConfig = AUDIO_SCALE_CONFIG, variationRef }) => {
    // Normalize audio level to ensure it's between 0 and 1
    const normalizedLevel = Math.min(Math.max(audioLevel, 0), 1);

    // Create animated value for smooth transitions
    const scaleAnim = useRef(new Animated.Value(scaleConfig.minScale)).current;

    // Update animation when audio level changes
    useEffect(() => {
        // Calculate target scale using the config mapping function
        const targetScale = scaleConfig.mapAudioToScale(normalizedLevel, scaleConfig);
        
        // Choose animation type based on config
        switch (scaleConfig.animationType) {
            case 'spring':
                // Spring animation - smooth but with bounce
                Animated.spring(scaleAnim, {
                    toValue: targetScale,
                    friction: scaleConfig.springFriction,
                    tension: scaleConfig.springTension,
                    useNativeDriver: true,
                }).start();
                break;
                
            case 'immediate':
                // Direct value setting - most responsive but no animation
                scaleAnim.setValue(targetScale);
                break;
                
            case 'timing':
            default:
                // Timing animation - responsive and smooth
                Animated.timing(scaleAnim, {
                    toValue: targetScale,
                    duration: scaleConfig.animDuration,
                    useNativeDriver: true,
                }).start();
                break;
        }
    }, [normalizedLevel, scaleAnim, scaleConfig]);


    return (
        <Animated.View
            style={[
                styles.videoContainer,
                { transform: [{ scale: scaleAnim }] }
            ]}
        >
            <Blob variationRef={variationRef} audioLevel={audioLevel} />
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
    },
})

export default memo(AIView);