import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform, ScrollView, TextInput } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useDashboard } from '../../../../contexts/DashboardContext';
import { useBottomSheet } from '../../../../contexts/BottomSheet';
import ContentHeader from '../ContentHeader';

import ColorPicker from './ColorPicker';
import DisplayModeSelector from './DisplayModeSelector';
import HeroPreview from './HeroPreview';
import TitleEditor from './TitleEditor';
import LogoUploader from './TaglineEditor';

const HeaderTab = () => {
    const { updateWebsiteHeader, websiteData } = useDashboard();
    const { openBottomSheet, closeBottomSheet } = useBottomSheet();

    // Default values if no data is present
    const defaultHeaderData = {
        title: 'Your Brand',
        logo: null,
        tagline: '',
        displayMode: 'centered', // 'centered', 'left', 'overlay'
        heroImage: null,
        backgroundColor: '#212529',
        titleColor: '#FFFFFF',
        useLogo: false,
        tintLogo: false
    };

    // Initialize state with data from context or defaults
    const [headerData, setHeaderData] = useState(
        (websiteData?.header || defaultHeaderData)
    );

    // Track if there are unsaved changes
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Load header data when websiteData changes
    useEffect(() => {
        if (websiteData?.header) {
            setHeaderData(websiteData.header);
        }
    }, [websiteData]);

    // Request permissions for image picker
    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to upload images!');
                }
            }
        })();
    }, []);

    // Update header data and mark as unsaved
    const updateHeader = (updates) => {
        setHeaderData(prev => ({
            ...prev,
            ...updates
        }));
        setHasUnsavedChanges(true);
    };

    // Handle logo upload with ImagePicker
    const handleLogoUpload = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [3, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const logoUri = result.assets[0].uri;
                updateHeader({
                    logo: logoUri,
                    useLogo: true
                });
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to upload logo. Please try again.');
        }
    };

    // Handle hero image upload with ImagePicker
    const handleHeroImageUpload = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [16, 9],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const imageUri = result.assets[0].uri;
                updateHeader({ heroImage: imageUri });
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to upload image. Please try again.');
        }
    };

    // Remove hero image
    const handleRemoveHeroImage = () => {
        updateHeader({ heroImage: null });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    };

    // Remove logo
    const handleRemoveLogo = () => {
        updateHeader({
            logo: null,
            useLogo: false
        });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    };

    // Toggle between title and logo
    const handleBrandDisplayMode = (useLogo) => {
        // If switching to logo and no logo exists, trigger upload
        if (useLogo && !headerData.logo) {
            handleLogoUpload();
        } else {
            updateHeader({ useLogo });
        }
    };

    // Toggle logo tint
    const handleLogoTint = (tintLogo) => {
        updateHeader({ tintLogo });
    };

    // Open background color picker
    const handleBackgroundColorPicker = () => {
        const sheetId = openBottomSheet(
            <ColorPicker
                currentColor={headerData.backgroundColor}
                onColorSelect={(color) => {
                    updateHeader({ backgroundColor: color });
                    closeBottomSheet(sheetId);
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }}
                colorType="background"
            />,
            ["60%"]
        );
    };

    // Open text color picker
    const handleTextColorPicker = () => {
        const sheetId = openBottomSheet(
            <ColorPicker
                currentColor={headerData.titleColor}
                onColorSelect={(color) => {
                    updateHeader({ titleColor: color });
                    closeBottomSheet(sheetId);
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }}
                colorType="text"
            />,
            ["60%"]
        );
    };

    // Save changes to context
    const saveChanges = () => {
        updateWebsiteHeader(headerData);
        setHasUnsavedChanges(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    };

    return (
        <>
            <ContentHeader
                title="Website Hero"
                subtitle="Design your website header"
            />
            <View style={styles.container}>
                {/* Compact Preview */}

                {/* Main Content */}
                <View style={styles.content}>
                    {/* SECTION: Brand Elements */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Brand Elements</Text>
                        </View>

                        <View style={styles.sectionContent}>
                            {/* Primary Display Options */}
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Primary Display</Text>
                                <View style={styles.segmentedControl}>
                                    <TouchableOpacity
                                        style={[
                                            styles.segmentButton,
                                            !headerData.useLogo && styles.segmentButtonActive
                                        ]}
                                        onPress={() => handleBrandDisplayMode(false)}
                                    >
                                        <Ionicons
                                            name="text"
                                            size={16}
                                            color={!headerData.useLogo ? "#000" : "rgba(0,0,0,0.6)"}
                                        />
                                        <Text style={[
                                            styles.segmentButtonText,
                                            !headerData.useLogo && styles.segmentButtonTextActive
                                        ]}>
                                            Title Text
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[
                                            styles.segmentButton,
                                            headerData.useLogo && styles.segmentButtonActive
                                        ]}
                                        onPress={() => handleBrandDisplayMode(true)}
                                    >
                                        <Ionicons
                                            name="image"
                                            size={16}
                                            color={headerData.useLogo ? "#000" : "rgba(0,0,0,0.6)"}
                                        />
                                        <Text style={[
                                            styles.segmentButtonText,
                                            headerData.useLogo && styles.segmentButtonTextActive
                                        ]}>
                                            Logo Image
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Show Logo Uploader or Title Editor */}
                            {headerData.useLogo ? (
                                <>
                                    <LogoUploader
                                        logo={headerData.logo}
                                        onLogoSelect={handleLogoUpload}
                                        onLogoRemove={handleRemoveLogo}
                                    />

                                    {/* Logo tint option */}
                                    {headerData.logo && (
                                        <View style={styles.formGroup}>
                                            <View style={styles.tintOption}>
                                                <Text style={styles.optionText}>Apply text color to logo</Text>
                                                <TouchableOpacity
                                                    style={[
                                                        styles.tintToggle,
                                                        headerData.tintLogo && styles.tintToggleActive
                                                    ]}
                                                    onPress={() => handleLogoTint(!headerData.tintLogo)}
                                                >
                                                    <View style={[
                                                        styles.tintIndicator,
                                                        headerData.tintLogo && styles.tintIndicatorActive
                                                    ]} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )}
                                </>
                            ) : (
                                <TitleEditor
                                    title={headerData.title}
                                    tagline={headerData.tagline}
                                    onTitleChange={(title) => updateHeader({ title })}
                                    onTaglineChange={(tagline) => updateHeader({ tagline })}
                                />
                            )}

                            {/* Tagline Input when Logo is selected */}
                            {headerData.useLogo && (
                                <View style={styles.formGroup}>
                                    <Text style={styles.label}>Tagline (Optional)</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={headerData.tagline}
                                        onChangeText={(tagline) => updateHeader({ tagline })}
                                        placeholder="Enter a tagline to appear below your logo"
                                        placeholderTextColor="#999"
                                    />
                                    <Text style={styles.hint}>
                                        A short phrase that describes your brand or business
                                    </Text>
                                </View>
                            )}

                            {/* Text Color Control */}
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>
                                    {headerData.useLogo && headerData.tintLogo ? 'Logo Tint Color' : 'Text Color'}
                                </Text>
                                <TouchableOpacity
                                    style={styles.colorPicker}
                                    onPress={handleTextColorPicker}
                                >
                                    <View
                                        style={[
                                            styles.colorSwatch,
                                            { backgroundColor: headerData.titleColor }
                                        ]}
                                    />
                                    <Text style={styles.colorCode}>
                                        {headerData.titleColor}
                                    </Text>
                                    <Ionicons name="color-palette-outline" size={20} color="#666" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* SECTION: Hero Background */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Hero Background</Text>
                        </View>

                        <View style={styles.sectionContent}>
                            {/* Background Image Upload */}
                            <View style={styles.formGroup}>
                                <View style={styles.labelRow}>
                                    <Text style={styles.label}>Background Image</Text>
                                    {headerData.heroImage && (
                                        <TouchableOpacity
                                            style={styles.removeButton}
                                            onPress={handleRemoveHeroImage}
                                        >
                                            <Ionicons name="close-circle" size={16} color="#FF3B30" />
                                            <Text style={styles.removeText}>Remove</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>

                                <TouchableOpacity
                                    style={[
                                        styles.uploadButton,
                                        headerData.heroImage ? styles.uploadButtonWithImage : null
                                    ]}
                                    onPress={handleHeroImageUpload}
                                >
                                    <View style={styles.uploadContent}>
                                        <Ionicons
                                            name={headerData.heroImage ? "image" : "image-outline"}
                                            size={24}
                                            color={headerData.heroImage ? "#000" : "#666"}
                                            style={styles.uploadIcon}
                                        />
                                        <View style={styles.uploadTextWrapper}>
                                            <Text style={[
                                                styles.uploadText,
                                                headerData.heroImage ? styles.uploadTextWithImage : null
                                            ]}>
                                                {headerData.heroImage ? "Change Background Image" : "Upload Background Image"}
                                            </Text>
                                            {!headerData.heroImage && (
                                                <Text style={styles.uploadHint}>
                                                    Recommended size: 1920×1080
                                                </Text>
                                            )}
                                        </View>
                                    </View>

                                    {headerData.heroImage && (
                                        <View style={styles.uploadStatus}>
                                            <Ionicons name="checkmark-circle" size={16} color="#34C759" />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </View>

                            {/* Background Color Control */}
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Background Color</Text>
                                <TouchableOpacity
                                    style={styles.colorPicker}
                                    onPress={handleBackgroundColorPicker}
                                >
                                    <View
                                        style={[
                                            styles.colorSwatch,
                                            { backgroundColor: headerData.backgroundColor }
                                        ]}
                                    />
                                    <Text style={styles.colorCode}>
                                        {headerData.backgroundColor}
                                    </Text>
                                    <Ionicons name="color-palette-outline" size={20} color="#666" />
                                </TouchableOpacity>
                                {headerData.heroImage && (
                                    <Text style={styles.hint}>
                                        Color is used as gradient base with background image
                                    </Text>
                                )}
                            </View>
                        </View>
                    </View>

                    {/* SECTION: Content Layout */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Content Layout</Text>
                        </View>

                            {/* Display Mode Selector */}
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Alignment</Text>
                                <DisplayModeSelector
                                    currentMode={headerData.displayMode}
                                    onModeSelect={(mode) => updateHeader({ displayMode: mode })}
                                />
                            </View>

                            <View style={styles.infoBox}>
                                <Ionicons name="information-circle" size={18} color="#0066cc" style={{ marginRight: 8 }} />
                                <Text style={styles.infoText}>
                                    'Overlay' mode works best with a background image
                                </Text>
                            </View>
                    </View>

                    {/* Save Button */}
                    {hasUnsavedChanges && (
                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={saveChanges}
                        >
                            <Ionicons name="save-outline" size={18} color="#fff" style={styles.saveIcon} />
                            <Text style={styles.saveButtonText}>Save Changes</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    content: {
        paddingBottom: 20,
    },
    
    // Sections
    section: {
        marginBottom: 16,
        borderRadius: 8,
        overflow: 'hidden',
    },
    sectionHeader: {
        backgroundColor: '#e9ecef',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#495057',
    },
    sectionContent: {
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        borderWidth: 1,
        borderTopWidth: 0,
        borderColor: '#e9ecef',
    },
    
    // Compact Preview
    compactPreview: {
        marginVertical: 12,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        height: 130,
    },
    previewContent: {
        height: '100%',
        position: 'relative',
    },
    previewContentHolder: {
        position: 'absolute',
        padding: 12,
        zIndex: 5,
        width: '100%',
    },
    previewAlignCenter: {
        alignItems: 'center',
        justifyContent: 'center',
        top: '35%',
    },
    previewAlignLeft: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        top: '35%',
        paddingLeft: 20,
    },
    previewAlignOverlay: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        bottom: 16,
    },
    previewTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    previewTagline: {
        fontSize: 12,
        opacity: 0.8,
    },
    previewLogoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        borderStyle: 'dashed',
        padding: 6,
        borderRadius: 4,
        marginBottom: 4,
    },
    previewLogoText: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 6,
    },
    previewImageIndicator: {
        position: 'absolute',
        top: 6,
        right: 6,
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 4,
    },
    previewLabel: {
        position: 'absolute',
        bottom: 4,
        right: 6,
        color: 'rgba(255,255,255,0.7)',
        fontSize: 8,
        fontWeight: '600',
        letterSpacing: 0.5,
        backgroundColor: 'rgba(0,0,0,0.4)',
        paddingVertical: 2,
        paddingHorizontal: 4,
        borderRadius: 2,
    },

    // Form groups and controls
    formGroup: {
        marginBottom: 20,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        fontSize: 15,
        fontWeight: '500',
        color: '#444',
        marginBottom: 8,
    },
    hint: {
        fontSize: 12,
        color: '#6c757d',
        marginTop: 6,
        fontStyle: 'italic',
    },

    // Input fields
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 15,
        color: '#333',
    },

    // Segmented control for logo/title toggle
    segmentedControl: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 8,
        padding: 4,
    },
    segmentButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 6,
    },
    segmentButtonActive: {
        backgroundColor: '#fff',
    },
    segmentButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: 'rgba(0,0,0,0.6)',
        marginLeft: 6,
    },
    segmentButtonTextActive: {
        color: '#000',
    },

    // Color picker
    colorPicker: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    colorSwatch: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginRight: 12,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    colorCode: {
        flex: 1,
        fontSize: 14,
        color: 'rgba(0,0,0,0.7)',
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },

    // Tint toggle
    tintOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 8,
        paddingVertical: 4,
    },
    optionText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#555',
    },
    tintToggle: {
        width: 50,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(0,0,0,0.1)',
        padding: 2,
    },
    tintToggleActive: {
        backgroundColor: '#34C759',
    },
    tintIndicator: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#fff',
    },
    tintIndicatorActive: {
        transform: [{ translateX: 22 }],
    },

    // Upload button
    uploadButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        borderStyle: 'dashed',
        padding: 16,
    },
    uploadButtonWithImage: {
        borderStyle: 'solid',
        backgroundColor: '#fff',
    },
    uploadContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    uploadIcon: {
        marginRight: 12,
    },
    uploadTextWrapper: {
        flex: 1,
    },
    uploadText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#666',
    },
    uploadTextWithImage: {
        color: '#000',
    },
    uploadHint: {
        fontSize: 12,
        color: '#888',
        marginTop: 4,
    },
    uploadStatus: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    // Remove button
    removeButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    removeText: {
        fontSize: 13,
        color: '#FF3B30',
        marginLeft: 4,
    },

    // Info box
    infoBox: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0, 102, 204, 0.08)',
        padding: 12,
        borderRadius: 8,
        marginBottom: 4,
        alignItems: 'flex-start',
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: '#444',
        lineHeight: 18,
    },

    // Save button
    saveButton: {
        flexDirection: 'row',
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
        paddingVertical: 14,
        borderRadius: 8,
    },
    saveIcon: {
        marginRight: 8,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default HeaderTab; 