import { View, Image, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { memo } from 'react';
import MoreProfile from '../draggable-menus/MoreProfile';
import { ShareButton } from '../draggable-menus/Share';
import { handleBlock } from '../../utils/calls/messages';
import createStyles from '../../utils/globalStyle';
import TouchableButton from '../global/ButtonTap';

const HeaderNavigation = ({ data, isSelf }) => {
    const navigation = useNavigation();
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
    const controller = {
        share: async () => {
            global.DraggableMenuController.close()
            await delay(500)
            global.DraggableMenuController.open();
            global.DraggableMenuController.setChildren(() => <ShareButton data={{ isSelf, username: data.username, fullname: data.fullname }} type={'profile'} />);
        },
        report: () => {
            global.DraggableMenuController.close()
            navigation.navigate('Report', { data: { id: data.id, data }, type: 'profile' })
        },
        block: () => {
            global.DraggableMenuController.close()
            handleBlock({ user: id })
        }
    }
    const setOptions = () => {
        global.DraggableMenuController.setChildren(<MoreProfile controller={controller} title={data.fullname} />)
        global.DraggableMenuController.open()
    }
    return (
        <View style={styles.topIconsHeader}>
            <TouchableButton style={[styles.ProfileIcons, styles.leftIcon]} onPress={navigation.goBack}>
                <Image style={styles.profileIconImage} source={require('../../assets/icons/profile/arrow right md-49-1696832059.png')} />
            </TouchableButton>
            <TouchableButton style={[styles.ProfileIcons, styles.rightIcon]} onPress={setOptions}>
                <Image style={[styles.profileIconImage, styles.rightIconImage]} source={require('../../assets/icons/profile/info menu-42-1661490994.png')} />
            </TouchableButton>
        </View>
    )
}

const styles = createStyles({
    topIconsHeader: {
        position: 'absolute',
        width: '100%',
        marginTop: 50,
        flexDirection: 'row',
        zIndex: 99,
    },
    rightIcon: {
        right: 0,
        position: 'absolute',
        marginRight: 20,
    },
    rightIconSecound: {
        right: 0,
        position: 'absolute',
        marginRight: 70,
    },
    ProfileIcons: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        marginLeft: 20
    },
    rightIconImage: {
        width: 20,
        resizeMode: 'contain'
    },
    profileIconImage: {
        tintColor: 'white',
        width: 24,
        height: 24,
        resizeMode: 'contain'
    },
})

export default memo(HeaderNavigation)