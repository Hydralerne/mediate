import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const SocialTab = () => {
    return (
        <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>Social Links</Text>
            <Text style={styles.tabDescription}>
                Connect your social media accounts to your website.
            </Text>
            
            <View style={styles.socialSettings}>
                <View style={styles.socialItem}>
                    <Text style={styles.socialLabel}>Instagram</Text>
                    <TouchableOpacity style={styles.connectButton}>
                        <Text style={styles.connectButtonText}>Connect</Text>
                    </TouchableOpacity>
                </View>
                
                <View style={styles.socialItem}>
                    <Text style={styles.socialLabel}>Twitter</Text>
                    <TouchableOpacity style={styles.connectButton}>
                        <Text style={styles.connectButtonText}>Connect</Text>
                    </TouchableOpacity>
                </View>
                
                <View style={styles.socialItem}>
                    <Text style={styles.socialLabel}>LinkedIn</Text>
                    <TouchableOpacity style={styles.connectButton}>
                        <Text style={styles.connectButtonText}>Connect</Text>
                    </TouchableOpacity>
                </View>
                
                <View style={styles.socialItem}>
                    <Text style={styles.socialLabel}>YouTube</Text>
                    <TouchableOpacity style={styles.connectButton}>
                        <Text style={styles.connectButtonText}>Connect</Text>
                    </TouchableOpacity>
                </View>
                
                <TouchableOpacity style={styles.addSocialButton}>
                    <Text style={styles.addSocialButtonText}>+ Add More</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    tabContent: {
        padding: 16,
        backgroundColor: '#f8f9fa',
    },
    tabTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
        marginBottom: 8,
    },
    tabDescription: {
        fontSize: 14,
        color: 'rgba(0,0,0,0.6)',
        marginBottom: 24,
    },
    socialSettings: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    socialItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    socialLabel: {
        fontSize: 16,
        color: '#000',
    },
    connectButton: {
        backgroundColor: 'rgba(0,0,0,0.05)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    connectButtonText: {
        color: '#000',
        fontSize: 14,
        fontWeight: '500',
    },
    addSocialButton: {
        marginTop: 16,
        backgroundColor: 'rgba(0,0,0,0.05)',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    addSocialButtonText: {
        color: '#000',
        fontSize: 14,
        fontWeight: '500',
    },
});

export default SocialTab; 