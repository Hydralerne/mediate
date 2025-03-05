import { Image, StyleSheet, View, Text, FlatList, ActivityIndicator } from 'react-native'
import { BlurView } from 'expo-blur'
import { useEffect, useState, useRef } from 'react'
import { request } from '../../utils/requests'
import { getToken } from '../../utils/token'
import { deleteStory } from '../../utils/calls/stories'
import { useStories } from '../../contexts/StoriesContext'
import createStyles from '../../utils/globalStyle'
import TouchableButton from '../global/ButtonTap'
import colors from '../../utils/colors'

export const MenuViews = ({ closePage, data, openProfile }) => {
    const { setSelf } = useStories()
    const [views, setViews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const viewsCount = useRef(null);

    const getViews = async (isLoadMore = false) => {
        if (loading || !hasMore) return;
        setLoading(true);

        const response = await request('https://api.onvo.me/v2/stories/views',
            { offset: views.length },
            'GET',
            {
                Authorization: `Bearer ${await getToken()}`,
            }
        );

        setLoading(false);
        if (!response?.data || response?.data?.length == 0) {
            setHasMore(false);
            return
        }
        if (isLoadMore) {
            setViews(prevViews => [...prevViews, ...response.data]);
        } else {
            setViews(response.data);
        }

        viewsCount.current = response.count;
        if (views.length + response.data.length >= response.count) {
            setHasMore(false);
        }
    };

    useEffect(() => {
        getViews();
    }, []);



    const renderItem = ({ item }) => {

        return (
            <TouchableButton onPress={() => { if (item.is_anon) return; openProfile(item.id, item) }}>
                <View style={menu.viewer}>
                    <Image style={menu.viewerImage} source={{ uri: item.image }} />
                    <Text style={menu.viewerName}>{item.fullname}</Text>
                    {item.is_liked && (
                        <Image style={menu.likeIcon} source={require('../../assets/icons/posts/heart like 2-19-1662493136.png')} />
                    )}
                    <Text style={menu.viewTime}>{item.time}</Text>
                </View>
            </TouchableButton>
        );
    };

    const loadMore = () => {
        if (hasMore) {
            getViews(true);
        }
    };

    const deleteCallback = (data) => {
        if (data.status == 'success') {
            global.DraggableMenuController.close()
            setSelf(null)
            closePage()
        }
    }

    return (
        <View style={menu.container}>
            <BlurView tint='dark' experimentalBlurMethod='dimezisBlurView' intensity={100} style={menu.blur} />
            <View style={menu.header}>
                <View style={menu.leftCount}>
                    <Image
                        style={[styles.openViewsIcon, { width: 22, height: 22 }]}
                        source={require('../../assets/icons/login/iconly-icon-export-1736392328.png')}
                    />
                    <Text style={[styles.numbers, { lineHeight: 22, marginLeft: 5 }]}>
                        {viewsCount.current} Views
                    </Text>
                </View>
                <TouchableButton onPress={() => deleteStory(deleteCallback)} style={menu.deleteIcon}>
                    <Image
                        style={[styles.openViewsIcon, { width: 22, height: 22 }]}
                        source={require('../../assets/icons/posts/delete-25-1692683663.png')}
                    />
                </TouchableButton>
                {/* <TouchableButton style={[menu.deleteIcon, { marginRight: 60 }]}>
                    <Image
                        style={[styles.openViewsIcon, { width: 22, height: 22 }]}
                        source={require('../../assets/icons/posts/send message-92-16584339032.png')}
                    />
                </TouchableButton> */}
            </View>
            {views?.length > 0 ?
                <FlatList
                    data={views}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={loading && hasMore ? <ActivityIndicator size="small" color={colors.mainColor} /> : null}
                    contentContainerStyle={menu.insetContainer}
                />
                : <Text style={menu.empty}>No viewers yet</Text>
            }
        </View>
    );
};


const menu = createStyles({
    leftCount: {
        flexDirection: 'row',
    },
    empty: {
        color: 'white',
        textAlign: 'center',
        opacity: 0.25,
        marginTop: 25
    },
    deleteIcon: {
        position: 'absolute',
        right: 0,
        marginRight: 15,
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center'
    },
    likeIcon: {
        tintColor: '#E0245E',
        width: 22,
        height: 22,
        position: 'absolute',
        marginRight: 35,
        resizeMode: 'contain',
        right: 0
    },
    insetContainer: {
        paddingHorizontal: 15,
        marginTop: 15,
        paddingBottom: 50
    },
    header: {
        height: 55,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255 / 0.1)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    viewerName: {
        fontWeight: 'bold',
        color: colors.mainColor,
        fontSize: 14,
        fontFamily: 'main'
    },
    viewTime: {
        color: colors.mainColor,
        position: 'absolute',
        right: 0,
        opacity: 0.5,
        fontSize: 12,
        fontFamily: 'main'
    },
    viewerImage: {
        height: 40,
        width: 40,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255 / 0.1)',
        marginRight: 15
    },
    viewer: {
        width: '100%',
        flexDirection: 'row',
        marginBottom: 20,
        alignItems: 'center'
    },
    blur: {
        flex: 1,
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(24 24 27 / 0.25)'
    },
    container: {
        flex: 1,
        height: 500,
        zIndex: 99
    }
})

const UserStoryFooter = ({ data, hooks }) => {

    return (
        <>
            <View style={styles.container}>
                <TouchableButton onPress={hooks.openMenu} style={styles.openViews}>
                    <Image style={styles.openViewsIcon} source={require('../../assets/icons/login/iconly-icon-export-1736392328.png')} />
                    <Text style={styles.numbers}>{data.views_count} Views</Text>
                </TouchableButton>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    openViewsIcon: {
        tintColor: 'white',
        width: 24,
        height: 24,
        marginRight: 5
    },
    numbers: {
        color: colors.mainColor
    },
    openViews: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        flex: 1,
        position: 'absolute',
        bottom: 0,
        margin: 'auto',
        marginBottom: 50,
        right: 0,
        left: 0,
    }
})

export default UserStoryFooter