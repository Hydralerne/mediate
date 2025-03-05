import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, Platform, Alert, Linking } from 'react-native';
import { UserContext } from '../../contexts/UserContext';
import Logo from '../global/Logo';
import LogoWord from '../global/LogoWord';
import colors from '../../utils/colors';
import { useNavigationContext } from '../../contexts/NavigationContext';
import { useNavigation } from '@react-navigation/native';
import { logout as logoutCall } from '../../utils/calls/auth'
import createStyles from '../../utils/globalStyle';
import useTranslation from '../../hooks/useTranslation'
import TouchableButton from '../global/ButtonTap';

const LeftMenu = ({ closeMenu, width }) => {
    const { userData, logout } = useContext(UserContext);
    const { navigateInCurrentTab } = useNavigationContext();
    const t = useTranslation();

    const navigation = useNavigation()
    const goProfile = async () => {
        await closeMenu()
        navigateInCurrentTab('ProfilePage', { id: userData.data.id, data: userData.data });
    }

    const goToBookmarks = async () => {
        try {
            await closeMenu();
            navigateInCurrentTab('Bookmarks', { id: userData.data.id });
        } catch (e) {
            console.log(e)
        }
    }


    const handleLogout = async () => {
        Alert.alert(
            t('leftMenu.alerts.logout.title'),
            t('leftMenu.alerts.logout.message'),
            [
                {
                    text: t('leftMenu.alerts.logout.cancel'),
                    style: "cancel",
                    onPress: () => {

                    }
                },
                {
                    text: t('leftMenu.alerts.logout.confirm'),
                    onPress: async () => {
                        await logoutCall(() => { }, t)
                        logout()
                    }
                }
            ],
            {
                cancelable: true
            }
        );
    }

    const openPlus = () => {
        Alert.alert(t('leftMenu.alerts.soon.title'), t('leftMenu.alerts.soon.plusMessage'))
    }

    const openThemes = () => {
        Alert.alert(t('leftMenu.alerts.soon.title'), t('leftMenu.alerts.soon.themesMessage'))
    }

    const openID = async () => {
        await closeMenu()
        navigation.navigate('IDStack')
    }

    const openSupport = async () => {
        await closeMenu()
        Linking.openURL('https://x.com/onvo_me').catch((err) => {
            console.error('Error opening URL:', err);
        });
    }

    const openSettings = async () => {
        await closeMenu()
        navigation.navigate('Settings')
    }
    
    const openPolicy = async () => {
        await closeMenu()
        navigation.navigate('Browser', { title: t('leftMenu.labels.policy'), url: 'https://onvo.me/privacy?theme=dark' })
    }

    return (
        <View style={[styles.mainContainer, {
            transform: [{ translateX: -width }],
            width: width
        }]}>
            <View style={styles.logoWrapper}>
                <Logo style={styles.logo} width="70px" height="100px" color={colors.mainColor} />
                <LogoWord style={{ marginLeft: -7 }} width="80px" height="100px" color={colors.mainColor} />
            </View>
            <View style={styles.MenuSectionView}>
                <TouchableButton style={styles.buttonMenu} onPress={goProfile}>
                    <Image source={require('../../assets/icons/posts/user-233-1658436042.png')}
                        style={styles.iconButtonMenu} />
                    <Text style={styles.textButtonMenu}>{t('leftMenu.labels.profile')}</Text>
                </TouchableButton>
                <TouchableButton style={styles.buttonMenu} onPress={openID}>
                    <Image source={require('../../assets/icons/home/scan-75-1662819929.png')}
                        style={styles.iconButtonMenu} />
                    <Text style={styles.textButtonMenu}>{t('leftMenu.labels.webId')}</Text>
                </TouchableButton>
                <TouchableButton onPress={openPlus} style={styles.buttonMenu}>
                    <Image source={require('../../assets/icons/posts/king-85-1658434754.png')}
                        style={styles.iconButtonMenu} />
                    <Text style={styles.textButtonMenu}>{t('leftMenu.labels.plus')}</Text>
                </TouchableButton>
                <TouchableButton style={styles.buttonMenu} onPress={goToBookmarks}>
                    <Image source={require('../../assets/icons/posts/bookmark-83-1658235288.png')}
                        style={styles.iconButtonMenu} />
                    <Text style={styles.textButtonMenu}>{t('leftMenu.labels.bookmarks')}</Text>
                </TouchableButton>
                <TouchableButton style={styles.buttonMenu} onPress={openSettings}>
                    <Image source={require('../../assets/icons/posts/setting-40-1662364403.png')}
                        style={styles.iconButtonMenu} />
                    <Text style={styles.textButtonMenu}>{t('leftMenu.labels.settings')}</Text>
                </TouchableButton>
                <TouchableButton style={styles.buttonMenu} onPress={openPolicy}>
                    <Image source={require('../../assets/icons/posts/shield-124-1691989601.png')}
                        style={styles.iconButtonMenu} />
                    <Text style={styles.textButtonMenu}>{t('leftMenu.labels.policy')}</Text>
                </TouchableButton>
                <TouchableButton onPress={openSupport} style={styles.buttonMenu}>
                    <Image source={require('../../assets/icons/posts/headphone-24-1663753435.png')}
                        style={styles.iconButtonMenu} />
                    <Text style={styles.textButtonMenu}>{t('leftMenu.labels.support')}</Text>
                </TouchableButton>
            </View>
            <View style={styles.userInfo}>
                <Image
                    style={styles.userMenuImage}
                    source={{ uri: userData?.data?.image }} />
                <View style={styles.gridInfo}>
                    <Text style={styles.MenuHeaderText}>{userData?.data?.fullname}</Text>
                    <Text style={[styles.MenuHeaderText, styles.MenuUsername]}>@{userData?.data?.username}</Text>
                </View>
                <TouchableButton onPress={handleLogout} style={styles.MoreMenu}>
                    <Image source={require('../../assets/icons/login/Log_out__PPDK99c2EKazCjjkhWSQswT09qaLfw1Ic2Lq.png')}
                        style={[styles.MoreMenuIcon]} />
                </TouchableButton>
            </View>
        </View>
    )
}

