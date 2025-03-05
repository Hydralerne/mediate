import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import PagesHeader from '../components/global/PagesHeader';
import TabBar from '../components/global/TabBar';
import TabView from '../components/global/TabView';
import UsersBody from '../components/users/UsersBody';
import colors from '../utils/colors';
import { useTabs } from '../hooks/useTabs'

const { width } = Dimensions.get('window')

const Followers = ({ route, navigation }) => {
    const { type, id, name } = route.params;
    const [isMounted, setIsMounted] = useState(false)
    const isFollowing = type === 'following-list'
    const swipeX = useSharedValue(isFollowing ? width : 0);

    const { loadedTabs, onTabChange } = useTabs(
        !isFollowing,
        isFollowing
    );
    const tabs = useMemo(() => [
        {
            title: 'Followers',
            body: loadedTabs.followers && <UsersBody id={id} endpoint={`users/${id}/followers`} offsetX={150} />,
            onTap: () => {
                onTabChange(0)
            }
        },
        {
            title: 'Following',
            body: loadedTabs.following && <UsersBody id={id} endpoint={`users/${id}/following`} offsetX={150} />,
            onTap: () => {
                onTabChange(1)
            }
        }
    ], [loadedTabs, id]);

    useEffect(() => {
        setTimeout(() => {
            setIsMounted(true)
        }, 50)
    }, [])

    if (!isMounted) {
        return (<View style={styles.modalContainer}></View>)
    }

    return (
        <View style={styles.modalContainer}>
            <View style={styles.header}>
                <PagesHeader navigation={navigation} title={name} />
                <TabBar
                    onTabChange={onTabChange}
                    tabs={tabs}
                    swipeX={swipeX}
                    style={styles.tabBar}
                />
            </View>
            <TabView
                initialTab={isFollowing ? 1 : 0}
                swipeX={swipeX}
                tabs={tabs}
                onTabChange={onTabChange}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        position: 'relative',
        marginTop: 90,
        zIndex: 99,
        paddingTop: 10,
        height: 55,
        backgroundColor: colors.background,
        borderBottomColor: colors.lightBorder
    },
    header: {
        position: 'absolute',
        width: '100%'
    },
    modalContainer: {
        flex: 1,
        backgroundColor: colors.background,
    }
});

export default Followers;