import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDashboard } from '../../../../contexts/DashboardContext';

// Theme options
const THEME_OPTIONS = [
  {
    id: 'dynamic',
    label: 'Dynamic',
    description: 'Adapts to user preferences',
    icon: 'ios-color-filter-outline',
    lightColor: '#f8f9fa',
    darkColor: '#212529',
  },
  {
    id: 'light',
    label: 'Light',
    description: 'Bright theme with dark text',
    icon: 'ios-sunny-outline',
    color: '#FFFFFF',
  },
  {
    id: 'dark',
    label: 'Dark',
    description: 'Dark theme with light text',
    icon: 'ios-moon-outline',
    color: '#212529',
  },
  {
    id: 'custom',
    label: 'Custom',
    description: 'Use your own colors',
    icon: 'ios-color-palette-outline',
  }
];

const ThemeSelector = () => {
  const { currentWebsiteId, getThemeSettings, updateThemeSettings } = useDashboard();
  const themeSettings = getThemeSettings(currentWebsiteId);
  
  // Current theme from theme settings
  const selectedTheme = themeSettings?.theme || 'dynamic';
  const isDarkMode = themeSettings?.isDarkMode || true;
  
  // Handle theme selection
  const handleThemeSelect = (themeId) => {
    // For non-custom themes, set appropriate background and text colors
    if (themeId === 'light') {
      updateThemeSettings({
        theme: themeId,
        backgroundColor: '#FFFFFF',
        textColor: '#000000',
        isDarkMode: false // Ensure isDarkMode is set correctly
      });
    } else if (themeId === 'dark') {
      updateThemeSettings({
        theme: themeId,
        backgroundColor: '#212529',
        textColor: '#FFFFFF',
        isDarkMode: true // Ensure isDarkMode is set correctly
      });
    } else if (themeId === 'dynamic') {
      updateThemeSettings({
        theme: themeId,
        backgroundColor: isDarkMode ? '#212529' : '#FFFFFF',
        textColor: isDarkMode ? '#FFFFFF' : '#000000',
        isDarkMode: isDarkMode
      });
    } else {
      // For custom theme, keep existing colors but update the theme type
      updateThemeSettings({
        ...themeSettings,
        theme: themeId
      });
    }
  };
  
  // Toggle dark mode for dynamic theme
  const toggleDynamicMode = (isDark) => {
    updateThemeSettings({
      ...themeSettings,
      theme: 'dynamic', // Ensure theme is still dynamic
      isDarkMode: isDark,
      backgroundColor: isDark ? '#212529' : '#FFFFFF',
      textColor: isDark ? '#FFFFFF' : '#000000'
    });
  };

  // Get theme color preview based on theme type
  const getThemeColorPreview = (themeId) => {
    const theme = THEME_OPTIONS.find(t => t.id === themeId);
    
    if (themeId === 'dynamic') {
      return isDarkMode ? theme.darkColor : theme.lightColor;
    } else if (themeId === 'custom') {
      return themeSettings?.backgroundColor || '#212529';
    } else {
      return theme?.color || '#212529';
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.themeList}>
        {THEME_OPTIONS.map((theme) => {
          const isSelected = selectedTheme === theme.id;
          const previewColor = getThemeColorPreview(theme.id);
          
          return (
            <TouchableOpacity 
              key={theme.id}
              style={[
                styles.themeOption,
                isSelected && styles.selectedThemeOption
              ]}
              onPress={() => handleThemeSelect(theme.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.colorSwatch, { backgroundColor: previewColor }]} />
              
              <View style={styles.themeContent}>
                <Text style={styles.themeName}>{theme.label}</Text>
                <Text style={styles.themeDescription}>{theme.description}</Text>
              </View>
              
              {isSelected && (
                <Ionicons name="checkmark-circle" size={22} color="#007AFF" style={styles.checkmark} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
      
      {/* Dynamic Theme Mode Toggle */}
      {selectedTheme === 'dynamic' && (
        <View style={styles.dynamicModeContainer}>
          <Text style={styles.dynamicModeTitle}>Preferred Mode:</Text>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleOption,
                !isDarkMode && styles.toggleOptionActive
              ]}
              onPress={() => toggleDynamicMode(false)}
            >
              <Ionicons 
                name="sunny-outline" 
                size={18} 
                color={!isDarkMode ? '#000000' : '#999'} 
                style={styles.toggleIcon}
              />
              <Text style={[
                styles.toggleText,
                !isDarkMode && styles.toggleTextActive
              ]}>Light</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.toggleOption,
                isDarkMode && styles.toggleOptionActive
              ]}
              onPress={() => toggleDynamicMode(true)}
            >
              <Ionicons 
                name="moon-outline" 
                size={18} 
                color={isDarkMode ? '#000000' : '#999'} 
                style={styles.toggleIcon}
              />
              <Text style={[
                styles.toggleText,
                isDarkMode && styles.toggleTextActive
              ]}>Dark</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.dynamicModeDescription}>
            Dynamic theme automatically adapts to device light/dark mode settings
          </Text>
        </View>
      )}

      {/* AI Theme Creator Section */}
      <View style={styles.aiThemeContainer}>
        <View style={styles.aiThemeHeader}>
          <Ionicons name="color-wand-outline" size={20} color="#007AFF" style={styles.aiIcon} />
          <Text style={styles.aiTitle}>Create a theme with AI</Text>
          <View style={styles.comingSoonBadge}>
            <Text style={styles.comingSoonText}>Soon</Text>
          </View>
        </View>
        <Text style={styles.aiDescription}>
          Get professionally designed theme palettes generated from your brand assets
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 5,
  },
  themeList: {
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    marginTop: 8,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  selectedThemeOption: {
    backgroundColor: 'rgba(0,122,255,0.05)',
  },
  colorSwatch: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  themeContent: {
    flex: 1,
  },
  themeName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  themeDescription: {
    fontSize: 12,
    color: '#777',
  },
  checkmark: {
    marginLeft: 8,
  },
  dynamicModeContainer: {
    marginTop: 20,
    marginBottom: 12,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  dynamicModeTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    padding: 4,
    marginBottom: 12,
  },
  toggleOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 6,
  },
  toggleOptionActive: {
    backgroundColor: '#fff',
  },
  toggleIcon: {
    marginRight: 6,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#999',
  },
  toggleTextActive: {
    color: '#000000',
  },
  dynamicModeDescription: {
    fontSize: 12,
    color: '#777',
    lineHeight: 16,
  },
  aiThemeContainer: {
    marginTop: 12,
    padding: 16,
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.2)',
  },
  aiThemeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiIcon: {
    marginRight: 8,
  },
  aiTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  comingSoonBadge: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: '#007AFF',
    borderRadius: 10,
  },
  comingSoonText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  aiDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 17,
  }
});

export default ThemeSelector; 