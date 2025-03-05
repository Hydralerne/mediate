import React, { useEffect, useState, useCallback, useMemo, useRef, useContext } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, RefreshControl, Dimensions, Platform } from 'react-native';
import MessageItem from './MessageItem';
import usePosts from '../../hooks/usePosts';
import { useNavigation } from '@react-navigation/native';
import PageLoader from '../../loaders/PageLoager';
import { sharedRefs, triggerRefs } from '../../hooks/Flatlists';
import createStyles from '../../utils/globalStyle';
import useTranslation from '../../hooks/useTranslation';
import ShareProfileTag from '../profile/ShareProfileTag';
import { UserContext } from '../../contexts/UserContext';
import colors from '../../utils/colors';

const MessageBody = ({ props = {}, refIndex, endpoint = 'posts/dm', offsetX = 185, dir }) => {
    const navigation = useNavigation()
    const ref = useRef(null)
    const { userData } = useContext(UserContext)

    const t = useTranslation()

    const {
        posts,
        loading,
        refreshing,
        loadingMore,
        loadInitialPosts,
        handleRefresh,
        handleLoadMore,
        trigger,
        deletePost
    } = usePosts({ ...props, limit: 10 }, endpoint);

    useEffect(() => {
        sharedRefs[refIndex] = ref
        triggerRefs[refIndex] = { deletePost }
    }, [refIndex])

    useEffect(() => {
        loadInitialPosts();
    }, []);

    const replyText = t('messages.item.reply')

    const renderItem = useMemo(() => ({ item }) => (
        <MessageItem navigation={navigation} replyText={replyText} dir={dir} refIndex={refIndex} message={item} />
    ), []);

    return (
        <View style={[styles.container]}>
            {(loading) ? <PageLoader />
                : (
                    posts.length == 0 ?
                        <ShareProfileTag data={userData.data} />
                        :
                        <FlatList
                            data={posts}
                            ref={ref}
                            keyExtractor={(item, index) => item.id?.toString() || `key-${index}`}
                            renderItem={renderItem}
                            contentContainerStyle={{ paddingTop: Platform.OS == 'android' ? offsetX - 30 : 0 }}
                            contentInset={{ top: offsetX }}
                            contentOffset={{ y: -offsetX }}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={handleRefresh}
                                    progressViewOffset={offsetX}
                                />
                            }
                            scrollIndicatorInsets={{ top: offsetX, right: 0 }}
                            onEndReached={handleLoadMore}
                            onEndReachedThreshold={0.1}
                            ListFooterComponent={
                                loadingMore ? <ActivityIndicator size="small" /> : null
                            }
                            extraData={trigger}
                            estimatedItemSize={2}
                            initialNumToRender={2}
                            maxToRenderPerBatch={2}
                            windowSize={4}
                        />
                )
            }
        </View>
    );
};

const styles = createStyles({
    container: {
        backgroundColor: colors.background,
        flex: 1
    },
    list: {
        paddingTop: 80,
    },
});

export default React.memo(MessageBody);