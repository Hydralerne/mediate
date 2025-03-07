import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BottomActionBar = ({ onAddContent, onPreview, activeTab }) => {
    const insets = useSafeAreaInsets();
    
    return (
        <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 10) }]}>
            <View style={styles.content}>
                {activeTab === 'content' && onAddContent && (
                    <TouchableOpacity 
                        style={styles.addButton}
                        onPress={onAddContent}
                    >
                        <Text style={styles.addButtonText}>+ Add Section</Text>
                    </TouchableOpacity>
                )}
                
                <TouchableOpacity 
                    style={styles.previewButton}
                    onPress={onPreview}
                >
                    <Text style={styles.previewButtonText}>Preview Website</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 12,
    },
    addButton: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.05)',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: 'center',
        marginRight: 12,
    },
    addButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#000',
    },
    previewButton: {
        flex: 1,
        backgroundColor: '#000',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: 'center',
    },
    previewButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#fff',
    },
});

export default BottomActionBar; 