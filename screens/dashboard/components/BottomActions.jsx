import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TintBlur from '../../home/components/TintBlur';

const { width } = Dimensions.get('window');

const BottomActions = ({ onAddContent, onPreview }) => {
    const insets = useSafeAreaInsets();
    
    return (
        <View style={[
            styles.container,
            { paddingBottom: Math.max(insets.bottom, 10) }
        ]}>
            {/* Using the TintBlur component for consistent styling */}
            <View style={styles.blurContainer}>
                <TintBlur 
                    direction="bottom" 
                    locations={[0, 0.25]} 
                    intensity={25} 
                    tint="light" 
                />
            </View>
            
            <View style={styles.content}>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity 
                        style={styles.addButton}
                        onPress={onAddContent}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.addButtonText}>Add Section</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={styles.previewButton}
                        onPress={onPreview}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.previewButtonText}>Preview Site</Text>
                    </TouchableOpacity>
                </View>
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
        backgroundColor: 'transparent',
        zIndex: 100,
    },
    blurContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 120,
        zIndex: -1,
    },
    content: {
        marginHorizontal: 20,
        height: 70,
        position: 'relative',
        justifyContent: 'center',
    },
    buttonsContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 30,
        height: '100%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 8,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    addButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.05)',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 25,
        marginRight: 12,
    },
    addButtonIcon: {
        width: 16,
        height: 16,
        tintColor: '#000',
        marginRight: 8,
    },
    addButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#000',
    },
    previewButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 25,
    },
    previewButtonIcon: {
        width: 16,
        height: 16,
        tintColor: '#fff',
        marginRight: 8,
    },
    previewButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#fff',
    },
});

export default BottomActions;