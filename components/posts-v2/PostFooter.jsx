import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Image, Text, Animated, StyleSheet, Easing } from 'react-native';
import colors from '../../utils/colors';
import * as Haptics from 'expo-haptics';
import { request } from '../../utils/requests';
import { getToken } from '../../utils/token';
import createStyles from '../../utils/globalStyle';
import TouchableButton from '../global/ButtonTap';

const SaveButton = React.memo(({ saved, perview, handleSavePress }) => {
    const bookmarkedIcon = require('../../assets/icons/posts/bookmark-7-1662808809.png');
    const defaultIcon = require('../../assets/icons/posts/bookmark-83-1658235288.png');
    const iconSource = saved ? bookmarkedIcon : defaultIcon;

    return (
        <TouchableButton style={[styles.postButtons, perview && styles.perviewButton]} onPress={handleSavePress}>
            <Image
                source={iconSource}
                style={[
                    styles.postIcons,
                    !perview && { right: 0, position: 'absolute' },
                    saved && { opacity: 1, tintColor: colors.main },
                    perview && styles.perviewIcon,
                    perview && { marginRight: 0, marginLeft: 'auto', right: 0, marginRight: -8 }
                ]}
            />
        </TouchableButton>
    );
});

const PostFooter = React.memo(({ data, reposts, index, post, isPerview, navigation, update, shareHood, trackAction = () => { } }) => {
    const [liked, setLiked] = useState(data.is_liked || false);
    const [saved, setSaved] = useState(data.is_saved || false);
    const [repliesCount, setRepliesCount] = useState(data.replies_count || false);
    const [isReposted, setIsReposted] = useState(reposts?.is_reposted);
    const [likesCount, setLikesCount] = useState(data.likes_count || 0);
    const [repostCount, setRepostCount] = useState(reposts?.total_reposts || 0);
    const scaleValue = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (!isPerview) return;

        setLiked(prev => prev !== data.is_liked ? data.is_liked : prev);
        setSaved(prev => prev !== data.is_saved ? data.is_saved : prev);
        setLikesCount(prev => prev !== data.likes_count ? data.likes_count : prev);
        setIsReposted(prev => prev !== reposts?.is_reposted ? reposts?.is_reposted : prev);
        setRepostCount(prev => prev !== reposts?.total_reposts ? reposts?.total_reposts : prev);
        setRepliesCount(prev => prev !== data.replies_count ? data.replies_count : prev);
    }, [data, reposts, isPerview]);

    useEffect(() => {
        if (update?.reply) {
            setRepliesCount(repliesCount + 1);
        }
    }, [update]);

    const handleLikePress = useCallback(() => {
        animateLike();
        setLiked(prevLiked => {
            const newLiked = !prevLiked;
            setLikesCount(prevCount => newLiked ? prevCount + 1 : prevCount - 1);
            sendLikeUpdate(newLiked);
            return newLiked;
        });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        trackAction('like', data.thread_id || data.post);
    }, [data.thread_id, data.post, trackAction]);

    const handleSavePress = useCallback(() => {
        toggleSaveState();
        sendSaveUpdate();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }, [saved]);

    const animateLike = useCallback(() => {
        Animated.sequence([
            Animated.timing(scaleValue, {
                toValue: 1.2,
                duration: 100,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(scaleValue, {
                toValue: 1,
                duration: 100,
                easing: Easing.in(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();
    }, [scaleValue]);

    const toggleSaveState = useCallback(() => {
        setSaved(prev => !prev);
    }, []);

    const sendLikeUpdate = useCallback(async () => {
        const response = await request(
            'https://api.onvo.me/v2/like',
            { id: data.id, method: liked ? 'delete' : undefined },
            'POST',
            { Authorization: `Bearer ${await getToken()}` }
        );
        if (response.status !== 'success') setLiked(false);
    }, [data.id, liked]);

    const sendSaveUpdate = useCallback(async () => {
        const response = await request(
            'https://api.onvo.me/v2/save',
            { id: data.id, method: saved ? 'delete' : undefined },
            'POST',
            { Authorization: `Bearer ${await getToken()}` }
        );
        if (response.status !== 'success') setSaved(false);
    }, [data.id, saved]);

    const sharePost = useCallback(async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        global.DraggableMenuController.open();
        const { ShareButton } = await import('../draggable-menus/Share');
        global.DraggableMenuController.setChildren(() => <ShareButton data={data} shareHood={shareHood} type={'post'} />);
    }, [data, shareHood]);

    const repostMenu = useCallback(async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        global.DraggableMenuController.open();
        const RepostMenu = (await import('../draggable-menus/RepostMenu')).default;
        global.DraggableMenuController.setChildren(() => (
            <RepostMenu
                postId={post}
                setRepostCount={setRepostCount}
                repostCount={repostCount}
                setIsReposted={setIsReposted}
                isReposted={isReposted}
                id={data.id}
            />
        ));
    }, [post, repostCount, isReposted, data.id]);

    const reply = useCallback(() => {
        navigation.push('ReplyModal', { data, type: 'post' });
    }, [navigation, data]);

    return (
        <View style={[styles.postFooter, isPerview && styles.perviewFooter]}>
            {isPerview && (
                <View style={styles.timePerview}>
                    <Text style={styles.perviewTime}>{data.date?.[0]}</Text>
                    <View style={styles.dotHeader} />
                    <Text style={styles.perviewTime}>{data.date?.[1]}</Text>
                </View>
            )}
            <View style={styles.innerPostFooter}>
                <View style={[styles.leftSection, isPerview && styles.sectionIcons]}>
                    <TouchableButton style={[styles.postButtons, isPerview && styles.perviewButton]} onPress={reply}>
                        <Image
                            source={require('../../assets/icons/posts/messages-176-1658433902.png')}
                            style={[styles.postIcons, isPerview && styles.perviewIcon, isPerview && { left: 0 }]}
                        />
                        <Text style={[styles.iconText, isPerview && { left: 0 }]}>{repliesCount}</Text>
                    </TouchableButton>
                    <TouchableButton style={[styles.postButtons, isPerview && styles.perviewButton]} onPress={handleLikePress}>
                        <Animated.Image
                            source={
                                liked
                                    ? require('../../assets/icons/posts/heart like 2-19-1662493136.png')
                                    : require('../../assets/icons/posts/heart like 2-176-1658434861.png')
                            }
                            style={[
                                styles.postIcons,
                                isPerview && styles.perviewIcon,
                                isPerview && { left: '15%' },
                                liked && { opacity: 1, tintColor: '#E0245E' },
                                { transform: [{ scale: scaleValue }] }
                            ]}
                        />
                        <Text style={[styles.iconText, isPerview && { left: '15%' }, liked && { opacity: 1, color: '#E0245E' }]}>
                            {likesCount > 0 ? likesCount : ''}
                        </Text>
                    </TouchableButton>
                    {(data.type === 'post' || isPerview) && (
                        <>
                            <TouchableButton style={[styles.postButtons, isPerview && styles.perviewButton]} onPress={repostMenu}>
                                <Image
                                    source={require('../../assets/icons/posts/swap square vertical-151-1696832205.png')}
                                    style={[
                                        styles.postIcons,
                                        { width: 19, height: 19 },
                                        isPerview && styles.perviewIcon,
                                        isPerview && { left: '35%' },
                                        isReposted && index === 0 && { opacity: 1, tintColor: '#febb68' }
                                    ]}
                                />
                                <Text style={[styles.iconText, isReposted && index === 0 && { opacity: 1, color: '#febb68' }, isPerview && { left: '35%' }]}>
                                    {index === 0 && (repostCount && repostCount > 0) ? repostCount : ''}
                                </Text>
                            </TouchableButton>
                            <TouchableButton onPress={sharePost} style={[styles.postButtons, isPerview && styles.perviewButton]}>
                                <Image
                                    source={require('../../assets/icons/posts/send message-92-16584339032.png')}
                                    style={[styles.postIcons, isPerview && styles.perviewIcon, isPerview && { right: '15%', marginRight: 0 }]}
                                />
                            </TouchableButton>
                        </>
                    )}
                    {isPerview && <SaveButton perview={true} saved={saved} handleSavePress={handleSavePress} />}
                </View>
                {!isPerview && (
                    <View style={styles.rightSection}>
                        <SaveButton saved={saved} handleSavePress={handleSavePress} />
                    </View>
                )}
            </View>
        </View>
    );
});

// Styles
const styles = createStyles({
    timePerview: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 5,
    },
    dotHeader: {
        width: 2,
        height: 2,
        borderRadius: 50,
        backgroundColor: colors.posts.dot,
        marginTop: 8,
        marginRight: 5,
        marginLeft: 5,
    },
    perviewTime: {
        color: colors.mainSecound,
        fontFamily: 'main'
    },
    sectionIcons: {
        justifyContent: 'space-between',
        flex: 1,
    },
    perviewButton: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    perviewIcon: {
        width: 22,
        height: 22,
        marginLeft: 'auto',
        left: 0,
        marginRight: 'auto',
        right: 0,
    },
    perviewFooter: {
        height: 'auto',
        flexDirection: 'column',
    },
    postFooter: {
        height: 20,
        marginTop: 10,
        flexDirection: 'row',
        zIndex: 9,
        paddingHorizontal: 15,
    },
    innerPostFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    leftSection: {
        flexDirection: 'row',
    },
    rightSection: {
        flexDirection: 'row',
    },
    postButtons: {
        height: 35,
        justifyContent: 'left',
        alignItems: 'center',
        flexDirection: 'row',
        paddingRight: 8,
    },
    postIcons: {
        width: 18,
        height: 18,
        position: 'relative',
        tintColor: colors.posts.icons,
        resizeMode: 'contain',
        marginLeft: -2,
    },
    iconText: {
        color: colors.posts.icons,
        fontSize: 12,
        textAlign: 'left',
        position: 'relative',
        marginLeft: 3,
        minWidth: 6,
        marginRight: 10,
        fontFamily: 'main'
    },
});

export default PostFooter;