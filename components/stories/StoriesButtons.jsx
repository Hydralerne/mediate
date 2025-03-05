import React, { useState, memo, useContext } from 'react';
import { ScrollView, View, Animated, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { handleAddStory } from '../../utils/media/stories';
import { UserContext } from '../../contexts/UserContext';
import { useStories } from '../../contexts/StoriesContext';
import { StoriesHook } from '../../hooks/Stories'
import createStyles from '../../utils/globalStyle';
import colors from '../../utils/colors';
import { fetchStories } from '../../utils/calls/stories';

const AddButton = memo(({ self }) => {
    const navigation = useNavigation();

    const selectCallback = (originalUri, compressedUri) => {
        navigation.push('SingleStory', {
            action: 'add',
            data: { originalUri, compressedUri },
        });
    };

    if (self) {
        const { userData } = useContext(UserContext)
        return <UserStory style={{ width: 55, marginRight: 8}} index={0} isSelf={!!self} story={{ ...self, user: userData.data }} />;
    }

    return (
        <TouchableOpacity onPress={() => handleAddStory(selectCallback)} style={[styles.storyContainer, { width: 55, marginRight: 8 }]}>
            <Svg height="55" width="55" style={{ opacity: 0.5 }}>
                <Rect
                    x="1"
                    y="1"
                    width="53"
                    height="53"
                    fill="none"
                    rx="26"
                    ry="26"
                    stroke={colors.mainColor}
                    strokeWidth="2"
                    strokeDasharray="8,4"
                    strokeDashoffset="0"
                    strokeLinecap="butt"
                />
            </Svg>
            <Image source={require('../../assets/icons/home/plus 4-12-1662493809.png')} style={styles.addIcon} />
            <Text numberOfLines={1} style={[styles.storyText, { paddingHorizontal: 0 }]}>Add story</Text>
        </TouchableOpacity>
    );
});

const UserStory = (({ story, style, index, isSelf }) => {
    const navigation = useNavigation();
    const [opened, setOpened] = useState(story.is_viewed || false)

    StoriesHook[index] = { setOpened, opened }

    const openStory = () => {
        const route = isSelf ? 'MyStory' : 'Stories'
        navigation.push(route, { data: story, index, isSelf });
    };

    const handlePress = () => {
        openStory()
    }

    return (
        <TouchableOpacity onPress={handlePress} style={[styles.storyContainer, style]}>
            <View style={[styles.imageWrapper, opened && { borderColor: colors.openedStory }]}>
                <Image source={{ uri: story?.user?.image }} style={styles.image} />
            </View>
            <Text numberOfLines={1} style={styles.storyText}>{story?.user?.fullname}</Text>
        </TouchableOpacity>
    );
});

const StoriesButtons = ({ style }) => {
    const storiesData = useStories();

    const { stories, loading, self } = storiesData

    const loadMore = async () => {
        try {
            if (loading) return;
            await fetchStories(storiesData, true, stories.length);
        } catch (e) {
            console.log(e)
        }
    }

    const renderItem = ({ item, index }) => {
        return index === 0 ? (
            <AddButton self={item} />
        ) : (
            <UserStory index={index - 1} story={item} />
        );
    };

    return (
        <View style={styles.outSetContainer}>
            <Animated.View style={[styles.scrollContainer, style]}>
                <FlatList
                    data={[self, ...stories || []]}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => item?.id.toString() || index.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.3}
                    contentContainerStyle={{ paddingHorizontal: 15 }}
                    ListFooterComponent={
                        <View style={styles.loaderButtons}>
                            <ActivityIndicator size={'small'} color={colors.mainColor} />
                        </View>
                    }
                />
            </Animated.View>
        </View>
    );
};

const styles = createStyles({
    outSetContainer: {
        overflow: 'hidden'
    },
    loaderButtons: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    addIcon: {
        tintColor: colors.mainColor,
        position: 'absolute',
        width: 28,
        height: 28,
        marginTop: 22,
        resizeMode: 'contain',
    },
    scrollContainer: {
        flexDirection: 'row',
    },
    storyText: {
        color: colors.mainSecound,
        fontSize: 12,
        marginTop: 8,
        lineHeight: 16,
        paddingHorizontal: 2
    },
    storyContainer: {
        alignItems: 'center',
        // marginRight: 10,
        paddingVertical: 8,
        width: 68
    },
    imageWrapper: {
        width: 55,
        height: 55,
        borderRadius: 35,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: colors.main,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 47.5,
        height: 47.5,
        resizeMode: 'cover',
        borderRadius: 50,
    },
});

export default (StoriesButtons);