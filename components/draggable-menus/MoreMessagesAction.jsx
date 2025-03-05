import React, { memo, useContext } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../../utils/colors';
import useTranslation from '../../hooks/useTranslation';
import { handleDelete, handleArchive, handleBlock } from '../../utils/calls/messages'
import { triggerRefs } from '../../hooks/Flatlists';
import { UserContext } from '../../contexts/UserContext';
import TouchableButton from '../global/ButtonTap';
import createStyles from '../../utils/globalStyle';

const MoreMenuItems = ({ dir, message, id = message.id, navigation, triggerAnimation, refIndex }) => {
    const t = useTranslation()

    const { userData } = useContext(UserContext)

    const controller = {
        reply: () => reply(message),
        report: () => {
            navigation.navigate('Browser', { title: 'Report', url: `https://onvo.me/report?id=${message?.id}&token=${userData?.user?.settings?.token}` })
        },
        block: async () => {
            await handleBlock({ msgid: message.id, muted: message?.sender?.muted })
        },
        archive: async (id) => {
            await handleArchive(id, dir == 'archive')
            await triggerAnimation(0);
            triggerRefs[refIndex]?.deletePost(id);
        },
        openProfile: () => {
            navigation.push('ProfilePage', { id: message.reciver?.id })
        },
        delete: async (id) => {
            Alert.alert(
                t('messages.alerts.delete.title'),
                t('messages.alerts.delete.message'),
                [
                    {
                        text: t('messages.itemMenu.cancel'),
                        style: "cancel",
                    },
                    {
                        text: t('messages.alerts.deleteText'),
                        style: "destructive",
                        onPress: async () => {
                            await handleDelete('posts/inbox/delete', { id })
                            await triggerAnimation(0);
                            triggerRefs[refIndex]?.deletePost(id);
                        },
                    },
                ],
                { cancelable: true }
            );
        }
    };

    const handlePress = (type) => {
        global.DraggableMenuController.close()
        controller[type](id)
    }

    let items = [
        { icon: require('../../assets/icons/posts/folder file-130-1661323044.png'), title: t('messages.itemMenu.archive'), action: 'archive' },
        { icon: require('../../assets/icons/posts/error triangle-19-1662452248.png'), title: t('messages.itemMenu.report'), action: 'report' },
        { icon: require('../../assets/icons/posts/delete-25-1692683663.png'), title: t('messages.itemMenu.delete'), action: 'delete' },
        { icon: require('../../assets/icons/posts/forbidden sign-48-1658435663.png'), title: t('messages.itemMenu.block'), action: 'block' }
    ]

    switch (dir) {
        case 'archive':
            items[0] = { icon: require('../../assets/icons/posts/refresh left-50-1696832523.png'), title: t('messages.itemMenu.restore'), action: 'archive' }
            break
        case 'sent':
            items = [
                { icon: require('../../assets/icons/posts/delete-25-1692683663.png'), title: t('messages.itemMenu.hide'), action: 'delete' },
                { icon: require('../../assets/icons/posts/user-233-1658436042.png'), title: t('messages.itemMenu.viewProfile'), action: 'openProfile' },
            ]
            break;
        default:
            break
    }

    return (
        <View style={styles.shareContainer}>
            {items.map((item, index) => {
                return (
                    <TouchableButton
                        key={index}
                        onPress={() => handlePress(item.action)}
                    >
                        <View style={styles.button}>
                            <Image source={item.icon} style={[styles.icon, item.style]} />
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
    cancelBtn: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: colors.border,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 14,
        borderRadius: 50,
        marginTop: 20
    },
    textCancel: {
        color: colors.mainColor
    },
    icon: {
        tintColor: colors.mainColor,
        width: 26,
        height: 26,
        marginRight: 15,
        opacity: 0.5
    },
    button: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
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