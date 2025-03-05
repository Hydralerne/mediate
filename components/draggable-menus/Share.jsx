import React, { memo, useState } from 'react';
import { Image, StyleSheet, Text, View, Linking, Alert, Platform } from 'react-native';
import { generatePostShare } from '../../scripts/share';
import colors from '../../utils/colors';
import * as Clipboard from 'expo-clipboard';
import TouchableButton from '../global/ButtonTap';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
// import Share from 'react-native-share';
import createStyles from '../../utils/globalStyle';
import * as FileSystem from 'expo-file-system';
import { request } from '../../utils/requests';
import { getToken } from '../../utils/token';
import { useData } from '../../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';

const ProfileWidget = () => {
    const { userData } = useData()
    const image = userData?.data?.image?.replace('/profile/', '/profile_frame/')
    const navigation = useNavigation()
    const handleChange = () => {
        global.DraggableMenuController.close()
        navigation.navigate('IDStack')
    }

    return (
        <View style={widgetStyle.container}>
            <View style={widgetStyle.imageContainer}>
                <Image source={{ uri: image }} style={widgetStyle.profileImage} />
                <Text style={widgetStyle.profileDescroiption}>This profile frame appears in the preview when sharing your profile link</Text>
                <TouchableButton style={widgetStyle.customize} onPress={handleChange}>
                    <Text style={widgetStyle.customizeText}>Change</Text>
                </TouchableButton>
            </View>
        </View>
    )
}

const widgetStyle = StyleSheet.create({
    iconProf: {
        tintColor: colors.mainColor,
        width: 20,
        height: 20
    },
    profileDescroiption: {
        color: colors.mainSecound,
        fontSize: 12,
        marginLeft: 95,
        marginRight: 100,
    },
    container: {
        width: '100%',
        borderBottomColor: colors.lightBorder,
        borderBottomWidth: 1,
        paddingTop: 20,
    },
    customizeText: {
        color: colors.mainColor,
        fontFamily: 'main',
    },
    customize: {
        backgroundColor: colors.lightBorder,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        paddingHorizontal: 15,
        marginLeft: 'auto',
        position: 'absolute',
        right: 0,
        width: 80
    },
    imageContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        borderRadius: 15,
        minHeight: 80,
        overflow: 'hidden',
        alignItems: 'center'
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 15,
        backgroundColor: colors.lightBorder,
        position: 'absolute'
    }
})

