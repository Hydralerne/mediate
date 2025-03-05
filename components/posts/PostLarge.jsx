import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableNativeFeedback } from 'react-native';
import MediaRender from './MediaRender'

import { useNavigation } from '@react-navigation/native';
import PostHeader from './PostHeader'
import PostFooter from './PostFooter'
import colors from '../../utils/colors';
import RepostUsers from './RepostsPerview'
import PostQoute from './PostQoute'
import createStyles from '../../utils/globalStyle';

const isArabicText = (text) => {
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
    return arabicRegex.test(text);
}

const PostLarge = ({ data}) => {

    const [isVisible, setIsVisible] = useState(false)

    const navigation = useNavigation();

    const openPostDetails = () => {
        navigation.navigate('PostDetails', { id: data?.id, data, post, repost });
    }

    const isNoti = data?.layout == 'notification'

    return (
        <View style={[styles.postContainer, style]}>
            <TouchableNativeFeedback onPressIn={() => setIsVisible(true)} onPressOut={() => setIsVisible(false)} onPress={openPostDetails}>
                <View style={[styles.backPostDetails, { zIndex: 2 }]} />
            </TouchableNativeFeedback>
            <View style={[styles.backPostDetails, (data.isLast || isNoti) && { height: '150%' }, { zIndex: -1 }, isVisible && { backgroundColor: colors.posts.overlay }]} />
            <View style={[styles.innerPostContainer, data.isLast && styles.lastPost, isNoti && { paddingBottom: 10 }]}>
                <PostHeader data={data} />
                <View style={styles.postBodyContainer}>
                    <Text style={[styles.bodyText, isArabicText(data.text) && { textAlign: 'right' }, (data.text == '' || !data.text) && { display: 'none' }]}>{data.text}</Text>
                    {data.media_type && <MediaRender type={data.media_type} content={data.media_content} />}
                    {data.qoute && <PostQoute data={data.qoute} navigation={navigation} />}
                    <PostFooter data={data} respost={repost} index={index} post={post} navigation={navigation} />
                </View>
                {repost && data.type == 'post' && <RepostUsers navigation={navigation} data={repost} />}
                {!data.isLast && !isNoti && <View style={[styles.leftThreadConnection]}></View>}
            </View>
        </View>
    )
}


const styles = createStyles({
    innerPostContainer: {
        paddingHorizontal: 15,
        paddingBottom: 20,
    },
    postContainer: {
        flex: 1
    },
    lastPost: {
        paddingBottom: 0,
    },
    backPostDetails: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        right: 0,
        zIndex: 1,
        left: 0,
        marginTop: -10
    },
    postBodyContainer: {
        flex: 1,
        marginLeft: 54.5,
        marginTop: -24,
    },
    bodyText: {
        color: colors.mainColor,
        fontSize: 14.5,
        lineHeight: 20,
        paddingBottom: 5,
        fontFamily: 'main'
    },
    leftThreadConnection: {
        width: 2,
        height: '100%',
        backgroundColor: colors.mainColor,
        opacity: 0.25,
        position: 'absolute',
        left: 0,
        marginLeft: 35,
        zIndex: -1,
        marginTop: 25,
    },
});

export default React.memo(PostLarge);
