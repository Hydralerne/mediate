import { StyleSheet, Text, View, Image, ScrollView, Alert } from 'react-native'
import PagesHeader from '../../components/global/PagesHeader'
import colors from '../../utils/colors'
import TouchableButton from '../../components/global/ButtonTap'
import { useSettings } from '../../contexts/SettingsProvider'
import useTranslation from '../../hooks/useTranslation'
import createStyles from '../../utils/globalStyle'

const Main = ({ route, navigation }) => {

    const { data } = useSettings()

    const t = useTranslation()

    const handleMenu = () => {

    }


    let sections = [
        {
            title: t('settings.main.yourProfile.title'),
            lable: t('settings.main.yourProfile.lable'),
            icon: require('../../assets/icons/settings/user-223-1658436042.png'),
            onPress: () => navigation.navigate('SettingsModal', { modal: 'ProfileModal', data })
        },
        {
            title: t('settings.main.yourAccount.title'),
            lable: t('settings.main.yourAccount.lable'),
            icon: require('../../assets/icons/settings/user-351-1658436041.png'),
            onPress: () => navigation.navigate('YourAccount')
        },
        {
            title: t('settings.main.safety.title'),
            lable: t('settings.main.safety.lable'),
            icon: require('../../assets/icons/settings/shield done-107-1691989601.png'),
            onPress: () => navigation.navigate('Saftey')
        },
        {
            title: t('settings.main.inbox.title'),
            lable: t('settings.main.inbox.lable'),
            icon: require('../../assets/icons/settings/email-37-1659689482.png'),
            onPress: () => navigation.navigate('Inbox')
        },
        {
            title: t('settings.main.notifications.title'),
            lable: t('settings.main.notifications.lable'),
            icon: require('../../assets/icons/settings/ringing-103-1658234612.png'),
            onPress: () => navigation.navigate('Notifications')
        },
        {
            title: t('settings.main.timeline.title'),
            lable: t('settings.main.timeline.lable'),
            icon: require('../../assets/icons/settings/center left layout-17-1692683663.png'),
            onPress: () => {
                Alert.alert(t('settings.main.alerts.title'), t('settings.main.alerts.lable'))
            }
        },
        {
            title: t('settings.main.language.title'),
            lable: t('settings.main.language.lable'),
            icon: require('../../assets/icons/settings/translate language-132-1692683664.png'),
            onPress: () => {
                Alert.alert(t('settings.main.alerts.title'), t('settings.main.alerts.description'))
            }
        }
    ]

    return (
        <View style={styles.container}>
            <PagesHeader
                title={t('settings.main.header')}
                navigation={navigation}
                contextMenu={handleMenu}
            />
            <ScrollView style={styles.pageContainer}>
                {
                    sections.map(section => {
                        return (
                            <TouchableButton onPress={section.onPress}>
                                <View style={styles.section}>
                                    <Image style={styles.sectionIcon} source={section.icon} />
                                    <View style={styles.gridText}>
                                        <Text style={styles.titleText}>{section.title}</Text>
                                        <Text style={styles.lableText}>{section.lable}</Text>
                                    </View>
                                    <Image style={styles.rightArrow} source={require('../../assets/icons/settings/chevron right-18-1696832403.png')} />
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
    pageContainer: {
        paddingTop: 110
    },
    rightArrow: {
        width: 24,
        height: 24,
        tintColor: colors.mainMedium,
        marginLeft: 10
    },
    gridText: {
        marginLeft: 15,
        flex: 1
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 20
    },
    titleText: {
        color: colors.mainColor,
        marginBottom: 4
    },
    sectionIcon: {
        tintColor: colors.mainSecound,
        width: 24,
        height: 24
    },
    lableText: {
        color: colors.mainSecound,
    }
})

export default Main