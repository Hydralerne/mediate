import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import TouchableButton from '../../../components/global/ButtonTap';
import colors from '../../../utils/colors';
import { useBottomSheet } from '../../../contexts/BottomSheet';

const SocialLinkSheet = ({ data, onSubmit, existingLink = null, onRemove = null }) => {
    const [url, setUrl] = useState('');
    const { closeBottomSheet } = useBottomSheet();
    const isEditing = !!existingLink;

    // Set initial URL if editing an existing link
    useEffect(() => {
        if (existingLink) {
            setUrl(existingLink.url);
        }
    }, [existingLink]);

    const handleSubmit = () => {
        if (url.trim()) {
            onSubmit(data.type, url.trim());
            closeBottomSheet();
        }
    };

    const handleRemove = () => {
        if (onRemove) {
            onRemove(data.type);
            closeBottomSheet();
        }
    };

    return (
        <>
            <Text style={styles.modalTitle}>
                {isEditing ? `Edit ${data.title}` : `Add ${data.title}`} Link
            </Text>
            <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                    <View style={styles.iconContainer}>
                        <Image 
                            source={data.icon}
                            style={styles.socialIcon}
                            resizeMode="contain"
                        />
                    </View>
                    <BottomSheetTextInput
                        style={styles.urlInput}
                        placeholder="Enter profile URL"
                        placeholderTextColor="rgba(0,0,0,0.35)"
                        value={url}
                        onChangeText={setUrl}
                        keyboardType="url"
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="done"
                    />
                </View>
                
                {isEditing && (
                    <TouchableOpacity 
                        style={styles.removeButton}
                        onPress={handleRemove}
                    >
                        <Image 
                            source={require('../../../assets/icons/posts/delete-25-1692683663.png')} 
                            style={styles.trashIcon}
                        />
                    </TouchableOpacity>
                )}
            </View>
            
            <View style={styles.modalButtons}>
                <TouchableButton 
                    style={styles.cancelButton} 
                    onPress={closeBottomSheet}
                >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableButton>
                <TouchableButton
                    style={[styles.addButton, !url.trim() && styles.addButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={!url.trim()}
                >
                    <Text style={styles.addButtonText}>{isEditing ? 'Update' : 'Add Link'}</Text>
                </TouchableButton>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    modalTitle: {
        fontSize: 20,
        fontWeight: 300,
        color: '#000',
        textAlign: 'center',
        marginBottom: 25,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    iconContainer: {
        paddingHorizontal: 12,
        borderRightWidth: 1,
        borderRightColor: 'rgba(0,0,0,0.1)',
    },
    socialIcon: {
        width: 24,
        height: 24,
    },
    urlInput: {
        flex: 1,
        height: 48,
        paddingHorizontal: 16,
        fontSize: 14,
        color: '#000',
        fontWeight: '400',
    },
    removeButton: {
        position: 'absolute',
        right: 0,
        top: -50,
        backgroundColor: '#FF3B30',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.2,
        // shadowRadius: 3,
        // elevation: 3,
    },
    trashIcon: {
        width: 16,
        height: 16,
        tintColor: 'white',
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        height: 52,
        backgroundColor: '#F2F2F7',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButton: {
        flex: 1,
        height: 52,
        backgroundColor: '#000',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonDisabled: {
        opacity: 0.5,
    },
    cancelButtonText: {
        color: '#000',
        fontSize: 14,
        fontWeight: 500,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 500,
    },
});

export default SocialLinkSheet;