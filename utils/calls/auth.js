import * as AppleAuthentication from 'expo-apple-authentication';
import { request } from '../requests';
import { getToken } from '../token';
import * as WebBrowser from 'expo-web-browser';
import { Alert } from 'react-native'
import * as Crypto from 'expo-crypto';
import { hook } from '../../hooks/useTranslation';

const t = (e) => {
    console.log(hook)
    console.log(e)
}

export const openTerms = async () => {
    try {
        WebBrowser.openBrowserAsync('https://onvo.me/privacy', 'onvo://redirect');
    } catch (e) {

    }
}

export const changePassword = async (password, confirm_password, callback, t) => {
    if (password !== confirm_password) {
        Alert.alert(
            t('auth.alerts.passwordNotMatch.title'),
            t('auth.alerts.passwordNotMatch.message'),
            [
                { text: "OK" }
            ],
        );
        return
    }
    const md5Hash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.MD5,
        password
    );
    const response = await request('https://api.onvo.me/v2/auth/reset/change', { password: md5Hash }, 'POST', {
        Authorization: `Bearer ${await getToken()}`
    })
    callback(response)
    if (response?.error || response?.alert) {
        Alert.alert(
            response.type || t('auth.alerts.error.title'),
            response.message || t('auth.alerts.error.message'),
            [
                { text: "OK" }
            ],
        )
        return
    }
}

export const submitReset = async (code, t) => {
    try {
        const response = await request('https://api.onvo.me/v2/auth/reset/submit', { code }, 'POST', {
            Authorization: `Bearer ${await getToken()}`
        })
        if (response?.error || response?.alert) {
            Alert.alert(
                response.type || t('auth.alerts.resetError.title'),
                response.message || t('auth.alerts.resetError.message'),
                [
                    { text: "OK" }
                ],
            )
            return
        }
        return response
    } catch (e) {
        console.log(e)
    }
}

export const requestReset = async (id, callback, t) => {
    try {
        const response = await request('https://api.onvo.me/v2/auth/reset/request', { id }, 'POST', {
            Authorization: `Bearer ${await getToken()}`
        })
        callback(response)
        if (response?.error || response?.alert) {
            Alert.alert(
                response.type || t('auth.alerts.resetError.title'),
                response.message || t('auth.alerts.resetError.message'),
                [
                    { text: "OK" }
                ],
            )
            return
        }
    } catch (e) {
        console.log(e)
    }
}

export const logCheck = async (input, callback, t) => {
    try {
        if (input.replace(/ /g, '') === '') {
            Alert.alert(
                t('auth.alerts.empty.title'),
                t('auth.alerts.empty.message'),
                [
                    { text: "OK" }
                ],
            );
            return;
        }
        const response = await request('https://api.onvo.me/v2/auth/check', { input }, 'POST', {
            Authorization: `Bearer ${await getToken()}`
        })
        if (response?.error || response?.alert) {
            Alert.alert(
                response.type || t('auth.alerts.error.title'),
                response.message || t('auth.alerts.error.message'),
                [
                    { text: "OK" }
                ],
            )
            return
        }

        callback(response)
    } catch (e) {
        console.log(e)
    }
}

export const submitLogin = async (id, password, t) => {
    try {
        if (password.replace(/ /g, '') === '') {
            Alert.alert(
                t('auth.alerts.empty.title'),
                t('auth.alerts.empty.message'),
                [
                    { text: "OK" }
                ],
            );
            return;
        }
        const md5Hash = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.MD5,
            password
        );
        const response = await request('https://api.onvo.me/v2/auth/login', { id, password: md5Hash }, 'POST', {
            Authorization: `Bearer ${await getToken()}`
        })
        if (response?.error) {
            Alert.alert(
                response.type || t('auth.alerts.error.title'),
                response.message || t('auth.alerts.error.message'),
                [
                    { text: "OK" }
                ],
            )
            return
        }
        return response
    } catch (e) {
        console.log(e)
    }
}

export const logout = async (callback, t) => {
    const response = await request('https://api.onvo.me/v2/auth/logout', {}, 'POST', {
        Authorization: `Bearer ${await getToken()}`
    })
    if (response?.error || response?.alert || (response.status == 'un_authorized' && !response.isLoged)) {
        Alert.alert(
            response.type || t('auth.alerts.error.title'),
            response.message || t('auth.alerts.error.message'),
            [
                { text: "OK" }
            ],
        )
        return
    }
}

export const googleLogin = async (login, t) => {

    try {
        const response = await request('https://api.onvo.me/v2/auth/google/request', {}, 'GET', {
            Authorization: `Bearer ${await getToken()}`
        })
        const result = await WebBrowser.openAuthSessionAsync(response.url, 'onvo://redirect');
        if (result.type == 'cancel') return
        const checkStatus = await request('https://api.onvo.me/v2/auth/status', {}, 'GET', {
            Authorization: `Bearer ${await getToken()}`
        })

        login(checkStatus)

        if (checkStatus?.error || checkStatus?.alert || checkStatus.status == 'un_authorized' && !checkStatus.isLoged) {
            Alert.alert(
                checkStatus.type || t('auth.alerts.error.title'),
                checkStatus.message || t('auth.alerts.error.message'),
                [
                    { text: "OK" }
                ],
            );
            return
        }
    } catch (error) {
        console.error(error);
    }

}

export const twitterLogin = async (login, t) => {

    try {
        const response = await request('https://api.onvo.me/v2/auth/twitter/request', {}, 'GET', {
            Authorization: `Bearer ${await getToken()}`
        })
        const result = await WebBrowser.openAuthSessionAsync(response.url, 'onvo://redirect');
        if (result.type == 'cancel') return
        const checkStatus = await request('https://api.onvo.me/v2/auth/status', {}, 'GET', {
            Authorization: `Bearer ${await getToken()}`
        })

        login(checkStatus)

        if (checkStatus?.status == 'un_authorized' && !checkStatus.isLoged) {
            Alert.alert(
                checkStatus.type || t('auth.alerts.error.title'),
                checkStatus.message || t('auth.alerts.error.message'),
                [
                    { text: "OK" }
                ],
            );
            return
        }
    } catch (error) {
        console.error(error);
    }

}


export const appleLogin = async (login, t) => {
    try {
        const credential = await AppleAuthentication.signInAsync({
            requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
            ],
        });

        const response = await request('https://api.onvo.me/v2/auth/apple/sign', { ...credential }, 'POST', {
            Authorization: `Bearer ${await getToken()}`
        })

        login(response)

        if (response?.alert || response?.error || (response.status == 'un_authorized' && !response.isLoged)) {
            Alert.alert(
                response.type || t('auth.alerts.error.title'),
                response.message || t('auth.alerts.error.message'),
                [
                    { text: "OK" }
                ],
            )
            return
        }

        // signed in
    } catch (e) {
        console.log(e)
        if (e.code === 'ERR_REQUEST_CANCELED') {
            // handle that the user canceled the sign-in flow
        } else {
            // handle other errors
        }
    }

}

