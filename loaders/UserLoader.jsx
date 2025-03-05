import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const UserLoader = () => {
    const shimmerAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(shimmerAnimation, {
                toValue: 1,
                duration: 1800,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const translateX = shimmerAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [-Dimensions.get('window').width, Dimensions.get('window').width],
    });

    return (
        <View style={styles.loaderContainer}>
            {Array.from({ length: 10 }).map((_, index) => (
                <View key={index} style={styles.container}>
                    {/* Poster Placeholder */}
                    <View style={styles.poster}>
                        <Animated.View
                            style={[
                                styles.shimmer,
                                {
                                    transform: [{ translateX }],
                                },
                            ]}
                        >
                            <LinearGradient
                                colors={[
                                    'rgba(255, 255, 255, 0.0)',
                                    'rgba(255, 255, 255, 0.2)',
                                    'rgba(255, 255, 255, 0.0)',
                                ]}
                                start={{ x: 0, y: 1 }}
                                end={{ x: 1, y: 1 }}
                                style={StyleSheet.absoluteFill}
                            />
                        </Animated.View>
                    </View>

                    {/* Artist Title Placeholder */}
                    <View style={styles.artistTitle}>
                        {/* First shimmer bar */}
                        <View style={styles.loaderText}>
                            <Animated.View
                                style={[
                                    styles.shimmer,
                                    {
                                        transform: [{ translateX }],
                                    },
                                ]}
                            >
                                <LinearGradient
                                    colors={[
                                        'rgba(255, 255, 255, 0.0)',
                                        'rgba(255, 255, 255, 0.2)',
                                        'rgba(255, 255, 255, 0.0)',
                                    ]}
                                    start={{ x: 0, y: 1 }}
                                    end={{ x: 1, y: 1 }}
                                    style={StyleSheet.absoluteFill}
                                />
                            </Animated.View>
                        </View>

                        {/* Second shimmer bar */}
                        <View style={[styles.loaderText, { marginTop: 12, width: '80%' }]}>
                            <Animated.View
                                style={[
                                    styles.shimmer,
                                    {
                                        transform: [{ translateX }],
                                    },
                                ]}
                            >
                                <LinearGradient
                                    colors={[
                                        'rgba(255, 255, 255, 0.0)',
                                        'rgba(255, 255, 255, 0.2)',
                                        'rgba(255, 255, 255, 0.0)',
                                    ]}
                                    start={{ x: 0, y: 1 }}
                                    end={{ x: 1, y: 1 }}
                                    style={StyleSheet.absoluteFill}
                                />
                            </Animated.View>
                        </View>
                        <View style={[styles.loaderText, { marginTop: 12, width: '60%' }]}>
                            <Animated.View
                                style={[
                                    styles.shimmer,
                                    {
                                        transform: [{ translateX }],
                                    },
                                ]}
                            >
                                <LinearGradient
                                    colors={[
                                        'rgba(255, 255, 255, 0.0)',
                                        'rgba(255, 255, 255, 0.2)',
                                        'rgba(255, 255, 255, 0.0)',
                                    ]}
                                    start={{ x: 0, y: 1 }}
                                    end={{ x: 1, y: 1 }}
                                    style={StyleSheet.absoluteFill}
                                />
                            </Animated.View>
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    loaderContainer: {
        marginTop: 15,
    },
    poster: {
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
        marginLeft: 15
    },
    artistTitle: {
        marginLeft: 15,
        flex: 1,
    },
    loaderText: {
        height: 12,
        width: '70%',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 50,
        overflow: 'hidden',
    },
    container: {
        width: '100%',
        marginBottom: 15,
        alignItems: 'center',
        flexDirection: 'row',
        paddingRight: 15,
        paddingVertical: 8,
    },
    shimmer: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.8,
        borderRadius: 10,
    },
});


export default UserLoader