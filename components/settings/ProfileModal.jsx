import { StyleSheet, Text, Image, View, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native'
import { useContext, useRef, useState } from 'react'
import colors from '../../utils/colors'
import TouchableButton from '../../components/global/ButtonTap';
import ModalBody from './ModalBody'
import { generateIcons } from '../profile/SocialIcons';
import DraggableMenu from '../global/draggableMenu';
import ProfileLinks from '../draggable-menus/ProfileLinks';
import { request } from '../../utils/requests';
import { getToken } from '../../utils/token';
import useTranslation from '../../hooks/useTranslation';
import { uploadProfileImage } from '../../utils/calls/settings';
import ImagePicker from 'react-native-image-crop-picker';
import createStyles from '../../utils/globalStyle';
import { UserContext } from '../../contexts/UserContext';

const ProfileInput = ({ value, onChangeText, placeholder, style, text, numberOfLines, multiline }) => {
    return (
        <View style={[styles.inputContainer, style]}>
            <Text style={styles.sectoinText}>{text}</Text>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.placeholder}
                style={styles.textInput}
                multiline={multiline}
                numberOfLines={numberOfLines}
            />
        </View>
    )
}

const LinkProfile = ({ data, onUpdate, onRemove }) => {
    const { image } = generateIcons(data.type);
    const [value, setValue] = useState(data.url);

    const handleChange = (newValue) => {
        setValue(newValue);
        onUpdate(data.type, newValue);
    };

    return (
        <View style={styles.linkContainer}>
            <Image source={image} style={styles.socialIcon} />
            <TextInput
                value={value}
                onChangeText={handleChange}
                placeholder={'Add link'}
                placeholderTextColor={colors.placeholder}
                style={styles.linksInput}
            />
            <TouchableButton onPress={() => onRemove(data.type)} style={styles.removeButton}>
                <Image style={styles.removeIcon} source={require('../../assets/icons/settings/minus 2-6-1662493809.png')} />
            </TouchableButton>
        </View>
    );
};

const hooks = {}

const ProfileModal = ({ route, navigation }) => {
    const { data } = route.params

    const { fetchUserData } = useContext(UserContext)

    const t = useTranslation()

    const initialFullname = data.user.fullname;
    const initialNickname = data.user.firstname;
    const initialBio = data.user.bio;
    const initialImage = data.user?.image?.replace('/profile/', '/profile_large/');
    const initialLinks = data.links || [];

    const [imagePath, setImage] = useState(initialImage)
    const [fullname, setFullname] = useState(initialFullname);
    const [nickname, setNickname] = useState(initialNickname);
    const [bio, setBio] = useState(initialBio);
    const [links, setLinks] = useState(initialLinks);
    const [loading, setLoading] = useState(false)

    const changes = useRef({
        image: false,
        fullname: false,
        firstname: false,
        bio: false,
        links: false,
    });

    const handleChange = (value, setValue, field) => {
        setValue(value);
        if (field === 'fullname') {
            changes.current.fullname = value !== initialFullname;
        } else if (field === 'firstname') {
            changes.current.firstname = value !== initialNickname;
        } else if (field === 'bio') {
            changes.current.bio = value !== initialBio;
        }
    };

    const pickAndCropImage = async () => {
        try {
            const result = await ImagePicker.openPicker({
                mediaTypes: "photo",
            });

            if (result) {
                const croppedImage = await ImagePicker.openCropper({
                    path: result.path,
                    width: 400,
                    height: 400,
                    cropping: true,
                    cropperCircleOverlay: true,
                });
                setImage(croppedImage.path);
                changes.current.image = true
            }
        } catch (error) {
            console.log("Image picking error:", error);
        }
    };

    const callback = (code) => {
        hooks.close()
        setLinks([...links, { type: code }])
        const linksChanged = JSON.stringify(links) !== JSON.stringify(initialLinks);
        changes.current.links = linksChanged;
    }

    const updateLink = (type, newUrl) => {
        setLinks((prevLinks) =>
            prevLinks.map(link =>
                link.type === type ? { ...link, url: newUrl } : link
            )
        );
        changes.current.links = true;
    };

    const removeLink = (type) => {
        setLinks((prevLinks) => prevLinks.filter(link => link.type !== type));
        changes.current.links = true;
    };

    const addLink = () => {
        hooks.open()
        hooks.setChildren(
            <ProfileLinks
                links={links}
                callback={callback}
            />
        )
    }

    const submitChange = async () => {
        if (loading) return

        setLoading(true)

        const payload = {}

        if (changes.current.fullname) {
            payload.fullname = fullname
        }

        if (changes.current.firstname) {
            payload.firstname = nickname
        }

        if (changes.current.bio) {
            payload.bio = bio
        }

        if (changes.current.links) {
            payload.links = links
        }

        if (changes.current.image) {
            const image = await uploadProfileImage(imagePath, (progress) => {
            })
            payload.image = image.url
        }

        const response = await request('https://api.onvo.me/v2/settings/update_info', payload, 'POST', {
            Authorization: `Bearer ${await getToken()}`
        })

        setLoading(false)

        if (response.error) {
            Alert.alert(response.type || 'Error occured', response.message || 'Error happend while updateing info, please try again later')
        }
        if (response.status == 'success') {
            navigation.goBack()
            fetchUserData()
        }
    }

    return (
        <ModalBody
            navigation={navigation}
            title={t('settings.profile.header')}
            contextIcon={(
                <TouchableButton style={styles.saveButton} onPress={submitChange}>
                    {loading ? <ActivityIndicator size={'small'} color={colors.mainColor} /> : <Text style={styles.buttonText}>{t('settings.profile.buttons.save')}</Text>}
                </TouchableButton>
            )}
        >
            <ScrollView style={styles.container}>
                <TouchableButton onPress={pickAndCropImage}>
                    <View style={styles.profileImageContainer}>
                        <Image style={styles.changeImageIcon} source={require('../../assets/icons/settings/image plus-45-1658434699.png')} />
                        <View style={styles.overlay} />
                        <Image style={styles.profileImage} source={{ uri: imagePath }} />
                    </View>
                </TouchableButton>
                <View style={styles.inputsBody}>
                    <ProfileInput
                        value={fullname}
                        onChangeText={(value) => handleChange(value, setFullname, 'fullname')}
                        placeholder={t('settings.profile.placeholders.name')}
                        text={t('settings.profile.titles.name')}
                    />
                    <ProfileInput
                        value={nickname}
                        onChangeText={(value) => handleChange(value, setNickname, 'firstname')}
                        placeholder={t('settings.profile.placeholders.nickname')}
                        text={t('settings.profile.titles.nickname')}
                    />
                    <ProfileInput
                        value={bio}
                        onChangeText={(value) => handleChange(value, setBio, 'bio')}
                        placeholder={t('settings.profile.placeholders.bio')}
                        text={t('settings.profile.titles.bio')}
                        style={styles.bio}
                        multiline={true}
                        numberOfLines={5}
                    />
                    <View style={styles.links}>
                        <Text style={styles.sectoinText}>{t('settings.profile.titles.links')}</Text>
                        <View style={styles.linksList}>
                            {links?.map(link =>
                                <LinkProfile key={link.type} data={link} onUpdate={updateLink} onRemove={removeLink} />
                            )}
                            <TouchableButton style={styles.addMore} onPress={addLink}>
                                <Image style={styles.addIcon} source={require('../../assets/icons/home/plus 4-12-1662493809.png')} />
                                <Text style={styles.addText}>{t('settings.profile.buttons.addLinks')}</Text>
                            </TouchableButton>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <DraggableMenu
                hooks={hooks}
            />
        </ModalBody>
    )
}

