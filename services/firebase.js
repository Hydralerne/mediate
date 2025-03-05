import { firebase } from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { getData, saveData } from '../utils/storage/localStorage';
import { request } from '../utils/requests';
import { getSystemInfo, getToken } from '../utils/token';

const requestFCMToken = async () => {
    try {
        const authorizationStatus = await messaging().requestPermission();

        if (
            authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
        ) {
            console.log('Authorization status:', authorizationStatus);
            const token = await messaging().getToken();
            const oldToken = await getData('notiToken')
            if (token) {
                console.log('FCM Token:', token);
                if (token !== oldToken) {
                    await saveData('notiToken', token)
                    return token
                } else {
                    return false
                }
            } else {
                console.warn('Failed to get FCM token');
            }
        } else {
            console.warn('Notification permissions not granted');
        }
    } catch (error) {
        console.error('Error requesting FCM token:', error);
    }
};

const firebaseIosConfig = {
    apiKey: 'AIzaSyBrglIQSdnYO4QvULV7tEAjxLwGExbIbsw',
    authDomain: `${'onvo-33de2'}.firebaseapp.com`,
    projectId: 'onvo-33de2',
    storageBucket: 'onvo-33de2.appspot.com',
    messagingSenderId: '656382689992',
    appId: '1:656382689992:ios:f2d2fb6e59635029ab1bfd',
};

const firebaseAndroidConfig = {
    apiKey: 'AIzaSyAqC7Hy51jScikAcrKZldXiwqjx_q6V6yE',
    authDomain: `${'onvo-33de2'}.firebaseapp.com`,
    projectId: 'onvo-33de2',
    storageBucket: 'onvo-33de2.appspot.com',
    messagingSenderId: '656382689992',
    appId: '1:656382689992:android:d017868522456040ab1bfd',
};

try {
if (!firebase.apps.length || firebase.apps.length == 0) {
    firebase.initializeApp(Platform.OS == 'android' ? firebaseAndroidConfig : firebaseIosConfig);
} else {
    firebase.app();
}
}catch(e){
    console.log(e)
}

requestFCMToken().then(async token => {
    if (token) {
        try {
            const info = await getSystemInfo()
            const response = await request('https://api.onvo.me/v2/status/update', {
                token,
                info
            }, 'POST', {
                Authorization: `Bearer ${await getToken()}`
            })
        } catch (e) {
            console.log(e)
        }
    }
})

export default firebase