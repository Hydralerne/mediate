import React, { useState } from 'react';
import { View, Text, Image, TouchableWithoutFeedback } from 'react-native';
import colors from '../../utils/colors';
import { sendFollow } from '../../utils/calls/follow';
import createStyles from '../../utils/globalStyle';
import TouchableButton from '../global/ButtonTap';

const UserItem = ({ data: item, userid, navigation }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [isFollowed, setIsFollowed] = useState(item.is_following);

    const handleFollow = () => {
        sendFollow({ id: item.id, isDisabled, setIsDisabled, isFollowed, setIsFollowed })
    }

    const openProfile = () => {
        navigation.navigateInCurrentTab('ProfilePage', { id: item.id, data: item })
    };

    return (
        <View style={styles.itemContainer}>
            <Image
                source={{ uri: item.image }}
                style={styles.avatar}
            />
            <View style={styles.infoContainer}>
                <TouchableButton
                    disabled={isDisabled}
                    onPress={handleFollow}
                    activeOpacity={0.5}
                    style={[
                        styles.followButton,
                        isFollowed && styles.followingButton
                    ]}
                >
                    <Text style={[
                        styles.followButtonText,
                        isFollowed && styles.followingButtonText
                    ]}>
                        {isFollowed ? 'Following' : 'Follow'}
                    </Text>
                </TouchableButton>
                <View style={styles.nameContainer}>
                    <Text style={styles.name}>{item.fullname}</Text>
                    {item.is_verified && (
                        <Image
                            source={require('../../assets/icons/profile/check badge-2-1660219236.png')}
                            style={styles.verifiedBadge}
                        />
                    )}
                </View>
                <View style={styles.flexFollows}>
                    <Text style={styles.username}>@{item.username}</Text>
                    {item.is_follower &&
                        <>
                            <View style={styles.followerMark} />
                            <Image
                                source={require('../../assets/icons/profile/into user-145-1658436041.png')}
                                style={styles.followBackIcon}
                            />
                        </>
                    }
                </View>
                {item.bio && <Text style={styles.bio} numberOfLines={2}>{item.bio}</Text>}
            </View>

            <TouchableWithoutFeedback activeOpacity={0.9} onPressIn={() => setIsVisible(true)} onPressOut={() => setIsVisible(false)} onPress={openProfile}>
                <View style={[styles.overlay]} />
            </TouchableWithoutFeedback>
            <View style={[styles.overlay, { zIndex: -1 }, isVisible && { backgroundColor: colors.posts.overlay }]} />
        </View>
    );
}

const styles = createStyles({
    itemContainer: {
        width: 250,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.lightBorder,
        padding: 15,
        overflow: 'hidden',
        marginRight: 15,
    },
    followBackIcon: {
        tintColor: colors.mainSecound,
        width: 18,
        height: 18,
        marginTop: 2,
        marginLeft: 4
    },
    followerMark: {
        backgroundColor: colors.mainSecound,
        width: 2,
        height: 2,
        borderRadius: 10,
        marginTop: 10,
        marginLeft: 6,
        opacity: 0.5
    },
    followerText: {
        color: colors.mainSecound,
        fontSize: 12,
        lineHeight: 18
    },
    flexFollows: {
        flexDirection: 'row'
    },
    overlay: {
        position: 'absolute',
        width: '150%',
        height: '200%',
        zIndex: 1
    },
    avatar: {
        width: 45,
        height: 45,
        borderRadius: 24,
        backgroundColor: colors.lightBorder,
    },
    infoContainer: {
        flex: 1,
        marginTop: 15
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    name: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.mainColor,
        fontFamily: 'main'
    },
    verifiedBadge: {
        width: 18,
        height: 18,
        marginLeft: 2,
        tintColor: colors.mainColor,
        resizeMode: 'contain',
    },
    username: {
        fontSize: 14,
        color: colors.mainSecound,
        marginTop: 2,
    },
    bio: {
        fontSize: 14,
        color: colors.mainColor,
        marginTop: 4,
        lineHeight: 18,
    },
    followButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: colors.mainColor,
        justifyContent: 'center',
        minWidth: 50,
        alignItems: 'center',
        alignSelf: 'flex-start',
        zIndex: 99,
        position: 'absolute',
        right: 0,
        top: 0,
        marginTop: -50
    },
    followingButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.mainMedium,
    },
    followButtonText: {
        color: colors.background,
        fontSize: 12,
        fontWeight: '500',
        fontFamily: 'main'
    },
    followingButtonText: {
        color: colors.mainColor,
    },
});

export default React.memo(UserItem)