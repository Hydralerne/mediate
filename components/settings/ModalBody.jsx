import { Platform, StyleSheet, View } from 'react-native'
import PagesHeader from '../../components/global/PagesHeader'
import { memo } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import createStyles from '../../utils/globalStyle'

const ModalBody = ({children, style, ...props }) => {
    const insets = useSafeAreaInsets()
    return (
        <View style={[styles.container, style]}>
            <PagesHeader
                style={[styles.header, Platform.OS == 'android' && { marginTop: insets.top }]}
                innerStyle={styles.innerHeader}
                navigation={props.navigation}
                contextMenu={false}
                title={props.title}
                contextIcon={props.contextIcon}
            />
            <View style={styles.innerContainer}>
                {children}
            </View>
        </View>
    )
}

const styles = createStyles({
    header: {
        minHeight: 50
    },
    container: {
        flex: 1
    },
    innerHeader: {
        marginTop: 0,
        paddingBottom: 40
    },
    innerContainer: {
        flex: 1,
        paddingTop: 50
    }
})

export default memo(ModalBody)