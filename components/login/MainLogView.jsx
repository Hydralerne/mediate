import React, { useRef, useState, useContext } from 'react';
import { View, StyleSheet, Text, TextInput, Image, Alert, ActivityIndicator } from 'react-native';
import { appleLogin, googleLogin, twitterLogin, logCheck, openTerms } from '../../utils/calls/auth'
import { PlatformLogin, MainButton, LoginInput } from './LoginButtons'

import { UserContext } from '../../contexts/UserContext'
import createStyles from '../../utils/globalStyle';
import useTranslation from '../../hooks/useTranslation';

const MainLogView = ({navigation}) => {
    const { login } = useContext(UserContext);
    const inputRef = useRef('');
    const t = useTranslation()

    const callback = (data) => {
        if (data.isLoged) {
            login(data);
        }
    };
    const signUp = () => {
        Alert.alert(
            t('login.alerts.unavilable.title'),
            t('login.alerts.unavilable.message')
        );
    }

    const navigateToLog = (data) => {
        navigation.navigate('LoginModal', { data })
    };

    return (
        <View style={styles.innerMiddleContainer}>
            <View style={styles.middle}>
                <View style={styles.middleDescription}>
                    <Text style={styles.topText}>{t('login.titleHead')}</Text>
                    <Text style={[styles.mainText]}>{t('login.header')}</Text>
                </View>
                <View style={styles.inputsContainer}>
                    <LoginInput
                        inputRef={inputRef}
                        placeholder={t('login.holders.loginUser')}
                        icon={require('../../assets/icons/login/user-222-1658436042.png')}
                    />
                    <View style={styles.loginContainer}>
                        <MainButton
                            onPress={logCheck}
                            callback={navigateToLog}
                            inputRef={inputRef}
                        />
                    </View>
                </View>
            </View>
            <View style={styles.usernameContainer}>
                <View style={[styles.gradientLine, { right: 0, marginRight: -25 }]} />
                <Text style={styles.usernameText}>{t('login.bottomLable.or')}</Text>
                <View style={[styles.gradientLine, { left: 0, marginLeft: -25 }]} />
            </View>
            <View style={styles.socialLogin}>
                <PlatformLogin
                    platform="google"
                    icon={require('../../assets/icons/login/google.png')}
                    onPress={googleLogin}
                    text={t('login.buttons.withGoogle')}
                    callback={callback}
                    t={t}
                />
                <PlatformLogin
                    platform="apple"
                    icon={require('../../assets/icons/login/Apple_logo_black.svg.png')}
                    onPress={appleLogin}
                    text={t('login.buttons.withApple')}
                    callback={callback}
                    t={t}
                />
                <PlatformLogin
                    platform="twitter"
                    icon={require('../../assets/icons/social/x.com-179-1693375584.png')}
                    onPress={twitterLogin}
                    text={t('login.buttons.withX')}
                    callback={callback}
                    t={t}
                />
            </View>
            <View style={styles.bottomInfo}>
                <Text style={styles.textInfo}>
                    {t('login.bottomLable.dontHave')}
                    <Text onPress={signUp} style={{ color: '#fff', fontWeight: 'regular' }}> {t('login.bottomLable.signUp')} </Text>
                </Text>
                <Text style={styles.textInfo}>
                    {t('login.bottomLable.youAgree')}
                    <Text onPress={openTerms} style={{ color: '#fff', fontWeight: 'regular' }}> {t('login.bottomLable.terms')} </Text>
                    {t('login.bottomLable.bySign')}
                </Text>
            </View>
        </View>
    );
};

const styles = createStyles({
    topText: {
        color: '#fff',
        fontWeight: 200,
        marginBottom: 5,
        fontSize: 14,
        textAlign: 'center',
        fontFamily: 'main'
    },
    middleDescription: {
        marginTop: 'auto',
        width: '100%',
    },
    mainText: {
        color: '#fff',
        fontSize: 30,
        marginTop: 10,
        lineHeight: '35',
        textAlign: 'center',
        fontFamily: 'main'
    },
    innerMiddleContainer: {
        flex: 1,
        width: '100%',
        borderRadius: 10,
        overflow: 'hidden',
        paddingHorizontal: '6%',
        paddingBottom: 20,
    },
    bottomInfo: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 10
    },
    innerHeader: {
        width: '100%',
        marginBottom: 0,
        marginTop: 40,
    },
    loginText: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    },
    textInfo: {
        color: 'rgba(255,255,255 / 0.5)',
        fontSize: 14,
        fontWeight: '300',
        lineHeight: 20,
        fontFamily: 'main'
    },
    loginContainer: {
        flexDirection: 'row',
    },
    login: {
        borderWidth: 1.5,
        backgroundColor: 'transparent',
        borderColor: '#fff',
        marginRight: 15,
    },
    socialLogin: {
        width: '100%',
        marginTop: 25,
    },
    usernameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        overflow: 'hidden',
        marginTop: -5,
        marginBottom: -5,
    },
    gradientLine: {
        height: 1,
        width: '50%',
        backgroundColor: 'rgba(255,255,255 / 0.1)',
        position: 'absolute',
    },
    usernameText: {
        color: '#fff',
        fontSize: 14,
        opacity: 0.5,
        fontFamily: 'main'
    },
    header: {
        zIndex: 99,
        flexDirection: 'row',
        left: 0,
        position: 'absolute',
        top: 0,
        marginTop: 50,
        marginLeft: 10,
    },
    logoSmall: {
        position: 'absolute',
        top: 0,
        marginTop: -38,
        marginLeft: -30,
    },
    logo: {
        flex: 1,
        position: 'relative',
        marginLeft: 40,
        marginTop: 2,
    },
    inputsContainer: {
        width: '100%',
        marginTop: 25,
        marginBottom: 25,
    },
    middle: {
        paddingTop: 90,
        width: '100%',
        borderRadius: 25,
        zIndex: 9,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundImages: {
        flex: 1,
        width: '100%',
        height: '100%',
        position: 'absolute',
        resizeMode: 'cover',
    },
})


export default MainLogView