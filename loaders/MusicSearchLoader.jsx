import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export const MusicSearchLoader = () => {
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
                        <View style={[styles.loaderText, { marginTop: 10, width: '60%' }]}>
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


export const MusicHeaderLoader = () => {
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
        <View style={stylesHeader.loaderContainer}>
            {Array.from({ length: 10 }).map((_, index) => (
                <View key={index} style={stylesHeader.container}>
                    <View style={stylesHeader.artistTitle}>
                        <View style={stylesHeader.loaderText}>
                            <Animated.View
                                style={[
                                    stylesHeader.shimmer,
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
                        <View style={[stylesHeader.loaderText, { marginTop: 10, width: '60%' }]}>
                            <Animated.View
                                style={[
                                    stylesHeader.shimmer,
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
                    <View style={stylesHeader.poster}>
                        <Animated.View
                            style={[
                                stylesHeader.shimmer,
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
            ))}
        </View>
    );
};

const stylesHeader = StyleSheet.create({
    loaderContainer: {
        marginTop: 20,
        flexDirection: 'row',
        height: 225
    },
    poster: {
        width: 240,
        height: 180,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
    },
    artistTitle: {
        flex: 1,
        // marginLeft: 10,
        marginTop: -15
    },
    loaderText: {
        height: 12,
        width: 200,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 50,
        overflow: 'hidden',
    },
    container: {
        width: 240,
        marginBottom: 10,
        marginRight: 15,
    },
    shimmer: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.8,
        borderRadius: 10,
    },
});


const styles = StyleSheet.create({
    loaderContainer: {
        marginTop: 20
    },
    poster: {
        width: 50,
        height: 50,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
    },
    artistTitle: {
        marginLeft: 15,
        flex: 1,
    },
    loaderText: {
        height: 12,
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 50,
        overflow: 'hidden',
    },
    container: {
        width: '100%',
        marginBottom: 10,
        alignItems: 'center',
        flexDirection: 'row',
        paddingRight: 100,
        paddingVertical: 8,
    },
    shimmer: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.8,
        borderRadius: 10,
    },
});
