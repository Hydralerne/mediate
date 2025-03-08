import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const Header = ({ websiteName, websiteDomain, onShare, onSettings }) => {
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title} numberOfLines={1}>{websiteName}</Text>
                {websiteDomain && (
                    <Text style={styles.domain}>{websiteDomain}</Text>
                )}
            </View>
            
            <View style={styles.actionsContainer}>
                <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={onShare}
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
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#fff',
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    domain: {
        fontSize: 13,
        color: 'rgba(0,0,0,0.5)',
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginLeft: 8,
        backgroundColor: 'rgba(0,0,0,0.05)',
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
        backgroundColor: 'rgba(0,0,0,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    settingsButtonImage: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
});

export default Header; 