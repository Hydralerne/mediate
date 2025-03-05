
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

import { LoginInput } from '../login/LoginButtons'
import useTranslation from '../../hooks/useTranslation';
import createStyles from '../../utils/globalStyle';
import colors from '../../utils/colors';

const NewPasswordBody = ({ inputRef, verifyRef }) => {
    const t = useTranslation()
    return (
        <>
            <Text style={styles.welcomeStyle}>{t('auth.lables.enterNew')}</Text>
            <Text style={[styles.welcomeStyle, { fontSize: 14, marginTop: 5, opacity: 0.5, marginBottom: 35 }]}>{t('auth.lables.makeSure')}</Text>

            <View style={styles.inputContainer}>
                <LoginInput
                    allowLight={true}
                    inputRef={inputRef}
                    placeholder={t('auth.holders.newPassword')}
                    icon={require('../../assets/icons/login/password-82-1691989601.png')}
                    blur={false}
                    secureTextEntry={true}
                    autoFocus={true}
                />
            </View>
            <View style={styles.inputContainer}>
                <LoginInput
                    allowLight={true}
                    inputRef={verifyRef}
                    placeholder={t('auth.holders.confirmPassword')}
                    icon={require('../../assets/icons/login/password-82-1691989601.png')}
                    blur={false}
                    secureTextEntry={true}
                />
            </View>
        </>
    )
}
const styles = createStyles({
    welcomeStyle: {
        fontWeight: "100",
        fontSize: 20,
        color: colors.mainColor,
    },
    inputContainer: {
        marginBottom: 5,
    },
});


export default NewPasswordBody