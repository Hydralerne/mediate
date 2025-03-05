import React, { useState, useRef, useEffect, memo, useCallback } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import SocialIcons from './SocialIcons';
import { useNavigation } from '@react-navigation/native';
import colors from '../../utils/colors';
import { sendFollow } from '../../utils/calls/follow';
import createStyles from '../../utils/globalStyle';
import { ShareButton } from '../draggable-menus/Share';
import useTranslation from '../../hooks/useTranslation';
import TouchableButton from '../global/ButtonTap';

const Header = ({ data, isSelf }) => {
    const [isFollowed, setIsFollowed] = useState(data.user?.followed)
    const [isDisabled, setIsDisabled] = useState(false)

    const t = useTranslation()

    const openFollow = (type) => {
        navigation.push('Followers', { id: data.user?.id, type, name: data?.user?.fullname })
    }

    useEffect(() => {
        if (data.user?.followed !== isFollowed) {
            setIsFollowed(data.user?.followed);
        }
    }, [data.user?.followed]);


    const handleFollow = () => {
        sendFollow({ id: data.user?.id, isDisabled, setIsDisabled, isFollowed, setIsFollowed })
    }

    const navigation = useNavigation()

    const sendMsg = () => {
        navigation.push('InboxModal', { data: data.user, isPost: isSelf })
    }
    const openSettings = async () => {
        navigation.navigate('SettingsModal', { modal: 'ProfileModal', data: data })
    }

    const sharePost = useCallback(() => {
        global.DraggableMenuController.open();
        global.DraggableMenuController.setChildren(() => <ShareButton data={data.user} type={'profile'} />);
    }, [data]);

    return (
        <>
            <View style={styles.container}>
                <View style={[styles.infoContainer]}>
                    <View style={styles.headerName}>
                        <Text style={styles.headerNameText}>{data.user?.fullname}</Text>
                        {data.user?.is_verified && (
                            <Image
                                style={styles.verifyIcon}
                                source={require('../../assets/icons/profile/check badge-2-1660219236.png')}
                            />
                        )}
                    </View>
                    <View style={styles.usernameContainer}>
                        <LinearGradient
                            colors={[colors.mainColor, 'transparent']}
                            start={{ x: 1, y: 0 }}
                            end={{ x: 0, y: 0 }}
                            style={[styles.gradientLine, { marginRight: 18 }]}
                        />
                        <Text style={styles.usernameText}>{'@' + data?.user?.username}</Text>
                        <LinearGradient
                            colors={['transparent', colors.mainColor]}
                            start={{ x: 1, y: 0 }}
                            end={{ x: 0, y: 0 }}
                            style={[styles.gradientLine, { marginLeft: 18 }]}
                        />
                    </View>
                    <Text
                        style={[
                            styles.bioText,
                            (!data?.user?.bio || data?.user?.bio?.length == 0) && { display: 'none' },
                        ]}
                    >
                        {data?.user?.bio}
                    </Text>
                    <View style={styles.followsContainer}>
                        <TouchableButton onPress={() => { openFollow('followers-list') }}>
                            <View style={styles.insetFollows}>
                                <Text style={styles.followsCount}>{data?.user?.cnt?.followers}</Text>
                                <Text style={styles.followsTitle}>{t('profile.header.followers')}</Text>
                            </View>
                        </TouchableButton>
                        <TouchableButton onPress={() => { openFollow('following-list') }}>
                            <View style={[styles.insetFollows, { marginLeft: 15 }]}>
                                <Text style={styles.followsCount}>{data?.user?.cnt?.following}</Text>
                                <Text style={styles.followsTitle}>{t('profile.header.following')}</Text>
                            </View>
                        </TouchableButton>
                    </View>
                    <SocialIcons data={data?.user?.links} />
                </View>
                <View style={styles.sendingContainer}>
                    <TouchableButton activeOpacity={0.8} onPress={sendMsg} style={styles.askButton}>
                        <Image
                            source={isSelf ? require('../../assets/icons/posts/pen-414-1658238246.png') : require('../../assets/icons/profile/email send-29-1659689482.png')}
                            style={styles.sendIcon}
                        />
                        <Text style={styles.sendText}>{isSelf ? t('profile.header.post') : t('profile.header.ask')}</Text>
                    </TouchableButton>
                    {isSelf ?
                        <>
                            <TouchableButton onPress={sharePost} style={[styles.settingsButton, styles.marianButton]}>
                                <Image
                                    source={require('../../assets/icons/posts/Share_uW5tAxkk9km3moG6kJ9dM875oyD8p7Of2RF8.png')}
                                    style={[styles.settingsIcon, styles.marianIcon]}
                                />
                            </TouchableButton>
                            <TouchableButton onPress={openSettings} style={styles.settingsButton}>
                                <Image
                                    source={require('../../assets/icons/home/setting-40-1662364403.png')}
                                    style={[styles.settingsIcon, { tintColor: colors.background }]}
                                />
                            </TouchableButton>
                        </>
                        : <TouchableButton activeOpacity={0.8} style={[styles.followButton, isFollowed && styles.doesFollowed, isDisabled && { opacity: 0.5, backgroundColor: 'transparent' }]} onPress={handleFollow}>
                            <Text style={[styles.followText, isFollowed && styles.doesFollowedText]}>{isFollowed ? t('profile.header.followed') : t('profile.header.follow')}</Text>
                        </TouchableButton>
                    }
                </View>
            </View>
        </>
    );
};

