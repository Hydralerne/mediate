import { StyleSheet, View, Text } from "react-native"
import colors from "../utils/colors"

const CommingSoon = ({ description, style }) => {
    return (
        <View style={[styles.container,style]}>
            <Text style={styles.text}>Coming Soon!</Text>
            <Text style={styles.smallText}>{description}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    text: {
        color: colors.mainColor,
        fontSize: 30,
    },
    smallText: {
        color: colors.mainColor,
        fontSize: 16,
        marginTop: 20,
        textAlign: 'center',
        opacity: 0.5
    },
    container: {
        paddingHorizontal: 50,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default CommingSoon