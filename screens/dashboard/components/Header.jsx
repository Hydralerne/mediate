import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Header = ({ websiteName, websiteDomain, onShare, onSettings, onSave, hasUnsavedChanges }) => {

    const insets = useSafeAreaInsets();



    return (
        <View style={styles.container}>
            <View style={[styles.headerBackground, { marginTop: -insets.top, height: 120 + insets.top }]}>
                <View style={styles.headerBackgroundOverlay} />
                <Image source={require('../../../assets/images/ass.jpg')} style={styles.headerBackgroundImage} />
            </View>
            <View style={styles.headerContent}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title} numberOfLines={1}>{websiteName}</Text>
                    {websiteDomain && (
                        <Text style={styles.domain}>{websiteDomain}</Text>
                    )}
                </View>

                <View style={styles.actionsContainer}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={hasUnsavedChanges}
                    >
                        <Text style={styles.actionButtonText}>Share</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.settingsButton}
                        onPress={onSettings}
                    >
                        <Image
                            source={require('../../../assets/icons/home/setting-40-1662364403.png')}
                            style={styles.settingsButtonImage}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000',
    },
    headerBackgroundOverlay: {
        position: 'absolute',
        top: 0,
        zIndex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.75)',
    },
    headerBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        overflow: 'hidden',
    },
    headerBackgroundImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingVertical: 16,
        zIndex: 9,
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 4,
    },
    domain: {
        fontSize: 14,
        fontWeight: '300',
        color: 'rgba(255,255,255,0.75)',
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginLeft: 8,
        backgroundColor: 'rgba(255,255,255,1)',
        borderRadius: 20,
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#000',
    },
    settingsButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    settingsButtonImage: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
        tintColor: '#000',
    },
});

export default memo(Header); 