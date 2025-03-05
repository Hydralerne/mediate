import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Platform,
    ScrollView,
    KeyboardAvoidingView,
    Keyboard,
} from 'react-native';
import { WebView } from 'react-native-webview';
import createStyles from '../utils/globalStyle';

const Coder = ({ route, navigation }) => {
    const webViewRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [isVisible,setIsVisible] = useState(false)

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => setIsVisible(true)
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => setIsVisible(false)
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);
    const codingButtons = ["{", "}", "[", "]", "(", ")", "<", ">", ";", ".", ",", ":", "=", "\"", "'", "/", "\\", "|"];

    const insertText = (text) => {
        const script = `addText('${text?.replace("'","\\'")}');`;
        webViewRef.current?.injectJavaScript(script);
    };

    const handleMessage = (event) => {
        const data = JSON.parse(event.nativeEvent.data);
        if (data?.action === 'back') {
            navigation.goBack();
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <WebView
                ref={webViewRef}
                source={{ uri: 'https://onvo.me/axios/' }}
                style={styles.webView}
                onLoad={() => setLoading(false)}
                onMessage={handleMessage}
                javaScriptEnabled={true}
                domStorageEnabled={true}
            />
            <View style={[styles.footer,!isVisible && {display: 'none'}]}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.insetFooter}>
                    {codingButtons.map((btn, index) => (
                        <TouchableOpacity key={index} style={styles.button} onPress={() => insertText(btn)}>
                            <Text style={styles.buttonText}>{btn}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#151515'
    },
    webView: {
        flex: 1,
        backgroundColor: '#151515'
    },
    footer: {

    },
    insetFooter: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        backgroundColor: 'black',
        paddingVertical: 10,
        marginBottom: 55,
        position: 'absolute',
        bottom: 0
    },
    button: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginHorizontal: 5,
        backgroundColor: '#333',
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    }
});

export default Coder;
