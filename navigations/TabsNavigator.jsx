import React, { useState, useCallback } from 'react';
import { CustomTabBar } from '../components/global/menuBar';

import { View, Dimensions, Platform, StyleSheet } from 'react-native';
import { sharedMenuHandler, useMenuHandler } from '../hooks/useMenuHandler';
import Animated from 'react-native-reanimated';
import LeftMenu from '../components/home/leftMenu'
import { PanGestureHandler } from 'react-native-gesture-handler';
import TouchableButton from '../components/global/ButtonTap';
const isAndroid = Platform.OS == 'android'
const menuWidth = Dimensions.get('window').width * 0.8;
const { width } = Dimensions.get('window');

const Tabs = React.memo(() => {
    return (
        <CustomTabBar />
    )
})


const TabsNavigator = () => {
    const [gestureEnabled, setGestureEnabled] = useState(true);
    sharedMenuHandler.setEnabled = setGestureEnabled;
    const {
        gestureHandler,
        gestureEndHandler,
        animatedStyle,
        animatedBack,
        closeMenu,
        onHandlerStateChange,
        isMenuOpenShared
    } = useMenuHandler(width, menuWidth);


    const memoizedGestureHandler = useCallback(gestureHandler, [gestureHandler]);
    const memoizedGestureEndHandler = useCallback(gestureEndHandler, [gestureEndHandler]);
    const memoizedOnHandlerStateChange = useCallback(onHandlerStateChange, [onHandlerStateChange]);

    return (
        <PanGestureHandler
            enabled={gestureEnabled}
            onGestureEvent={memoizedGestureHandler}
            onHandlerStateChange={memoizedOnHandlerStateChange}
            onEnded={memoizedGestureEndHandler}
            activeOffsetX={[isAndroid ? -25 : -10, isAndroid ? 25 : 10]}
            failOffsetY={[-8, 8]}
        >
            <Animated.View style={[{ flex: 1 }, animatedStyle, { backgroundColor: '#000' }]}>
                <Tabs />
                {isMenuOpenShared && (
                    <TouchableButton onPress={closeMenu}>
                        <Animated.View
                            style={[styles.overlay, animatedBack]}
                        />
                    </TouchableButton>
                )}
                <LeftMenu closeMenu={closeMenu} width={menuWidth} />
            </Animated.View>
        </PanGestureHandler>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        display: 'none',
        backgroundColor: 'rgba(25, 25, 25, 0.75)',
    },
});


export default React.memo(TabsNavigator);