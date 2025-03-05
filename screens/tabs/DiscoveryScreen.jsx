import React, { memo, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useNavigationContext } from '../../contexts/NavigationContext';
import PostsBody from '../../components/posts/PostsFetch'
import TabView from '../../components/global/TabView';
import { useSharedValue } from 'react-native-reanimated';
import createStyles from '../../utils/globalStyle';
import useTranslation from '../../hooks/useTranslation';

const useTabs = (movies, drawing, music) => {
    const [loadedTabs, setLoadedTabs] = useState({
        movies,
        drawing,
        music,
    });

    const onTabChange = (index) => {
        if (index === 0 && !loadedTabs.movies) {
            setLoadedTabs(prev => ({ ...prev, movies: true }));
        } else if (index === 1 && !loadedTabs.drawing) {
            setLoadedTabs(prev => ({ ...prev, drawing: true }));
        } else if (index === 2 && !loadedTabs.music) {
            setLoadedTabs(prev => ({ ...prev, music: true }));
        }
    };

    return { loadedTabs, onTabChange };
};

import InboxHeader from '../../components/inbox/Header'
import colors from '../../utils/colors';

const DiscoveryScreen = ({ navigation }) => {
    const { registerTabNavigation, unregisterTabNavigation } = useNavigationContext();
    const swipeX = useSharedValue(0);
    const t = useTranslation()

    useEffect(() => {
        registerTabNavigation('DiscoveryTab', navigation);

        return () => {
            unregisterTabNavigation('DiscoveryTab');
        };
    }, [navigation]);

    const { loadedTabs, onTabChange } = useTabs(true);

    const tabs = useMemo(() => [
        {
            title: t('messages.headerDiscovery.movies'),
            body: loadedTabs.movies && <PostsBody endpoint={'posts/category/movie'} offset={150} />
        },
        {
            title: t('messages.headerDiscovery.drawing'),
            body: loadedTabs.drawing && <PostsBody endpoint={'posts/category/draw'} offset={150} />,
            onTap: () => onTabChange(1)
        },
        {
            title: t('messages.headerDiscovery.music'),
            body: loadedTabs.music && <PostsBody endpoint={'posts/category/music'} offset={150} />,
            onTap: () => onTabChange(2)
        }
    ], [loadedTabs]);

    return (
        <View style={styles.container}>
            <InboxHeader
                onTabChange={onTabChange}
                tabs={tabs}
                swipeX={swipeX}
                headerText={t('messages.headerDiscovery.title')}
            />
            <TabView
                swipeX={swipeX}
                tabs={tabs}
                onTabChange={onTabChange}
            />
        </View>
    )
};

const styles = createStyles({
    tabBar: {
        position: 'relative',
        // marginTop: 10,
        zIndex: 99,
        paddingTop: 10,
        height: 55,
        // backgroundColor: colors.background,
        // borderBottomColor: colors.lightBorder
    },
    header: {
        position: 'absolute',
        width: '100%'
    },
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
})

export default memo(DiscoveryScreen);