const styles = createStyles({
    logoWrapper: {
        flexDirection: 'row',
        position: 'absolute',
        marginTop: 50,
        marginLeft: 5
    },
    MoreMenu: {
        position: 'absolute',
        right: 0,
        width: 35,
        height: 35
    },
    MoreMenuIcon: {
        width: 30,
        height: 30,
        tintColor: colors.mainColor
    },
    textButtonMenu: {
        color: colors.mainColor,
        marginLeft: 20,
        fontSize: 19,
        flexShrink: 1,
        flex: 1,
        fontFamily: 'main'
    },
    MenuSectionView: {
        marginTop: 150,
        borderBottomColor: colors.lightBorder,
        borderBottomWidth: 1,
        paddingBottom: 25
    },
    iconButtonMenu: {
        width: 26,
        height: 26,
        tintColor: colors.mainColor
    },
    buttonMenu: {
        flexDirection: 'row',
        marginBottom: 5,
        height: 50,
        alignItems: 'center',
    },
    userMenuImage: {
        width: 50,
        height: 50,
        borderRadius: 50,
    },
    gridInfo: {
        marginLeft: 15
    },
    MenuUsername: {
        opacity: 0.5,
        marginTop: 4,
    },
    MenuHeaderText: {
        color: colors.mainColor,
        fontSize: 16,
        lineHeight: 20,
        flex: 1,
        marginTop: 2,
        fontFamily: 'main'
    },
    userInfo: {
        marginBottom: 65,
        width: '100%',
        position: 'absolute',
        bottom: 0,
        marginLeft: 25,
        flexDirection: 'row',
        alignItems: 'center',
    },
    mainContainer: {
        position: 'absolute',
        left: 0,
        height: '100%',
        backgroundColor: colors.background,
        paddingHorizontal: 25,
        borderRightColor: colors.lightBorder
    },

})

export default React.memo(LeftMenu)