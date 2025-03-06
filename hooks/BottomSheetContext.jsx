import React, { useState } from 'react';
import { View, Image, TextInput, Text, TouchableOpacity } from 'react-native';

const BottomSheetContent = ({ data, onSubmit }) => {
    const [url, setUrl] = useState('');
    
    const handleSubmit = () => {
        if (url.trim()) {
            onSubmit(data.type, url.trim());
        }
    };

    return (
        <View style={styles.modalContent}>
            <View style={styles.bottomSheetHeader}>
                <Image 
                    source={data.icon}
                    style={styles.socialIcon}
                    resizeMode="contain"
                />
                <Text style={styles.bottomSheetTitle}>{data.title}</Text>
            </View>
            
            <TextInput
                style={styles.urlInput}
                placeholder={`Enter your ${data.type} profile URL`}
                placeholderTextColor="rgba(0,0,0,0.35)"
                value={url}
                onChangeText={setUrl}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
            />
            
            <View style={styles.modalButtons}>
                <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={() => closeBottomSheet()}
                >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[styles.addButton, !url.trim() && styles.addButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={!url.trim()}
                >
                    <Text style={[styles.addButtonText, !url.trim() && styles.addButtonTextDisabled]}>
                        Add Link
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default BottomSheetContent; 