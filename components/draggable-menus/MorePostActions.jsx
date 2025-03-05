import React, { memo, useContext } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { UserContext } from '../../contexts/UserContext';
import { triggerRefs } from '../../hooks/Flatlists';
import { handleBlock, handleDelete } from '../../utils/calls/messages';
import useTranslation from '../../hooks/useTranslation';
import colors from '../../utils/colors';
import TouchableButton from '../global/ButtonTap';
import createStyles from '../../utils/globalStyle';

const MoreMenuItems = ({ refIndex, data, navigation, threadOwner }) => {

    const t = useTranslation()

    const { userData } = useContext(UserContext)

    let items = [
        {
            icon: require('../../assets/icons/posts/reply share left-66-1696832204.png'), title: t('messages.itemMenu.replyPost'),
            handlePress: () => {
                global.DraggableMenuController.close()
                navigation.navigate('ReplyModal', { data })
            }
        },
        {
            icon: require('../../assets/icons/posts/error triangle-19-1662452248.png'), title: t('messages.itemMenu.reportPost'),
            handlePress: () => {
                global.DraggableMenuController.close()
                navigation.navigate('Browser', { title: 'Report', url: `https://onvo.me/report?id=${data.id}&token=${userData?.user?.settings?.token}` })
            }
        },
        {
            icon: require('../../assets/icons/posts/hide-33-1691989601.png'), title: t('messages.itemMenu.hide'),
            handlePress: () => {
                global.DraggableMenuController.close()
                triggerRefs[refIndex]?.deletePost(data.thread_id)
            }
        },
        {
            icon: require('../../assets/icons/posts/forbidden sign-48-1658435663.png'), title: data?.sender?.muted ? t('messages.itemMenu.unblock') : t('messages.itemMenu.block'),
            handlePress: async () => {
                global.DraggableMenuController.close()
                await handleBlock({ msgid: data.id, muted: data?.sender?.muted })
            }
        }
    ]

    const isReply = data?.parent_post_id && data?.sender?.id == userData.data?.id

    if (threadOwner == userData.data?.id || isReply) {
        if (data.type == 'reply' || isReply) {
            items[0] = {
                icon: require('../../assets/icons/posts/pen-414-1658238246.png'), title: t('messages.itemMenu.edit'),
                handlePress: () => {
                    return
                    global.DraggableMenuController.close()
                    navigation.navigate('ReplyModal', { data, edit: true })
                }
            }
        }
        items[1] = {
            icon: require('../../assets/icons/posts/delete-25-1692683663.png'), title: t('messages.itemMenu.deletePost'),
            handlePress: () => {
                global.DraggableMenuController.close()
                Alert.alert(
                    t('messages.alerts.delete.title'),
                    t('messages.alerts.delete.message'),
                    [
                        {
                            text: t('messages.alerts.cancel'),
                            style: "cancel",
                        },
                        {
                            text: t('messages.alerts.deleteText'),
                            style: "destructive",
                            onPress: async () => {
                                await handleDelete('posts/delete', { id: data.id })
                                triggerRefs[refIndex]?.deletePost(data.thread_id)
                            },
                        },
                    ],
                    { cancelable: true }
                );
            }
        }
        if (isReply) {
            items[userData.data?.id == data?.sender?.id ? 3 : 4] = {
                icon: require('../../assets/icons/posts/refresh left-50-1696832523.png'), title: t('messages.itemMenu.restore'),
                handlePress: () => {
                    global.DraggableMenuController.close()
                    Alert.alert(
                        t('messages.alerts.delete.title'),
                        t('messages.alerts.restore.message'),
                        [
                            {
                                text: t('messages.alerts.cancel'),
                                style: "cancel",
                            },
                            {
                                text: t('messages.alerts.restore'),
                                style: "destructive",
                                onPress: async () => {
                                    await handleDelete('posts/restore', { id: data.id })
                                    triggerRefs[refIndex]?.deletePost(data.thread_id)
                                },
                            },
                        ],
                        { cancelable: true }
                    );
                }
            }
        }
    }

    return (
        <View style={styles.shareContainer}>
            {items.map((item, index) => {
                return (
                    <TouchableButton
                        key={index}
                        onPress={item?.handlePress}
                    >
                        <View style={styles.button}>
                            <Image source={item.icon} style={[styles.icon]} />
                            <Text style={styles.buttonText}>{item.title}</Text>
                        </View>
                    </TouchableButton>
                );
            })}
            <TouchableButton onPress={global.DraggableMenuController.close} style={styles.cancelBtn}>
                <Text style={styles.textCancel}>{t('messages.itemMenu.cancel')}</Text>
            </TouchableButton>
        </View>
    );
}
const styles = createStyles({
    icon: {
        tintColor: colors.mainSecound,
        width: 26,
        height: 26,
        marginRight: 15,
    },
    cancelBtn: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: colors.lightBorder,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 14,
        borderRadius: 50,
        marginTop: 20
    },
    textCancel: {
        color: colors.mainColor
    },
    button: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        // backgroundColor: '#111',
        // paddingHorizontal: 15,
        // borderRadius: 10,
        marginBottom: 5
    },
    buttonText: {
        color: colors.mainColor,
        fontSize: 16,
        fontFamily: 'main'
    },
    shareContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginBottom: 50,
        zIndex: 99
    }
})


export default memo(MoreMenuItems) 