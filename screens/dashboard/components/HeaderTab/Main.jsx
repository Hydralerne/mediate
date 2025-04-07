import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ImageHandler from '../../../../components/global/ImageHandler';
import HeroPreview from './HeroPreview';
import NavigationOptions from './NavigationOptions';
import NavigationPreview from './NavigationPreview';
import { useBottomSheet } from '../../../../contexts/BottomSheet';
import { useDashboard } from '../../../../contexts/DashboardContext';

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
    const { 
        currentWebsiteId, 
        getHeaderSettings, 
        updateHeaderSettings 
    } = useDashboard();

    // Get header settings from context
    const headerSettings = getHeaderSettings(currentWebsiteId);
    
    // Update text color when background color changes
    useEffect(() => {
        const contrastingTextColor = getContrastingTextColor(headerSettings.backgroundColor);
        if (headerSettings.textColor !== contrastingTextColor) {
            updateHeaderSettings({
                ...headerSettings,
                textColor: contrastingTextColor
            });
        }
    }, [headerSettings.backgroundColor]);

    // Handle background color change
    const handleBackgroundColorChange = (color) => {
        updateHeaderSettings({
            ...headerSettings,
            backgroundColor: color,
            // Automatically set contrasting text color
            textColor: getContrastingTextColor(color)
        });
    };
    // Handle hero image update
    const handleHeroImageUpdate = (response) => {
        if (Array.isArray(response)) {
            // Handle image removal
            updateHeaderSettings({
                ...headerSettings,
                heroImage: response.length > 0 ? response[0] : null
            });
        } else if (response && response.files) {
            // Handle bulk file upload
            const newUrl = response.files.map(file => file.url)[0];
            updateHeaderSettings({
                ...headerSettings,
                heroImage: newUrl
            });
        } else if (response && response.url) {
            // Handle single file upload
            updateHeaderSettings({
                ...headerSettings,
                heroImage: response.url
            });
        }
    };

    // Handle hero layout change
    const handleLayoutChange = (layout) => {
        updateHeaderSettings({
            ...headerSettings,
            heroLayout: layout
        });
    };

    // Handle navigation style change
    const handleNavigationStyleChange = (style) => {
        updateHeaderSettings({
            ...headerSettings,
            navigationStyle: style
        });
    };

    // Toggle bottom bar icons
    const toggleBottomIcons = () => {
        updateHeaderSettings({
            ...headerSettings,
            showBottomIcons: !headerSettings.showBottomIcons
        });
    };

    // Create preview data for HeroPreview component
    const previewData = {
        backgroundColor: headerSettings.backgroundColor || '#212529',
        heroImage: headerSettings.heroImage,
        displayMode: headerSettings.displayMode,
        heroLayout: headerSettings.heroLayout,
        textColor: headerSettings.textColor || '#FFFFFF'
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
                                size={22} 
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
                        backgroundColor={headerSettings.backgroundColor || '#212529'}
                        textColor={headerSettings.textColor || '#FFFFFF'}
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
    },
    card: {
        margin: 16,
        marginBottom: 8,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
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
