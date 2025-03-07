import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ContentHeader = () => {
    return (
        <View style={styles.contentHeader}>
            <Text style={styles.contentTitle}>Website Sections</Text>
            <Text style={styles.contentSubtitle}>
                Drag sections to reorder how they appear on your website
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    contentHeader: {
        padding: 16,
        backgroundColor: '#f8f9fa', // Non-white background
        marginBottom: 8,
    },
    contentTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    contentSubtitle: {
        fontSize: 14,
        color: 'rgba(0,0,0,0.6)',
    },
});

export default ContentHeader; 