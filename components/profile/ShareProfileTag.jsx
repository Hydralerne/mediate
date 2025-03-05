import { View, StyleSheet, Text } from 'react-native'
// import createStyles from "../../utils/globalStyle"
import TouchableButton from '../global/ButtonTap'
import useTranslation from '../../hooks/useTranslation'
import { ShareButton } from '../draggable-menus/Share'
import colors from '../../utils/colors'

const ShareProfileTag = ({ sendMessage, style, refIndex, isSelf, data }) => {
    const t = useTranslation()
    const handlePress = () => {
        try {
            if (refIndex == 'profile' && !isSelf) {
                sendMessage()
            } else {
                global.DraggableMenuController.open();
                global.DraggableMenuController.setChildren(() => <ShareButton data={data} type={'profile'} />);
            }
        } catch (e) {
            console.log(e)
        }
    }
    return (
        <View style={[styles.container, style]}>
            <Text style={styles.headerText}>{refIndex == 'profile' && !isSelf ? data.fullname+' '+t('messages.item.emptyHeaderProf') : t('messages.item.emptyHeader')}</Text>
            <Text style={styles.shareProfile}>{refIndex == 'profile' && !isSelf ? t('messages.item.emptyBodyProf') : t('messages.item.emptyBody')}</Text>
            <TouchableButton onPress={handlePress} style={styles.ShareButton}>
                <Text style={styles.buttonText}>{refIndex == 'profile' && !isSelf ? t('messages.item.sendNow') : t('messages.item.shareNow')}</Text>
            </TouchableButton>
        </View>
    )
}

const styles = StyleSheet.create({
    headerText: {
        fontFamily: 'main',
        color: colors.mainColor,
        fontWeight: 'bold',
        fontSize: 30,
        marginTop: -20
    },
    ShareButton: {
        backgroundColor: colors.mainColor,
        paddingHorizontal: 20,
        flex: 0,
        width: 120,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        marginTop: 30,
        height: 40
    },
    buttonText: {
        fontFamily: 'main',
        color: colors.background
    },
    shareProfile: {
        fontFamily: 'main',
        color: colors.mainColor,
        fontSize: 14,
        marginTop: 10,
        opacity: 0.5
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        marginTop: 220
    }
})

export default ShareProfileTag