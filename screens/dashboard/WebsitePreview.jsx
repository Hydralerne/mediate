import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    ActivityIndicator,
    SafeAreaView,
    StatusBar,
    Image,
    Dimensions
} from 'react-native';
import { WebView } from 'react-native-webview';

const WebsitePreview = ({ route, navigation }) => {
    const { websiteDomain } = route.params;
    const [isLoading, setIsLoading] = useState(true);
    const [deviceType, setDeviceType] = useState('mobile'); // 'mobile', 'tablet', or 'pc'

    // Get device screen dimensions
    const { width: screenWidth } = Dimensions.get('window');

    // Construct the preview URL
    const previewUrl = `http://192.168.1.6:3000`;

    // Define viewport and user-agent settings for different devices
    const viewportSettings = {
        mobile: {
           
        },
        tablet: {
            userAgent: 'Mozilla/5.0 (iPad; CPU OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
            viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
            width: 768, // iPad width
        },
        pc: {
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
            viewport: 'width=device-width, initial-scale=1',
            width: '100%', // Full width
        }
    };

    // Get the current viewport settings
    const currentSettings = {}// viewportSettings[deviceType];

    // Create the injected JavaScript for viewport
    const viewportScript = '' //deviceType !== 'mobile' ? `
    //     const meta = document.querySelector('meta[name="viewport"]');
    //     if (meta) {
    //         meta.setAttribute('content', '${currentSettings.viewport}');
    //     } else {
    //         const newMeta = document.createElement('meta');
    //         newMeta.name = 'viewport';
    //         newMeta.content = '${currentSettings.viewport}';
    //         document.head.appendChild(newMeta);
    //     }
    // `: '';

    useEffect(() => {
        // Set navigation options dynamically
        navigation.setOptions({
            title: websiteDomain,
            headerShown: false,
        });
    }, [navigation, websiteDomain]);

    // Function to get container style based on device type
    const getContainerStyle = () => {
        switch (deviceType) {
            case 'mobile':
                return styles.mobileContainer;
            case 'tablet':
                return styles.tabletContainer;
            case 'pc':
                return styles.pcContainer;
            default:
                return {};
        }
    };

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
                </View>
            </View>

            {/* WebView for website content */}
            <View style={styles.webViewContainer}>
                <View style={[
                    getContainerStyle()
                ]}>
                    <WebView
                        source={{ uri: previewUrl }}
                        style={styles.webView}
                        userAgent={currentSettings.userAgent}
                        injectedJavaScript={viewportScript}
                        onLoadStart={() => setIsLoading(true)}
                        onLoadEnd={() => setIsLoading(false)}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        scalesPageToFit={deviceType !== 'mobile'}
                    />
                </View>

                {/* Loading indicator */}
                {isLoading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#000" />
                    </View>
                )}
            </View>

            {/* Fixed close button at bottom */}
            <View style={[styles.bottomButtonContainer]}>
                {/* Device type selector buttons */}
                <View style={styles.deviceButtonsContainer}>
                    <TouchableOpacity
                        style={[styles.deviceButton, deviceType === 'mobile' && styles.activeDeviceButton]}
                        onPress={() => setDeviceType('mobile')}
                    >
                        <Image
                            source={require('../../assets/icons/home/filter-85-1658432731.png')}
                            style={[styles.deviceIcon, deviceType === 'mobile' && styles.activeDeviceIcon]}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.deviceButton, deviceType === 'tablet' && styles.activeDeviceButton]}
                        onPress={() => setDeviceType('tablet')}
                    >
                        <Image
                            source={require('../../assets/icons/home/tablet-55-1658434492.png')}
                            style={[styles.deviceIcon, deviceType === 'tablet' && styles.activeDeviceIcon]}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.deviceButton, deviceType === 'pc' && styles.activeDeviceButton]}
                        onPress={() => setDeviceType('pc')}
                    >
                        <Image
                            source={require('../../assets/icons/home/mac notebook-77-1658236937.png')}
                            style={[styles.deviceIcon, deviceType === 'pc' && styles.activeDeviceIcon]}
                        />
                    </TouchableOpacity>
                </View>
                
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
    },
    header: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 5,
        zIndex: 10,
        height: 60,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
        height: 60
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
        textAlign: 'center',
    },
    closeButton: {
        position: 'absolute',
        left: 10,
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
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
    },
    mobileContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
        padding: 0,
    },
    tabletContainer: {
        width: 768,
        height: '85%',
        borderRadius: 16,
    },
    pcContainer: {
        width: '95%',
        height: '90%',
        borderRadius: 8,
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
        padding: 20,
        marginBottom: 65,
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 15,
    },
    bottomCloseButton: {
        backgroundColor: '#000',
        borderRadius: 25,
        paddingVertical: 14,
        alignItems: 'center',
        flex: 1,
    },
    bottomCloseButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    deviceButtonsContainer: {
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        borderRadius: 25,
        padding: 4,
        justifyContent: 'space-between',
    },
    deviceButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        backgroundColor: '#fff',
        marginHorizontal: 2,
    },
    activeDeviceButton: {
        backgroundColor: '#000',
    },
    deviceIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        tintColor: '#000',
    },
    activeDeviceIcon: {
        tintColor: '#fff',
    },
});

export default WebsitePreview; 