import React, { useState, useContext, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Image,
    SafeAreaView,
    ActivityIndicator,
    TextInput,
    Keyboard,
    Alert
} from 'react-native';

import colors from '../utils/colors';
import PagesHeader from '../components/global/PagesHeader';
import { LoginInput, LoginButton, ResetButton, ResetCodeInput } from '../components/login/LoginButtons'

import { UserContext } from '../contexts/UserContext'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { requestReset, submitReset, submitLogin, changePassword } from '../utils/calls/auth'
import useTranslation from '../hooks/useTranslation';
import TouchableButton from '../components/global/ButtonTap';
import createStyles from '../utils/globalStyle';
import NewPasswordBody from '../components/settings/NewPassword';

const LoginBody = ({ inputRef, data }) => {
    const t = useTranslation()
    return (
        <>
            <Text style={styles.welcomeStyle}>{t('auth.lables.welcome')}</Text>
            <Text style={[styles.welcomeStyle, { fontSize: 14, marginTop: 5, opacity: 0.5 }]}>{t('auth.lables.pleseEnter')}</Text>
            <View style={styles.userStyle}>
                <Image style={styles.userImage} source={{ uri: data.image }} />
                <View style={styles.gridStyle}>
                    <Text style={[styles.userInfo, { fontWeight: 'bold', marginBottom: 5 }]}>{data.fullname}</Text>
                    <Text style={[styles.userInfo, { opacity: 0.5, fontSize: 14 }]}>{data.username || data.email || data.phone}</Text>
                </View>
            </View>
            <View style={styles.inputContainer}>
                <LoginInput
                    allowLight={true}
                    inputRef={inputRef}
                    placeholder={t('auth.holders.password')}
                    icon={require('../assets/icons/login/password-82-1691989601.png')}
                    blur={false}
                    secureTextEntry={true}
                    autoFocus={true}
                />
            </View>
        </>
    )
}


const EnterCodeBody = ({ inputRef, value }) => {
    const t = useTranslation()
    return (
        <>
            <Text style={styles.welcomeStyle}>{t('auth.lables.insertCode')}</Text>
            <Text style={[styles.welcomeStyle, { fontSize: 14, marginTop: 5, opacity: 0.5, marginBottom: 35 }]}>{t('auth.lables.insertCodeDesc')}</Text>
            <View style={styles.inputContainer}>
                <ResetCodeInput
                    allowLight={true}
                    inputRef={inputRef}
                    placeholder="######"
                    autoFocus={true}
                    value={value}
                />
            </View>
        </>
    )
}

const LoginModal = ({ route, navigation }) => {
    const { data } = route.params
    const inputRef = useRef('')
    const passRef = useRef('')
    const tempNavigation = useRef(null)
    const { login } = useContext(UserContext);
    const [screen, setScreen] = useState(0)
    const [loading, setLoading] = useState(false)

    const t = useTranslation()

    const insets = useSafeAreaInsets()

    const resetCallback = (data) => {
        if (data.status == 'success' || (data.error == 'wait_for_code' && screen !== 1)) {
            setScreen(1)
            tempNavigation.current = navigation.goBack
            navigation.goBack = () => {
                setScreen(0)
                navigation.goBack = tempNavigation.current
                tempNavigation.current = null
            }
        }
    }

    const resetAction = async () => {
        if (screen == 2) return
        setLoading(true)
        await requestReset(data.id, resetCallback, t)
        setLoading(false)
    }

    const useLogData = (data = {}) => {
        if (data?.isLoged) {
            login(data);
        }
        if (data?.error) {
            navigation.goBack()
            Alert.alert(data.type || t('auth.alerts.error.title'), data.message || t('auth.alerts.error.message'))
        }
    }

    const callback = async () => {
        try {
            switch (screen) {
                case 0:
                    const request = await submitLogin(data.id, inputRef.current, t)
                    useLogData(request)
                    break;
                case 1:
                    const response = await submitReset(inputRef.current, t)
                    if (response?.status == 'success') {
                        setScreen(2)
                    }
                    break;
                case 2:
                    await changePassword(inputRef.current, passRef.current, useLogData, t)
                    break
                default:
                    break
            }
        } catch (e) {
            console.log(e)
        }
    };

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardView}
            >
                <PagesHeader
                    style={[styles.header, Platform.OS == 'android' && { marginTop: insets.top }]}
                    innerStyle={styles.innerHeader}
                    navigation={navigation}
                    contextMenu={false}
                    title={t('auth.lables.login')}
                />
                {loading && <View style={styles.loading}>
                    {Platform.OS !== 'android' && <BlurView style={styles.blurLoading} intensity={35} />}
                    <ActivityIndicator size={'large'} color={colors.mainColor} />
                </View>}
                <View style={[styles.body, Platform.OS == 'android' && { marginTop: insets.top + 90 }]}>
                    {screen == 0 && <LoginBody inputRef={inputRef} data={data} />}
                    {screen == 1 && <EnterCodeBody inputRef={inputRef} data={data} />}
                    {screen == 2 && <NewPasswordBody inputRef={inputRef} verifyRef={passRef} />}
                </View>
                <SafeAreaView>
                    <View style={[styles.footer, Platform.OS == 'ios' && { marginBottom: 55 }]}>
                        <TouchableButton onPress={resetAction} style={styles.forgotPassword}>
                            {screen == 0 && <Text style={styles.forgotPasswordText}>{t('auth.lables.forgotPassword')}</Text>}
                            {screen == 1 && <Text style={styles.forgotPasswordText}>{t('auth.lables.resendCode')}</Text>}
                            {screen == 2 && <Text style={styles.forgotPasswordText}></Text>}
                        </TouchableButton>
                        <LoginButton
                            allowLight={true}
                            callback={callback}
                            title={screen == 0 ? t('auth.lables.login') : (screen == 1 ? t('auth.lables.reset') : t('auth.lables.change'))}
                        />
                    </View>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = createStyles({
    blurLoading: { width: '100%', flex: 1, position: 'absolute', height: '100%' },
    loading: {
        position: 'absolute',
        flex: 1,
        width: '100%',
        height: '100%',
        zIndex: 99,
        backgroundColor: `rgba(${colors.blackRGB},${colors.blackRGB},${colors.blackRGB} / 0.5)`,
        alignItems: 'center',
        justifyContent: 'center'
    },
    welcomeStyle: {
        fontWeight: 100,
        fontSize: 20,
        color: colors.mainColor,
    },
    forgotPassword: {
        flexDirection: 'row',
        alignItems: 'center',
        height: '100%',
        width: 'auto',
        marginTop: -2
    },
    forgotPasswordText: {
        color: colors.mainColor,
        fontSize: 16,
    },
    userImage: {
        width: 60,
        height: 60,
        borderRadius: 50,
        backgroundColor: colors.lightBorder
    },
    gridStyle: {
        marginLeft: 12
    },
    userInfo: {
        color: colors.mainColor,
        fontSize: 16
    },
    userStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 30
    },
    body: {
        marginTop: 90,
        flex: 1,
        paddingHorizontal: 20
    },
    header: { minHeight: 50 },
    innerHeader: { marginTop: 0, paddingBottom: 40 },
    footer: {
        paddingHorizontal: 16,
        height: 55,
        borderTopWidth: 0.5,
        borderTopColor: colors.border,
        flexDirection: 'row',
        backgroundColor: colors.background,
    },
    keyboardView: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
})

export default LoginModal;