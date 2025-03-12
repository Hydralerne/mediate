import React, { memo } from 'react';
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
        backgroundColor: '#000',
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