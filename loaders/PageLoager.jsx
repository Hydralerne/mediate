import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import colors from "../utils/colors";
const PageLoader = ({isProfile}) => {

    return (
        <View style={[styles.container,isProfile && {marginTop: 250}]}>
            <ActivityIndicator size="large" color={colors.mainColor} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background
    }
})

export default PageLoader