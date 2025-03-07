import { View, Text, StyleSheet, Image, TextInput, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import React, { memo, useState, useRef, useCallback, useEffect, useContext } from 'react';
import TouchableButton from '../../components/global/ButtonTap';
import ProfileLinks from './components/ProfileLinks';
import colors from '../../utils/colors';
import { useBottomSheet } from '../../contexts/BottomSheet';
import { socialIcons } from './components/SocialIcons';
import SocialLinkSheet from './components/BottomSheet';
import Wrapper from './Wrapper';
import { OnboardingContext } from '../../contexts/OnboardingContext';

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

const Setup = memo(({ navigation }) => {
    // Get state from context
    const { 
        profileData, 
        setProfileData, 
        isLoading 
    } = useContext(OnboardingContext);
    
    // Local state for UI management
    const [name, setName] = useState(profileData?.name || '');
    const [tagline, setTagline] = useState(profileData?.tagline || '');
    const [links, setLinks] = useState(profileData?.links || []);
    const [profileImage, setProfileImage] = useState(profileData?.profileImage || null);
    
    const { openBottomSheet } = useBottomSheet();
    
    // Update local state when context data changes (e.g., when loaded from storage)
    useEffect(() => {
        if (!isLoading && profileData) {
            setName(profileData.name || '');
            setTagline(profileData.tagline || '');
            setLinks(profileData.links || []);
            setProfileImage(profileData.profileImage || null);
        }
    }, [profileData, isLoading]);
    
    // Save data to context whenever it changes
    useEffect(() => {
        // Only save if we have at least one piece of data and not in loading state
        if (!isLoading && (name || tagline || links.length > 0 || profileImage)) {
            setProfileData({
                name,
                tagline,
                links,
                profileImage
            });
        }
    }, [name, tagline, links, profileImage, setProfileData, isLoading]);

    const handleAddLink = (code) => {
        // Check if this link already exists
        const existingLink = links.find(link => link.type === code);

        const socialData = socialIcons[code];
        openBottomSheet(
            <SocialLinkSheet
                data={{
                    type: code,
                    title: `${existingLink ? 'Edit' : 'Add'} ${socialData.title}`,
                    icon: socialData.image,
                }}
                existingLink={existingLink}
                onSubmit={handleSubmitLink}
                onRemove={handleRemoveLink}
            />
        );
    };

    const handleSubmitLink = (socialType, url) => {
        const updatedLinks = [...links];
        const existingIndex = updatedLinks.findIndex(link => link.type === socialType);
        
        if (existingIndex >= 0) {
            // Update existing link
            updatedLinks[existingIndex] = { type: socialType, url };
        } else {
            // Add new link
            updatedLinks.push({ type: socialType, url });
        }
        
        setLinks(updatedLinks);
    };

    const handleRemoveLink = (socialType) => {
        const updatedLinks = links.filter(link => link.type !== socialType);
        setLinks(updatedLinks);
    };
    
    const handleAddProfilePhoto = () => {
        // This would typically open an image picker
        // For now, we'll just simulate adding a photo
        console.log('Add profile photo');
        // setProfileImage(selectedImage);
    };

    if (isLoading) {
        return (
            <Wrapper allowScroll={false} navigation={navigation}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#000" />
                    <Text style={styles.loadingText}>Loading your profile...</Text>
                </View>
            </Wrapper>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <Wrapper allowScroll={true} navigation={navigation}>
                <View style={styles.innerContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Let's Set Up Your Profile</Text>
                        <Text style={styles.subtitle}>
                            We'll help you create the perfect presence that represents you
                        </Text>
                    </View>

                    <View style={styles.content}>
                        <TouchableButton 
                            style={styles.imageUpload}
                            onPress={handleAddProfilePhoto}
                        >
                            <View style={styles.imageContainer}>
                                {profileImage ? (
                                    <Image
                                        source={{ uri: profileImage }}
                                        style={styles.profileImage}
                                    />
                                ) : (
                                    <Image
                                        source={require('../../assets/icons/home/image-211-1658434699.png')}
                                        style={styles.cameraIcon}
                                    />
                                )}
                            </View>
                            <Text style={styles.uploadText}>
                                {profileImage ? 'Change Profile Photo' : 'Add Profile Photo'}
                            </Text>
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
            </Wrapper>
        </KeyboardAvoidingView>
    );
});

const styles = StyleSheet.create({
    contentContainer: {
        marginTop: 150,
        backgroundColor: 'white',
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
    },
    container: {
        flex: 1,
        backgroundColor: 'transparent',
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 15,
        fontSize: 16,
        color: 'rgba(0,0,0,0.7)',
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
});

export default Setup;