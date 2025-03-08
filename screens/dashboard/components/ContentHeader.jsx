import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ContentHeader = ({title, subtitle}) => {
    return (
        <View style={styles.contentHeader}>
            <Text style={styles.contentTitle}>{title}</Text>
            <Text style={styles.contentSubtitle}>
                {subtitle}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    contentHeader: {
        padding: 20,
        backgroundColor: '#f8f9fa', // Non-white background
    },
    contentTitle: {
        fontSize: 20,
        fontWeight: '300',
        color: '#000',
        marginBottom: 4,
    },
    contentSubtitle: {
        fontSize: 14,
        fontWeight: '300',
        color: 'rgba(0,0,0,0.6)',
    },
});

export default ContentHeader; 