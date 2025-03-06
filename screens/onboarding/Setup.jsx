import { View, Text, StyleSheet, Image, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import React, { memo, useState, useRef, useCallback, useEffect } from 'react';
import TouchableButton from '../../components/global/ButtonTap';
import ProfileLinks from './components/ProfileLinks';
import colors from '../../utils/colors';
import { useBottomSheet } from '../../contexts/BottomSheet';
import { socialIcons } from '../../components/profile/SocialIcons';
import SocialLinkSheet from './components/BottomSheet';

const InputField = ({ label, placeholder, value, onChangeText }) => (
    <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor="rgba(0,0,0,0.35)"
            value={value}
            onChangeText={onChangeText}
        />
    </View>
);

const Setup = memo(() => {
    const [links, setLinks] = useState([]);
    const [name, setName] = useState('');
    const [tagline, setTagline] = useState('');
    const { openBottomSheet } = useBottomSheet();

    const handleAddLink = (code) => {
        // Check if this link already exists
        const existingLink = links.find(link => link.type === code);
        
        const socialData = socialIcons[code];
        openBottomSheet(
            <SocialLinkSheet 
                data={{
                    type: code,
                    title: `${existingLink ? 'Edit' : 'Add'} ${socialData.title} Link`,
                    icon: socialData.image,
                }}
                existingLink={existingLink}
                onSubmit={handleSubmitLink}
                onRemove={handleRemoveLink}
            />
        );
    };

    const handleSubmitLink = (socialType, url) => {
        setLinks(prev => {
            // Check if we're updating an existing link
            const existingIndex = prev.findIndex(link => link.type === socialType);
            
            if (existingIndex >= 0) {
                // Update existing link
                const newLinks = [...prev];
                newLinks[existingIndex] = { type: socialType, url };
                return newLinks;
            } else {
                // Add new link
                return [...prev, { type: socialType, url }];
            }
        });
    };

    const handleRemoveLink = (socialType) => {
        setLinks(prev => prev.filter(link => link.type !== socialType));
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.innerContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Let's Set Up Your Profile</Text>
                        <Text style={styles.subtitle}>
                            We'll help you create the perfect presence that represents you
                        </Text>
                    </View>

                    <View style={styles.content}>
                        <TouchableButton style={styles.imageUpload}>
                            <View style={styles.imageContainer}>
                                <Image
                                    source={require('../../assets/icons/home/image-211-1658434699.png')}
                                    style={styles.cameraIcon}
                                />
                            </View>
                            <Text style={styles.uploadText}>Add Profile Photo</Text>
                        </TouchableButton>
                        <InputField
                            label="Name or Brand"
                            placeholder="Enter your name or brand name"
                            value={name}
                            onChangeText={setName}
                        />

                        <InputField
                            label="Tagline"
                            placeholder="Add a short bio or tagline"
                            value={tagline}
                            onChangeText={setTagline}
                        />
                        <View style={styles.socialSection}>
                            <Text style={styles.label}>Social Links</Text>
                            <ProfileLinks
                                links={links}
                                callback={handleAddLink}
                                light={true}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    innerContainer: {
        flex: 1,
        padding: 20,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 0,
    },
    title: {
        color: '#000',
        fontSize: 28,
        fontWeight: '300',
        marginBottom: 8,
    },
    subtitle: {
        color: 'rgba(0,0,0,1)',
        fontSize: 14,
        fontWeight: '300',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    content: {
        flex: 1,
    },
    imageUpload: {
        alignItems: 'center',
        marginBottom: 25,
        marginTop: 25,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 14,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 10,
    },
    imageContainer: {
        width: 50,
        height: 50,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraIcon: {
        width: 32,
        height: 32,
        tintColor: '#000',
    },
    uploadText: {
        color: '#000',
        fontSize: 14,
        fontWeight: '300',
    },
    inputContainer: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        color: 'rgba(0,0,0,0.7)',
        marginBottom: 8,
        fontWeight: '400',
        paddingLeft: 2,
    },
    input: {
        height: 52,
        paddingHorizontal: 16,
        fontSize: 15,
        color: '#000',
        fontWeight: '400',
        backgroundColor: colors.lightBorder,
        borderRadius: 14,
        borderWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.2)',
    },
    socialSection: {
        // marginTop: 15,
        marginBottom: 100,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '400',
        color: '#000',
        marginBottom: 15,
        textAlign: 'center',
    },
    urlInput: {
        height: 52,
        paddingHorizontal: 16,
        fontSize: 15,
        color: '#000',
        fontWeight: '400',
        backgroundColor: colors.lightBorder,
        borderRadius: 14,
        borderWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.2)',
        marginBottom: 15,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 10,
    },
    cancelButton: {
        flex: 1,
        height: 52,
        backgroundColor: colors.lightBorder,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButton: {
        flex: 1,
        height: 52,
        backgroundColor: '#000',
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonDisabled: {
        opacity: 0.5,
    },
    cancelButtonText: {
        color: '#000',
        fontSize: 15,
        fontWeight: '400',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '400',
    },
    addButtonTextDisabled: {
        opacity: 0.5,
    },
    bottomSheetBackground: {
        backgroundColor: 'white',
    },
    bottomSheetIndicator: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        width: 40,
    },
    bottomSheetHeader: {
        alignItems: 'center',
        marginBottom: 24,
    },
    socialIcon: {
        width: 48,
        height: 48,
        marginBottom: 16,
    },
    bottomSheetTitle: {
        fontSize: 20,
        fontWeight: '500',
        color: '#000',
        textAlign: 'center',
    },
});

export default Setup;