import React from 'react';
import {
    View,
    StyleSheet
} from 'react-native';
import PostsBody from '../../components/posts/PostsFetch';
import PagesHeader from '../../components/global/PagesHeader';
import createStyles from '../../utils/globalStyle';
import colors from '../../utils/colors';


const BookmarkScreen = ({ route }) => {
    return (
        <View style={styles.container}>
            <PagesHeader
                title={'Bookmarks'}
            />
            <PostsBody
                offset={100}
                endpoint={`posts/bookmarks`}
                tracking={false}
            />
        </View>
    )
};

const styles = createStyles({
    container: {
        flex: 1,
        backgroundColor: colors.background
    }
})

export default BookmarkScreen;
