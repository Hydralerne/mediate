import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Dimensions, Animated } from "react-native"
const { width } = Dimensions.get('window');
import Blob from "../blob";
// Configuration for audio-to-scale mapping
const AUDIO_SCALE_CONFIG = {
    // Audio level threshold to start scaling
    threshold: 0.7,

    // Scale range
    minScale: 0.9,   // Scale at or below threshold
    maxScale: 1.1,   // Scale at max audio level (1.0)

    // Animation parameters
    animDuration: 300,   // Animation duration in ms
    springFriction: 8,   // Spring physics: lower = more bouncy
    springTension: 40,   // Spring physics: higher = faster

    // Customize the mapping function if needed
    mapAudioToScale: (audioLevel, config) => {
        const { threshold, minScale, maxScale } = config;
        if (audioLevel < threshold) return minScale;

        // Map value from threshold-1.0 range to minScale-maxScale range
        const normalizedValue = (audioLevel - threshold) / (1.0 - threshold);
        return minScale + normalizedValue * (maxScale - minScale);
    }
};

const AIView = ({ audioLevel = 0, scaleConfig = AUDIO_SCALE_CONFIG }) => {
    console.log("audioLevel", audioLevel)
    return (
        <View style={styles.container}>
            {/* <RobotEye style={{ zIndex: 1000, marginTop: -20, transform: [{ scale: 0.5 }] }} /> */}
            <VideoBack audioLevel={audioLevel} scaleConfig={scaleConfig} />
        </View>
    )
}

const VideoBack = ({ audioLevel = 0, scaleConfig = AUDIO_SCALE_CONFIG }) => {
    // Normalize audio level to ensure it's between 0 and 1
    const normalizedLevel = Math.min(Math.max(audioLevel, 0), 1);

    // Create animated value for smooth transitions
    const scaleAnim = useRef(new Animated.Value(scaleConfig.minScale)).current;

    // Update animation when audio level changes
    useEffect(() => {
        // Calculate target scale using the config mapping function
        const targetScale = scaleConfig.mapAudioToScale(normalizedLevel, scaleConfig);

        // Animate to the new scale using spring animation
        Animated.spring(scaleAnim, {
            toValue: targetScale,
            friction: scaleConfig.springFriction,
            tension: scaleConfig.springTension,
            useNativeDriver: true,
        }).start();

        // For debugging
        console.log("Audio Level:", normalizedLevel, "Target Scale:", targetScale);

    }, [normalizedLevel, scaleAnim, scaleConfig]);


    return (
        <Animated.View
            style={[
                styles.videoContainer,
                { transform: [{ scale: scaleAnim }] }
            ]}
        >
            <Blob audioLevel={audioLevel} />
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

export default AIView;