

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import colors from '../../utils/colors';
import MediaRender from '../posts/MediaRender'
import PostQoute from '../posts/PostQoute';
import createStyles from '../../utils/globalStyle';
import TouchableButton from '../global/ButtonTap';

const isArabicText = (text) => /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(text);

const MessageContent = ({ data: message, type, perview, triggerAnimation, dir, navigation, refIndex }) => {
    const isReply = type === 'reply'

    const showMenu = async () => {
        global.DraggableMenuController.open()
        const MoreMenuItems = (await import('../draggable-menus/MoreMessagesAction')).default;
        global.DraggableMenuController.setChildren(() => <MoreMenuItems
            refIndex={refIndex}
            isMuted={message.sender?.muted}
            dir={dir}
            navigation={navigation}
            triggerAnimation={triggerAnimation}
            message={message}
        />);
    };

    const isArabic = useMemo(() => isArabicText(message.text || ""), [message.text]);

    const renderTextWithLinks = useMemo(() => {
        return (message.text || "").split(/(\s+)/).map((part, index) => {
            if (/https?:\/\/[^\s]+/.test(part)) {
                return (
                    <Text key={index} style={{ color: colors.main }} onPress={() => Linking.openURL(part)}>
                        {part}
                    </Text>
                );
            }
            if (part.startsWith('@')) {
                return (
                    <Text key={index} style={{ color: colors.main }} onPress={() => navigation.navigate('ProfilePage', { id: part.slice(1) })}>
                        {part}
                    </Text>
                );
            }
            return part;
        });
    }, [message.text]);
    const openProfile = () => {
        navigation.push('ProfilePage', { id: message.sender?.id, data: message.sender })
    }

    return (
        <View style={[styles.container]}>
            {isReply ? <View style={styles.threadLine}></View> : ''}
            <View style={styles.header}>
                <TouchableButton disabled={message.is_anon} onPress={openProfile} style={styles.userInfo}>
                    {perview && <Image source={{ uri: message.sender?.image || message.user?.image }} style={styles.userImage} />}
                    <View style={{ flexDirection: 'row'}}>
                        <Text style={styles.userName}>{message.sender?.fullname || message.user?.fullname}</Text>
                        <Text style={[styles.userHandle, !perview && { marginLeft: 8 }]}>{message.is_anon ? '' : '@'}{message.sender?.username || message.user?.username}</Text>
                    </View>
                </TouchableButton>
                <View style={styles.headerRight}>
                    <Text style={[styles.date, !isReply && { display: 'none' }]}>{message.date_short}</Text>
                    <TouchableButton style={[styles.postButtons]} onPress={showMenu}>
                        <Image source={require('../../assets/icons/posts/info menu-41-1661490994.png')}
                            style={[styles.postIconsHeader]} />
                    </TouchableButton>
                </View>
            </View>
            <Text style={[styles.messageText, !isReply && message.media_type && { marginBottom: 15 }, isReply && { paddingLeft: 52, marginTop: -10, marginBottom: message.media_type ? 15 : 100 }, (message.text?.length == 0 || !message.text) && { display: 'none' }, isArabic && { textAlign: 'right' }]}>
                {renderTextWithLinks}
            </Text>
            <View style={[styles.mediaContainer, { marginBottom: isReply ? 50 : 15 }, isReply && { marginLeft: 52 }]}>
                {message.media_type && (
                    <Suspense fallback={<ActivityIndicator color={colors.mainColor} size={'small'} />}>
                        <MediaRender type={message.media_type} content={message.media_content} />
                    </Suspense>
                )}
                {message.qoute && (
                    <Suspense fallback={<ActivityIndicator color={colors.mainColor} size={'small'} />}>
                        <PostQoute data={message.qoute} navigation={navigation} />
                    </Suspense>
                )}
            </View>
        </View>
    )
}
const styles = createStyles({

    threadLine: {
        width: 2,
        height: '100%',
        flex: 1,
        backgroundColor: colors.posts.threadLine,
        zIndex: -1,
        position: 'absolute',
        marginLeft: 18.5,
        paddingBottom: 30
    },
    postButtons: {
        flex: 1,
        height: 35,
        width: 50,
        justifyContent: 'left',
        alignItems: 'center',
        flexDirection: 'row',
        position: 'absolute',
        right: 0,
        marginRight: -15,
        top: 0,
        marginTop: -10
    },
    postIconsHeader: {
        width: 15,
        height: 15,
        tintColor: colors.mainSecound,
        opacity: 0.5,
        right: 0,
        position: 'absolute',
        marginRight: 15,
        zIndex: 9
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
        backgroundColor: 'rgba(255,255,255 / 0.1)'
    },
    userName: {
        color: colors.mainColor,
        fontSize: 15,
        fontWeight: 'bold',
        fontFamily: 'main'
    },
    userHandle: {
        color: colors.mainSecound,
        fontSize: 14,
    },
    date: {
        color: colors.mainColor,
        fontSize: 13,
        marginRight: 30,
        marginTop: 3,
        opacity: 0.35,
        fontFamily: 'main'
    },
    messageText: {
        color: colors.mainColor,
        fontSize: 15,
        marginBottom: 5,
        lineHeight: 20,
        fontFamily: 'main'
    }
});
export default React.memo(MessageContent)