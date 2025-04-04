import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const LogoUploader = memo(({ logo, onLogoSelect, onLogoRemove }) => {
  const handleUpload = () => {
    Haptics.selectionAsync();
    onLogoSelect();
  };

  const handleRemove = () => {
    Haptics.selectionAsync();
    onLogoRemove();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.helperText}>
        Upload a logo to replace the title text
      </Text>
      
      {!logo ? (
        <TouchableOpacity 
          style={styles.uploadContainer}
          onPress={handleUpload}
          activeOpacity={0.7}
        >
          <Ionicons name="image-outline" size={32} color="#777" />
          <Text style={styles.uploadText}>Upload Logo</Text>
          <Text style={styles.uploadSubtext}>PNG with transparent background recommended</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.logoContainer}>
          <View style={styles.logoPreviewWrapper}>
            <Image 
              source={{ uri: logo }} 
              style={styles.logoPreview}
              resizeMode="contain"
            />
            <View style={styles.imageOverlay}>
              <Text style={styles.logoSizeText}>Logo Preview</Text>
            </View>
          </View>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.changeButton}
              onPress={handleUpload}
            >
              <Ionicons name="refresh-outline" size={16} color="#555" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Change Logo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={handleRemove}
            >
              <Ionicons name="trash-outline" size={16} color="#ff3b30" style={styles.buttonIcon} />
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      <Text style={styles.noteText}>
        Note: You can still add a tagline in the Title/Tagline section below the logo
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  helperText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  uploadContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    borderStyle: 'dashed',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginTop: 12,
  },
  uploadSubtext: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  logoContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  logoPreviewWrapper: {
    position: 'relative',
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 8,
    overflow: 'hidden',
  },
  logoPreview: {
    width: '100%',
    height: 120,
    backgroundColor: 'transparent',
  },
  imageOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  logoSizeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  changeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    justifyContent: 'center',
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,59,48,0.1)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 6,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
  },
  removeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ff3b30',
  },
  noteText: {
    fontSize: 12,
    color: '#888',
    marginTop: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  }
});

export default LogoUploader; 