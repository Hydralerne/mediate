import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import StorySlide from '../components/stories/StorySlide';
import { GestureDetector } from 'react-native-gesture-handler';
const { width, height } = Dimensions.get('window');
import StoriesFooter from '../components/stories/StoriesFooter';
import StoryAddPage from '../screens/stories/AddStory'
import Animated from 'react-native-reanimated';
import { useStories } from '../contexts/StoriesContext';
import { StoriesGesture, StoriesIndicator, StoriesHook } from '../hooks/Stories'
import { callLike, fetchStories, setViewed } from '../utils/calls/stories'
import { useNavigationContext } from '../contexts/NavigationContext';
import colors from '../utils/colors';

const StoriesPage = ({ route, navigation }) => {
    const { data, index } = route.params;
    const storiesData = useStories();
    const { stories, loading } = storiesData

    const loadMore = React.useCallback(async () => {
        if (loading) return;
        await fetchStories(storiesData, true);
    }, [loading, storiesData]);

    const { navigateInCurrentTab } = useNavigationContext();

    const StroiesRef = useRef(null)
    const [activeIndex, setActiveIndex] = useState(index || 0);
    const [isLiked, setIsLiked] = useState(data?.isLiked)
    const { combinedGesture, animatedStyle } = StoriesGesture({ navigation })
    const { IndicatorStyle, TouchHandlers, startProgress } = StoriesIndicator({ activeIndex, navigation, StroiesRef })
    const CloseStories = navigation.goBack
    const MIN_SWIPE_X = 10;

    const resolve = () => {
        startProgress()
    }

    const openProfile = async (id, data) => {
        CloseStories()
        navigateInCurrentTab('ProfilePage', { id, data })
    }

    const renderSlide = (({ item, index }) => (
        <StorySlide
            openProfile={openProfile}
            CloseStories={CloseStories}
            TouchHandlers={TouchHandlers}
            IndicatorStyle={index === activeIndex ? IndicatorStyle : null}
            index={index}
            activeIndex={activeIndex}
            data={item}
            style={styles.storyImage}
            resolve={resolve}
        />
    ));

    useEffect(() => {
        if (data?.action !== 'add') {
            StroiesRef.current?.scrollTo({ count: index })
        }
    }, [])

    useEffect(() => {
        if (activeIndex >= stories.length - 3) {
            loadMore();
        }
        if (!stories[activeIndex]) return
        if (StoriesHook[activeIndex]?.opened) return
        setTimeout(() => {
            StoriesHook[activeIndex].setOpened(true)
            setViewed(stories[activeIndex].id)
        }, 300)
    }, [activeIndex]);

    const panGestureHandlerProps = React.useMemo(() => ({
        activeOffsetX: [-MIN_SWIPE_X, MIN_SWIPE_X],
    }), [MIN_SWIPE_X]);

    const setIsLikedFire = (isLiked) => {
        callLike(stories[activeIndex].id, isLiked)
        setIsLiked(isLiked)
    }

    return (
        <View style={{ flex: 1}}>
            <GestureDetector gesture={combinedGesture}>
                <Animated.View style={[styles.container, animatedStyle]}>
                    <Carousel
                        width={width}
                        height={height}
                        data={stories || []}
                        loop={false}
                        ref={StroiesRef}
                        onSnapToItem={(index) => {
                            setActiveIndex(index);
                            setIsLiked(stories[index]?.is_liked)
                        }}
                        renderItem={renderSlide}
                        scrollAnimationDuration={100}
                        panGestureHandlerProps={panGestureHandlerProps}
                    />
                    <StoriesFooter isLiked={isLiked} setIsLiked={setIsLikedFire} activeIndex={activeIndex} />
                </Animated.View>
            </GestureDetector>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});

export default StoriesPage;