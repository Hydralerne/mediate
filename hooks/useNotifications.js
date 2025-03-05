import { useEffect } from 'react';
import { getMessaging } from '@react-native-firebase/messaging';

export const useNotifications = (isNavigationReady, handleNotificationNavigation) => {
    useEffect(() => {
        if (!isNavigationReady) return;

        let isInitialNotificationHandled = false;

        try {
            const messaging = getMessaging();

            const unsubscribeOnMessage = messaging.onMessage(async (remoteMessage) => {
                console.log('Notification received in foreground:', remoteMessage);
            });

            const unsubscribeOnNotificationOpenedApp = messaging.onNotificationOpenedApp((remoteMessage) => {
                console.log('Notification opened from background state:', remoteMessage);
                handleNotificationNavigation(remoteMessage);
            });

            messaging.getInitialNotification().then((remoteMessage) => {
                if (!isInitialNotificationHandled && remoteMessage) {
                    console.log('Notification opened from closed state:', remoteMessage);
                    handleNotificationNavigation(remoteMessage);
                    isInitialNotificationHandled = true;
                }
            });

            return () => {
                unsubscribeOnMessage();
                unsubscribeOnNotificationOpenedApp();
            };
        } catch (error) {
            console.warn('Firebase messaging not available:', error);
        }
    }, [isNavigationReady]);
};
