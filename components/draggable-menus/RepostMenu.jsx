import React, { memo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import colors from '../../utils/colors';
import { request } from '../../utils/requests';
import { getToken } from '../../utils/token';
import PostInteractions from './PostsInteraction'
import TouchableButton from '../global/ButtonTap';
import createStyles from '../../utils/globalStyle';

const RepostMenu = ({ postId, id, isReposted, setIsReposted, setRepostCount, repostCount }) => {
    const repost = async () => {
        global.DraggableMenuController.close()
        setRepostCount(isReposted ? (repostCount - 1) : (repostCount + 1))
        setIsReposted(!isReposted)
        const response = await request('https://api.onvo.me/v2/message', { id: postId, msg: id, repost: true, action: isReposted ? 'undo' : 'repost' }, 'POST', {
            Authorization: `Bearer ${await getToken()}`
        })
        console.log(response, id, isReposted)

    }

    const Interactions = async () => {
        global.DraggableMenuController.close()
        await new Promise(resolve => setTimeout(resolve, 200))
        global.DraggableMenuController.setChildren(() => <PostInteractions threadId={postId} id={id} />);
        await new Promise(resolve => setTimeout(resolve, 50))
        global.DraggableMenuController.open();
    };

    let items = [
        { icon: require('../../assets/icons/posts/swap square vertical-151-1696832205.png'), title: !isReposted ? 'Repost' : 'Undo respost', handlePress: repost },
        { icon: require('../../assets/icons/posts/pen-414-1658238246.png'), title: 'Qoute', handlePress: () => { } },
        { icon: require('../../assets/icons/posts/chart 4 line-5-1666004410.png'), title: 'View post interactions', handlePress: Interactions },
    ]

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
                <Text style={styles.textCancel}>Cancel</Text>
            </TouchableButton>
        </View>
    );
}
const styles = createStyles({
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
    icon: {
        tintColor: colors.mainSecound,
        width: 26,
        height: 26,
        marginRight: 15,
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


export default memo(RepostMenu) 