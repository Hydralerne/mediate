import React, { useEffect, useContext, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, Dimensions, Platform, StatusBar } from 'react-native';
import RootNavigator from '../navigations/RootNavigator';
import SignedOutNavigator from '../navigations/SignedOutNavigator';
import { loadFonts } from '../contexts/Fonts';
import { UserContext } from '../contexts/UserContext';
import * as SplashScreen from 'expo-splash-screen';
import { useDeepLinking } from '../hooks/useDeepLinking';
import { useNavigationContext } from '../contexts/NavigationContext';
import { useNavigation } from '@react-navigation/native';
// import { useNotifications } from '../hooks/useNotifications';

const { height } = Dimensions.get('window');

const Main = () => {
    const { isLogedIn, isReady } = useContext(UserContext);
    const [isNavigationReady, setIsNavigationReady] = useState(false);
    const { navigateInCurrentTab, navigateInTab } = useNavigationContext();
    const nav = useNavigation();

    useEffect(() => {
        const prepare = async () => {
            try {
                await SplashScreen.preventAutoHideAsync();
                await loadFonts();
            } catch (error) {
                console.error('Error preparing app:', error);
            } finally {
                setIsNavigationReady(true);
                SplashScreen.hideAsync();
            }
        };

        prepare();
    }, []);

    const handleNotificationNavigation = (remoteMessage) => {
        try {
            if (!remoteMessage?.data) return;

            const { navigation, route, tab, params } = remoteMessage.data;

            if (navigation === 'current') {
                navigateInCurrentTab(route, JSON.parse(params || '{}'));
            } else if (navigation === 'tab') {
                navigateInTab(tab, route, JSON.parse(params || '{}'));
            } else if (navigation === 'push') {
                nav.push(route, JSON.parse(params || '{}'));
            } else if (route) {
                nav.navigate(route, JSON.parse(params || '{}'));
            }
        } catch (e) {
            console.log(e);
        }
    };

    // useNotifications(isNavigationReady, handleNotificationNavigation);

    useDeepLinking();

    const insets = useSafeAreaInsets();

    if (!isReady || !isNavigationReady) {
        return null;
    }

    return (
        <GestureHandlerRootView
            style={{
                flex: 1,
                position: 'absolute',
                height: Platform.OS == 'android' ? height + insets.top : height,
                width: '100%',
            }}>
            <StatusBar style={'light'} translucent backgroundColor="transparent" />
            {
                isLogedIn ?
                    <RootNavigator />
                    :
                    <SignedOutNavigator />
            }

        </GestureHandlerRootView>
    );
};

export default Main;