const styles = createStyles({
    socialIcon: {
        tintColor: colors.main,
        width: 22,
        height: 22,
    },
    removeButton: {
        width: 30,
        height: 30,
        position: 'absolute',
        right: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    removeIcon: {
        tintColor: colors.mainSecound,
        width: 22,
        height: 22,
        right: 0,
        position: 'absolute'
    },
    addMore: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10
    },
    addText: {
        color: colors.mainSecound
    },
    addIcon: {
        width: 24,
        height: 24,
        marginRight: 5,
        tintColor: colors.mainSecound
    },
    linksInput: {
        color: colors.main,
        marginLeft: 10,
        marginRight: 60
    },
    linksList: {
        marginLeft: 105,
        marginRight: 10,
        paddingTop: 5
    },
    linkContainer: {
        flexDirection: 'row',
        flex: 1,
        height: 45,
        alignItems: 'center'
    },
    bio: { minHeight: 100, paddingTop: 10, borderBottomWidth: 1, borderBottomColor: colors.posts.threadBorder },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 100
    },
    saveButton: {
        position: 'absolute',
        right: 0,
        width: 50,
        height: 50,
        marginRight: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: colors.mainColor,
        fontSize: 16
    },
    textInput: {
        color: colors.main,
        marginLeft: 90,
        flex: 1
    },
    sectoinText: {
        color: colors.mainColor,
        position: 'absolute',
        marginLeft: 20,
        marginTop: 15
    },
    inputsBody: {
        marginTop: 50,
    },
    inputContainer: {
        flexDirection: 'row',
        flex: 1,
        width: '100%',
        paddingHorizontal: 20,
        borderTopColor: colors.posts.threadBorder,
        borderTopWidth: 1,
        paddingVertical: 15
        // alignItems: 'center'
    },
    overlay: {
        width: 100,
        height: 100,
        position: 'absolute',
        backgroundColor: `rgba(${colors.blackRGB},${colors.blackRGB},${colors.blackRGB} / 0.5)`,
        zIndex: 9,
        borderRadius: 50,
    },
    changeImageIcon: {
        tintColor: colors.mainColor,
        position: 'absolute',
        width: 40,
        height: 40,
        zIndex: 99
    },
    profileImageContainer: {
        width: 120,
        height: 120,
        borderWidth: 1,
        borderColor: colors.mainMedium,
        borderRadius: 100,
        right: 0,
        left: 0,
        margin: 'auto',
        marginTop: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        minHeight: 50
    },
    innerHeader: {
        marginTop: 0,
        paddingBottom: 40
    },
})

export default ProfileModal