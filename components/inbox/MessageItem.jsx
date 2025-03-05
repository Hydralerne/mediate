import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Animated, Alert } from 'react-native';
import MessageContent from './MessageContent'
import colors from '../../utils/colors';
import createStyles from '../../utils/globalStyle';
import TouchableButton from '../global/ButtonTap';

const MessageItem = ({ message, dir, replyText, navigation, refIndex }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const triggerAnimation = async (toValue) => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: toValue,
                duration: 500,
                useNativeDriver: true,
            })
        ]).start();
        await new Promise((resolve) => setTimeout(resolve, 500))
    }

    useEffect(() => {
        triggerAnimation(1)
    }, []);

    const handleReply = () => {
        navigation.navigate('ReplyModal', { data: message })
    };

    return (
        <Animated.View style={[styles.animatedContainer, { opacity: fadeAnim }]}>
            <Image source={{ uri: message.sender?.image || message.user?.image }} style={styles.userImage} />
            <View style={styles.container}>
                <MessageContent dir={dir} refIndex={refIndex} navigation={navigation} triggerAnimation={triggerAnimation} data={message} />
                {dir !== 'sent' &&
                    <View style={styles.actions}>
                        <TouchableButton style={styles.actionButton} onPress={handleReply}>
                            <Image source={require('../../assets/icons/posts/messages forward-48-1658433902.png')} style={styles.iconReply} />
                            <Text style={styles.actionText}>{replyText}</Text>
                        </TouchableButton>
                        <View style={styles.dateLong}>
                            <Text style={styles.dateLongText}>{message.time_ago}</Text>
                        </View>
                    </View>
                }
            </View>
        </Animated.View>
    );
};

const styles = createStyles({
    userImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
        backgroundColor: 'rgba(255,255,255 / 0.1)'
    },
    dateLongText: {
        color: colors.mainSecound,
        opacity: 0.5,
        fontSize: 14,
        fontWeight: 'light',
        fontFamily: 'main',
    },
    dateLong: {
        flexDirection: 'row',
        // position: 'absolute',
        right: 0,
        marginLeft: 'auto',
        alignItems: 'center'
    },
    dotHeader: {
        width: 2,
        height: 2,
        borderRadius: 50,
        backgroundColor: colors.mainColor,
        opacity: 0.25,
        marginRight: 4,
        marginLeft: 4,
    },
    iconReply: {
        tintColor: colors.mainColor,
        width: 24,
        height: 24,
        marginRight: 9,
        marginLeft: -3,
    },
    animatedContainer: {
        marginHorizontal: 15,
        marginVertical: 8,
        backgroundColor: colors.background,
        zIndex: 99,
        flexDirection: 'row',
    },
    container: {
        padding: 16,
        borderRadius: 20,
        // borderWidth: 0.5,
        borderColor: colors.lightBorder,
        marginBottom: 5,
        paddingBottom: 0,
        backgroundColor: colors.secoundBackground,
        zIndex: 99,
        flex: 1,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: -15,
        // borderTopWidth: 0.5,
        // borderTopColor: colors.lightBorder,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 999,
        paddingTop: 12,
        paddingRight: 20,
        paddingBottom: 16,
        // backgroundColor: '#555'
    },
    actionText: {
        color: colors.mainSecound,
        fontSize: 14,
        fontFamily: 'main'
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    menuButton: {
        padding: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    elevation: {
        elevation: 5,
        shadowColor: colors.background,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    menuItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    menuText: {
        color: colors.mainColor,
        fontSize: 14,
    },
    messageImage: {
        width: '100%',
        height: '100%',
    },
});

export default React.memo(MessageItem);