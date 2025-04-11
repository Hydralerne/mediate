import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import Eye from '../eye/Main';
const Header = () => {
    const insets = useSafeAreaInsets()
    return (
        <View style={[styles.header, { paddingTop: insets.top }]}>
            <TouchableOpacity style={styles.backIconContainer} onPress={() => { }}>
                <Image source={require('../../../assets/icons/home/chevron left-8-1696832126.png')} style={styles.backIcon} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Oblien AI</Text>
            <TouchableOpacity style={styles.settings}>
                <Image source={require('../../../assets/icons/home/info menu-42-1661490994.png')} style={styles.settingsIcon} />
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    header: {
        width: '100%',
        flex: 1,
        height: 120,
        zIndex: 9,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    headerTitle: {
        color: 'white',
        marginTop: 10,
        fontSize: 16,
    },
    backIcon: {
        width: 28,
        height: 28,
        tintColor: 'white',
    },
    backIconContainer: {
        left: 10,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        marginTop: 65,
        top: 0,
        marginLeft: 20,
    },
    settings: {
        position: 'absolute',
        right: 0,
        top: 0,
        marginTop: 65,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
    },
    settingsIcon: {
        width: 24,
        height: 24,
        tintColor: 'white',
    }
})
export default Header;
