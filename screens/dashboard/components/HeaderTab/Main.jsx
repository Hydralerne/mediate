import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ImageHandler from '../../../../components/global/ImageHandler';
import ColorPicker from './ColorPicker';
import HeroPreview from './HeroPreview';
import NavigationOptions from './NavigationOptions';
import NavigationPreview from './NavigationPreview';
import { useBottomSheet } from '../../../../contexts/BottomSheet';

// Hero layout options
const HERO_LAYOUTS = [
  {
    id: 'fullWidth',
    label: 'Full Width',
    icon: 'ios-expand-outline',
  },
  {
    id: 'circleLeft',
    label: 'Circle Left',
    icon: 'ios-ellipsis-horizontal-circle-outline',
  },
  {
    id: 'squareLeft',
    label: 'Square Left',
    icon: 'ios-square-outline',
  }
];

// Function to detect if a color is light or dark
const isLightColor = (hexColor) => {
  // Remove the hash if it exists
  hexColor = hexColor.replace('#', '');
  
  // Parse the RGB values
  const r = parseInt(hexColor.substr(0, 2), 16);
  const g = parseInt(hexColor.substr(2, 2), 16);
  const b = parseInt(hexColor.substr(4, 2), 16);
  
  // Calculate the perceived brightness (using the formula from W3C)
  // See: https://www.w3.org/TR/AERT/#color-contrast
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  // Return true if the color is light (brightness > 125)
  return brightness > 125;
};

// Function to get contrasting text color based on background color
const getContrastingTextColor = (backgroundColor) => {
  return isLightColor(backgroundColor) ? '#000000' : '#FFFFFF';
};

