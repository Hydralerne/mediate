import React, { useEffect, useState, useRef, memo } from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text,
    ActivityIndicator,
    Animated as ReactAnimated,
    Dimensions,
    Platform
} from 'react-native';
import * as Haptics from 'expo-haptics';

import Header from './Header';
import TabBar from '../global/TabBar';
import PostButton from './SendMsgButton';
import PostsBody from '../posts/PostsFetch';
import HeaderNavigation from './profileHeaderNavigation'
import HeaderBack from './HeaderBackground'
import Avatar from './HeaderImage';
import TabView from '../global/TabView'
import { useSharedValue } from 'react-native-reanimated';
import CommingSoon from '../../loaders/CommingSoon';
import createStyles from '../../utils/globalStyle';
import useTranslation from '../../hooks/useTranslation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import ShareProfileTag from './ShareProfileTag';
import colors from '../../utils/colors';
const { height, width } = Dimensions.get('window');

const Profile = ({ data, id, isSelf }) => {
    const t = useTranslation()
    const insets = useSafeAreaInsets()
    const scrollY = useRef(new ReactAnimated.Value(0)).current;
    const STICKY_OFFSET = height < 750 ? 132 : 144;
    const [HEADER_HEIGHT, setHeaderHeight] = useState(300)
    const { scale, translateY, headerBackTranslateY, headerTranslateY, translateYArrow, opacityArrow } = profileScroller(scrollY, HEADER_HEIGHT, STICKY_OFFSET)
    const activeTabRef = useRef(0);
    const [refreshing, setRefreshing] = useState(false);

    const swipeX = useSharedValue(0);

    const triggerRefresh = () => {
        if (refreshing) return
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    };

    const handleScroll = (event) => {
        const yOffset = event.nativeEvent.contentOffset.y;
        if (yOffset < -75 && !refreshing) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            setRefreshing(true);
        } else if (yOffset >= 0 && refreshing) {
            triggerRefresh()
        }
    };

    const onFlatListScroll = ReactAnimated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        {
            useNativeDriver: true,
            listener: handleScroll,
        }
    );
    const navigation = useNavigation()
    const sendMessage = () => {
        navigation.push('InboxModal', { data: data.user, isPost: isSelf })
    }

    const tabs = [
        {
            title: t('profile.menu.threads'),
            body: (
                <PostsBody
                    props={{ limit: 10 }}
                    onScroll={onFlatListScroll}
                    animated={true}
                    refIndex={'profileThreads'}
                    style={{ paddingTop: Platform.OS == 'android' ? (HEADER_HEIGHT - 20) : HEADER_HEIGHT }}
                    offset={HEADER_HEIGHT - 10}
                    endpoint={`users/${data.user?.id || id}/posts`}
                    isProfile={true}
                    onEmpty={<ShareProfileTag sendMessage={sendMessage} style={{ marginTop: HEADER_HEIGHT + insets.top }} data={data.user} refIndex={'profile'} isSelf={isSelf} />}
                />
            )
        },
        {
            title: t('profile.menu.collections'),
            body: (
                <CommingSoon
                    description={'Profile collection will be available soon in next update'}
                    style={{ marginTop: HEADER_HEIGHT - 150 }}
                />
            )
        },
        {
            title: t('profile.menu.posts'),
            body: (
                <CommingSoon
                    description={'User posts will be available soon in next update'}
                    style={{ marginTop: HEADER_HEIGHT - 150 }}
                />
            )
        }
    ]

    return (
        <View style={styles.container}>
            <ReactAnimated.View pointerEvents="box-none" style={[styles.container, { zIndex: 4 }]}>
                <HeaderNavigation isSelf={isSelf} data={data.user} />
                <HeaderBack style={{ transform: [{ translateY: headerBackTranslateY }] }} url={data.user?.img} />
                <Avatar isSelf={isSelf} data={data} style={{ transform: [{ scale }, { translateY: translateY }] }} />
                <ReactAnimated.View
                    style={[styles.refreshIndicator, {
                        transform: [{ translateY: translateYArrow }],
                        opacity: opacityArrow,
                    }]}>
                    {refreshing ? <ActivityIndicator size={'small'} /> :
                        <Image style={styles.arrowIcon} source={require('../../assets/icons/profile/arrow down md-20-1696832059.png')} />}
                </ReactAnimated.View>
                <ReactAnimated.View
                    style={[
                        styles.headerContainer,
                        { transform: [{ translateY: headerTranslateY }] },
                    ]}
                    onLayout={(event) => {
                        const { height } = event.nativeEvent.layout;
                        setHeaderHeight(height)
                    }}
                >
                    <Header isSelf={isSelf} data={data} />
                    <TabBar
                        tabs={tabs}
                        activeTabRef={activeTabRef}
                        swipeX={swipeX}
                        viewWidth={width}
                    />
                </ReactAnimated.View>
            </ReactAnimated.View>
            <TabView
                activeTabRef={activeTabRef}
                swipeX={swipeX}
                tabs={tabs}
            />
            {!isSelf && <PostButton sendMessage={sendMessage} />}
        </View>
    );
};

const styles = createStyles({
    refreshIndicator: {
        left: '50%',
        marginLeft: '-25',
        width: 50,
        height: 50,
        position: 'absolute',
        zIndex: 999,
        marginTop: 150,
        alignItems: 'center',
        justifyContent: 'center'
    },
    arrowIcon: {
        width: 26,
        height: 26,
        tintColor: 'white',
        resizeMode: 'contain'
    },
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    headerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2,
        backgroundColor: colors.background,
    },
});


const profileScroller = (scrollY, HEADER_HEIGHT, STICKY_OFFSET) => {

    const translateYArrow = scrollY.interpolate({
        inputRange: [-70, -20],
        outputRange: [50, 20],
        extrapolate: 'clamp',
    });

    const opacityArrow = scrollY.interpolate({
        inputRange: [-100, -20],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });
    const headerTranslateY = scrollY.interpolate({
        inputRange: [-500, HEADER_HEIGHT - STICKY_OFFSET],
        outputRange: [500, -(HEADER_HEIGHT - STICKY_OFFSET)],
        extrapolate: 'clamp',
    });

    const headerBackTranslateY = scrollY.interpolate({
        inputRange: [0, 40],
        outputRange: [0, -40],
        extrapolate: 'clamp',
    });

    const translateY = scrollY.interpolate({
        inputRange: [0, 150],
        outputRange: [0, -195],
        extrapolate: 'clamp',
    });

    const scale = scrollY.interpolate({
        inputRange: [0, 150],
        outputRange: [1, 0.35],
        extrapolate: 'clamp',
    });

    return { scale, translateY, headerBackTranslateY, headerTranslateY, opacityArrow, translateYArrow }

}


export default memo(Profile);
