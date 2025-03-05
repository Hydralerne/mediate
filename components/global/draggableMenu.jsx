import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, View, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolate } from 'react-native-reanimated';
import createStyles from '../../utils/globalStyle';
import TouchableButton from './ButtonTap';
import colors from '../../utils/colors';
const { height } = Dimensions.get('window');

const DraggableMenu = ({ components, initialBack, overSwiper, initialStyle, hooks, scroller: initialScroller }) => {
    const initialTop = height + 50
    const translateY = useSharedValue(initialTop);
    const MIN_HEIGHT = 0;

    const isOpen = useRef(false);
    const [isVisible, setIsVisible] = useState(false);
    const [style, setStyle] = useState(initialStyle)
    const [back, setBack] = useState(initialBack)
    const [children, setChildren] = useState(components);
    const [scroller, setScroller] = useState(initialScroller);

    const setChilderns = (childs) => {
        if (Platform.OS === 'android') {
            setTimeout(() => setChildren(childs), 200)
        } else {
            setChildren(childs)
        }
    }

    useEffect(() => {
        if (!hooks) {
            global.DraggableMenuController = {
                open: openMenu,
                close: closeMenu,
                setChildren: setChilderns,
                updateStyle: setStyle,
                style: setStyle,
                back: setBack,
                scroller: setScroller,
            };
        } else {
            hooks.open = openMenu
            hooks.setStyle = setStyle
            hooks.setBack = setBack
            hooks.setChildren = setChilderns
            hooks.close = closeMenu
        }
    }, []);

    const openMenu = async () => {
        setIsVisible(true)
        translateY.value = withTiming(MIN_HEIGHT, { duration: 200 });
        isOpen.current = true;
    };

    const onClose = () => {
        setIsVisible(false)
        setStyle(null)
        setBack(null)
        setChildren(null)
    }

    const closeMenu = () => {
        translateY.value = withTiming(initialTop, { duration: 200 });
        isOpen.current = false;
        setTimeout(onClose, 200)
    };

    const gestureHandler = (event) => {
        if (overSwiper) {
            translateY.value = Math.max(
                MIN_HEIGHT,
                Math.min(height, event.nativeEvent.translationY + (isOpen.current ? MIN_HEIGHT : height))
            );
        } else {
            const translationY = event.nativeEvent.translationY;
            const adjustedTranslation = translationY > 0
                ? translationY
                : translationY / 2;

            translateY.value = Math.max(adjustedTranslation + (isOpen.current ? MIN_HEIGHT : height), -height + 600);
        }
    };


    const gestureEndHandler = () => {
        const THRESHOLD = height * 0.2;
        if (translateY.value > MIN_HEIGHT + THRESHOLD) {
            closeMenu();
        } else {
            openMenu();
        }
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const backgroundStyle = useAnimatedStyle(() => {
        const opacity = interpolate(translateY.value, [MIN_HEIGHT, height], [0.5, 0]);
        return { opacity };
    });

    const insets = useSafeAreaInsets();

    if (!isVisible) {
        return (<></>)
    }

    return (
        <View style={[styles.container, {
            height: Platform.OS == 'android' ? height + insets.top + 25 : height,
        }]}>
            <TouchableButton onPress={closeMenu}>
                <Animated.View style={[styles.background, back, backgroundStyle]} />
            </TouchableButton>
            <PanGestureHandler
                onGestureEvent={gestureHandler}
                onEnded={gestureEndHandler}
                activeOffsetY={[Platform.OS == 'android' && scroller ? -25 : 0, Platform.OS == 'android' && scroller ? 25 : 0]}
            >
                <Animated.View style={[styles.menuContainer, style, animatedStyle]}>
                    {!style && <View style={[styles.menuHandle]} />}
                    {children}
                    <View style={[styles.backMain, style]} />
                </Animated.View>
            </PanGestureHandler>
        </View>
    );
};


const styles = StyleSheet.create({
    container: { position: 'absolute', width: '100%', height: '100%', top: 0 },
    background: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: colors.draggOverlay,
    },
    menuContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 'auto',
        minHeight: 350,
        backgroundColor: colors.background,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    backMain: {
        position: 'absolute',
        width: '100%',
        height: 1000,
        marginTop: '80%',
        backgroundColor: colors.background
    },
    menuHandle: {
        width: 30,
        height: 4,
        backgroundColor: colors.mainColor,
        opacity: 0.2,
        borderRadius: 2.5,
        alignSelf: 'center',
        marginVertical: 15,
    },
});

export default DraggableMenu;
