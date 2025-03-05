import React, { useRef, useState } from 'react'
import { StyleSheet, TouchableOpacity, View, Image, Text, ActivityIndicator, Alert, TextInput, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform } from 'react-native'
import StoriesBody from '../../components/stories/StoriesBody'
import StoriesHeader from '../../components/stories/StoriesHeader'
import { useContext, useEffect } from "react"
import { UserContext } from "../../contexts/UserContext"
import { useAnimatedStyle, useSharedValue } from "react-native-reanimated"
import { uploadImage } from '../../utils/calls/stories'
import UserStoryFooter from '../../components/stories/UserStoryFooter'
import { useStories } from '../../contexts/StoriesContext'
import createStyles from '../../utils/globalStyle'
import TouchableButton from '../../components/global/ButtonTap'
import { LinearGradient } from 'expo-linear-gradient'
import colors from '../../utils/colors'

const StoryAddPage = ({ data, isSelf, navigation, openProfile, hooks }) => {
    const width = useSharedValue(0)
    const { setSelf } = useStories()
    const [disabled, setDisabled] = useState(false)
    const [uploaded, setUploaded] = useState(false)
    const [isVisible, setKeyboardVisible] = useState(false)
    const text = useRef('')

    const callback = (data) => {
        if (data.progress) {
            width.value = data.progress
        }
    }

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => setKeyboardVisible(true)
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => setKeyboardVisible(false)
        );
        Keyboard.dismiss()
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    let cancelUpload = { current: () => { } }

    const closePage = () => {
        cancelUpload.current()
        navigation.goBack()
    }

    const handleUpload = async () => {
        setDisabled(true)
        const image = await uploadImage({ uri: data.compressedUri, callback, text })
        if (image.error) {
            Alert.alert(image.type, image.message, [
                {
                    text: 'ok'
                }
            ])
            setDisabled(false)
            return
        }
        setSelf(image)
        setUploaded(true)
    }

    const { userData } = useContext(UserContext)

    const animatedInnerIndicatorStyle = useAnimatedStyle(() => ({
        width: `${width.value}%`,
    }));

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <StoriesHeader
                    openProfile={openProfile}
                    closePage={closePage}
                    animatedInnerIndicatorStyle={animatedInnerIndicatorStyle}
                    data={{ user: userData.data, date: data.date }}
                />
                <StoriesBody prepare={true} data={{ media: data.compressedUri || data.media }} />
                {uploaded || isSelf ?
                    <UserStoryFooter hooks={hooks} openProfile={openProfile} closePage={closePage} data={data} />
                    :
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        style={[styles.imageUpload, isVisible && { marginBottom: 70 }]}
                    >
                        <View style={styles.linearBack}>
                            <LinearGradient
                                colors={['transparent', 'rgba(0, 0, 0, 0.75)']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 0, y: 1 }}
                                style={styles.gradient}
                            />
                        </View>
                        <TextInput
                            style={styles.replyInput}
                            placeholder="Type your caption"
                            placeholderTextColor="rgba(255,255,255 / 0.5)"
                            onChangeText={(value) => text.current = value}
                            numberOfLines={1}
                            color={colors.mainColor}
                        />
                        <TouchableButton disabled={disabled} onPress={handleUpload} activeOpacity={0.5} style={[styles.uploadButton]}>
                            <Text>Add Story</Text>
                            {disabled ? <View style={styles.loadingIndicator}><ActivityIndicator color={colors.background} /></View> : <Image style={styles.uploadIcon} source={require('../../assets/icons/profile/plus 2-10-1662493809.png')} />}
                        </TouchableButton>
                    </KeyboardAvoidingView>
                }
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = createStyles({
    loadingIndicator: {
        position: 'absolute',
        right: 0,
        marginRight: 15,
    },
    linearBack: {
        position: 'absolute',
        width: '100%',
        height: 150,
        zIndex: 0
    },
    gradient: {
        width: '100%',
        height: '100%',
    },
    replyInput: {
        flex: 1,
        textAlign: 'center',
        minHeight: 50
    },
    uploadIcon: {
        tintColor: colors.background,
        width: 24,
        height: 24,
        resizeMode: 'contain',
        right: 0,
        position: 'absolute',
        marginRight: 15
    },
    uploadButton: {
        width: '100%',
        height: 50,
        backgroundColor: colors.mainColor,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 20,
    },
    imageUpload: {
        position: 'absolute',
        bottom: 0,
        marginBottom: 50,
        width: '100%',
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: colors.background
    }
})

export default StoryAddPage