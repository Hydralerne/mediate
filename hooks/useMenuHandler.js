import { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

export const sharedMenuHandler = {
    openMenu: () => { },
    closeMenu: () => { },
    setEnabled: () => { }
}

export function useMenuHandler(SCREEN_WIDTH, MENU_WIDTH) {
    const translateX = useSharedValue(0);
    const isMenuOpenShared = useSharedValue(false);

    const gestureHandler = (event) => {
        const { translationX } = event.nativeEvent;
        translateX.value = Math.max(
            0,
            Math.min(
                MENU_WIDTH,
                isMenuOpenShared.value ? MENU_WIDTH + translationX : translationX
            )
        );
    };

    const openMenu = () => {
        translateX.value = withTiming(MENU_WIDTH, { duration: 200 });
        isMenuOpenShared.value = true;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    }

    sharedMenuHandler.openMenu = openMenu

    const closeMenu = (e) => {
        let duration = e?.duration || 200
        translateX.value = withTiming(0, { duration });
        if(isMenuOpenShared.value == true){
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
        }
        isMenuOpenShared.value = false;
    }

    sharedMenuHandler.closeMenu = closeMenu

    const gestureEndHandler = (event) => {
        const { velocityX } = event.nativeEvent;
        if (((translateX.value > MENU_WIDTH / 3) || velocityX > 500) && velocityX > -500) {
            openMenu()
        } else if (velocityX < -500) {
            closeMenu()
        } else {
            closeMenu()
        }
    };

    const onHandlerStateChange = (event) => {
        if (event.nativeEvent.oldState === 4) {
            translateX.value = translateX.value;
        }
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    const animatedBack = useAnimatedStyle(() => ({
        display: translateX.value > 20 ? 'flex' : 'none',
        opacity: translateX.value / MENU_WIDTH,
    }));



    return { gestureHandler, gestureEndHandler, openMenu, animatedStyle, animatedBack, onHandlerStateChange, isMenuOpenShared, closeMenu };
}
