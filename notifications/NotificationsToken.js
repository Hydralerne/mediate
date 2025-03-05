import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

export const registerForPushNotifications = async () => {
    if (Device.isDevice) {
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log('Device Token:', token);
        // Send this token to your backend or Firebase for targeting
    } else {
        alert('Must use a physical device for Push Notifications');
    }
};
