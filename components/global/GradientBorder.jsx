import { View, Animated, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useEffect } from 'react';

export const GradientBorder = ({ colors = ['#4B7BFF', '#FF4B81', '#4B7BFF', '#FF4B81'], style, radius = 18, borderWidth = 2.5, backgroundColor = 'rgba(0, 0, 0, 1)' }) => {
    const rotation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(rotation, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true
            })
        ).start();
        return () => rotation.setValue(0);
    }, []);

    const spin = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    return (
        <View style={[styles.borderContainer, { borderRadius: radius }, style]}>
            <View style={[styles.overlay, { padding: borderWidth }]}>
                <View style={[styles.overlayContent, { borderRadius: radius, backgroundColor }]} />
            </View>
            <Animated.View
                style={[
                    styles.gradientWrapper,
                    { transform: [{ rotate: spin }] }
                ]}
            >
                <LinearGradient
                    colors={colors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientBorder}
                />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    borderContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 20,
        overflow: 'hidden',
    },
    overlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        right: 0,
        zIndex: 10,
        padding: 2,
    },
    overlayContent: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 1)',
        borderRadius: 20,
    },
    gradientWrapper: {
        width: '500%',
        height: '500%',
        position: 'absolute',
        top: '-200%',
        left: '-200%',
    },
    gradientBorder: {
        width: '100%',
        height: '100%',
        borderRadius: 3000,
    },
}); 