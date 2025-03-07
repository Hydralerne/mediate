import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

const QuickStatCard = ({ title, value, color, icon }) => {
    return (
        <View style={[styles.statCard, { shadowColor: color }]}>
            <View style={styles.statContent}>
                <Text style={[styles.statValue, { color }]}>{value}</Text>
                <Text style={styles.statTitle}>{title}</Text>
            </View>
            <View style={styles.iconContainer}>
                <View style={[styles.iconBackground, { backgroundColor: 'black' }]}>
                    <Image source={icon} style={styles.icon} resizeMode="contain" />
                </View>
            </View>
        </View>
    );
};

const QuickStats = ({ visitors, interactions, messages }) => {
    return (
        <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            <QuickStatCard 
                title="Visitors" 
                value={visitors} 
                color="#4A6FFF"
                icon={require('../../../assets/icons/home/eye 2-17-1691989638.png')}
            />
            <QuickStatCard 
                title="Interactions" 
                value={interactions} 
                color="#FF4A8D"
                icon={require('../../../assets/icons/home/tap-90-1658433377.png')}
            />
            <QuickStatCard 
                title="Messages" 
                value={messages} 
                color="#1DD1A1"
                icon={require('../../../assets/icons/menu-bottom/email-76-1659689482.png')}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 8,
        paddingRight: 16, // Ensure last card's shadow is visible
    },
    statCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginLeft: 16,
        marginVertical: 4, // Add vertical margin for shadow visibility
        width: 150,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    statContent: {
        flex: 1,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 4,
    },
    statTitle: {
        fontSize: 14,
        color: 'rgba(0,0,0,0.6)',
    },
    iconContainer: {
        marginLeft: 12,
    },
    iconBackground: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 16,
        height: 16,
        tintColor: 'white',
    },
});

export default QuickStats; 