import { useState, useCallback, useEffect, useRef } from 'react';
import { debounce } from 'lodash';
import { request } from '../utils/requests';
import { getToken } from '../utils/token';

const useFollowers = (id, endpoint) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [offset, setOffset] = useState(0);
    const [error, setError] = useState(null);
    const mounted = useRef(true);

    const fetchData = useCallback(async (newOffset = 0) => {
        if (!hasMore || loading || loadingMore) return;
        if (!mounted.current || !id) return;

        try {
            if (newOffset === 0) {
                setLoading(true);
                setError(null);
            } else {
                setLoadingMore(true);
            }

            const token = await getToken();
            const response = await request(
                `https://api.onvo.me/v2/${endpoint}`,
                { offset: newOffset },
                'GET',
                { Authorization: `Bearer ${token}` }
            );

            if(response.length == 0){
                return setHasMore(false)
            }

            if (newOffset === 0) {
                setData(response);
            } else {
                setData((prevData) => [...prevData, ...response]);
            }

            setOffset(newOffset + 30);
            setHasMore(response.length > 5);
        } catch (err) {
            setHasMore(false);
            console.error('Error fetching data:', err);
            setError('Failed to fetch data. Please try again.');
        } finally {
            if (mounted.current) {
                setLoading(false);
                setLoadingMore(false);
            }
        }
    }, [id, endpoint, hasMore]);

    const loadInitialData = useCallback(async () => {
        await fetchData(0);
    }, [fetchData]);

    const handleLoadMore = useCallback(
        debounce(async () => {
            if (!loadingMore && hasMore) {
                await fetchData(offset);
            }
        }, 300),
        [loadingMore, hasMore, offset, fetchData]
    );

    useEffect(() => {
        if (id) {
            loadInitialData();
        }
    }, [id, loadInitialData]);

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    return {
        data,
        loading,
        loadingMore,
        hasMore,
        error,
        handleLoadMore,
    };
};

export default useFollowers;