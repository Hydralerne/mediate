import React, { useCallback, useEffect, useRef } from 'react';
import { FlatList, ActivityIndicator, Platform, View, Animated as RCAnimated } from 'react-native';
import ThreadItem from './ThreadItem';
import usePosts from '../../hooks/usePosts';
import PageLoader from '../../loaders/PageLoager';
import { sharedRefs, triggerRefs } from '../../hooks/Flatlists';
import useTrackSeenPosts from '../../hooks/useTrackPosts';
import { RefreshControl } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Animated from 'react-native-reanimated';

const PostsBody = ({ props, endpoint, style, tracking, refIndex, isProfile, animated, onEmpty, renmaited, onScroll, offset = 185 }) => {
    const ref = useRef(null)
    const navigation = useNavigation()

    const { handleViewableItemsChanged, trackAction, viewabilityConfig } = useTrackSeenPosts({ tracking, props, endpoint })

    const {
        posts,
        loading,
        refreshing,
        loadingMore,
        loadInitialPosts,
        handleRefresh,
        handleLoadMore,
        initialLoaded,
        trigger,
        deletePost
    } = usePosts(props, endpoint);

    useEffect(() => {
        loadInitialPosts();
        if (refIndex) {
            sharedRefs[refIndex] = ref
            triggerRefs[refIndex] = { deletePost }
        }
    }, []);

    const renderThreadItem = useCallback(({ item }) => (
        <ThreadItem navigation={navigation} refIndex={refIndex} trackAction={trackAction} post={item} id={item.id} />
    ));

    const FlatListComponent = renmaited ? Animated.FlatList : (animated ? RCAnimated.FlatList : FlatList);

    return loading ? (
        <PageLoader isProfile={isProfile} />
    ) : (
        posts.length == 0 && initialLoaded ? onEmpty : 
        <FlatListComponent
            data={posts}
            keyExtractor={(item, index) => item.id?.toString() || index?.toString()}
            renderItem={renderThreadItem}
            style={style}
            ref={ref}
            contentContainerStyle={{ paddingTop: !isProfile && Platform.OS == 'android' ? offset - 15 : 0 }}
            contentInset={{ top: !isProfile ? offset : 0 }}
            contentOffset={{ y: !isProfile ? -offset : 0 }}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    progressViewOffset={offset}
                    activeOffsetY={10}
                />
            }
            onScroll={onScroll}
            scrollEventThrottle={16}
            scrollIndicatorInsets={isProfile ? offset : { top: offset - 30, right: 0 }}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.2}
            ListFooterComponent={
                <View style={{ flex: 1, height: 100 }}>
                    {loadingMore && <ActivityIndicator size="small" />}
                </View>
            }
            extraData={trigger}
            onViewableItemsChanged={handleViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
        />
    );
};

export default React.memo(PostsBody);
