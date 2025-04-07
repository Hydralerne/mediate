import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThemeSelector from './ThemeSelector';
import ColorPicker from './ColorPicker';
import AIThemeGenerator from './AIThemeGenerator';
import { useBottomSheet } from '../../../../contexts/BottomSheet';
import { useDashboard } from '../../../../contexts/DashboardContext';

const Main = () => {
    const { openBottomSheet, closeBottomSheet } = useBottomSheet();
    const { 
        currentWebsiteId, 
        getThemeSettings, 
        updateThemeSettings 
    } = useDashboard();

    // Get theme settings from context
    const themeSettings = getThemeSettings(currentWebsiteId);

    console.log(themeSettings);
    
    // Add theme settings if not present
    useEffect(() => {
        if (!themeSettings.theme) {
            updateThemeSettings({
                theme: 'dynamic',
                isDarkMode: true, // Default to dark mode
                backgroundColor: '#212529',
                textColor: '#FFFFFF'
            });
        }
    }, [currentWebsiteId, updateThemeSettings]);

    // Handle color change from color picker
    const handleColorChange = (mode, color) => {
        if (mode === 'background') {
            updateThemeSettings({
                ...themeSettings,
                backgroundColor: color,
                textColor: getContrastingTextColor(color),
                theme: 'custom' // Switch to custom theme when manually changing colors
            });
        } else if (mode === 'text') {
            updateThemeSettings({
                ...themeSettings,
                textColor: color,
                theme: 'custom' // Switch to custom theme when manually changing colors
            });
        }
    };

    // Open color picker in bottom sheet
    const openColorPicker = (mode, initialColor) => {
        const sheetId = openBottomSheet(
            <ColorPicker 
                currentColor={initialColor}
                onColorSelect={(color) => {
                    handleColorChange(mode, color);
                    closeBottomSheet(sheetId);
                }}
                colorType={mode}
            />,
            ['50%']
        );
    };

    // Define theme colors with fallback values
    const bgColor = themeSettings?.backgroundColor || '#212529';
    const txtColor = themeSettings?.textColor || '#FFFFFF';

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Color Preview Card */}
            <View style={styles.previewCard}>
                <View style={[styles.colorPreview, { backgroundColor: bgColor }]}>
                    <Text style={[styles.previewText, { color: txtColor }]}>
                        Theme Preview
                    </Text>
                    <View style={styles.previewButtonRow}>
                        <View style={[styles.previewButton, { backgroundColor: txtColor, opacity: 0.9 }]}>
                            <Text style={[styles.previewButtonText, { color: bgColor }]}>Button</Text>
                        </View>
                        <View style={[styles.previewButtonOutline, { borderColor: txtColor }]}>
                            <Text style={[styles.previewButtonOutlineText, { color: txtColor }]}>Button</Text>
                        </View>
                    </View>
                </View>
                <Text style={styles.previewCaption}>
                    This is how your website's theme will appear to visitors
                </Text>
            </View>

            {/* Theme Card */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Theme Style</Text>
                <Text style={styles.cardDescription}>
                    Choose a theme for your website. This will affect the appearance of all pages.
                </Text>
                
                {/* Theme Selector Component */}
                <ThemeSelector />
            </View>
            
            {/* Colors Card */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Colors</Text>
                <Text style={styles.cardDescription}>
                    Customize the colors used throughout your website.
                </Text>
                
                <View style={styles.colorOptionsRow}>
                    {/* Background Color */}
                    <TouchableOpacity 
                        style={styles.colorButton}
                        onPress={() => openColorPicker('background', bgColor)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.colorButtonContent}>
                            <View style={[styles.colorSwatch, { backgroundColor: bgColor }]} />
                            <View style={styles.colorButtonTextContainer}>
                                <Text style={styles.colorButtonLabel}>Background</Text>
                                <Text style={styles.colorButtonValue}>{bgColor}</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#999" />
                    </TouchableOpacity>
                </View>
                
                <View style={styles.colorOptionsRow}>
                    {/* Text Color */}
                    <TouchableOpacity 
                        style={styles.colorButton}
                        onPress={() => openColorPicker('text', txtColor)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.colorButtonContent}>
                            <View style={[styles.colorSwatch, { backgroundColor: txtColor }]} />
                            <View style={styles.colorButtonTextContainer}>
                                <Text style={styles.colorButtonLabel}>Text Color</Text>
                                <Text style={styles.colorButtonValue}>{txtColor}</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#999" />
                    </TouchableOpacity>
                </View>
                
                <TouchableOpacity
                    style={styles.resetButton}
                    onPress={() => updateThemeSettings({
                        ...themeSettings,
                        backgroundColor: '#212529',
                        textColor: '#FFFFFF'
                    })}
                >
                    <Ionicons name="refresh-outline" size={16} color="#666" style={styles.resetIcon} />
                    <Text style={styles.resetButtonText}>Reset to Default Colors</Text>
                </TouchableOpacity>
            </View>
            
            {/* AI Theme Generator Component */}
            <AIThemeGenerator />
            
            {/* Typography Card - Placeholder for future expansion */}
            <View style={styles.card}>
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.cardTitle}>Typography</Text>
                    <View style={styles.comingSoonBadge}>
                        <Text style={styles.comingSoonBadgeText}>Coming Soon</Text>
                    </View>
                </View>
                <Text style={styles.cardDescription}>
                    Customize fonts for headings and body text throughout your website.
                </Text>
                <View style={styles.comingSoonContainer}>
                    <Ionicons name="text" size={32} color="#ddd" />
                    <Text style={styles.comingSoonText}>Font customization will be available soon</Text>
                </View>
            </View>
        </ScrollView>
    );
};

