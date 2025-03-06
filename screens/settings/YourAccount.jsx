import { Alert, Image, Linking, ScrollView, StyleSheet, Text, View } from 'react-native'
import PagesHeader from '../../components/global/PagesHeader'
import colors from '../../utils/colors'
import TouchableButton from '../../components/global/ButtonTap'
// import Deactive from '../../components/draggable-menus/Deactive'
import { UserContext } from '../../contexts/UserContext'
import { useContext } from 'react'
import { request } from '../../utils/requests'
import { getToken } from '../../utils/token'
import { useSettings } from '../../contexts/SettingsProvider'
import useTranslation from '../../hooks/useTranslation'
import createStyles from '../../utils/globalStyle'

const YourAccount = ({ route, navigation }) => {

    const { data } = useSettings()
    const { logout } = useContext(UserContext)
    const t = useTranslation()

    const handleMenu = () => {

    }

    const handleDeactive = async (type) => {
        const response = await request('https://api.onvo.me/v2/settings/delete', { type }, 'POST', {
            Authorization: `Bearer ${await getToken()}`
        })
        if (response.error) {
            Alert.alert(response.type || 'Error occured', response.message || 'Please try again later')
        }
        if (response.status == 'success') {
            Alert.alert(t('settings.account.alerts.seeyou'), t('settings.account.alerts.seeyouLabel'))
            logout()
        }
    }

    const deactiveCallback = (type) => {
        if (type == 'cancel') {
            global.DraggableMenuController.close();
            return
        }
        const deactiveText = type == 'deactive' ? t('settings.account.alerts.deactiveMessage') : t('settings.account.alerts.deleteMessage')
        Alert.alert(
            t('settings.account.alerts.areyou'),
            deactiveText,
            [
                {
                    text: t('settings.account.alerts.cancel'),
                    style: 'cancel',
                },
                {
                    text: t('settings.account.alerts.contact'),
                    onPress: () => {
                        Linking.openURL('https://x.com/onvo_me')
                    },
                },
                {
                    text: t('settings.account.alerts.confirm') + ' ' + t(`settings.account.alerts.${type}`),
                    onPress: () => handleDeactive(type),
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );

    }

    const params = { 'Apple': data?.user?.apid, 'Twitter': data?.user?.twid, 'Google': data?.user?.glid }
    const oauth = Object.entries(params)
        .map(([type, value]) => (value ? type : null))
        .filter(Boolean)
        .join(', ');

    const sections = [
        {
            title: t('settings.account.sections.username'),
            value: '@' + data.user?.username,
            onPress: () => {
                navigation.navigate('SettingsModal', { username: data.user?.username, modal: 'Username' })
            },
            icon: require('../../assets/icons/settings/add username-39-1659689482.png')
        },
        {
            title: t('settings.account.sections.phone'),
            value: data.user?.phone || t('settings.account.labels.noPhone'),
            icon: require('../../assets/icons/settings/call phone-60-1662452713.png'),
            onPress: () => {
                navigation.navigate('SettingsModal', { data: data.user?.phone, modal: 'PhoneMail', type: 'phone' })
            },
        },
        {
            title: t('settings.account.sections.email'),
            value: data.user?.email || t('settings.account.labels.noEmail'),
            icon: require('../../assets/icons/settings/gmail-22-1693375160.png'),
            onPress: () => {
                navigation.navigate('SettingsModal', { data: data.user?.email, modal: 'PhoneMail', type: 'email' })
            },
        },
        {
            title: t('settings.account.sections.gender'),
            value: data.user?.sex || t('settings.account.labels.noGender'),
            icon: require('../../assets/icons/settings/man woman-92-1658435662.png'),

        },
        {
            title: t('settings.account.sections.oauth'),
            value: oauth || t('settings.account.labels.noConnected'),
            icon: require('../../assets/icons/settings/digital key-61-1686045820.png'),
            onPress: () => {
                Alert.alert('Unavilable', 'Changing one click login is currently unavailable, please contact us at x.com/onvo_me')
            }
        },
        {
            title: t('settings.account.sections.password'),
            value: t('settings.account.labels.password'),
            icon: require('../../assets/icons/settings/password-81-1691989638.png'),
            lable: ' ',
            onPress: () => {
                navigation.navigate('SettingsModal', { modal: 'Password' })
            },
            style: { borderTopWidth: 1, borderTopColor: colors.lightBorder, marginTop: 20 }
        },
        {
            title: t('settings.account.sections.deactive'),
            value: t('settings.account.labels.deactive'),
            icon: require('../../assets/icons/settings/user delete-180-1658436041.png'),
            lable: ' ',
            onPress: () => {
                global.DraggableMenuController.open();
                global.DraggableMenuController.setChildren(() =>
                    <Deactive callback={deactiveCallback} />
                );
            }
        },
        {
            title: t('settings.account.sections.country'),
            value: data.user?.country || t('settings.account.labels.noCountry'),
            icon: require('../../assets/icons/settings/pin-316-1658433758.png'),
            noEdit: true
        }

    ]

    return (
        <View style={styles.container}>
            <PagesHeader
                title={t('settings.account.header')}
                navigation={navigation}
                contextMenu={handleMenu}
            />
            <ScrollView style={styles.sections}>
                {
                    sections.map(section => {
                        return (
                            <TouchableButton onPress={section.onPress}>
                                <View style={[styles.section, section.style]}>
                                    <Image style={styles.mainIcon} source={section.icon} />
                                    <View style={styles.grid}>
                                        <Text style={styles.title}>{section.title}</Text>
                                        <Text style={styles.value}>{section.value}</Text>
                                    </View>
                                    {!section?.noEdit && <View style={styles.edit}>
                                        <Text style={styles.editText}>{section.lable || t('settings.account.labels.edit')}</Text>
                                        <Image style={styles.editIcon} source={require('../../assets/icons/settings/chevron right-18-1696832403.png')} />
                                    </View>}
                                </View>
                            </TouchableButton>
                        )
                    })
                }
            </ScrollView>
        </View>
    )
}

const styles = createStyles({
    edit: {
        flexDirection: 'row',
        position: 'absolute',
        right: 0
    },
    headeing: {
        borderBottomColor: colors.lightBorder,
        borderBottomWidth: 1,
        paddingBottom: 15,
        paddingTop: 10,
        marginTop: 20
    },
    textHeading: {
        color: colors.mainColor,
        fontSize: 18
    },
    editText: {
        color: colors.mainSecound,
    },
    sections: {
        paddingTop: 110,
        paddingHorizontal: 20,
        height: '100%',
        width: '100%',
    },
    value: {
        color: colors.mainSecound,
    },
    title: {
        color: colors.mainColor,
        fontSize: 16,
        marginBottom: 2
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15
    },
    editIcon: {
        tintColor: colors.mainMedium,
        width: 20,
        height: 20,
        marginLeft: 5,
        marginRight: -6,
    },
    mainIcon: {
        tintColor: colors.mainSecound,
        width: 24,
        height: 24,
        marginRight: 15
    }
})

export default YourAccount