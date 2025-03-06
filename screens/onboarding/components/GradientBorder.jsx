import { View, Animated, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useEffect } from 'react';

export const GradientBorder = ({ selected }) => {
    const rotation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (selected) {
            Animated.loop(
                Animated.timing(rotation, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true
                })
            ).start();
            return () => rotation.setValue(0);
        }
    }, [selected]);

    if (!selected) return null;

    const spin = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    return (
        <View style={styles.borderContainer}>
            <Animated.View
                style={[
                    styles.gradientWrapper,
                    { transform: [{ rotate: spin }] }
                ]}
            >
                <LinearGradient
                    colors={['#4B7BFF', '#FF4B81', '#4B7BFF', '#FF4B81']}
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
        borderRadius: 14,
        overflow: 'hidden',
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