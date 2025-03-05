import React, { useContext, useRef, useState } from 'react';
import {
    View,
    StyleSheet,
    Platform,
} from 'react-native';
import PagesHeader from '../../components/global/PagesHeader';
import { WebView } from 'react-native-webview';
import { UserContext } from '../../contexts/UserContext';
import { logout as logoutCall } from '../../utils/calls/auth'
import createStyles from '../../utils/globalStyle';
import colors from '../../utils/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Browser = ({ route, navigation }) => {
    let { url, title, type } = route.params

    const [loading, setLoading] = useState(false)
    const { userData, logout } = useContext(UserContext)

    const webViewRef = useRef(null);

    const handleNavigationStateChange = () => {

    }

    const onWebViewMessage = async (event) => {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.action == 'logout') {
            await logoutCall()
            logout()
        } else if (data.action == 'goBack') {
            navigation.goBack()
        }
    }

    const insets = useSafeAreaInsets()

    return (
        <View style={styles.container}>
            <PagesHeader
                style={[styles.header, Platform.OS == 'android' && { marginTop: insets.top }]}
                title={title}
                navigation={navigation}
                contextMenu={false}
            />
            <WebView
                ref={webViewRef}
                source={{ uri: url }}
                onNavigationStateChange={handleNavigationStateChange}
                style={styles.webView}
                onLoad={() => setLoading(false)}
                onMessage={onWebViewMessage}
                javaScriptEnabled={true}
                domStorageEnabled={true}
            />
        </View>
    )
};

const styles = createStyles({
    container: {
        flex: 1,
        backgroundColor: colors.background
    },
    webView: {
        flex: 1,
        backgroundColor: colors.background
    }
})

export default Browser;