const styles = createStyles({
    marianIcon: {
        tintColor: colors.mainColor,
        width: 20,
        height: 20
    },
    settingsButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 45,
        height: 45,
        backgroundColor: colors.mainColor,
        borderRadius: 50,
        zIndex: 9
    },
    marianButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.lightBorderMixed,
        marginRight: 15
    },
    settingsIcon: {
        width: 24,
        height: 24,

    },
    doesFollowedText: {
        color: colors.mainColor
    },
    doesFollowed: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.border
    },
    sendIcon: {
        tintColor: colors.mainColor,
        width: 24,
        height: 24,
    },
    sendText: {
        color: colors.mainColor,
        fontSize: 14,
        marginLeft: 10,
        fontFamily: 'main'
    },
    askButton: {
        flex: 1,
        backgroundColor: colors.askButton,
        marginRight: 15,
        flexDirection: 'row',
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    followText: {
        color: colors.background,
    },
    followButton: {
        width: 90,
        backgroundColor: colors.mainColor,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
    },
    sendingContainer: {
        height: 45,
        flexDirection: 'row',
        width: '100%',
        marginTop: 20,
        paddingHorizontal: 20,
    },
    followsContainer: {
        flexDirection: 'row',
        marginTop: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dimBackground: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1,
    },
    insetFollows: {
        flexDirection: 'row',
    },
    followsCount: {
        color: colors.mainColor,
        fontWeight: '500',
        fontFamily: 'main'
    },
    followsTitle: {
        color: colors.mainColor,
        opacity: 0.5,
        marginLeft: 5,
    },
    bioText: {
        color: colors.mainColor,
        textAlign: 'center',
        marginTop: 12,
        fontSize: 14,
        lineHeight: 18,
        paddingHorizontal: 20,
        fontFamily: 'main'
    },
    usernameContainer: {
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '88%',
        opacity: 0.5,
    },
    gradientLine: {
        height: 0.5,
        width: '50%',
        opacity: 0.5,
    },
    usernameWings: {
        height: 1,
        width: '50%',
        opacity: 0.5,
    },
    usernameText: {
        color: colors.mainColor,
        fontSize: 14,
        fontFamily: 'main'
    },
    verifyIcon: {
        tintColor: colors.verifyIcon,
        resizeMode: 'contain',
        width: 22,
        height: 22,
        marginLeft: 4,
    },
    headerNameText: {
        color: colors.mainColor,
        fontWeight: 'bold',
        fontSize: 20,
        lineHeight: 24,
        fontFamily: 'main'
    },
    headerName: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 115,
    },
    innerBackContainer: {
        zIndex: 0,
    },
    imageBack: {
        width: 100,
        height: 100,
    },
    container: {
        width: '100%',
        flex: 0,
        top: 0,
        paddingBottom: 15,
    },
    infoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        top: 0,
        marginTop: 85,
        zIndex: 9,
    },
});

export default memo(Header);