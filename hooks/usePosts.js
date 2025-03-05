import { useState, useRef, useCallback, version } from 'react';
import { request } from '../utils/requests';
import { getToken } from '../utils/token';

const usePosts = (inputs = {}, endpoint = 'posts/timeline') => {
    const postsRef = useRef([]);
    const [trigger, setTrigger] = useState(0);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [initialLoaded, setInitialLoaded] = useState(false)

    const fetchPosts = useCallback(
        async (props) => {
            try {
                const lastPost = postsRef.current[postsRef.current.length - 1];
                const firstPost = postsRef.current[0];
                const options = {
                    first_id: firstPost?.id,
                    fs: firstPost?.timestamp,
                    last_id: lastPost?.id,
                    ls: lastPost?.timestamp,
                    version: 2,
                    ...props,
                    ...inputs
                };

                const response = await request(
                    `https://api.onvo.me/v2/${endpoint}`,
                    options,
                    'GET',
                    { Authorization: `Bearer ${await getToken()}` }
                );

                return response.data;
            } catch (error) {
                console.error('Error fetching posts:', error);
                return [];
            }
        },
        [inputs, endpoint]
    );


    const loadInitialPosts = useCallback(async () => {
        if (loading) return;
        setInitialLoaded(true)
        setLoading(true);
        const initialPosts = await fetchPosts();
        postsRef.current = initialPosts;
        setTrigger((prev) => prev + 1);
        setLoading(false);
    }, [fetchPosts, loading]);

    const handleRefresh = useCallback(async () => {
        if (refreshing) return
        setRefreshing(true);
        const newPosts = await fetchPosts({ refresh: true });
        if (newPosts.length > 0) {
            const mergedPosts = [
                ...newPosts,
                ...postsRef.current.filter((post) => !newPosts.some((np) => np.id === post.id)),
            ];
            const maxPosts = 200;
            const slicedPosts = mergedPosts.slice(0, maxPosts);
            postsRef.current = slicedPosts;
            setTrigger((prev) => prev + 1);
        }
        setRefreshing(false);
    }, [fetchPosts]);

    const handleLoadMore = useCallback(async () => {
        if (loadingMore || !hasMore || loading) return;
        setLoadingMore(true);
        const newPosts = await fetchPosts();

        if (newPosts.length > 0) {
            const mergedPosts = [
                ...postsRef.current,
                ...newPosts.filter((np) => !postsRef.current.some((post) => post.id === np.id)),
            ];
            const maxPosts = 200;
            let slicedPosts = mergedPosts;
            if (mergedPosts.length > maxPosts) {
                const excess = mergedPosts.length - maxPosts;
                slicedPosts = mergedPosts.slice(excess);
            }
            postsRef.current = slicedPosts;
            setTrigger((prev) => prev + 1);
        } else {
            setHasMore(false);
        }

        setLoadingMore(false);
    }, [fetchPosts, hasMore, loadingMore]);

    const deletePost = useCallback((id) => {
        postsRef.current = postsRef.current.filter((post) => post.id !== id);
        setTrigger((prev) => prev + 1);
    }, []);

    const updatePost = useCallback((updatedPost) => {
        postsRef.current = postsRef.current.map((post) =>
            post.id === updatedPost.id ? { ...post, ...updatedPost } : post
        );
        setTrigger((prev) => prev + 1);
    }, []);

    return {
        posts: postsRef.current,
        loading,
        refreshing,
        loadingMore,
        hasMore,
        initialLoaded,
        trigger,
        loadInitialPosts,
        handleRefresh,
        handleLoadMore,
        deletePost,
        updatePost
    };
};

export default usePosts;
