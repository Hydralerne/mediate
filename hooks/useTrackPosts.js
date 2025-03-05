import { useEffect, useRef } from 'react';

const useTrackSeenPosts = ({ tracking, props, endpoint }) => {
    if (!tracking) {
        return {}
    }
    const seenPostsRef = useRef({});
    const activePostIdRef = useRef(null);
    const startTimeRef = useRef(null);
    const viewabilityConfig = {
        itemVisiblePercentThreshold: 100,
        waitForInteraction: true,
        minimumViewTime: 300,
    }

    useEffect(() => {
        return () => {
            if (activePostIdRef.current !== null) {
                finalizePostTime(activePostIdRef.current, startTimeRef.current);
            }
        };
    }, []);

    const finalizePostTime = (postId, startTime) => {
        const duration = Date.now() - startTime;
        const postData = seenPostsRef.current[postId];

        if (!postData) {
            seenPostsRef.current[postId] = {
                total_ms: duration,
                actions: {},
            };
        } else {
            postData.total_ms += duration;
        }
    };

    const handleViewableItemsChanged = ({ viewableItems }) => {
        if (viewableItems.length === 0) return;

        const closestToCenter = viewableItems.reduce((prev, curr) => {
            const prevDistance = Math.abs(prev.item.index - viewableItems.length / 2);
            const currDistance = Math.abs(curr.item.index - viewableItems.length / 2);
            return currDistance < prevDistance ? curr : prev;
        });

        const newPostId = closestToCenter.item.id;

        if (closestToCenter.item.ranked) return

        if (activePostIdRef.current !== null && activePostIdRef.current !== newPostId) {
            finalizePostTime(activePostIdRef.current, startTimeRef.current);
        }

        activePostIdRef.current = newPostId;
        startTimeRef.current = Date.now();

        if (!seenPostsRef.current[newPostId]) {
            seenPostsRef.current[newPostId] = {
                total_ms: 0,
                actions: {}
            };
        }
        return console.log(JSON.stringify(seenPostsRef.current));
    };

    const trackAction = (action, postId) => {
        if (seenPostsRef.current[postId]) {
            const actionTime = Date.now() - startTimeRef.current;
            if (seenPostsRef.current[postId].total_ms == 0) {
                seenPostsRef.current[postId].total_ms = actionTime
            }
            seenPostsRef.current[postId].actions[action] = actionTime;
        }
    };

    const getSeenPosts = () => seenPostsRef.current;

    return {
        handleViewableItemsChanged,
        trackAction,
        getSeenPosts,
        viewabilityConfig
    };
};

export default useTrackSeenPosts;