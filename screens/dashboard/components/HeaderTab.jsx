import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const HeaderTab = () => {
    return (
        <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>Website Header</Text>
            <Text style={styles.tabDescription}>
                Customize your website header with logo, navigation, and tagline.
            </Text>
            
            <View style={styles.headerSettings}>
                <View style={styles.settingItem}>
                    <Text style={styles.settingLabel}>Logo</Text>
                    <TouchableOpacity style={styles.uploadButton}>
                        <Text style={styles.uploadButtonText}>Upload Logo</Text>
                    </TouchableOpacity>
                </View>
                
                <View style={styles.settingItem}>
                    <Text style={styles.settingLabel}>Tagline</Text>
                    <TouchableOpacity style={styles.editButton}>
                        <Text style={styles.editButtonText}>Edit Tagline</Text>
                    </TouchableOpacity>
                </View>
                
                <View style={styles.settingItem}>
                    <Text style={styles.settingLabel}>Navigation Style</Text>
                    <View style={styles.optionsRow}>
                        <TouchableOpacity style={[styles.optionButton, styles.optionButtonSelected]}>
                            <Text style={styles.optionButtonText}>Minimal</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.optionButton}>
                            <Text style={styles.optionButtonText}>Standard</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.optionButton}>
                            <Text style={styles.optionButtonText}>Full</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
    headerSettings: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        marginBottom: 16,
    },
    settingItem: {
        marginBottom: 20,
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
        marginBottom: 8,
    },
    uploadButton: {
        backgroundColor: '#000',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    uploadButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    editButton: {
        backgroundColor: 'rgba(0,0,0,0.05)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    editButtonText: {
        color: '#000',
        fontSize: 14,
        fontWeight: '500',
    },
    optionsRow: {
        flexDirection: 'row',
    },
    optionButton: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.05)',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginRight: 8,
    },
    optionButtonSelected: {
        backgroundColor: '#000',
    },
    optionButtonText: {
        color: '#000',
        fontSize: 14,
        fontWeight: '500',
    },
});

export default HeaderTab; 