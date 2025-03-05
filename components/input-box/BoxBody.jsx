
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Image,
    ScrollView
} from 'react-native';
import MediaRender from '../posts/MediaRender';
import colors from '../../utils/colors';
import createStyles from '../../utils/globalStyle';
import useTranslation from '../../hooks/useTranslation';
import TouchableButton from '../global/ButtonTap';

const BoxBody = ({ media, setReplyText, replyText, setMedia, userData, isPost, isAnon, setIsAnon }) => {
    const t = useTranslation()
    return (
        <ScrollView style={styles.content}>
            <View style={styles.messageThread}>
                <View style={styles.replySection}>
                    {!isAnon ? <Image
                        source={{ uri: userData?.data?.image }}
                        style={styles.userImage}
                    /> :
                        <Image
                            source={{ uri: 'https://onvo.me/media/profile/user.jpg' }}
                            style={styles.userImage}
                        />}
                    <View style={styles.replyInputContainer}>
                        <TextInput
                            style={styles.replyInput}
                            placeholder={isPost ? t('profile.box.postHolder') : t('profile.box.holder')}
                            placeholderTextColor={colors.placeholder}
                            onChangeText={setReplyText}
                            multiline
                            value={replyText}
                            maxLength={1000}
                            autoFocus
                        />
                    </View>
                </View>
                {media && media?.data ? <View style={styles.mediaContainer}>
                    <MediaRender type={media?.type} content={media?.data} layout='inbox' />
                    <TouchableButton style={styles.removeMedia} onPress={() => setMedia(null)}>
                        <Image source={require('../../assets/icons/profile/remove circle-99-1658234612.png')} style={styles.removeMediaIcon} />
                        <Text style={styles.removeMediaText}>Remove media</Text>
                    </TouchableButton>
                </View> : ''}
            </View>
        </ScrollView>
    )
}

const styles = createStyles({
    content: {
        flex: 1,
        padding: 16,
        paddingTop: 120,
    },

    messageThread: {
        flex: 1,
        paddingBottom: 200
    },

    replySection: {
        flexDirection: 'row',
        flex: 1,
    },

    userImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
        backgroundColor: colors.loader.image,
    },

    replyInputContainer: {
        flex: 1,
        marginTop: 10,
        marginLeft: 2,
        fontFamily: 'main'
    },

    replyInput: {
        color: colors.mainColor,
        fontSize: 16,
        padding: 0,
        textAlignVertical: 'top',
    },

    mediaContainer: {
        marginLeft: 50,
        flex: 1,
        marginTop: 20
    },

    removeMedia: {
        flexDirection: 'row',
        marginTop: 15,
        alignItems: 'center',
        opacity: 0.5
    },

    removeMediaIcon: {
        tintColor: colors.mainColor,
        width: 24,
        height: 24
    },

    removeMediaText: {
        color: colors.mainColor,
        marginLeft: 8,
        lineHeight: 20,
        fontFamily: 'main'
    },
});

export default BoxBody