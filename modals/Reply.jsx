import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Modal,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    Image,
    SafeAreaView,
    StatusBar,
    ScrollView,
    Alert
} from 'react-native';

import { BlurView } from 'expo-blur';

import colors from '../utils/colors';
import { getToken } from '../utils/token';
import { request } from '../utils/requests';
import { UserContext } from '../contexts/UserContext';
import MessageContent from '../components/inbox/MessageContent';
import { triggerRefs } from '../hooks/Flatlists';
import { sendReply } from '../hooks/GlobalReply';
import { ShareButton } from '../components/draggable-menus/Share';
import InputFooter from '../components/input-box/InputFooter';
import TouchableButton from '../components/global/ButtonTap';
const isAndroid = Platform.OS === 'android'

const ReplyModal = ({ route, navigation }) => {

    const { data: message, type } = route.params
    const [replyText, setReplyText] = useState('');
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [disabled, setDisabled] = useState(false)
    const [isAnon, setIsAnon] = useState(false)
    const [mounted, setMounted] = useState(false)
    const { userData } = useContext(UserContext);

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

    const handleSendReply = async () => {
        if (!replyText || replyText.trim().length > 1000) {
            Alert.alert('Invalid Input', 'Please enter a valid reply (1-1000 characters).');
            return;
        }

        if (type == 'post') {
            sendReply({ id: message.id, post: message.thread_id || message.post, replyText, setReplyText, userData, setDisabled, handleClose })
            return
        }

        try {
            const token = await getToken();

            const response = await request('https://api.onvo.me/v2/message', {
                reply: true,
                text: replyText.trim(),
                id: message.id,
                dir: 'reply'
            }, 'POST', {
                Authorization: `Bearer ${token}`
            });

            if (triggerRefs.messagesRefs) {
                triggerRefs.messagesRefs.deletePost(message.id)
            } else if (triggerRefs.archiveRefs) {
                triggerRefs.archiveRefs.deletePost(message.id)
            }

            handleClose()
            global.DraggableMenuController.open();
            global.DraggableMenuController.setChildren(() => <ShareButton data={message} shareHood={() => { return { text: replyText, user: userData.data?.username } }} type={'post'} />);
        } catch (error) {
            console.error('Error sending reply:', error);
            alert('Error', 'Failed to send reply. Please try again.');
        }
    };

    if (!mounted) {
        return (<View style={styles.container}></View>)
    }
    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardView}
            >
                <View style={styles.modalHeader}>
                    {isAndroid ? '' : <BlurView
                        intensity={35}
                        tint={colors.blurTint}
                        style={styles.blurHeader}
                    >
                    </BlurView>}
                    <View style={styles.insetHeader}>
                        <TouchableButton onPress={handleClose} style={styles.closeButton}>
                            <Image style={styles.closeImage} source={require('../assets/icons/home/close remove-802-1662363936.png')} />
                        </TouchableButton>
                        <TouchableButton
                            style={[styles.replyButton, !replyText.trim() && styles.replyButtonDisabled]}
                            onPress={handleSendReply}
                            disabled={!replyText.trim()}
                        >
                            <Text style={[styles.replyButtonText, !replyText.trim() && styles.replyButtonTextDisabled]}>
                                Reply
                            </Text>
                        </TouchableButton>
                    </View>
                </View>

                <ScrollView style={styles.content}>
                    <View style={styles.messageThread}>
                        <MessageContent data={message} type={'reply'} />
                        <Text style={styles.replyingTo}>
                            Replying to <Text style={styles.replyingToHandle}>{message?.user?.username || 'onvo_user'}</Text>
                        </Text>
                        <View style={styles.replySection}>
                            <Image
                                source={{ uri: isAnon ? 'https://onvo.me/media/profile/user.jpg' : userData?.data?.image }}
                                style={styles.userImage}
                            />
                            <View style={styles.replyInputContainer}>
                                <TextInput
                                    style={styles.replyInput}
                                    placeholder="Type your reply"
                                    placeholderTextColor={colors.placeholder}
                                    value={replyText}
                                    onChangeText={setReplyText}
                                    multiline
                                    maxLength={1000}
                                    autoFocus
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <SafeAreaView>
                    <InputFooter
                        replyText={replyText}
                        isAnon={isAnon}
                        setIsAnon={setIsAnon}
                        hideAnon={type !== 'post'}
                    />
                </SafeAreaView>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    blurHeader: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        flex: 1,
    },
    IconsInbox: {
        flexDirection: 'row',
        position: 'absolute',
        marginLeft: 5,
        flex: 1,
        alignItems: 'center',
    },
    inboxButton: {
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5,
        marginLeft: 5
    },
    inboxIcon: {
        tintColor: colors.main,
        width: 25,
        height: 25,
        resizeMode: 'contain'
    },
    closeImage: {
        tintColor: colors.mainColor,
        width: 24,
        height: 24
    },
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    keyboardView: {
        flex: 1,
    },
    modalHeader: {
        borderBottomWidth: 0.5,
        borderBottomColor: colors.border,
        position: 'absolute',
        zIndex: 99,
        width: '100%',
        top: 0,
        height: 105,
        backgroundColor: isAndroid ? colors.background : `rgba(${colors.blackRGB}, ${colors.blackRGB}, ${colors.blackRGB} / 0.8)`
    },
    insetHeader: {
        flex: 1,
        paddingHorizontal: 15,
        alignItems: 'flex-end',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15
    },
    closeButton: {
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 30
    },
    replyButton: {
        backgroundColor: colors.main,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    replyButtonDisabled: {
        backgroundColor: colors.main,
        opacity: 0.5,
    },
    replyButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    replyButtonTextDisabled: {
        opacity: 0.5,
    },
    content: {
        flex: 1,
        padding: 16,
        paddingTop: 120
    },
    threadLine: {
        position: 'absolute',
        left: 35,
        top: 50,
        bottom: 0,
        width: 2,
        backgroundColor: colors.posts.threadLine,
    },
    messageThread: {
        flex: 1,
        paddingBottom: 200
    },
    originalMessage: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    userImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
        backgroundColor: colors.loader.image,
    },
    messageContent: {
        flex: 1,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    username: {
        color: colors.mainColor,
        fontWeight: 'bold',
        fontSize: 15,
    },
    originalMessageText: {
        color: colors.mainColor,
        fontSize: 15,
        lineHeight: 20,
        marginBottom: 12,
    },
    replyingTo: {
        color: '#666',
        fontSize: 12,
        marginBottom: 5,
        marginLeft: 52,
        marginTop: -20
    },
    replyingToHandle: {
        color: colors.main,
    },
    replySection: {
        flexDirection: 'row',
        flex: 1,
    },
    replyInputContainer: {
        flex: 1,
        marginTop: 10,
        marginLeft: 2
    },
    replyInput: {
        color: colors.mainColor,
        fontSize: 16,
        padding: 0,
        textAlignVertical: 'top',
    },
    footer: {
        paddingHorizontal: 16,
        height: 50,
        borderTopWidth: 0.5,
        borderTopColor: colors.border,
        justifyContent: 'center',
        backgroundColor: colors.background
    },
    characterCount: {
        alignSelf: 'flex-end',
    },
    characterCountText: {
        color: '#666',
        fontSize: 13,
    },
    characterCountWarning: {
        color: '#FFD700',
    },
    characterCountLimit: {
        color: '#FF4444',
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 16 / 9,
        marginBottom: 12,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#1a1a1a',
    },
    messageImage: {
        width: '100%',
        height: '100%',
    },
});

export default ReplyModal;