// Helper function to detect if a color is light or dark
const isLightColor = (hexColor) => {
    if (!hexColor || typeof hexColor !== 'string') return false;
    
    // Remove the hash if it exists
    hexColor = hexColor.replace('#', '');
    
    // Parse the RGB values
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);
    
    // Calculate the perceived brightness (using the formula from W3C)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // Return true if the color is light (brightness > 125)
    return brightness > 125;
};

// Helper function to get contrasting text color based on background color
const getContrastingTextColor = (backgroundColor) => {
    return isLightColor(backgroundColor) ? '#000000' : '#FFFFFF';
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    previewCard: {
        margin: 16,
        marginBottom: 8,
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    colorPreview: {
        height: 140,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    previewText: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
    },
    previewButtonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
        marginHorizontal: 6,
    },
    previewButtonText: {
        fontSize: 14,
        fontWeight: '500',
    },
    previewButtonOutline: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
        marginHorizontal: 6,
        borderWidth: 1,
    },
    previewButtonOutlineText: {
        fontSize: 14,
        fontWeight: '500',
    },
    previewCaption: {
        fontSize: 12,
        color: '#777',
        padding: 12,
        textAlign: 'center',
        backgroundColor: '#f9f9f9',
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
        marginBottom: 8,
    },
    cardDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
        lineHeight: 20,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    sectionLabel: {
        fontSize: 15,
        fontWeight: '500',
        color: '#333',
        marginBottom: 10,
        marginTop: 12,
    },
    colorOptionsRow: {
        marginBottom: 12,
    },
    colorButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 14,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.08)',
        borderRadius: 10,
        backgroundColor: '#f9f9f9',
    },
    colorButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    colorSwatch: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        marginRight: 12,
    },
    colorButtonTextContainer: {
        flex: 1,
    },
    colorButtonLabel: {
        fontSize: 15,
        fontWeight: '500',
        color: '#333',
    },
    colorButtonValue: {
        fontSize: 12,
        fontFamily: 'monospace',
        color: '#777',
        marginTop: 2,
    },
    resetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        paddingVertical: 10,
        backgroundColor: 'rgba(0,0,0,0.03)',
        borderRadius: 8,
    },
    resetIcon: {
        marginRight: 6,
    },
    resetButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666',
    },
    comingSoonContainer: {
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.02)',
        borderRadius: 10,
        marginVertical: 8,
    },
    comingSoonText: {
        fontSize: 14,
        color: '#999',
        marginTop: 8,
        textAlign: 'center',
    },
    comingSoonBadge: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 10,
    },
    comingSoonBadgeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '600',
    },
});

export default Main; 