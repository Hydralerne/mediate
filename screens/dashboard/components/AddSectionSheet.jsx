import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    FlatList,
    Image
} from 'react-native';

// Import directly from middleware
import { 
    SECTION_TYPES, 
    getSectionMetadata, 
    getSectionIcon
} from '../../../middleware/content';

const AddSectionSheet = ({ 
    onAdd, 
    onClose
}) => {
    // Get all section types from middleware
    const allSectionTypes = Object.values(SECTION_TYPES);
    
    const handleAddSection = (sectionType) => {
        onAdd({ type: sectionType });
        onClose();
    };
    
    const renderSectionType = ({ item }) => {
        const metadata = getSectionMetadata(item);
        const icon = getSectionIcon(item);
        
        return (
            <TouchableOpacity
                style={styles.sectionTypeItem}
                activeOpacity={0.7}
            >
                <View style={styles.sectionTypeContent}>
                    <View style={styles.sectionTypeIconContainer}>
                        {icon ? (
                            <Image 
                                source={icon} 
                                style={styles.sectionTypeIcon} 
                            />
                        ) : (
                            <View style={styles.iconPlaceholder} />
                        )}
                    </View>
                    
                    <View style={styles.sectionTypeInfo}>
                        <Text style={styles.sectionTypeName}>{metadata?.title || item}</Text>
                        <Text style={styles.sectionTypeDescription}>
                            {metadata?.description || 'Add this section to your website'}
                        </Text>
                    </View>
                    
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => handleAddSection(item)}
                    >
                        <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };
    
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Add New Section</Text>
                
                <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={onClose}
                >
                    <Image 
                        source={require('../../../assets/icons/home/close remove-802-1662363936.png')} 
                        style={styles.closeIcon} 
                    />
                </TouchableOpacity>
            </View>
            
            <Text style={styles.subtitle}>
                Choose a section type to add to your website
            </Text>
            
            <FlatList
                data={allSectionTypes}
                renderItem={renderSectionType}
                keyExtractor={(item) => item}
                contentContainerStyle={styles.sectionTypesList}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '300',
        color: '#000',
    },
    closeButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '300',
        color: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    sectionTypesList: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    sectionTypeItem: {
        marginBottom: 12,
        borderRadius: 12,
        backgroundColor: '#f8f9fa',
        overflow: 'hidden',
    },
    sectionTypeContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    sectionTypeIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    sectionTypeIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    iconPlaceholder: {
        width: 24,
        height: 24,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 12,
    },
    sectionTypeInfo: {
        flex: 1,
    },
    sectionTypeName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
        marginBottom: 4,
    },
    sectionTypeDescription: {
        fontSize: 12,
        color: 'rgba(0,0,0,0.6)',
    },
    addButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#000',
        borderRadius: 12,
        marginLeft: 12,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
});

export default AddSectionSheet; 