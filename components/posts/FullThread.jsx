import React from 'react';
import { View, StyleSheet } from 'react-native';
import PostItem from './PostItem';
import createStyles from '../../utils/globalStyle';

const FullThread = ({ data, id, newReply, navigation }) => {
    const fullmap = [
        ...(data.previous || []),
        data.post?.[0] || data.post,
        ...(data.replies || [])
    ];

    const getShareHood = (post) => {
        const index = fullmap.findIndex(p => p.id === post.id);
        if (index === -1) return null;
        const hood = post.type === 'post' ? fullmap[index + 1] : fullmap[index - 1];
        return hood ? { text: hood.text, user: hood.sender?.username } : null;
    };

    const renderPostItem = (post, extraProps = {}) => (
        post.is_thread ?
            <ThreadItem
                navigation={navigation}
                refIndex={'DetailsScreen'}
                post={post}
                id={post.id}
            />
            :
            <PostItem
                key={post.id}
                post={post.thread_id}
                data={post}
                navigation={navigation}
                shareHood={() => getShareHood(post)}
                {...extraProps}
            />
    );

    return (
        <View style={styles.threadContainer}>
            {data.previous?.map(post => renderPostItem(post))}
            {renderPostItem(data.post?.[0] || data.post, { isPerview: true, update: newReply ? { reply: true } : undefined })}
            {data.replies?.map(post => renderPostItem({ ...post, isLast: true, isReply: true }))}
            {newReply && renderPostItem({ ...newReply, isLast: true, isReply: true })}
        </View>
    );
};

const styles = createStyles({
    threadContainer: {
        paddingVertical: 10,
        overflow: 'hidden'
    }
});

export default React.memo(FullThread);
