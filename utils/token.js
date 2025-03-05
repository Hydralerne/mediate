import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import { request } from './requests';

const isWeb = Platform.OS === 'web';

export const getSystemInfo = async () => {
    return {
        deviceId: Device.deviceId,
        brand: Device.brand,
        model: Device.modelName,
        systemName: Device.osName,
        systemVersion: Device.osVersion,
        appVersion: Device.nativeAppVersion,
        buildNumber: Device.nativeBuildVersion,
        uniqueId: Device.serial,
        deviceName: Device.deviceName,
        isTablet: Device.isTablet,
        carrier: Device.carrier,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
};

export const requestToken = async () => {
    try {
        const info = await getSystemInfo();
        const data = await request('https://api.onvo.me/token', info, 'POST');
        if (data.token) {
            saveToken(data.token);
        }
        return data.token;
    } catch (e) {
        console.log(e);
    }
};

export const saveToken = async (token) => {
    try {
        if (isWeb) {
            // Save token in localStorage for web
            localStorage.setItem('userToken', token);
        } else {
            await SecureStore.setItemAsync('userToken', token);
        }
    } catch (error) {
        console.error('Error saving token:', error);
    }
};

export const getToken = async () => {
    try {
        let token;
        if (isWeb) {
            token = localStorage.getItem('userToken');
            if (token) {
                console.log('Token retrieved from localStorage:', token);
            } else {
                token = await requestToken();
                console.log('No token found in localStorage');
            }
        } else {
            token = await SecureStore.getItemAsync('userToken');
            if (!token) {
                token = await requestToken();
            }
        }
        return token;
    } catch (error) {
        console.error('Error retrieving token:', error);
    }
};

export const deleteToken = async () => {
    try {
        if (isWeb) {
            localStorage.removeItem('userToken');
            console.log('Token deleted from localStorage');
        } else {
            // Delete token from SecureStore for other platforms
            await SecureStore.deleteItemAsync('userToken');
            console.log('Token deleted securely');
        }
    } catch (error) {
        console.error('Error deleting token:', error);
    }
};
