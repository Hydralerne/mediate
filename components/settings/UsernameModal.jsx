import { useState, useCallback } from 'react'
import { Platform, StyleSheet, Text, Image, View, KeyboardAvoidingView, ActivityIndicator, Alert } from 'react-native'
import ModalBody from './ModalBody'
import { FooterButton, EditInput } from '../login/LoginButtons'
import colors from '../../utils/colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import { request } from '../../utils/requests'
import { getToken } from '../../utils/token'
import { debounce } from 'lodash';
import useTranslation from '../../hooks/useTranslation'
import createStyles from '../../utils/globalStyle'

const UsernameModal = ({ route, navigation }) => {
    const { type, data } = route.params;
    const t = useTranslation()
    const [disabled, setDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState('');
    const [message, setMessage] = useState(null);

    const placeholder = t('settings.account.modals.username.placeholder')
    const icon = require('../../assets/icons/settings/user-223-1658436042.png');

    const checkUsername = useCallback(
        debounce(async (username) => {
            if (!username) {
                setLoading(false);
                return;
            }
            const response = await request('https://api.onvo.me/v2/settings/check_username', { username }, 'GET', {
                Authorization: `Bearer ${await getToken()}`
            });
            if (response.error) {
                setMessage(response.message);
            }
            if (response.available) {
                setDisabled(false);
            }
            setLoading(false);
        }, 500),
        []
    );

    const handleChange = (text) => {
        setValue(text);
        setLoading(true);
        setDisabled(true);
        setMessage(null);
        checkUsername(text);
    };

    const handlePress = async () => {
        setDisabled(true);
        setLoading(true);
        const response = await request('https://api.onvo.me/v2/settings/update_username', { username: value }, 'POST', {
            Authorization: `Bearer ${await getToken()}`
        });

        if (response.error) {
            Alert.alert(response.type || 'Error occurred', response.message || 'Try again later');
            setLoading(false);
            return;
        }

        if (response.status === 'success') {
            navigation.goBack();
            Alert.alert('Success', 'Your username has been changed successfully');
        }
    };

    return (
        <ModalBody navigation={navigation} title={t('settings.account.sections.username')}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardView}
            >
                <View style={styles.container}>
                    <Text style={styles.choseHandle}>
                        {t('settings.account.modals.username.title')}
                    </Text>
                    <EditInput
                        value={value}
                        onChangeText={handleChange}
                        autoFocus={true}
                        placeholder={placeholder}
                        icon={icon}
                    />
                    {message && !loading && <Text style={styles.message}>{message}</Text>}
                </View>
                <SafeAreaView style={[styles.footer, Platform.OS === 'ios' && { marginBottom: 55 }]}>
                    <View style={styles.isExist}>
                        {!disabled && <Image style={styles.correct} source={require('../../assets/icons/settings/check circle-3-1662452248.png')} />}
                        {loading && <ActivityIndicator size={'small'} color={colors.mainColor} />}
                    </View>
                    <FooterButton
                        style={disabled && { opacity: 0.5 }}
                        title={t('settings.account.modals.button')}
                        onPress={handlePress}
                        disabled={disabled}
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

export default UsernameModal