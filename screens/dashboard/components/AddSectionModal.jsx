import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    Modal, 
    TouchableOpacity, 
    Image, 
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform
} from 'react-native';

const AddSectionModal = ({ visible, onClose, onAdd, sectionTypes }) => {
    const [title, setTitle] = useState('');
    const [selectedType, setSelectedType] = useState(null);
    
    const handleAdd = () => {
        if (!title.trim() || !selectedType) return;
        
        const sectionData = {
            title: title.trim(),
            type: selectedType,
            description: getDescriptionForType(selectedType),
            icon: getIconForType(selectedType)
        };
        
        onAdd(sectionData);
        resetForm();
    };
    
    const resetForm = () => {
        setTitle('');
        setSelectedType(null);
    };
    
    const getDescriptionForType = (type) => {
        switch (type) {
            case sectionTypes.ABOUT:
                return 'Share your story and background';
            case sectionTypes.PORTFOLIO:
                return 'Display your work and projects';
            case sectionTypes.PRODUCTS:
                return 'Showcase items you\'re selling';
            case sectionTypes.VIDEOS:
                return 'Share video content with your audience';
            case sectionTypes.BLOG:
                return 'Share your thoughts and articles';
            case sectionTypes.SERVICES:
                return 'Highlight or directly buy services you offer';
            case sectionTypes.CONTACT:
                return 'Let visitors get in touch with you';
            default:
                return '';
        }
    };
    
    const getIconForType = (type) => {
        switch (type) {
            case sectionTypes.ABOUT:
                return require('../../../assets/icons/home/user information-309-1658436041.png');
            case sectionTypes.PORTFOLIO:
                return require('../../../assets/icons/home/roadmap-47-1681196106.png');
            case sectionTypes.PRODUCTS:
                return require('../../../assets/icons/home/store-116-1658238103.png');
            case sectionTypes.VIDEOS:
                return require('../../../assets/icons/home/youtube circle-0-1693375323.png');
            case sectionTypes.BLOG:
                return require('../../../assets/icons/home/feedly-180-1693375492.png');
            case sectionTypes.SERVICES:
                return require('../../../assets/icons/home/payoneer-0-1693375216.png');
            case sectionTypes.CONTACT:
                return require('../../../assets/icons/home/email sendng-69-1659689482.png');
            default:
                return null;
        }
    };
    
    const getTitleForType = (type) => {
        switch (type) {
            case sectionTypes.ABOUT:
                return 'About Me';
            case sectionTypes.PORTFOLIO:
                return 'Portfolio Showcase';
            case sectionTypes.PRODUCTS:
                return 'Products';
            case sectionTypes.VIDEOS:
                return 'Videos';
            case sectionTypes.BLOG:
                return 'Blog Posts';
            case sectionTypes.SERVICES:
                return 'Services';
            case sectionTypes.CONTACT:
                return 'Contact Form';
            default:
                return '';
        }
    };
    
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalOverlay}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Add New Section</Text>
                        <TouchableOpacity 
                            style={styles.closeButton}
                            onPress={() => {
                                resetForm();
                                onClose();
                            }}
                        >
                            <Image 
                                source={require('../../../assets/icons/home/close remove-802-1662363936.png')}
                                style={styles.closeIcon}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.formContainer}>
                        <Text style={styles.inputLabel}>Section Title</Text>
                        <TextInput 
                            style={styles.input}
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Enter section title"
                            placeholderTextColor="rgba(0,0,0,0.3)"
                        />
                        
                        <Text style={[styles.inputLabel, styles.sectionTypeLabel]}>Section Type</Text>
                        <ScrollView 
                            horizontal 
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.typeContainer}
                        >
                            {Object.values(sectionTypes).map(type => (
                                <TouchableOpacity 
                                    key={type}
                                    style={[
                                        styles.typeButton, 
                                        selectedType === type && styles.typeButtonSelected
                                    ]}
                                    onPress={() => {
                                        setSelectedType(type);
                                        if (!title) {
                                            setTitle(getTitleForType(type));
                                        }
                                    }}
                                >
                                    <Image 
                                        source={getIconForType(type)}
                                        style={[
                                            styles.typeIcon,
                                            selectedType === type && styles.typeIconSelected
                                        ]}
                                        resizeMode="contain"
                                    />
                                    <Text style={[
                                        styles.typeText,
                                        selectedType === type && styles.typeTextSelected
                                    ]}>{getTitleForType(type)}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        
                        <TouchableOpacity 
                            style={[
                                styles.addButton,
                                (!title.trim() || !selectedType) && styles.addButtonDisabled
                            ]}
                            onPress={handleAdd}
                        >
                            <Text style={styles.addButtonText}>Add Section</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    closeButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(0,0,0,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeIcon: {
        width: 16,
        height: 16,
        tintColor: '#000',
    },
    formContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    sectionTypeLabel: {
        marginBottom: 16,
    },
    typeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    typeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        marginRight: 8,
        marginBottom: 8,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    typeButtonSelected: {
        backgroundColor: '#000',
    },
    typeIcon: {
        width: 24,
        height: 24,
        marginRight: 12,
        tintColor: '#000',
    },
    typeIconSelected: {
        tintColor: '#fff',
    },
    typeText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
    },
    typeTextSelected: {
        color: '#fff',
    },
    addButton: {
        backgroundColor: '#000',
        padding: 16,
        borderRadius: 20,
    },
    addButtonDisabled: {
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    addButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default AddSectionModal; 