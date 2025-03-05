import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import StorySlide from '../components/stories/StorySlide';
import StoryAddPage from '../screens/stories/AddStory'
import Animated from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';
import { StoriesGesture } from '../hooks/Stories';
import { setViewed } from '../utils/calls/stories';
import { useNavigationContext } from '../contexts/NavigationContext';
import DraggableMenu from '../components/global/draggableMenu';
import { MenuViews } from '../components/stories/UserStoryFooter';
import colors from '../utils/colors';

const hooks = {}

const SingleStory = ({ route, navigation }) => {
    const { combinedGesture, animatedStyle } = StoriesGesture({ navigation })
    const { navigateInCurrentTab } = useNavigationContext()

    const { data, action, isSelf } = route.params;
    const CloseStories = navigation.goBack
    useEffect(() => {
        setViewed(data.id)
    }, [])

    const openProfile = (id, data) => {
        global.DraggableMenuController.close()
        navigation.goBack()
        if (!id) return
        navigateInCurrentTab('ProfilePage', { id, data })
    }

    hooks.openMenu = () => {
        hooks.open()
        hooks.setBack(styles.viewsBack)
        hooks.setStyle(styles.viewsContainer)
        hooks.setChildren(<MenuViews openProfile={openProfile} data={data} />)
    }


    return (
        <>
            <GestureDetector gesture={combinedGesture}>
                <Animated.View style={[styles.container, animatedStyle]}>
                    {action == 'add' || isSelf ? <StoryAddPage hooks={hooks} openProfile={openProfile} navigation={navigation} data={data} isSelf={isSelf} /> :
                        <StorySlide
                            openProfile={openProfile}
                            CloseStories={CloseStories}
                            data={data}
                            style={styles.storyImage}
                        />
                    }
                </Animated.View>
            </GestureDetector>
            {isSelf &&
                <DraggableMenu
                    overSwiper={true}
                    scroller={true}
                    hooks={hooks}
                    initialBack={styles.viewsBack}
                    initialStyle={styles.viewsContainer}
                    components={<MenuViews openProfile={openProfile} data={data} />}
                />}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background
    },
    viewsBack: {
        backgroundColor: 'rgba(255,255,255 / 0.35)'
    },
    viewsContainer: {
        backgroundColor: 'transparent',
        paddingBottom: 0,
        paddingTop: 0,
        overflow: 'hidden'
    }
});

export default SingleStory;