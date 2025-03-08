import React, { useState, useEffect } from 'react';
import { 
    View, 
    StyleSheet, 
    TouchableOpacity, 
    Text, 
    ActivityIndicator,
    SafeAreaView,
    StatusBar,
    Image
} from 'react-native';
import { WebView } from 'react-native-webview';

const WebsitePreview = ({ route, navigation }) => {
    const { websiteDomain } = route.params;
    const [isLoading, setIsLoading] = useState(true);
    
    // Construct the preview URL
    const previewUrl = `https://${websiteDomain}`;
    
    useEffect(() => {
        // Set navigation options dynamically
        navigation.setOptions({
            title: websiteDomain,
            headerShown: false,
        });
    }, [navigation, websiteDomain]);
    
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#fff" />
            
            {/* Header with website domain and close button */}
            <View style={[styles.header]}>
                <View style={styles.headerContent}>
                    <TouchableOpacity 
                        style={styles.closeButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Image 
                            source={require('../../assets/icons/home/close remove-802-1662363936.png')} 
                            style={styles.closeIcon} 
                        />
                    </TouchableOpacity>
                    
                    <Text style={styles.headerTitle}>{websiteDomain}</Text>
                    
                    <View style={styles.placeholderButton} />
                </View>
            </View>
            
            {/* WebView for website content */}
            <View style={styles.webViewContainer}>
                <WebView
                    source={{ uri: previewUrl }}
                    style={styles.webView}
                    onLoadStart={() => setIsLoading(true)}
                    onLoadEnd={() => setIsLoading(false)}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                />
                
                {/* Loading indicator */}
                {isLoading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#000" />
                    </View>
                )}
            </View>
            
            {/* Fixed close button at bottom */}
            <View style={[styles.bottomButtonContainer]}>
                <TouchableOpacity 
                    style={styles.bottomCloseButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.bottomCloseButtonText}>Close Preview</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 5,
        zIndex: 10,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
        textAlign: 'center',
    },
    closeButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    placeholderButton: {
        width: 40,
        height: 40,
    },
    webViewContainer: {
        flex: 1,
        position: 'relative',
    },
    webView: {
        flex: 1,
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.8)',
    },
    bottomButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        marginBottom: 65,
    },
    bottomCloseButton: {
        backgroundColor: '#000',
        borderRadius: 25,
        paddingVertical: 14,
        alignItems: 'center',
    },
    bottomCloseButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default WebsitePreview; 