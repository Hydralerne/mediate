import React, { useCallback, useState, useMemo, lazy, Suspense } from 'react';
import { View, Text, StyleSheet, TouchableNativeFeedback, Linking, ActivityIndicator } from 'react-native';
import PostHeader from './PostHeader';
import PostFooter from './PostFooter';
import colors from '../../utils/colors';

const MediaRender = lazy(() => import('./MediaRender'));
const RepostUsers = lazy(() => import('./RepostsPerview'));
const PostQoute = lazy(() => import('./PostQoute'));

import createStyles from '../../utils/globalStyle';

const isArabicText = (text) => /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(text);

const PostItem = React.memo(({
    data = {},
    post,
    index,
    repost,
    style,
    shareHood,
    isPerview,
    update,
    trackAction,
    refIndex,
    threadOwner,
    navigation
}) => {
    const [isVisible, setIsVisible] = useState(false);

    const openPostDetails = useCallback(() => {
        navigation.push('PostDetails', { id: data?.id, data });
    }, [navigation, data?.id, data]);

    const isArabic = useMemo(() => isArabicText(data.text || ""), [data.text]);

    const renderTextWithLinks = useMemo(() => {
        return (data.text || "").split(/(\s+)/).map((part, index) => {
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
    }, [data.text, navigation]);

    const isNoti = data?.layout === 'notification';

    return (
        <View style={[styles.postContainer, style, isPerview && styles.perviewContainer, data?.isReply && styles.replyContainer]}>
            {!isPerview && (
                <>
                    <TouchableNativeFeedback
                        onPressIn={() => setIsVisible(true)}
                        onPressOut={() => setIsVisible(false)}
                        onPress={openPostDetails}
                    >
                        <View style={[styles.backPostDetails, { zIndex: 2 }]} />
                    </TouchableNativeFeedback>
                    <View
                        style={[
                            styles.backPostDetails,
                            (data?.isLast || isNoti) && { height: '150%' },
                            { zIndex: -1 },
                            isVisible && { backgroundColor: colors.posts.overlay },
                        ]}
                    />
                </>
            )}
            <View
                style={[
                    styles.innerPostContainer,
                    data?.isLast && styles.lastPost,
                    isNoti && { paddingBottom: 10 },
                    isPerview && { paddingBottom: 0 },
                ]}
            >
                <PostHeader
                    threadOwner={threadOwner}
                    refIndex={refIndex}
                    isPerview={isPerview}
                    navigation={navigation}
                    data={data}
                />
                <View style={[styles.postBodyContainer, isPerview && styles.perviewBody]}>
                    {data.text && (
                        <Text
                            numberOfLines={!isPerview ? 10 : null}
                            ellipsizeMode="tail"
                            style={[
                                styles.bodyText,
                                isPerview && styles.perviewText,
                                isArabic && { textAlign: 'right' },
                            ]}
                        >
                            {renderTextWithLinks}
                        </Text>
                    )}
                    {data.media_type && <Suspense fallback={<ActivityIndicator size="small" color={colors.main} />}>
                        <MediaRender type={data.media_type} content={data.media_content} />
                    </Suspense>}

                    {data.qoute && <Suspense fallback={<ActivityIndicator size="small" color={colors.main} />}>
                        <PostQoute data={data.qoute} navigation={navigation} />
                    </Suspense>}

                    <PostFooter
                        shareHood={shareHood}
                        isPerview={isPerview}
                        data={data}
                        reposts={repost}
                        index={index}
                        post={post}
                        navigation={navigation}
                        update={update}
                        trackAction={trackAction}
                    />
                </View>
                {repost && data.type === 'post' && <Suspense fallback={<ActivityIndicator size="small" color={colors.main} />}>
                    <RepostUsers navigation={navigation} data={repost} />
                </Suspense>}
                {!data.isLast && !isPerview && !isNoti && <View style={styles.leftThreadConnection} />}
            </View>
        </View>
    );
});

const styles = createStyles({
    postContainer: {
        flex: 1,
    },
    replyContainer: {
        borderBottomColor: colors.lightBorder,
        borderBottomWidth: 1,
        paddingVertical: 12,
        overflow: 'hidden'
    },
    perviewContainer: {
        borderBottomColor: colors.lightBorder,
        borderBottomWidth: 1,
    },
    innerPostContainer: {
        paddingHorizontal: 15,
        paddingBottom: 24,
    },
    lastPost: {
        paddingBottom: 0,
    },
    postBodyContainer: {
        flex: 1,
        marginLeft: 54.5,
        marginTop: -26,
    },
    perviewBody: {
        marginLeft: 0,
    },
    bodyText: {
        color: colors.mainColor,
        fontSize: 14.5,
        lineHeight: 20,
        paddingBottom: 5,
        fontFamily: 'main'
    },
    perviewText: {
        fontSize: 17,
        lineHeight: 23,
        marginTop: 15,
    },
    backPostDetails: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        right: 0,
        zIndex: 1,
        left: 0,
        marginTop: -12,
    },
    leftThreadConnection: {
        width: 2,
        height: '100%',
        backgroundColor: colors.posts.threadLine,
        position: 'absolute',
        left: 0,
        marginLeft: 35,
        zIndex: -1,
        marginTop: 25,
    },
});

export default PostItem;
