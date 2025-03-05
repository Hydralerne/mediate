import { useState, useRef } from 'react'
import { Platform, StyleSheet, View, KeyboardAvoidingView, Alert } from 'react-native'
import ModalBody from './ModalBody'
import { FooterButton } from '../login/LoginButtons'
import colors from '../../utils/colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import { request } from '../../utils/requests'
import { getToken } from '../../utils/token'
import NewPasswordBody from './NewPassword'
import * as Crypto from 'expo-crypto';
import useTranslation from '../../hooks/useTranslation'
import createStyles from '../../utils/globalStyle'

const Password = ({ route, navigation }) => {
    const t = useTranslation()
    const [loading, setLoading] = useState(false);
    const inputRef = useRef('')
    const verifyRef = useRef('')

    const handlePress = async () => {
        if (inputRef.current !== verifyRef.current) {
            Alert.alert(
                t('auth.alerts.passwordNotMatch.title'),
                t('auth.alerts.passwordNotMatch.message'),
            )
            return
        }
        if (inputRef.current.length == 0) {
            Alert.alert('Empty fields', 'Please enter your new password')
            return
        }

        setLoading(true);

        const md5Hash = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.MD5,
            inputRef.current
        );

        const response = await request('https://api.onvo.me/v2/settings/change_password', { password: md5Hash }, 'POST', {
            Authorization: `Bearer ${await getToken()}`
        });

        setLoading(false);
        if (response.error) {
            Alert.alert(response.type || 'Error occurred', response.message || 'Try again later');
            return;
        }

        if (response.status === 'success') {
            navigation.goBack();
            Alert.alert('Success', `Your password has been updated successfully`);
        }
    };

    return (
        <ModalBody navigation={navigation} title={'Change password'}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardView}
            >
                <View style={styles.container}>
                    <NewPasswordBody
                        inputRef={inputRef}
                        verifyRef={verifyRef}
                    />
                </View>
                <SafeAreaView style={[styles.footer, Platform.OS === 'ios' && { marginBottom: 55 }]}>
                    <FooterButton
                        title="Change"
                        onPress={handlePress}
                        loading={loading}
                        disabled={loading}
                    />
                </SafeAreaView>
            </KeyboardAvoidingView>
        </ModalBody>
    );
};


const styles = createStyles({
    correct: {
        tintColor: colors.true,
        width: 28,
        height: 28
    },
    message: {
        color: colors.warnText,
    },
    isExist: {
        alignItems: 'center',
        flexDirection: 'row',
        flex: 1
    },
    choseHandle: {
        color: colors.mainColor,
        fontWeight: 100,
        marginBottom: 20,
        lineHeight: 20
    },
    container: {
        paddingHorizontal: 20,
        paddingTop: 50
    },
    keyboardView: {
        flex: 1
    },
    footer: {
        paddingHorizontal: 16,
        height: 55,
        borderTopWidth: 0.5,
        borderTopColor: colors.border,
        flexDirection: 'row',
        backgroundColor: colors.background,
        marginTop: 'auto'
    },
})

export default Password