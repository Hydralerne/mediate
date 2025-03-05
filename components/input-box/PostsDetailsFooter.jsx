import { StyleSheet, View, TextInput, Image, Text, Alert, Platform } from 'react-native'
import colors from '../../utils/colors'
import { useContext, useState, useEffect } from 'react'
import { UserContext } from '../../contexts/UserContext'
import InputFooter from './InputFooter'
import { sendReply } from '../../hooks/GlobalReply'
import createStyles from '../../utils/globalStyle'
import useTranslation from '../../hooks/useTranslation'
import TouchableButton from '../global/ButtonTap'

const PostsDetailsFooter = ({ data, id, renderReply = () => { } }) => {
    const { userData } = useContext(UserContext)
    const [replyText, setReplyText] = useState('')
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [inputHeight, setInputHeight] = useState(35);
    const [isAnon, setIsAnon] = useState(false)

    const t = useTranslation()

    const handleContentSizeChange = (event) => {
        // setInputHeight(event.nativeEvent.contentSize.height);
    };

    return (
        <View style={[styles.container, keyboardVisible && { marginBottom: 0 }]}>
            <View style={[styles.innerContainer]}>
                <View style={[styles.outsetMain, !keyboardVisible && { flexDirection: 'row', flex: 1 }, keyboardVisible && styles.keyboardOpened]}>
                    <View style={[styles.textOutContainer, !keyboardVisible && { marginBottom: Platform.OS == 'android' ? 25 : 10 }]}>
                        <Image source={{ uri: isAnon ? 'https://onvo.me/media/profile/user.jpg' : userData.data?.image }} style={[styles.imageAvatar, !keyboardVisible && Platform.OS == 'android' && { marginTop: 35 }]} />
                        <View style={[styles.gridUsers, !keyboardVisible && { display: 'none' }]}>
                            <Text style={styles.FullName}>{isAnon ? 'ONVO Guest' : userData.data?.fullname}</Text>
                            <Text style={styles.userName}>{isAnon ? 'anon_user' : '@'+userData.data?.username}</Text>
                        </View>
                        <TouchableButton onPress={() => sendReply({ setDisabled, setReplyText, replyText, id, post: data.thread_id, userData })} style={[styles.replyButton, !keyboardVisible && { display: 'none' }, replyText.length == 0 && { opacity: 0.25 }]} disabled={disabled || replyText.length == 0}>
                            <Text style={styles.replyText}>Reply</Text>
                        </TouchableButton>
                    </View>
                    <View style={[styles.mainField, !keyboardVisible && { flex: 1 }]}>
                        <TextInput
                            style={[styles.replyInput, !keyboardVisible && { marginLeft: 0 }, keyboardVisible && { height: Math.max(35, inputHeight) }]}
                            placeholder={t('profile.replys')}
                            placeholderTextColor={colors.placeholder}
                            onChangeText={setReplyText}
                            value={replyText}
                            multiline
                            onFocus={() => setKeyboardVisible(true)}
                            onBlur={() => setKeyboardVisible(false)}
                            maxLength={1000}
                            // onContentSizeChange={handleContentSizeChange}
                        />
                    </View>
                </View>
                <View style={!keyboardVisible && { display: 'none' }}>
                    <InputFooter
                        style={[styles.footer]}
                        replyText={replyText}
                        isAnon={isAnon}
                        setIsAnon={setIsAnon}
                    />
                </View>
            </View>
        </View>
    )
}

const styles = createStyles({
    imageAvatar: {
        width: 35,
        height: 35,
        borderRadius: 50
    },
    replyText: {
        color: '#fff',
        fontFamily: 'main'
    },
    footer: {
        borderTopWidth: 0
    },
    FullName: {
        color: colors.mainColor,
        fontFamily: 'main'
    },
    replyButton: {
        borderRadius: 50,
        height: 30,
        backgroundColor: colors.mainColor,
        marginLeft: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 15,
        backgroundColor: colors.main
    },
    userName: {
        color:colors.mainColor,
        opacity: 0.5,
        marginTop: 2,
        fontFamily: 'main'
    },
    textOutContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        marginBottom: 15,
        alignItems: 'center',
    },
    gridUsers: {
        marginLeft: 10
    },
    outsetMain: {
        width: '100%',
        marginBottom: 4
    },
    mainField: {
        height: 'auto',
        flexDirection: 'row',
    },
    replyInput: {
        backgroundColor: colors.lightBorder,
        borderRadius: 18,
        paddingHorizontal: 15,
        flex: 1,
        marginLeft: 10,
        height: 35,
        flexDirection: 'row',
        paddingTop: 8,
        color: colors.mainColor,
        bottom: 0,
        fontFamily: 'main'
    },
    innerContainer: {
        flex: 1,
    },
    container: {
        minHeight: Platform.OS == 'android' ? 40 : 60,
        height: 'auto',
        width: '100%',
        backgroundColor: colors.background,
        borderTopColor: colors.lightBorder,
        borderTopWidth: 1,
        marginBottom: 75,
        flexDirection: 'row',
        // position: 'absolute',
        bottom: 0,
        paddingTop: 10
    }
})

export default PostsDetailsFooter