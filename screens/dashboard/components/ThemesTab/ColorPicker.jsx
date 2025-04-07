import React, { useState, memo, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

// Color palettes
const COLOR_PALETTES = {
  "Neutrals": ['#000000', '#212529', '#343a40', '#495057', '#6c757d', '#adb5bd', '#ced4da', '#dee2e6', '#e9ecef', '#f8f9fa', '#FFFFFF'],
  "Blues": ['#0d6efd', '#0d6efda0', '#0a58ca', '#084298', '#052c65', '#032830', '#CFE2FF', '#9ec5fe', '#6ea8fe', '#3d8bfd', '#0D47A1'],
  "Reds": ['#dc3545', '#dc3545a0', '#b02a37', '#842029', '#58151c', '#2c0b0e', '#F8D7DA', '#f5c2c7', '#ea868f', '#dc3545', '#C62828'],
  "Greens": ['#198754', '#198754a0', '#146c43', '#0f5132', '#0a3622', '#051b11', '#D1E7DD', '#a3cfbb', '#75c298', '#479f76', '#1B5E20'],
  "Yellows": ['#ffc107', '#ffc107a0', '#cc9a06', '#997404', '#664d03', '#332701', '#FFF3CD', '#ffe69c', '#ffda6a', '#ffcd39', '#F57F17'],
  "Purples": ['#6f42c1', '#6f42c1a0', '#59359a', '#432874', '#2c1a4d', '#160d27', '#E2D9F3', '#c5b3e6', '#a98eda', '#8c68cd', '#4A148C'],
  "Primary": ['#007bff', '#6610f2', '#6f42c1', '#e83e8c', '#dc3545', '#fd7e14', '#ffc107', '#28a745', '#20c997', '#17a2b8', '#6c757d']
};

const ColorPicker = memo(({ currentColor, onColorSelect, colorType = 'background' }) => {
  const [selectedPalette, setSelectedPalette] = useState('Neutrals');
  const [hexInput, setHexInput] = useState(currentColor || '#000000');
  const [isHexValid, setIsHexValid] = useState(true);
  
  // Update hex input when current color changes
  useEffect(() => {
    if (currentColor) {
      setHexInput(currentColor);
    }
  }, [currentColor]);
  
  // Validate hex color
  const validateHex = (hex) => {
    const regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return regex.test(hex);
  };
  
  // Handle hex input change
  const handleHexChange = (text) => {
    // Add # if not present
    let formattedText = text;
    if (text.charAt(0) !== '#') {
      formattedText = '#' + text;
    }
    
    setHexInput(formattedText);
    const isValid = validateHex(formattedText);
    setIsHexValid(isValid);
    
    // Update color if valid
    if (isValid) {
      onColorSelect(formattedText);
    }
  };
  
  // Handle color swatch selection
  const handleSwatchSelect = (color) => {
    Haptics.selectionAsync();
    setHexInput(color);
    setIsHexValid(true);
    onColorSelect(color);
  };

  // Render color palette section
  const renderPalette = (paletteName, colors) => {
    const isActive = selectedPalette === paletteName;
    
    return (
      <View key={paletteName} style={styles.paletteSection}>
        <TouchableOpacity 
          style={[styles.paletteHeader, isActive && styles.activePaletteHeader]}
          onPress={() => setSelectedPalette(isActive ? null : paletteName)}
          activeOpacity={0.7}
        >
          <Text style={[styles.paletteName, isActive && styles.activePaletteName]}>
            {paletteName}
          </Text>
          <Ionicons 
            name={isActive ? "chevron-up" : "chevron-down"} 
            size={16} 
            color={isActive ? "#000" : "rgba(0,0,0,0.6)"} 
          />
        </TouchableOpacity>
        
        {isActive && (
          <View style={styles.colorsGrid}>
            {colors.map(color => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorSwatch,
                  { backgroundColor: color },
                  hexInput.toLowerCase() === color.toLowerCase() && styles.selectedSwatch
                ]}
                onPress={() => handleSwatchSelect(color)}
              >
                {hexInput.toLowerCase() === color.toLowerCase() && (
                  <Ionicons name="checkmark" size={16} color={validateHex(color) && isLightColor(color) ? '#000' : '#fff'} style={styles.checkmark} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select {colorType} color</Text>
      
      {/* Custom Hex Input */}
      <View style={styles.hexInputContainer}>
        <View style={[styles.colorPreview, { backgroundColor: isHexValid ? hexInput : '#ff0000' }]} />
        <TextInput
          style={[styles.hexInput, !isHexValid && styles.invalidHexInput]}
          value={hexInput}
          onChangeText={handleHexChange}
          placeholder="#000000"
          placeholderTextColor="#aaa"
          autoCapitalize="characters"
          maxLength={9} // Allow for #RRGGBBAA
          spellCheck={false}
          autoCorrect={false}
        />
      </View>
      
      {!isHexValid && (
        <Text style={styles.errorText}>Please enter a valid hex color (e.g. #FF5500)</Text>
      )}
      
      {/* Color Palettes */}
      <View style={styles.palettesContainer}>
        {Object.entries(COLOR_PALETTES).map(([paletteName, colors]) => 
          renderPalette(paletteName, colors)
        )}
      </View>
      
      {/* Done Button */}
      <TouchableOpacity 
        style={[styles.doneButton, !isHexValid && styles.disabledButton]}
        onPress={() => isHexValid && onColorSelect(hexInput)}
        disabled={!isHexValid}
        activeOpacity={0.7}
      >
        <Text style={styles.doneButtonText}>Apply Color</Text>
      </TouchableOpacity>
    </View>
  );
});

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

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  hexInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
  },
  colorPreview: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  hexInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'monospace',
    color: '#333',
    padding: 4,
  },
  invalidHexInput: {
    color: '#dc3545',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 12,
    marginBottom: 12,
  },
  palettesContainer: {
    marginBottom: 16,
  },
  paletteSection: {
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    borderRadius: 8,
    overflow: 'hidden',
  },
  paletteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
  },
  activePaletteHeader: {
    backgroundColor: '#e0e0e0',
  },
  paletteName: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(0,0,0,0.7)',
  },
  activePaletteName: {
    color: '#000',
  },
  colorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    backgroundColor: '#fff',
  },
  colorSwatch: {
    width: 40,
    height: 40,
    margin: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedSwatch: {
    borderWidth: 2,
    borderColor: '#007bff',
  },
  checkmark: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
  },
  doneButton: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  disabledButton: {
    backgroundColor: '#adb5bd',
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ColorPicker;