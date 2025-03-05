
import React, { useEffect, useRef } from 'react';
import { View, Dimensions, TouchableWithoutFeedback,StyleSheet } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
const { width, height } = Dimensions.get('window');
const MIN_SWIPE_Y = 20;
const MIN_SWIPE_X = 10;
import {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
    cancelAnimation,
    runOnJS,
} from 'react-native-reanimated';

export const StoriesGesture = ({ navigation }) => {
    const translateY = useSharedValue(0);
    const startY = useSharedValue(0);
    const isSwipingDown = useSharedValue(false);

    const swipeDownGesture = Gesture.Pan()
        .onBegin(() => {
            startY.value = translateY.value;
        })
        .onUpdate((event) => {
            const deltaY = event.translationY;
            if (deltaY > 0) {
                translateY.value = startY.value + deltaY;
                isSwipingDown.value = true;
            }
        })
        .onEnd((event) => {
            const deltaY = event.translationY;
            const vilocityY = event.velocityY;
            if (deltaY > 200 || (vilocityY > 1000 && deltaY > 50)) {
                translateY.value = withTiming(height, { duration: 200 }, () => {
                    runOnJS(navigation.goBack)();
                });
            } else {
                translateY.value = withTiming(0, { duration: 200 });
            }
            isSwipingDown.value = false;
        })
        .minDistance(MIN_SWIPE_Y)
        .failOffsetX(20)

    const horizontalSwipeGesture = Gesture.Pan()
        .onUpdate((event) => {
            if (!isSwipingDown.value && Math.abs(event.translationX) > MIN_SWIPE_X) {

            }
        });

    const combinedGesture = Gesture.Simultaneous(horizontalSwipeGesture, swipeDownGesture);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        };
    });

    return { combinedGesture, animatedStyle }
}

export const StoriesIndicator = ({ activeIndex, StroiesRef }) => {
    const progress = useSharedValue(0);

    const duration = 5000;
    const startTime = useRef(null);
    const elapsedTime = useRef(0);
    const isStarted = useRef(false);
    const isPaused = useRef(false);
    const pressStartTime = useRef(0);

    useEffect(() => {
        resetProgress();
    }, [activeIndex]);

    useEffect(() => {
        return () => {
            cancelAnimation(progress);
        };
    }, []);

    const goNext = () => {
        if (!StroiesRef.current) return;
        StroiesRef.current?.next();
    };

    const goPrev = () => {
        if (!StroiesRef.current) return;
        StroiesRef.current?.prev();
    };

    const resetProgress = () => {
        progress.value = 0;
        isStarted.current = false;
        isPaused.current = false;
        elapsedTime.current = 0;
        startTime.current = null;
    };

    const startProgress = () => {
        if (isStarted.current) return;

        progress.value = 0;
        isStarted.current = true;
        isPaused.current = false;
        startTime.current = Date.now() - elapsedTime.current;

        progress.value = withTiming(
            100,
            {
                duration: duration - elapsedTime.current,
                easing: Easing.linear,
            },
            (finished) => {
                if (finished) {
                    runOnJS(goNext)();
                }
            }
        );
    };

    const pauseProgress = () => {
        if (isPaused.current || !isStarted.current) return;

        isPaused.current = true;
        cancelAnimation(progress);
        elapsedTime.current = Date.now() - startTime.current;
    };

    const resumeProgress = () => {
        if (!isPaused.current || !isStarted.current) return;

        isPaused.current = false;
        startTime.current = Date.now() - elapsedTime.current;
        progress.value = withTiming(
            100,
            {
                duration: duration - elapsedTime.current,
                easing: Easing.linear,
            },
            (finished) => {
                if (finished) {
                    runOnJS(goNext)();
                }
            }
        );
    };

    const handlePressIn = () => {
        pressStartTime.current = Date.now();
        pauseProgress();
    };

    const handlePressOut = () => {
        resumeProgress();
    };

    const IndicatorStyle = useAnimatedStyle(() => ({
        width: `${progress.value}%`,
    }));

    const TouchHandlers = () => {
        return (<>
            <TouchableWithoutFeedback
                onPressOut={handlePressOut}
                onPressIn={handlePressIn}
                onPress={() => {
                    const pressDuration = Date.now() - pressStartTime.current;
                    if (pressDuration < 100) {
                        goNext()
                    }
                }}
                pointerEvents="box-none"
            >
                <View style={[styles.handler, styles.rightHandler]} />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
                onPressOut={handlePressOut}
                onPressIn={handlePressIn}
                onPress={() => {
                    const pressDuration = Date.now() - pressStartTime.current;
                    if (pressDuration < 100) {
                        goPrev()
                    }
                }}
                pointerEvents="box-none"
            >
                <View style={[styles.handler, styles.leftHandler]} />
            </TouchableWithoutFeedback>
        </>)
    }

    return {
        TouchHandlers,
        IndicatorStyle,
        pauseProgress,
        resumeProgress,
        startProgress
    };
};


export let StoriesHook = []

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    handler: {
        position: 'absolute',
        zIndex: 99,
        height: '100%',
        width: '50%',
    },
    rightHandler: {
        right: 0
    },
});
