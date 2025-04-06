import React, { memo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

// More attractive professional color palettes for websites
const COLOR_PALETTES = {
  Dark: ['#212529', '#343a40', '#495057', '#6c757d', '#242628'],
  Light: ['#f8f9fa', '#e9ecef', '#dee2e6', '#ced4da', '#f2f2f2'],
  Blue: ['#007bff', '#0069d9', '#0062cc', '#005cbf', '#3a8eff'],
  Indigo: ['#6610f2', '#5a0fbe', '#510ea8', '#4b0a93', '#7d3dd9'],
  Purple: ['#6f42c1', '#633bb2', '#593da5', '#513997', '#8c52e6'],
  Teal: ['#20c997', '#1db386', '#1a9e76', '#178966', '#2de6af'],
  Green: ['#28a745', '#24953e', '#208838', '#1d7c33', '#2ec94f'],
  Red: ['#dc3545', '#c8303e', '#b52c38', '#a22833', '#eb4d5d'],
  Orange: ['#fd7e14', '#e67211', '#d3690f', '#c0600e', '#ff9133'],
  Yellow: ['#ffc107', '#e5ae06', '#d2a005', '#be9005', '#ffd54f'],
};

// A more sophisticated color picker component
const ColorPicker = memo(({ currentColor, onColorSelect, colorType = 'background' }) => {
  const [selectedPalette, setSelectedPalette] = useState(null);
  
  const handleSelect = (color) => {
    Haptics.selectionAsync();
    onColorSelect(color);
  };

  const renderPalette = (paletteName, colors) => {
    const isActive = selectedPalette === paletteName;
    
    return (
      <View key={paletteName} style={styles.paletteSection}>
        <TouchableOpacity 
          style={[styles.paletteHeader, isActive && styles.activePaletteHeader]}
          onPress={() => setSelectedPalette(isActive ? null : paletteName)}
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
          <View style={styles.colorsRow}>
            {colors.map(color => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorSwatch,
                  { backgroundColor: color },
                  currentColor === color && styles.selectedSwatch
                ]}
                onPress={() => handleSelect(color)}
              >
                {currentColor === color && (
                  <Ionicons name="checkmark" size={16} color="#fff" style={styles.checkmark} />
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
      <View style={styles.headerRow}>
        <Text style={styles.title}>
          {colorType === 'background' ? 'Select Background Color' : 'Select Text Color'}
        </Text>
        <View style={styles.previewContainer}>
          <View 
            style={[
              styles.previewSwatch,
              { backgroundColor: currentColor || '#212529' }
            ]}
          />
          <Text style={styles.previewValue}>{currentColor || '#212529'}</Text>
        </View>
      </View>
      
      <ScrollView style={styles.paletteContainer} showsVerticalScrollIndicator={false}>
        {Object.entries(COLOR_PALETTES).map(([paletteName, colors]) => 
          renderPalette(paletteName, colors)
        )}
      </ScrollView>
      
      <View style={styles.quickColors}>
        <Text style={styles.quickTitle}>Quick Select</Text>
        <FlatList
          data={['#000000', '#FFFFFF', '#f8f9fa', '#212529', '#6c757d', '#007bff']}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={color => color}
          renderItem={({item: color}) => (
            <TouchableOpacity
              style={[
                styles.quickSwatch,
                { backgroundColor: color },
                currentColor === color && styles.selectedQuickSwatch
              ]}
              onPress={() => handleSelect(color)}
            />
          )}
          contentContainerStyle={styles.quickSwatchContainer}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  paletteContainer: {
    maxHeight: 300,
    marginBottom: 12,
  },
  paletteSection: {
    marginBottom: 10,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 10,
    overflow: 'hidden',
  },
  paletteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  activePaletteHeader: {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  paletteName: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(0,0,0,0.7)',
  },
  activePaletteName: {
    color: '#000',
  },
  colorsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  colorSwatch: {
    width: 42,
    height: 42,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedSwatch: {
    borderWidth: 2,
    borderColor: '#000',
  },
  checkmark: {
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewSwatch: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  previewValue: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.7)',
    fontFamily: 'monospace',
  },
  quickColors: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  quickTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: 'rgba(0,0,0,0.6)',
  },
  quickSwatchContainer: {
    paddingVertical: 8,
  },
  quickSwatch: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  selectedQuickSwatch: {
    borderWidth: 2,
    borderColor: '#000',
    transform: [{scale: 1.1}],
  }
});

export default ColorPicker; 