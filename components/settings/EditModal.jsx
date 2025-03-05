import { useState, useCallback } from 'react'
import { Platform, StyleSheet, Text, Image, View, KeyboardAvoidingView, ActivityIndicator, Alert } from 'react-native'
import ModalBody from './ModalBody'
import { FooterButton, EditInput } from '../login/LoginButtons'
import colors from '../../utils/colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import { request } from '../../utils/requests'
import { getToken } from '../../utils/token'
import createStyles from '../../utils/globalStyle'

const EditModal = ({ route, navigation }) => {
    const { type, data } = route.params;
    const [disabled, setDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState('');

    const placeholder = 'Add new ' + type;
    let icon
    if (type == 'phone') {
        icon = require('../../assets/icons/settings/call phone-60-1662452713.png');
    }
    if (type == 'email') {
        icon = require('../../assets/icons/settings/gmail-22-1693375160.png');
    }

    const handleChange = (text) => {
        setValue(text);
        setDisabled(text?.length == 0)
    };

    const handlePress = async () => {
        setDisabled(true);
        setLoading(true);
        const response = await request('https://api.onvo.me/v2/settings/update_' + type, { [type]: value }, 'POST', {
            Authorization: `Bearer ${await getToken()}`
        });

        if (response.error) {
            Alert.alert(response.type || 'Error occurred', response.message || 'Try again later');
            setLoading(false);
            return;
        }

        if (response.status === 'success') {
            navigation.goBack();
            Alert.alert('Success', `Your ${type} has been updated successfully`);
        }
    };

    return (
        <ModalBody navigation={navigation} title={'Edit ' + type}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardView}
            >
                <View style={styles.container}>
                    <Text style={styles.choseHandle}>
                        Please enter your correct {type}
                    </Text>
                    <EditInput
                        allowLight={true}
                        value={value}
                        onChangeText={handleChange}
                        autoFocus={true}
                        placeholder={placeholder}
                        icon={icon}
                    />
                </View>
                <SafeAreaView style={[styles.footer, Platform.OS === 'ios' && { marginBottom: 55 }]}>
                    <FooterButton
                        style={disabled && { opacity: 0.5 }}
                        title="Change"
                        onPress={handlePress}
                        disabled={disabled}
                        loading={loading}
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

export default EditModal