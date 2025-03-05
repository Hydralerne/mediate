import React, { useState } from 'react';
import { BlurView } from 'expo-blur';
import { submitLogin } from '../../utils/calls/auth'
import { View, StyleSheet, Text, TextInput, Image, ActivityIndicator, Platform, Keyboard } from 'react-native';
import createStyles from '../../utils/globalStyle';
import useTranslation from '../../hooks/useTranslation';
import TouchableButton from '../global/ButtonTap';
import colors from '../../utils/colors';

export const PlatformLogin = React.memo(({ platform, t, icon, onPress, text, callback }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handlePress = async () => {
        if (isLoading) return
        setIsLoading(true);
        await onPress(callback, t);
        setIsLoading(false);
    };

    return (
        <TouchableButton
            disabled={isLoading}
            onPress={handlePress}
            style={[styles.button, styles.spcialButton]}
        >
            {isLoading && (
                <View style={styles.loadingIndicator}>
                    <ActivityIndicator color="#000" />
                </View>
            )}
            <Image source={icon} style={styles.platformIcon} />
            <Text style={styles.texTButton}>{text}</Text>
        </TouchableButton>
    );
});

export const MainButton = React.memo(({ onPress, inputRef, callback }) => {
    const [loading, setLoading] = useState(false)
    const t = useTranslation()

    const continueLog = async () => {
        Keyboard.dismiss()
        if (loading) return
        setLoading(true)
        await onPress(inputRef.current, callback, t);
        setLoading(false)
    };

    return (
        <TouchableButton
            onPress={continueLog}
            style={[styles.button, styles.loginButtons]}
        >
            {loading && <View style={styles.loadingIndicator}><ActivityIndicator color="#000" /></View>}
            <Text style={styles.texTButton}> {t('login.buttons.continue')}</Text>
            {!loading && <Image source={require('../../assets/icons/login/flow right-143-1696832127.png')} style={styles.loginIcon} />}
        </TouchableButton>
    )
})


export const ResetCodeInput = React.memo(({ inputRef, placeholder, autoFocus = false, value }) => {
    return (
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.resetInput}
                placeholder={placeholder}
                onChangeText={(text) => inputRef.current = text}
                keyboardType="number-pad"
                placeholderTextColor={colors.placeholder}
                textContentType="oneTimeCode"
                autoFocus={autoFocus}
                maxLength={6}
                value={value}
            />
        </View>
    )
})



export const EditInput = React.memo(({ placeholder, onChangeText, value, icon, autoFocus = false }) => {
    return (
        <View style={styles.inputContainer}>
            <Image source={icon} style={[styles.formIcon, styles.formIconLight]} />
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.placeholder}
                style={[styles.textInput, styles.textInputLight]}
                autoFocus={autoFocus}
            />
        </View>
    )
})

export const LoginInput = React.memo(({ inputRef, allowLight, placeholder, onChangeText = (text) => (inputRef.current = text), icon, blur = true, secureTextEntry = false, autoFocus = false }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View style={[styles.inputContainer, allowLight && { backgroundColor: colors.inputBack }]}>
            {blur && <BlurView experimentalBlurMethod='dimezisBlurView' style={styles.blurContainer} tint={allowLight ? colors.blurTint : 'dark'} intensity={25} />}
            <Image source={icon} style={[styles.formIcon, allowLight && { tintColor: colors.mainColor }]} />
            <TextInput
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={[allowLight ? colors.placeholder : 'rgba(255,255,255 / 0.35)']}
                style={styles.textInput}
                secureTextEntry={secureTextEntry && !showPassword}
                autoFocus={autoFocus}
            />
            {secureTextEntry && (
                <TouchableButton onPress={() => setShowPassword(!showPassword)} style={[styles.hideButton]}>
                    {!showPassword ? <Image source={require('../../assets/icons/login/iconly-icon-export-1736392328.png')} style={[styles.loginIcon, styles.hideIcons, allowLight && { tintColor: colors.mainColor }]} /> : <Image source={require('../../assets/icons/login/hide 2-31-1691989638.png')} style={[styles.loginIcon, styles.hideIcons]} />}
                </TouchableButton>
            )}
        </View>
    )
})

export const FooterButton = ({ onPress, title, disabled, loading, style }) => {
    return (
        <TouchableButton disabled={disabled} onPress={onPress} style={[styles.loginButton, style]}>
            {loading ? <ActivityIndicator color={colors.mainColor} /> : <Text style={styles.textButtonFooter}>{title}</Text>}
        </TouchableButton>
    )
}

export const LoginButton = ({ callback, title, allowLight }) => {
    const [loading, setLoading] = useState(false)
    const logPressed = async () => {
        if (loading) return
        setLoading(true)
        await callback()
        setLoading(false)
    }
    return (
        <TouchableButton onPress={logPressed} style={styles.loginButton}>
            {loading ? <ActivityIndicator color={allowLight ? colors.background : '#000'} /> : <Text style={[styles.loginButtonMain, allowLight && { color: colors.background }]}>{title}</Text>}
        </TouchableButton>
    )
}


export const styles = createStyles({
    textButtonFooter: {
        color: colors.background,
        fontSize: 14
    },
    loginButtonMain: {
        fontSize: 14,
        fontFamily: 'main'
    },
    hideIcons: {
        tintColor: 'white'
    },
    resetInput: {
        textAlign: 'center',
        paddingLeft: 0,
        backgroundColor: 'transparent',
        borderWidth: 0.5,
        borderColor: colors.lightBorder,
        borderRadius: 50,
        fontSize: 20,
        letterSpacing: 10,
        color: colors.mainColor,
        width: '100%',
        height: 50,
    },
    hideButton: {
        height: 50,
        position: 'absolute',
        width: 45,
        alignItems: 'center',
        justifyContent: 'center',
        right: 0
    },
    loginButton: {
        backgroundColor: colors.mainColor,
        marginLeft: 'auto',
        height: 35,
        borderRadius: 50,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        // marginBottom
    },
    inputContainer: {
        height: 50,
        width: '100%',
        borderRadius: 20,
        marginBottom: 20,
        overflow: 'hidden',
        alignItems: 'center',
        flexDirection: 'row',
    },
    formIcon: {
        tintColor: colors.mainSecound,
        position: 'absolute',
        width: 24,
        height: 24,
        marginLeft: 15,
        // opacity: 0.5,
    },
    textInputLight: {
        color: colors.mainColor,
        backgroundColor: colors.lightBorder,
    },
    textInput: {
        color: '#fff',
        width: '100%',
        height: 50,
        paddingHorizontal: 15,
        textAlign: 'left',
        paddingLeft: 55,
        backgroundColor: 'rgba(255,255,255 / 0.1)',
        fontSize: 14,
        letterSpacing: 0,
        fontFamily: 'main'
    },
    blurContainer: {
        flex: 1,
        width: '100%',
        height: 50,
        position: 'absolute',
    },
    button: {
        height: 50,
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    spcialButton: {
        marginBottom: 20,
    },
    loginButtons: {
        flex: 1,
    },
    platformIcon: {
        position: 'absolute',
        left: 0,
        width: 24,
        height: 24,
        marginLeft: 15,
        resizeMode: 'contain',
    },
    texTButton: {
        color: '#000',
        fontSize: 14,
        fontFamily: 'main'
    },
    loadingIndicator: {
        position: 'absolute',
        right: 0,
        marginRight: 15,
    },
    loginIcon: {
        width: 24,
        height: 24,
        position: 'absolute',
        right: 0,
        marginRight: 15,
    },
});