import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const Header = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const handleMenuPress = () => {
        navigation.openDrawer();
    };

    const handlePremiumPress = () => {
        navigation.navigate('Premium');
        // TODO: Open info/settings modal
        console.log('Info pressed');
    };

    return (
        <View style={[styles.header, { paddingTop: insets.top }]}>
            <TouchableOpacity style={styles.menuIconContainer} onPress={handleMenuPress}>
                <View style={styles.menuIconLines}>
                    <Image
                        source={require('@/assets/icons/Menu_open_right__GgluGK9aWDoeXJMsOOo8m9KKibAwmPH0A7C1.png')}
                        style={styles.menuIcon}
                    />
                </View>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Hekai</Text>
            <TouchableOpacity style={styles.settings} onPress={handlePremiumPress}>
                <Image
                    source={require('@/assets/icons/King_ADiMZbtCwV0WmhYL4Zo4RxzwgxoAS7iMtqE5.png')}
                    style={styles.infoIcon}
                />
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
    menuIcon: {
        width: 24,
        height: 24,
        tintColor: 'white',
    },
    menuIconContainer: {
        left: 15,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        marginTop: 65,
        top: 0,
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
    menuIconLines: {
        width: 24,
        height: 16,
        justifyContent: 'space-between',
    },
    line: {
        width: '100%',
        height: 2,
        backgroundColor: 'white',
        borderRadius: 1,
    },
    infoIcon: {
        width: 24,
        height: 24,
        tintColor: 'white',
    },
    infoText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    }
})
export default Header;