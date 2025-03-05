import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    Alert
} from 'react-native';

import colors from '../utils/colors';
import { handleSendMsg } from '../utils/calls/sendMessage'
import { UserContext } from '../contexts/UserContext';
import mediaController from '../hooks/InboxMediaController'
import Header from '../components/input-box/BoxHeader';
import BoxBody from '../components/input-box/BoxBody'
import BoxFooter from '../components/input-box/BoxFooter'
import useTranslation from '../hooks/useTranslation';

const InboxModal = ({ route, navigation }) => {
    const { data, isPost } = route.params
    const [replyText, setReplyText] = useState('');
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [media, setMedia] = useState(null)
    const [disabled, setDisabled] = useState(false)
    const [mounted, setMounted] = useState(false)
    const t = useTranslation()
    mediaController.set = setMedia
    const { userData } = useContext(UserContext);
    const [isAnon, setIsAnon] = useState(userData?.settings?.Anon || false)

    const username = data?.username

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => setKeyboardVisible(true)
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => setKeyboardVisible(false)
        );

        setTimeout(() => {
            setMounted(true)
        }, 50)

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    const handleClose = () => {
        navigation.goBack()
    };

    const handleSend = () => {
        if (isPost && !media?.type && !isAnon) {
            Alert.alert(
                t('profile.alert.recommend.title'),
                t('profile.alert.recommend.message')
            );
            return
        }
        handleSendMsg({ text: replyText, media, data, handleClose, setDisabled, isAnon, isPost })
    }

    if (!mounted) {
        return (<View style={styles.container}></View>)
    }

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardView}
            >
                <Header
                    isPost={isPost}
                    data={data}
                    disabled={(disabled || !replyText.trim() && !media?.data)}
                    onClose={() => handleClose()}
                    onSend={handleSend}
                />
                <BoxBody
                    isPost={isPost}
                    userData={userData}
                    media={media}
                    replyText={replyText}
                    setReplyText={setReplyText}
                    setMedia={setMedia}
                    isAnon={isAnon}
                    setIsAnon={setIsAnon}
                />
                <BoxFooter
                    username={username}
                    isPost={isPost}
                    navigation={navigation}
                    replyText={replyText}
                    setIsAnon={setIsAnon}
                    isAnon={isAnon}
                />
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        zIndex: 99,
        position: 'absolute',
        height: '100%',
        width: '100%'
    },
    keyboardView: {
        flex: 1,
    },
});


export default InboxModal;