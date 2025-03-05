import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import mediaController from '../hooks/InboxMediaController'

const MoviesPage = ({ route, navigation }) => {
    const { type, id, action } = route?.params || {}

    const url = `https://tv.onvo.me/${action == 'title' ? `${type}/${id}?onvo=true` : '?send=true'}`

    const handleWebViewMessage = (event) => {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.action == 'close') {
            navigation.goBack()
        } else if (data.action == 'set') {
            mediaController.set({ data: data.data, type: 'movie' })
            navigation.goBack()
        }
    };

    return (
        <View style={styles.container}>
            <WebView
                source={{ uri: url }}
                style={styles.webview}
                bounces={false}
                overScrollMode="never"
                originWhitelist={['*']}
                onMessage={handleWebViewMessage}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000'
    },
    webview: {
        flex: 1,
        backgroundColor: '#000'

    },
});

export default MoviesPage;
