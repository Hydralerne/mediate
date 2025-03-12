import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Switch,
  Platform,
  Alert
} from 'react-native';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import * as ImagePicker from 'expo-image-picker';
import colors from '../../../../utils/colors';

const ProductForm = ({ product = {}, isNew = false, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: product.title || '',
    price: product.price || '',
    imageUrl: product.imageUrl || '',
    description: product.description || '',
    externalLink: product.externalLink || '',
    sellDirectly: product.sellDirectly !== false, // Default to true
    inventory: product.inventory?.toString() || '0',
    featured: product.featured || false
  });
  
  const titleInputRef = useRef(null);
  
  useEffect(() => {
    // Focus the title input when the form opens
    if (titleInputRef.current) {
      setTimeout(() => titleInputRef.current.focus(), 100);
    }
  }, []);
  
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSave = () => {
    // Only save if we have at least a title
    if (formData.title.trim()) {
      if (onSave) {
        // Convert inventory to number
        const inventory = parseInt(formData.inventory) || 0;
        
        onSave({
          ...formData,
          inventory
        });
      }
    } else {
      Alert.alert(
        "Missing Information", 
        "Please enter a product title",
        [
          { 
            text: "OK", 
            onPress: () => {
              // Focus on title input
              if (titleInputRef.current) {
                titleInputRef.current.focus();
              }
            } 
          }
        ]
      );
      return; // Don't close if validation fails
    }
    
    // Always call onClose to ensure the sheet closes
    if (onClose) onClose();
  };

  const pickImage = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please allow access to your photo library to select product images.');
        return;
      }
      
      // Launch image picker with square aspect ratio
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Square aspect ratio
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Use the selected image URI
        updateField('imageUrl', result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {isNew ? 'Add Product' : 'Edit Product'}
        </Text>
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={handleSave}
          activeOpacity={0.7}
        >
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          {/* Image Selection */}
          <TouchableOpacity 
            style={styles.imageSelector}
            onPress={pickImage}
            activeOpacity={0.8}
          >
            {formData.imageUrl ? (
              <View style={styles.imagePreviewContainer}>
                <Image 
                  source={{ uri: formData.imageUrl }} 
                  style={styles.imagePreview} 
                  resizeMode="cover"
                />
                <View style={styles.imageOverlay}>
                  <Text style={styles.changeImageText}>Tap to change</Text>
                </View>
              </View>
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.addImageIconText}>+</Text>
                <Text style={styles.placeholderText}>Add Image</Text>
              </View>
            )}
          </TouchableOpacity>
          
          {/* Title Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Product Title *</Text>
            <BottomSheetTextInput
              ref={titleInputRef}
              style={styles.input}
              value={formData.title}
              onChangeText={(value) => updateField('title', value)}
              placeholder="Enter product title"
            />
          </View>
          
          {/* Price Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Price</Text>
            <BottomSheetTextInput
              style={styles.input}
              value={formData.price}
              onChangeText={(value) => updateField('price', value)}
              placeholder="0.00"
              keyboardType="numeric"
            />
          </View>
          
          {/* Description Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Description</Text>
            <BottomSheetTextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(value) => updateField('description', value)}
              placeholder="Enter product description"
              multiline
              numberOfLines={4}
            />
          </View>
          
          {/* Sell Directly Toggle */}
          <View style={styles.toggleContainer}>
            <View style={styles.toggleTextContainer}>
              <Text style={styles.toggleLabel}>Sell Directly</Text>
              <Text style={styles.toggleDescription}>
                Enable customers to purchase this product directly
              </Text>
            </View>
            <Switch
              value={formData.sellDirectly}
              onValueChange={(value) => updateField('sellDirectly', value)}
              trackColor={{ false: '#D1D1D6', true: colors.primary || '#000' }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          {/* External Link (only show if not selling directly) */}
          {!formData.sellDirectly && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>External Purchase Link</Text>
              <BottomSheetTextInput
                style={styles.input}
                value={formData.externalLink}
                onChangeText={(value) => updateField('externalLink', value)}
                placeholder="https://example.com/buy-product"
                autoCapitalize="none"
              />
            </View>
          )}
          
          {/* Inventory (only show if selling directly) */}
          {formData.sellDirectly && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Inventory</Text>
              <BottomSheetTextInput
                style={styles.input}
                value={formData.inventory}
                onChangeText={(value) => {
                  // Only allow numbers
                  if (/^\d*$/.test(value)) {
                    updateField('inventory', value);
                  }
                }}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>
          )}
          
          {/* Featured Toggle */}
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>Featured Product</Text>
            <Switch
              value={formData.featured}
              onValueChange={(value) => updateField('featured', value)}
              trackColor={{ false: '#D1D1D6', true: colors.primary || '#000' }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          {/* Spacer for keyboard */}
          <View style={styles.keyboardSpacer} />
        </View>
      </ScrollView>
      
      {/* Add a bottom button as a fallback for closing */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
          activeOpacity={0.7}
        >
          <Text style={styles.saveButtonText}>Save Product</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
  },
  doneText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary || '#007AFF',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 80, // Space for bottom button
  },
  formContainer: {
    padding: 16,
  },
  imageSelector: {
    marginBottom: 20,
    alignItems: 'center',
  },
  imagePreviewContainer: {
    position: 'relative',
    width: 150,
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 8,
    alignItems: 'center',
  },
  changeImageText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  imagePlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  addImageIconText: {
    fontSize: 40,
    color: '#666',
    marginBottom: 8,
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  toggleTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  toggleDescription: {
    fontSize: 14,
    color: '#666',
  },
  keyboardSpacer: {
    height: 100,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  saveButton: {
    backgroundColor: colors.primary || '#000',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProductForm; 