// HomeScreen.js
import React, { memo, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, Dimensions, Animated as ReactAnimated, Platform } from 'react-native';
import HomeHeader from '../../components/home/Header'
import PostsBody from '../../components/posts/PostsFetch'
import { useSharedValue } from 'react-native-reanimated';
import { useNavigationContext } from '../../contexts/NavigationContext';
import useTranslation from '../../hooks/useTranslation';
import colors from '../../utils/colors';

const HomeScreen = ({ navigation }) => {
    const { registerTabNavigation, unregisterTabNavigation } = useNavigationContext();
    const t = useTranslation()

    useEffect(() => {
        registerTabNavigation('HomeTab', navigation);
        return () => {
            unregisterTabNavigation('HomeTab');
        };
    }, [navigation]);

    // const scrollY = useRef(new ReactAnimated.Value(0)).current;
    const swipeX = useSharedValue(0);
    const HeaderHeight = 200

    const lastScrollY = useRef(0);
    const isUp = useRef(false);
    const headerTranslateY = useRef(new ReactAnimated.Value(0)).current;
    const isAnimating = useRef(false);

    const onFlatListScroll = (event) => {
        const currentScrollY = event.nativeEvent.contentOffset.y;
        const scrollDifference = Math.abs(currentScrollY - lastScrollY.current);
        if (scrollDifference < 20 || isAnimating.current) return;

        if (currentScrollY > lastScrollY.current && currentScrollY > 50 && !isUp.current) {
            isAnimating.current = true;
            ReactAnimated.timing(headerTranslateY, {
                toValue: -HeaderHeight,
                duration: 200,
                useNativeDriver: true,
            }).start(() => {
                isAnimating.current = false;
            });
            isUp.current = true
        } else if (currentScrollY < lastScrollY.current && isUp.current) {
            isAnimating.current = true;
            ReactAnimated.timing(headerTranslateY, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start(() => {
                isAnimating.current = false;
            });
            isUp.current = false
        }
        lastScrollY.current = currentScrollY;
    };


    const addPost = () => {
        navigation.push('InboxModal', { isPost: true })
    }
    

    // const onFlatListScroll = ReactAnimated.event(
    //     [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    //     {
    //         useNativeDriver: true,
    //         listener: handleScroll,
    //     }
    // );

    return (
        <View style={styles.container}>
            <HomeHeader
                swipeX={swipeX}
                scrollY={headerTranslateY}
            />
            {/* <PostButton onClick={addPost} /> */}
            <PostsBody
                refIndex={'homeFlatListRef'}
                animated={true}
                onScroll={onFlatListScroll}
                offset={Platform.OS == 'android' ? 210 : 205}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
});

export default memo(HomeScreen);
