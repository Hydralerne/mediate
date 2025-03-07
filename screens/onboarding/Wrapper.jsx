import { ScrollView, View, StyleSheet, Image } from "react-native";
import TouchableButton from "../../components/global/ButtonTap";

const Wrapper = ({ children, allowScroll = false, navigation }) => {
    return allowScroll ? (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}>
            <View style={styles.backButton}>
                <TouchableButton onPress={() => navigation.goBack()}>
                    <Image source={require('../../assets/icons/home/chevron left-8-1696832126.png')} style={styles.backButtonImage} />
                </TouchableButton>
            </View>
            {children}
        </ScrollView>
    ) : (
        <View style={styles.container}>
            <View style={[styles.contentContainer, { flex: 1 }]}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    backButton: {
        position: 'absolute',
        top: -90,
        left: 10,
        width: 45,
        height: 45,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        marginTop: 150,
        backgroundColor: 'white',
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
    },
    backButtonImage: {
        width: 28,
        height: 28,
        tintColor: 'white',
    },
});

export default Wrapper;
