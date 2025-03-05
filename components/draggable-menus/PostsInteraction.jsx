import { memo, useEffect, useMemo } from 'react'
import { Dimensions, Platform, StyleSheet, View } from 'react-native'
import colors from '../../utils/colors'
import { useSharedValue, ZoomIn } from 'react-native-reanimated'
const { height } = Dimensions.get('window')
import { useTabs } from '../../hooks/useTabs'
import TabBar from '../global/TabBar'
import TabView from '../global/TabView'
import UsersBody from '../users/UsersBody';
import createStyles from '../../utils/globalStyle'

const PostInteractions = ({ threadId, isRepost, id }) => {
    const swipeX = useSharedValue(isRepost ? width : 0);

    useEffect(() => {
        global.DraggableMenuController.style(styles.menu)
        global.DraggableMenuController.scroller(true)
    }, [])

    const { loadedTabs, onTabChange } = useTabs(
        !isRepost,
        isRepost
    );

    const tabs = useMemo(() => [
        {
            title: 'Likes',
            body: loadedTabs.followers && <UsersBody isMenu={true} id={id} endpoint={`posts/${id}/likes`} offsetX={10} />,
            onTap: () => {onTabChange(0)}
        },
        {
            title: 'Reposts',
            body: loadedTabs.following && <UsersBody isMenu={true} id={threadId} endpoint={`posts/${threadId}/reposts`} offsetX={10} />,
            onTap: () => {onTabChange(1)}

        }
    ], [loadedTabs, id]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TabBar
                    onTabChange={onTabChange}
                    tabs={tabs}
                    swipeX={swipeX}
                    style={styles.tabBar}
                />
            </View>
            <TabView
                height={height * 0.7}
                initialTab={isRepost ? 1 : 0}
                swipeX={swipeX}
                tabs={tabs}
                onTabChange={onTabChange}
            />
        </View>
    )
}

const styles = createStyles({
    tabBar: {
        height: 55
    },
    container: {
        height: Platform.OS == 'android' ?  height * 0.85 : height * 0.75,
        zIndex: 99
    },
    menu: {
        backgroundColor: colors.background
    }
})

export default memo(PostInteractions)