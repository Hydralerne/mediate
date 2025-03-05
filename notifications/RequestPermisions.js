import * as Notifications from 'expo-notifications';

export const requestPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
        alert('Permission to receive notifications was denied!');
    }
};
