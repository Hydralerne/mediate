
import React, { memo, useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import PagesHeader from '../../components/global/PagesHeader';
import { request } from '../../utils/requests';
import { getToken } from '../../utils/token';
import FullThread from '../../components/posts/FullThread';
import PostsDetailsFooter from '../../components/input-box/PostsDetailsFooter'
import { renderReplyRef } from '../../hooks/GlobalReply';
import createStyles from '../../utils/globalStyle';
import MoreMenuItems from '../../components/draggable-menus/MorePostActions';
import colors from '../../utils/colors';

const PostDetailScreen = ({ route, navigation }) => {
    const { id, data, repost, post: postID } = route.params
    const [post, setPost] = useState({ post: [data] })
    const [newReply, renderReply] = useState(null)
    const [isMounted, setIsMounted] = useState(false)

    renderReplyRef.current = renderReply

    useEffect(() => {
        const getPostDetails = async () => {
            const response = await request(`https://api.onvo.me/v2/posts/${id}`, {}, 'GET', {
                Authorization: `${await getToken()}`
            })

            if (!response || response?.error) {
                Alert.alert('Post not found', 'Looks like this post is not found')
                navigation.goBack()
                return
            }

            setPost(response)
        }
        getPostDetails()
        setTimeout(() => {
            setIsMounted(true)
        }, 50)
    }, [])

    if (!isMounted) {
        return (<></>)
    }

    const openMoreMenu = () => {
        global.DraggableMenuController.open();
        global.DraggableMenuController.setChildren(() => <MoreMenuItems data={post?.post || data} navigation={navigation} threadOwner={post?.thread_owner?.id} refIndex={'postsDetails'} />);
    }


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <PagesHeader navigation={navigation} title={'Thread'} contextMenu={openMoreMenu} />
            <ScrollView contentContainerStyle={styles.content}>
                <FullThread navigation={navigation} newReply={newReply} data={post} id={data?.id} />
            </ScrollView>
            <PostsDetailsFooter renderReply={renderReply} data={data} id={id} />
        </KeyboardAvoidingView>
    );
};

const styles = createStyles({
    container: {
        flex: 1,
        backgroundColor: colors.background
    },
    content: {
        paddingVertical: 100
    },

})

export default memo(PostDetailScreen);
