
import { StyleSheet, Image } from 'react-native';
import createStyles from '../../utils/globalStyle';
import TouchableButton from './ButtonTap';
import { useNavigation } from '@react-navigation/native';
import colors from '../../utils/colors';

const SettingsIcon = ({ screen }) => {
    const navigation = useNavigation()

    const openSettings = async () => {
        navigation.navigate('Settings', { screen, params: {} })
    }

    return (
        <TouchableButton onPress={openSettings} style={[styles.backButton, styles.contextMenu]}>
            <Image
                style={[styles.backIcon, styles.contextIcon]}
                source={require('../../assets/icons/posts/setting-40-1662364403.png')}
            />
        </TouchableButton>
    );
};

const styles = createStyles({
    backButton: {
        width: 35,
        height: 35,
        position: 'absolute',
        lef: 0,
        marginTop: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 15
    },
    contextMenu: {
        left: null,
        right: 0,
        marginLeft: 0,
        marginRight: 10
    },
    backIcon: {
        tintColor: colors.mainColor,
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
})

export default SettingsIcon