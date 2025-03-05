// PostItem.js
import React from 'react';
import { View, StyleSheet } from 'react-native';

import PostItem from './PostItem'
import CutItem from './CutItem'
import SuggestedUsers from '../users/Suggested';
import createStyles from '../../utils/globalStyle';
import colors from '../../utils/colors';

const ThreadItem = ({ post: thread, id, trackAction, refIndex, navigation }) => {
    switch (thread.layout) {
        case 'post':
            return (
                <View style={styles.threadContainer}>
                    {
                        thread.content.map((post, index) => (
                            <PostItem
                                refIndex={refIndex}
                                trackAction={trackAction}
                                key={post.id || index}
                                post={id}
                                index={index}
                                repost={thread.reposts}
                                threadOwner={thread.userid}
                                navigation={navigation}
                                shareHood={() => {
                                    const hood = thread.content?.[post.type === 'post' ? index + 1 : index - 1];
                                    return { text: hood?.text, user: hood?.sender?.username };
                                }}
                                data={{
                                    ...post,
                                    isLast: index === thread.content.length - 1,
                                }} />
                        ))
                    }
                </View>
            )
        case 'suggested':
            return (
                <View style={styles.container}>
                    <SuggestedUsers data={thread.content} />
                </View>
            )
    }
};

const styles = createStyles({
    container: {
        borderBottomColor: colors.posts.threadBorder,
        borderBottomWidth: 1,
        minHeight: 200,
        paddingVertical: 20,
    },
    threadContainer: {
        borderBottomColor: colors.posts.threadBorder,
        borderBottomWidth: 1,
        paddingVertical: 11,
        overflow: 'hidden'
    }
});

export default React.memo(ThreadItem);
