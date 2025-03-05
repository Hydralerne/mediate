import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Dimensions,
    StyleSheet,
    Platform
} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import createStyles from '../../utils/globalStyle';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const MemoizedTabContent = React.memo(({ tabs, height = SCREEN_HEIGHT }) => {
    return (
        <>
            {tabs.map((tab, index) => (
                <View style={{ width: SCREEN_WIDTH, height }} key={index}>
                    {tab.body}
                </View>
            ))}
        </>
    );
});

const TabView = ({ tabs, swipeX, height, style, onTabChange, initialTab = 0 }) => {
    const [activeTab, setActiveTab] = useState(initialTab);
    const gestureEndHandler = (event) => {
        const { velocityX } = event.nativeEvent
        const threshold = SCREEN_WIDTH / 3;
        const velocityThreshold = 500;

        const swipeOffset = swipeX.value - (activeTab * SCREEN_WIDTH);
        let newTab = activeTab;
        if (
            (Math.abs(swipeOffset) > threshold || Math.abs(velocityX) > velocityThreshold) &&
            ((swipeOffset > 0 && activeTab < tabs.length - 1) || (swipeOffset < 0 && activeTab > 0))
        ) {
            newTab = activeTab + (swipeOffset > 0 ? 1 : -1);
        }

        swipeX.value = withTiming(newTab * SCREEN_WIDTH, { duration: 200 });
        if (activeTab !== newTab) {
            setTimeout(() => {
                setActiveTab(newTab);
                if (onTabChange) {
                    onTabChange(newTab)
                }
            }, 200)
        }
    };
    const handleGestureEvent = (event) => {
        const { translationX } = event.nativeEvent;
        const newX = activeTab * SCREEN_WIDTH - translationX;
        swipeX.value = Math.min(
            Math.max(0, newX),
            SCREEN_WIDTH * (tabs.length - 1)
        );
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: -swipeX.value }],
    }));

    return (
        <PanGestureHandler
            onGestureEvent={handleGestureEvent}
            onEnded={gestureEndHandler}
            activeOffsetX={[Platform.OS == 'android' ? -15 : -10, activeTab == 0 ? Infinity : Platform.OS == 'android' ? 15 : 10]}
            failOffsetY={[-5, 5]}
        >
            <Animated.View style={[styles.listsContainer]}>
                <Animated.View style={[styles.innerListsContainer, style, { width: SCREEN_WIDTH * tabs.length }, animatedStyle]}>
                    <MemoizedTabContent height={height} tabs={tabs} />
                </Animated.View>
            </Animated.View>
        </PanGestureHandler>
    )
}

const styles = createStyles({
    innerListsContainer: {
        flexDirection: 'row',
    },
    listsContainer: {
        overflow: 'hidden'
    },
})

export default React.memo(TabView)