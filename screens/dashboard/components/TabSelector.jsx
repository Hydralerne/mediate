import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const TabSelector = ({ activeTab, onTabChange }) => {
    return (
        <View style={styles.tabsContainer}>
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tabsScroll}
            >
                <TouchableOpacity 
                    style={[styles.tabButton, activeTab === 'content' && styles.activeTabButton]}
                    onPress={() => onTabChange('content')}
                >
                    <Text style={[styles.tabButtonText, activeTab === 'content' && styles.activeTabButtonText]}>
                        Content Sections
                    </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[styles.tabButton, activeTab === 'header' && styles.activeTabButton]}
                    onPress={() => onTabChange('header')}
                >
                    <Text style={[styles.tabButtonText, activeTab === 'header' && styles.activeTabButtonText]}>
                        Header & navigation
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.tabButton, activeTab === 'themes' && styles.activeTabButton]}
                    onPress={() => onTabChange('themes')}
                >
                    <Text style={[styles.tabButtonText, activeTab === 'themes' && styles.activeTabButtonText]}>
                        Layouts & themes
                    </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[styles.tabButton, activeTab === 'social' && styles.activeTabButton]}
                    onPress={() => onTabChange('social')}
                >
                    <Text style={[styles.tabButtonText, activeTab === 'social' && styles.activeTabButtonText]}>
                        Social links & hero
                    </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[styles.tabButton, activeTab === 'footer' && styles.activeTabButton]}
                    onPress={() => onTabChange('footer')}
                >
                    <Text style={[styles.tabButtonText, activeTab === 'footer' && styles.activeTabButtonText]}>
                        Footer
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    tabsContainer: {
        backgroundColor: '#fff',
    },
    tabsScroll: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 12,
    },
    tabButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 12,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    activeTabButton: {
        backgroundColor: '#000',
    },
    tabButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#000',
    },
    activeTabButtonText: {
        color: '#fff',
    },
});

export default memo(TabSelector); 