import React, { useCallback } from 'react';
import { View, Text, Image } from 'react-native';
import colors from '../../utils/colors';
import createStyles from '../../utils/globalStyle';
import TouchableButton from '../global/ButtonTap';

const MoreButton = React.memo(({ openMoreMenu }) => (
    <TouchableButton onPress={openMoreMenu} style={styles.moreButton}>
        <Image
            source={require('../../assets/icons/posts/info menu-42-1661490994.png')}
            style={styles.moreIcon}
        />
    </TouchableButton>
));


const PostHeader = React.memo(({ data, isQoute, isPerview, refIndex, threadOwner, navigation }) => {
    const sender = data?.sender || data?.user || {};
    const receiver = data?.reciver || {};

    const imageUri = sender.image;
    const fullname = sender.fullname || 'Unknown';
    const username = sender.username || 'user';
    const isVerified = sender.is_verified;
    const isAnon = data?.is_anon;
    const timeAgo = data?.time_ago || '';
    const receiverId = receiver.id;
    const receiverUsername = receiver.username;
    const layout = data?.layout;

    const openProfile = useCallback(() => {
        if (!isAnon) {
            navigation.push('ProfilePage', { id: sender.id, data: sender });
        }
    }, [isAnon, sender, navigation]);

    const openMoreMenu = useCallback(async () => {
        global.DraggableMenuController.open();
        const MoreMenuItems = (await import('../draggable-menus/MorePostActions')).default;
        global.DraggableMenuController.setChildren(() => (
            <MoreMenuItems data={data} navigation={navigation} threadOwner={threadOwner} refIndex={refIndex} />
        ));
    }, [data, navigation, threadOwner, refIndex]);

    return (
        <>
            <TouchableButton disabled={data.is_anon} style={[styles.profileImageContainer]} onPress={openProfile}>
                <Image style={[styles.postHeaderImage, isQoute && styles.qouteImage]} source={{ uri: imageUri }} />
            </TouchableButton>
            {!isQoute && !isPerview && <MoreButton openMoreMenu={openMoreMenu} />}
            <View style={[styles.postHeaderSection, isQoute && styles.qouteHeader, isPerview && styles.perviewMain]}>
                <View style={[styles.usernameContainer, isPerview && styles.perviewHeader]}>
                    <View style={styles.fullnameContainer}>
                        <Text style={[styles.postHeaderText, styles.nameText, isPerview && styles.perviewName]}>
                            {fullname}
                        </Text>
                        {isVerified && (
                            <Image
                                style={styles.verifyIcon}
                                source={require('../../assets/icons/profile/check badge-2-1660219236.png')}
                            />
                        )}
                    </View>
                    <Text style={[styles.postHeaderText, styles.usernameText, isPerview && styles.perviewUsername]}>
                        {!isAnon && '@'}{username}
                    </Text>
                    {!isPerview && (
                        <>
                            <View style={styles.dotSeparator} />
                            <Text style={[styles.postHeaderText, styles.timeText]}>{timeAgo}</Text>
                        </>
                    )}
                </View>
                {
                    receiverId && layout === 'notification' && (
                        <View style={styles.replyingContainer}>
                            <Text style={styles.replyingText}>Replying to </Text>
                            <Text style={styles.handleText}>{receiverUsername ? '@' + receiverUsername : receiverId}</Text>
                        </View>
                    )
                }
            </View>
        </>
    );
});

// Styles
const styles = createStyles({
    profileImageContainer: {
        zIndex: 9,
        width: 44,
        height: 44,
        borderRadius: 50,
        position: 'absolute',
        marginLeft: 14
    },
    fullnameContainer: {
        flexDirection: 'row',
    },
    verifyIcon: {
        width: 18,
        height: 18,
        marginLeft: 2,
        marginRight: -2,
        marginTop: -2,
        tintColor: colors.verifyIcon,
        resizeMode: 'contain',
    },
    postHeaderImage: {
        resizeMode: 'cover',
        width: 44,
        height: 44,
        borderRadius: 50,
        backgroundColor: '#222',
    },
    qouteImage: {
        width: 20,
        height: 20,
        backgroundColor: colors.lightBorder,
        marginTop: 12,
    },
    moreButton: {
        position: 'absolute',
        right: 0,
        zIndex: 9,
        opacity: 0.5,
        width: 40,
        height: 25,
    },
    moreIcon: {
        width: 18,
        height: 18,
        resizeMode: 'contain',
        opacity: 0.75,
        right: 15,
        position: 'absolute',
        tintColor: colors.posts.icons,
    },
    postHeaderSection: {
        paddingTop: 2,
        zIndex: 0,
        minHeight: 47,
        marginLeft: 45,
    },
    qouteHeader: {
        marginLeft: 35,
        marginTop: 12,
        marginBottom: 0,
        minHeight: 25,
    },
    perviewMain: {
        minHeight: 75,
    },
    usernameContainer: {
        flexDirection: 'row',
        marginLeft: 10,
    },
    perviewHeader: {
        flexDirection: 'column',
    },
    postHeaderText: {
        color: colors.mainColor,
        fontSize: 15,
        lineHeight: 18,
        marginTop: -2,
        fontFamily: 'main'
    },
    nameText: {
        fontWeight: 'bold',
    },
    usernameText: {
        marginLeft: 5,
        color: colors.posts.handle,
    },
    perviewName: {
        fontSize: 16,
        marginBottom: 2,
    },
    perviewUsername: {
        marginLeft: 0,
        fontSize: 16,
        lineHeight: 22,
    },
    dotSeparator: {
        width: 2,
        height: 2,
        borderRadius: 50,
        backgroundColor: colors.posts.dot,
        marginTop: 6,
        marginRight: 4,
        marginLeft: 4,
    },
    timeText: {
        color: colors.posts.time,
        marginLeft: 0,
    },
    replyingContainer: {
        flexDirection: 'row',
        left: 0,
        marginLeft: 10,
        marginBottom: 28,
        marginTop: 2,
    },
    replyingText: {
        color: colors.posts.handle,
        fontSize: 15,
    },
    handleText: {
        color: colors.main,
        fontSize: 15,
        fontFamily: 'main'
    },
});

export default PostHeader;