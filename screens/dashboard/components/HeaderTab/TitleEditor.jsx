import React, { memo, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

// Component for editing the hero title
const TitleEditor = memo(({ title, tagline, onTitleChange, onTaglineChange }) => {
  const [titleFocused, setTitleFocused] = useState(false);
  const [taglineFocused, setTaglineFocused] = useState(false);
  const [showTagline, setShowTagline] = useState(!!tagline);

  const handleTitleSubmit = () => {
    Haptics.selectionAsync();
  };

  const handleTaglineSubmit = () => {
    Haptics.selectionAsync();
  };
  
  const toggleTagline = (value) => {
    setShowTagline(value);
    if (!value) {
      onTaglineChange('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Brand Title</Text>
        <View style={[styles.inputWrapper, titleFocused && styles.focusedInput]}>
          <Ionicons name="text" size={20} color="#777" style={styles.inputIcon} />
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={onTitleChange}
            placeholder="Enter your brand name"
            placeholderTextColor="#999"
            onFocus={() => setTitleFocused(true)}
            onBlur={() => setTitleFocused(false)}
            onSubmitEditing={handleTitleSubmit}
            returnKeyType="done"
            maxLength={50}
          />
          {title ? (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => onTitleChange('')}
            >
              <Ionicons name="close-circle" size={18} color="#999" />
            </TouchableOpacity>
          ) : null}
        </View>
        
        <Text style={styles.characterCount}>
          {title ? `${title.length}/50` : '0/50'}
        </Text>
      </View>

      <View style={styles.taglineToggleContainer}>
        <Text style={styles.taglineToggleLabel}>Add a tagline</Text>
        <Switch
          value={showTagline}
          onValueChange={toggleTagline}
          trackColor={{ false: '#d1d1d1', true: 'rgba(0,0,0,0.1)' }}
          thumbColor={showTagline ? '#000' : '#f4f3f4'}
        />
      </View>

      {showTagline && (
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Tagline (Optional)</Text>
          <View style={[styles.inputWrapper, taglineFocused && styles.focusedInput]}>
            <Ionicons name="chatbubble-outline" size={20} color="#777" style={styles.inputIcon} />
            <TextInput
              style={styles.taglineInput}
              value={tagline}
              onChangeText={onTaglineChange}
              placeholder="Enter a short catchy phrase"
              placeholderTextColor="#999"
              onFocus={() => setTaglineFocused(true)}
              onBlur={() => setTaglineFocused(false)}
              onSubmitEditing={handleTaglineSubmit}
              returnKeyType="done"
              maxLength={100}
            />
            {tagline ? (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => onTaglineChange('')}
              >
                <Ionicons name="close-circle" size={18} color="#999" />
              </TouchableOpacity>
            ) : null}
          </View>
          
          <Text style={styles.characterCount}>
            {tagline ? `${tagline.length}/100` : '0/100'}
          </Text>
        </View>
      )}

      <View style={styles.tips}>
        <Ionicons name="information-circle-outline" size={18} color="#0066cc" style={styles.tipIcon} />
        <Text style={styles.tipText}>
          A good title should be clear and memorable. Taglines can add context to what your brand offers.
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.5)',
    paddingHorizontal: 12,
    height: 50,
  },
  focusedInput: {
    borderColor: '#007bff',
    backgroundColor: 'rgba(255,255,255,0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 10,
  },
  titleInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 10,
  },
  taglineInput: {
    flex: 1,
    fontSize: 15,
    color: '#555',
    paddingVertical: 10,
  },
  clearButton: {
    padding: 5,
  },
  characterCount: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
    marginTop: 4,
    marginRight: 8,
  },
  taglineToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  taglineToggleLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
  },
  tips: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 102, 204, 0.08)',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'flex-start',
  },
  tipIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#444',
    lineHeight: 18,
  },
});

export default TitleEditor; 