export const ShareButton = memo(({ type, data = {}, shareHood: func = () => { return {} } }) => {

    const [loading, setLoading] = useState(false)

    const shareToInstagram = async () => {
        setLoading(true)
        try {
            if (Platform.OS === 'android') {
                const { isInstalled } = await Share.isPackageInstalled('com.instagram.android');
                if (!isInstalled) {
                    Alert.alert('Error', 'Instagram is not installed on this device.');
                    return;
                }
            }

            const imageResponse = await request('https://api.onvo.me/v2/share', { type, id: data?.id }, 'POST', {
                Authorization: `Bearer ${await getToken()}`
            });

            const imageUrl = imageResponse.url;
            if (!imageUrl) throw new Error('Invalid image URL');

            const { dirs } = RNFetchBlob.fs;
            const filePath = `${dirs.CacheDir}/image_to_share.jpg`;

            const response = await RNFetchBlob.config({
                fileCache: true,
                path: filePath,
            }).fetch('GET', imageUrl);

            if (!response.path()) throw new Error('Failed to download image');

            const options = {
                social: Share.Social.INSTAGRAM_STORIES,
                backgroundImage: `file://${response.path()}`,
                appId: '1495508034465138',
            };

            await Share.shareSingle(options);

        } catch (error) {
            console.error('Error sharing to Instagram:', error);
        }
        setLoading(false)
    };

    const shareToSnap = () => {
        setLoading(true)
    }

    const shareHood = func()

    let text = '', url = ''

    if (type == 'profile') {
        url = 'https://onvo.me/' + data.username
        text = `Recommend, suggest or ask ${data.isSelf ? 'me' : data.fullname} on ONVO`
    }

    if (type == 'post') {
        const user = data.type == 'post' ? shareHood?.user : data.sender.username
        const urlBody = `https://onvo.me/${user?.replace('@', '')}/msg/${data.id}`
        let ask = data.type == 'post' ? data.text : shareHood.text
        if (data.media_type == 'draw') {
            ask = 'Draw sent by ' + data.sender?.fullname
        } else if (data.media_type == 'music') {
            ask = 'Track sent by ' + data.sender?.fullname
        } else if (data.media_type == 'movie') {
            ask = 'Movie sent by ' + data.sender?.fullname
        }
        const props = generatePostShare(urlBody, ask, data.type == 'post' ? shareHood.text : data.text)
        text = props.text
        url = props.url
    }

    const social = [
        {
            title: 'Twitter', icon: require('../../assets/icons/share/x.png'), type: 'x',
            handlePress: async () => {
                const link = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text) + '%0A' + encodeURIComponent(url);
                Linking.openURL(link).catch((err) => {
                    console.error('Error opening URL:', err);
                });
                global.DraggableMenuController.close()
            }
        },
        {
            title: 'Facebook', icon: require('../../assets/icons/share/facebook.png'),
            handlePress: async () => {
                const link = 'http://www.facebook.com/sharer.php?u=' + encodeURIComponent(url);
                Linking.openURL(link).catch((err) => {
                    console.error('Error opening URL:', err);
                });
                global.DraggableMenuController.close()
            }
        },
        {
            title: 'Whatsapp', icon: require('../../assets/icons/share/whatsapp.png'),
            handlePress: async () => {
                const link = 'whatsapp://send?text=' + encodeURIComponent(text) + '%0A' + encodeURIComponent(url);
                Linking.openURL(link).catch((err) => {
                    console.error('Error opening URL:', err);
                });
                global.DraggableMenuController.close()
            }
        },
        {
            title: 'Reddit', icon: require('../../assets/icons/share/reddit.png'),
            handlePress: async () => {
                const link = 'https://www.reddit.com/submit?title=' + encodeURIComponent(text) + '&url=' + encodeURIComponent(url);
                Linking.openURL(link).catch((err) => {
                    console.error('Error opening URL:', err);
                });
                global.DraggableMenuController.close()
            }
        },
        {
            title: 'Instagram', icon: require('../../assets/icons/share/insta.png'),
            handlePress: shareToInstagram
        },
        {
            title: 'Linked In', icon: require('../../assets/icons/share/linkedin.png'),
            handlePress: async () => {
                const link = 'http://www.linkedin.com/shareArticle?mini=true&url=' + encodeURIComponent(url);
                Linking.openURL(link).catch((err) => {
                    console.error('Error opening URL:', err);
                });
                global.DraggableMenuController.close()
            }
        },
        {
            title: 'Snapchat', icon: require('../../assets/icons/share/snap.png'),
            handlePress: shareToSnap
        },
        {
            title: 'Copy link', icon: require('../../assets/icons/posts/link-57-1663582874.png'), iconType: 'png',
            handlePress: async () => {
                await Clipboard.setStringAsync(url);
                global.DraggableMenuController.close()
            }
        }
    ];

    return (
        <View style={styles.shareContainer}>
            <Text style={styles.containerHeader}>{type == 'profile' ? `Share Profile` : 'Share post'}</Text>
            <ProfileWidget isSelf={data.isSelf} data={data} />
            <View style={styles.buttonsContainer}>
                {social.map((item, index) => {
                    return (
                        <TouchableButton
                            disabled={loading}
                            style={styles.button}
                            key={index}
                            onPress={item.handlePress}
                        >
                            <View style={[styles.iconContainer, item.iconType == 'png' && styles.pngButton]}>
                                <Image source={item.icon} style={[styles.icon, item.iconType == 'png' && styles.pngIcon]} />
                            </View>
                            <Text style={styles.buttonText}>{item.title}</Text>
                        </TouchableButton>
                    );
                })}
            </View>
        </View>
    );
})

const styles = createStyles({
    buttonsContainer: {
        flexDirection: 'row',
        width: '100%',
        flexWrap: 'wrap',
        paddingVertical: 20,
        justifyContent: 'center',
        marginLeft: 10

    },
    containerHeader: {
        color: colors.mainColor,
        textAlign: 'center',
        width: '100%',
        fontSize: 18,
        lineHeight: 26
    },
    shareContainer: {
        paddingHorizontal: 20,
        paddingBottom: 35,
        zIndex: 99
    },
    buttonText: {
        color: colors.mainColor,
        position: 'absolute',
        top: 0,
        marginTop: 65,
        width: '150%',
        textAlign: 'center',
        fontFamily: 'main'
    },
    button: {
        justifyContent: 'center',
        width: 50,
        marginRight: 35,
        alignItems: 'center',
        marginBottom: 60,
    },
    icon: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        resizeMode: 'cover',
        borderWidth: 1,
        borderColor: colors.lightBorder,
        borderRadius: 50,
        overflow: 'hidden'
    },
    pngButton: {
        borderColor: colors.lightBorder,
        borderWidth: 1,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        height: 50,
    },
    pngIcon: {
        tintColor: colors.mainColor,
        width: 30,
        height: 30,
        borderWidth: 0,
        opacity: 0.75
    }
})
