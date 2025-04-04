import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

// Available display modes for the hero section
const DISPLAY_MODES = [
  {
    id: 'centered',
    label: 'Centered',
    icon: 'ios-albums-outline',
    iconSelected: 'ios-albums',
  },
  {
    id: 'left',
    label: 'Left',
    icon: 'ios-list-outline',
    iconSelected: 'ios-list',
  },
  {
    id: 'overlay',
    label: 'Overlay',
    icon: 'ios-layers-outline',
    iconSelected: 'ios-layers',
  }
];

// Component to select the display mode for the hero
const DisplayModeSelector = memo(({ currentMode, onModeSelect }) => {
  const handleSelect = (mode) => {
    Haptics.selectionAsync();
    onModeSelect(mode);
  };
  
  return (
    <View style={styles.modesContainer}>
      {DISPLAY_MODES.map((mode) => {
        const isSelected = currentMode === mode.id;
        return (
          <TouchableOpacity
            key={mode.id}
            style={[
              styles.modeOption,
              isSelected && styles.selectedMode
            ]}
            onPress={() => handleSelect(mode.id)}
          >
            <Ionicons 
              name={isSelected ? mode.iconSelected : mode.icon} 
              size={22} 
              color={isSelected ? '#fff' : '#555'} 
            />
            <Text style={[
              styles.modeLabel,
              isSelected && styles.selectedModeLabel
            ]}>
              {mode.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  modesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 10,
    padding: 4,
  },
  modeOption: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    margin: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  selectedMode: {
    backgroundColor: '#000',
  },
  modeLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#555',
    marginTop: 6,
  },
  selectedModeLabel: {
    color: '#fff',
  }
});

export default DisplayModeSelector; 