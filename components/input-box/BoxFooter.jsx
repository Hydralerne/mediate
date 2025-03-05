
import {
    View,
    Text,
    StyleSheet,
    Image,
    SafeAreaView,
    Alert,
    Linking
} from 'react-native';

import colors from '../../utils/colors';
import MediaAttachScroller from './AttachMediaScroller'
import InputFooter from './InputFooter';
import createStyles from '../../utils/globalStyle';

const BoxFooter = ({ navigation, replyText, username, isAnon, setIsAnon }) => {
    const attachRouter = {
        draw: () => {
            navigation.push('BoardModal', {})
        },
        music: () => {
            navigation.navigate('MusicModal')
        },
        movies: () => {
            navigation.navigate('MoviesModal')
        },
        openBoard: () => {
            Linking.openURL(`https://onvo.me/${username}/draw`)
        }
    }

    return (
        <SafeAreaView>
            <View style={styles.footer}>
                <MediaAttachScroller onPress={attachRouter} />
                <InputFooter isAnon={isAnon} setIsAnon={setIsAnon} replyText={replyText} />
            </View>
        </SafeAreaView>
    )
}

const styles = createStyles({
    footer: {
        backgroundColor: colors.background
    }
});

export default BoxFooter