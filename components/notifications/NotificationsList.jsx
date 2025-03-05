import React, { useState, useEffect } from 'react';
import { FlatList, ActivityIndicator, View, StyleSheet, Text, RefreshControl, SafeAreaView, StatusBar, Platform } from 'react-native';
import NotificationItem from './NotificationItem'
import colors from '../../utils/colors';
import { request } from '../../utils/requests';
import { getToken } from '../../utils/token';
import createStyles from '../../utils/globalStyle';

const NotificationsList = ({ navigation }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [hasMore, setHasMore] = useState(true)
    const [offset, setOffset] = useState(0);

    const fetchNotifications = async (isRefreshing = false) => {
        try {
            if (refreshing || loading || !hasMore) return;
            const response = await request('https://api.onvo.me/v2/notifications', { refresh: isRefreshing, fs: notifications?.[0]?.timestamp, offset: isRefreshing ? 0 : notifications.length }, 'GET', {
                Authorization: `Bearer ${await getToken()}`
            });

            if (response?.length > 0) {
                if (isRefreshing) {
                    setNotifications([...response, ...notifications]);
                } else {
                    setNotifications([...notifications, ...response]);
                }
            } else {
                setHasMore(false)
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleLoadMore = async () => {
        if (refreshing || loading) return;
        await fetchNotifications();
    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchNotifications(true); // Pass true to indicate refreshing
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.mainColor} />
            </View>
        );
    }

    const renderItem = ({ item, index }) => (
        <NotificationItem navigation={navigation} data={item} index={index} />
    )

    return (
        <View style={styles.container}>
            <FlatList
                data={notifications}
                keyExtractor={(item, index) => item.id?.toString() || `key-${index}`}
                renderItem={renderItem}
                contentContainerStyle={{ paddingTop: Platform.OS == 'android' ? 110 - 10 : 0 }}
                contentInset={{ top: 110 }}
                contentOffset={{ y: -110 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        progressViewOffset={110}
                    />
                }
                scrollIndicatorInsets={{ top: 110, right: 0 }}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.1}
                ListFooterComponent={
                    loading ? <ActivityIndicator size="small" /> : null
                }
            />
        </View>
    );
};

const styles = createStyles({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
});

export default NotificationsList;