const HeaderTab = () => {
    const { openBottomSheet, closeBottomSheet } = useBottomSheet();
    
    // State for header settings
    const [headerSettings, setHeaderSettings] = useState({
        backgroundColor: '#212529',
        heroImage: null,
        heroLayout: 'fullWidth',
        displayMode: 'centered',
        textColor: '#FFFFFF',
        navigationStyle: 'topBar',
        showBottomIcons: true
    });

    // Update text color when background color changes
    useEffect(() => {
        const contrastingTextColor = getContrastingTextColor(headerSettings.backgroundColor);
        if (headerSettings.textColor !== contrastingTextColor) {
            setHeaderSettings(prev => ({
                ...prev,
                textColor: contrastingTextColor
            }));
        }
    }, [headerSettings.backgroundColor]);

    // Handle background color change
    const handleBackgroundColorChange = (color) => {
        setHeaderSettings(prev => ({
            ...prev,
            backgroundColor: color,
            // Automatically set contrasting text color
            textColor: getContrastingTextColor(color)
        }));
    };

    // Open color picker in bottom sheet
    const openColorPicker = () => {
        const sheetId = openBottomSheet(
            <ColorPicker 
                currentColor={headerSettings.backgroundColor}
                onColorSelect={(color) => {
                    handleBackgroundColorChange(color);
                    closeBottomSheet(sheetId);
                }}
                colorType="background"
            />,
            ['50%']
        );
    };

    // Handle hero image update
    const handleHeroImageUpdate = (response) => {
        if (Array.isArray(response)) {
            // Handle image removal
            setHeaderSettings(prev => ({
                ...prev,
                heroImage: response.length > 0 ? response[0] : null
            }));
        } else if (response && response.files) {
            // Handle bulk file upload
            const newUrl = response.files.map(file => file.url)[0];
            setHeaderSettings(prev => ({
                ...prev,
                heroImage: newUrl
            }));
        } else if (response && response.url) {
            // Handle single file upload
            setHeaderSettings(prev => ({
                ...prev,
                heroImage: response.url
            }));
        }
    };

    // Handle hero layout change
    const handleLayoutChange = (layout) => {
        setHeaderSettings(prev => ({
            ...prev,
            heroLayout: layout
        }));
    };

    // Handle navigation style change
    const handleNavigationStyleChange = (style) => {
        setHeaderSettings(prev => ({
            ...prev,
            navigationStyle: style
        }));
    };

    // Toggle bottom bar icons
    const toggleBottomIcons = () => {
        setHeaderSettings(prev => ({
            ...prev,
            showBottomIcons: !prev.showBottomIcons
        }));
    };

    // Create preview data for HeroPreview component
    const previewData = {
        backgroundColor: headerSettings.backgroundColor,
        heroImage: headerSettings.heroImage,
        displayMode: headerSettings.displayMode,
        heroLayout: headerSettings.heroLayout,
        textColor: headerSettings.textColor
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Card Section */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Header Appearance</Text>
                
                {/* Preview Section */}
                <View style={styles.previewContainer}>
                    <HeroPreview headerData={previewData} />
                </View>

                {/* Colors Section */}
                <Text style={styles.sectionLabel}>Colors</Text>
                <View style={styles.colorOptionsRow}>
                    {/* Background Color */}
                    <TouchableOpacity 
                        style={styles.colorButton}
                        onPress={openColorPicker}
                    >
                        <View style={[styles.colorSwatch, { backgroundColor: headerSettings.backgroundColor }]} />
                        <View style={styles.colorButtonTextContainer}>
                            <Text style={styles.colorButtonLabel}>Background</Text>
                            <Text style={styles.colorButtonValue}>{headerSettings.backgroundColor}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={14} color="#777" />
                    </TouchableOpacity>

                    {/* Text Color */}
                    <View style={styles.colorButton}>
                        <View style={[styles.colorSwatch, { backgroundColor: headerSettings.textColor }]} />
                        <View style={styles.colorButtonTextContainer}>
                            <Text style={styles.colorButtonLabel}>Text (Auto)</Text>
                            <Text style={styles.colorButtonValue}>{headerSettings.textColor}</Text>
                        </View>
                    </View>
                </View>

                {/* Hero Layout Section */}
                <Text style={styles.sectionLabel}>Hero Layout</Text>
                <View style={styles.layoutOptionsRow}>
                    {HERO_LAYOUTS.map(layout => (
                        <TouchableOpacity 
                            key={layout.id}
                            style={[
                                styles.layoutOption,
                                headerSettings.heroLayout === layout.id && styles.selectedLayout
                            ]}
                            onPress={() => handleLayoutChange(layout.id)}
                        >
                            <Ionicons 
                                name={layout.icon} 
                                size={24} 
                                color={headerSettings.heroLayout === layout.id ? "#fff" : "#000"} 
                            />
                            <Text 
                                style={[
                                    styles.layoutLabel,
                                    headerSettings.heroLayout === layout.id && styles.selectedLayoutLabel
                                ]}
                            >
                                {layout.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Hero Image Section */}
                <Text style={styles.sectionLabel}>Hero Image</Text>
                <View style={styles.imagePickerContainer}>
                    <ImageHandler
                        imageUri={headerSettings.heroImage}
                        onImageSelected={(response) => handleHeroImageUpdate(response)}
                        onImageRemoved={() => handleHeroImageUpdate([])}
                        onUploadComplete={(response) => handleHeroImageUpdate(response)}
                        square={false}
                        quality={0.8}
                        upload={true}
                        maxSize={1024}
                        placeholderText="Choose hero background image"
                    />
                </View>
            </View>

            {/* Navigation Card */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Navigation Style</Text>
                
                {/* Navigation Preview */}
                <View style={styles.navPreviewContainer}>
                    <NavigationPreview 
                        navStyle={headerSettings.navigationStyle}
                        backgroundColor={headerSettings.backgroundColor}
                        textColor={headerSettings.textColor}
                        showIcons={headerSettings.showBottomIcons}
                    />
                </View>
                
                {/* Navigation Options */}
                <View style={styles.navigationOptionsContainer}>
                    <NavigationOptions 
                        selectedOption={headerSettings.navigationStyle}
                        onOptionSelect={handleNavigationStyleChange}
                    />
                </View>
                
                {/* Bottom Bar Options - Only show when bottom bar is selected */}
                {headerSettings.navigationStyle === 'bottomBar' && (
                    <View style={styles.bottomBarOptions}>
                        <Text style={styles.sectionLabel}>Bottom Bar Options</Text>
                        <TouchableOpacity 
                            style={styles.toggleOption}
                            onPress={toggleBottomIcons}
                        >
                            <Text style={styles.toggleOptionLabel}>Show Icons</Text>
                            <View style={[
                                styles.toggleSwitch, 
                                headerSettings.showBottomIcons && styles.toggleSwitchActive
                            ]}>
                                <View style={[
                                    styles.toggleSwitchKnob, 
                                    headerSettings.showBottomIcons && styles.toggleSwitchKnobActive
                                ]} />
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.helpText}>
                            Note: Scrolling is enabled for navigation bars with many items
                        </Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f7',
    },
    card: {
        margin: 16,
        marginBottom: 8,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: 16,
    },
    previewContainer: {
        marginBottom: 16,
        borderRadius: 12,
        overflow: 'hidden',
    },
    sectionLabel: {
        fontSize: 15,
        fontWeight: '500',
        color: '#333',
        marginBottom: 10,
        marginTop: 8,
    },
    colorOptionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    colorButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        borderRadius: 8,
        marginHorizontal: 4,
        height: 48,
    },
    colorSwatch: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        marginRight: 8,
    },
    colorButtonTextContainer: {
        flex: 1,
    },
    colorButtonLabel: {
        fontSize: 13,
        fontWeight: '500',
        color: '#333',
    },
    colorButtonValue: {
        fontSize: 11,
        fontFamily: 'monospace',
        color: '#777',
        marginTop: 1,
    },
    layoutOptionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    layoutOption: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 10,
        padding: 12,
        marginHorizontal: 4,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    selectedLayout: {
        backgroundColor: '#000',
        borderColor: '#000',
    },
    layoutLabel: {
        fontSize: 13,
        fontWeight: '500',
        marginTop: 8,
        color: '#000',
        textAlign: 'center',
    },
    selectedLayoutLabel: {
        color: '#fff',
    },
    imagePickerContainer: {
        marginVertical: 4,
    },
    navigationOptionsContainer: {
        marginBottom: 20,
    },
    navPreviewContainer: {
        height: 170,
        marginBottom: 16,
        overflow: 'hidden',
    },
    bottomBarOptions: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    toggleOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 12,
        backgroundColor: 'rgba(0,0,0,0.02)',
        borderRadius: 8,
    },
    toggleOptionLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    toggleSwitch: {
        width: 50,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#e0e0e0',
        paddingHorizontal: 2,
        justifyContent: 'center',
    },
    toggleSwitchActive: {
        backgroundColor: '#000',
    },
    toggleSwitchKnob: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#fff',
    },
    toggleSwitchKnobActive: {
        alignSelf: 'flex-end',
    },
    helpText: {
        fontSize: 12,
        color: '#888',
        marginTop: 8,
        fontStyle: 'italic',
    },
});

export default HeaderTab;
