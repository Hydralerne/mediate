import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Platform,
  Alert,
  Modal,
  FlatList,
  NativeModules
} from 'react-native';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import colors from '../../../../utils/colors';
import ImageHandler from '../../../global/ImageHandler';
import { Ionicons } from '@expo/vector-icons';
import { useBottomSheet } from '../../../../contexts/BottomSheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { handleImagesUpdate } from '../../../../utils/media/imagesServices';
// Define available currencies
const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
];

// Get default currency based on locale or saved preference
const getDefaultCurrency = async () => {
  try {
    // Check if there's a saved currency in AsyncStorage
    const savedCurrency = await AsyncStorage.getItem('preferredCurrency');
    if (savedCurrency) {
      // Validate that the saved currency is in our list
      if (currencies.some(c => c.code === savedCurrency)) {
        return savedCurrency;
      }
    }
    
    // Fall back to locale detection if no valid saved currency
    const locale = Platform.OS === 'ios' ?
      NativeModules.SettingsManager.settings.AppleLocale ||
      NativeModules.SettingsManager.settings.AppleLanguages[0] :
      NativeModules.I18nManager.localeIdentifier;

    // Simple mapping of common locales to currencies
    if (locale.includes('US')) return 'USD';
    if (locale.includes('GB')) return 'GBP';
    if (locale.includes('EG')) return 'EGP';
    if (locale.includes('EU')) return 'EUR';
    if (locale.includes('SA')) return 'SAR'; // Saudi Arabia

    // Default to USD
    return 'USD';
  } catch (error) {
    return 'USD'; // Default fallback
  }
};

// Currency selector component for bottom sheet
const CurrencySelector = ({ onSelect, currentCurrency, onClose }) => {
  return (
    <View style={styles.currencySelectorSheet}>
      <View style={styles.currencySheetHeader}>
        <Text style={styles.currencySheetTitle}>Select Currency</Text>
        <TouchableOpacity
          onPress={onClose}
          style={styles.currencySheetCloseButton}
        >
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={currencies}
        keyExtractor={(item) => item.code}
        style={styles.currencyList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.currencyItem,
              item.code === currentCurrency && styles.selectedCurrencyItem
            ]}
            onPress={() => {
              onSelect(item.code);
              onClose();
            }}
          >
            <Text style={styles.currencySymbol}>{item.symbol}</Text>
            <View style={styles.currencyInfo}>
              <Text style={styles.currencyCode}>{item.code}</Text>
              <Text style={styles.currencyName}>{item.name}</Text>
            </View>
            {item.code === currentCurrency && (
              <Ionicons name="checkmark-circle" size={24} color={colors.primary || '#000'} />
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const ProductForm = ({ product = {}, isNew = false, onSave, onClose }) => {

  const [formData, setFormData] = useState({
    title: product.title || '',
    price: product.price || '',
    currency: product.currency || 'USD',
    image_urls: product.image_urls || [],
    description: product.description || '',
    external_link: product.external_link || '',
    sell_directly: product.sell_directly !== false,
    inventory: product.inventory?.toString() || '0',
    featured: product.featured || false,
    options: product.options || []
  });

  const { openBottomSheet, closeBottomSheet } = useBottomSheet();
  const titleInputRef = useRef(null);

  useEffect(() => {
    // Focus the title input when the form opens
    if (titleInputRef.current) {
      setTimeout(() => titleInputRef.current.focus(), 100);
    }
    
    // Load saved currency from AsyncStorage
    const loadSavedCurrency = async () => {
      try {
        const savedCurrency = await getDefaultCurrency();
        // Only update if different from product currency and no product currency provided
        if (!product.currency && savedCurrency !== formData.currency) {
          setFormData(prev => ({ ...prev, currency: savedCurrency }));
        }
      } catch (error) {
        console.warn('Failed to load saved currency:', error);
      }
    };
    
    loadSavedCurrency();
  }, []);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Save currency to AsyncStorage when it changes
    if (field === 'currency') {
      try {
        AsyncStorage.setItem('preferredCurrency', value)
          .catch(error => console.warn('Failed to save currency preference:', error));
      } catch (error) {
        console.warn('Failed to save currency preference:', error);
      }
    }
  };

  // Handle adding a new product option
  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [
        ...prev.options,
        {
          id: Date.now().toString(), // unique ID
          name: '',
          values: [''],
          required: true
        }
      ]
    }));
  };

  // Handle updating a product option's name
  const updateOptionName = (optionId, name) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map(option => 
        option.id === optionId ? { ...option, name } : option
      )
    }));
  };

  // Handle adding a new option value
  const addOptionValue = (optionId) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map(option => 
        option.id === optionId ? 
          { ...option, values: [...option.values, ''] } : 
          option
      )
    }));
  };

  // Handle updating an option value
  const updateOptionValue = (optionId, index, value) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map(option => 
        option.id === optionId ? 
          { 
            ...option, 
            values: option.values.map((v, i) => i === index ? value : v) 
          } : 
          option
      )
    }));
  };

  // Handle removing an option value
  const removeOptionValue = (optionId, index) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map(option => 
        option.id === optionId ? 
          { 
            ...option, 
            values: option.values.filter((_, i) => i !== index) 
          } : 
          option
      )
    }));
  };

  // Handle removing an entire option
  const removeOption = (optionId) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter(option => option.id !== optionId)
    }));
  };

  // Handle toggling the required field for an option
  const toggleOptionRequired = (optionId) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map(option => 
        option.id === optionId ? 
          { ...option, required: !option.required } : 
          option
      )
    }));
  };

  const handleSave = () => {
    // Only save if we have at least a title
    if (formData.title.trim()) {
      if (onSave) {
        // Convert inventory to number
        const inventory = parseInt(formData.inventory) || 0;
        
        // Ensure backward compatibility by setting imageUrl to the first image
        const mainImageUrl = formData.image_urls.length > 0 ? formData.image_urls[0] : '';
        
        onSave({
          ...formData,
          image_url: mainImageUrl, // Set the first image as the main imageUrl for compatibility
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

  // Open currency selector bottom sheet
  const openCurrencySelector = () => {
    const sheetId = openBottomSheet(
      <CurrencySelector
        currentCurrency={formData.currency}
        onSelect={(currencyCode) => updateField('currency', currencyCode)}
        onClose={() => closeBottomSheet(sheetId)}
      />,
      ['50%']
    );
  };

  // Get current currency data
  const currentCurrency = currencies.find(c => c.code === formData.currency) || currencies[0];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {isNew ? 'Add Product' : 'Edit Product'}
        </Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <Text style={styles.doneText}>Close</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          {/* Product Images Section */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Product Images</Text>
            <Text style={styles.sectionDescription}>
              Add photos of your product. First image will be the main image.
            </Text>
            
            <ImageHandler
              imageUris={formData.image_urls}
              onImageSelected={(response) => handleImagesUpdate(response, setFormData)}
              onImageRemoved={(index, newImages) => handleImagesUpdate(newImages, setFormData)}
              upload={true}
              onUploadComplete={(response) => handleImagesUpdate(response, setFormData)}
              multiple={true}
              maxImages={6}
              square={true}
              quality={0.8}
              maxSize={1024}
              placeholderText="Add Product Images"
              style={styles.imageHandler}
            />
          </View>

          {/* Title Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Product Title *</Text>
            <BottomSheetTextInput
              ref={titleInputRef}
              style={styles.input}
              value={formData.title}
              onChangeText={(value) => updateField('title', value)}
              placeholder="Enter product title"
              placeholderTextColor="#ccc"
            />
          </View>

          {/* Price Input with Currency Selector */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Price</Text>
            <View style={styles.priceInputRow}>
              <View style={styles.priceInputContainer}>
                <BottomSheetTextInput
                  style={styles.priceInput}
                  value={formData.price}
                  onChangeText={(value) => updateField('price', value)}
                  placeholder="0.00"
                  keyboardType="numeric"
                  placeholderTextColor="#ccc"
                />
              </View>

              <TouchableOpacity
                style={styles.currencySelector}
                onPress={openCurrencySelector}
              >
                <Text style={styles.currencySelectorText}>
                  {currentCurrency.symbol} {currentCurrency.code}
                </Text>
                <Ionicons name="chevron-down" size={16} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Description Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Description</Text>
            <BottomSheetTextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(value) => updateField('description', value)}
              placeholder="Enter product description"
              placeholderTextColor="#ccc"
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
              value={formData.sell_directly}
              onValueChange={(value) => updateField('sell_directly', value)}
              trackColor={{ false: '#D1D1D6', true: colors.primary || '#000' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* External Link (only show if not selling directly) */}
          {!formData.sell_directly && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>External Purchase Link</Text>
              <BottomSheetTextInput
                style={styles.input}
                value={formData.external_link}
                onChangeText={(value) => updateField('external_link', value)}
                placeholder="https://example.com/buy-product"
                autoCapitalize="none"
                placeholderTextColor="#ccc"
              />
            </View>
          )}

          {/* Inventory (only show if selling directly) */}
          {formData.sell_directly && (
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
                placeholderTextColor="#ccc"
              />
            </View>
          )}

          {/* Product Options Section */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Product Options</Text>
            <Text style={styles.sectionDescription}>
              Add customizable options like size, color, etc.
            </Text>

            {formData.options.length === 0 ? (
              <TouchableOpacity 
                style={styles.addFirstOptionButton}
                onPress={addOption}
                activeOpacity={0.7}
              >
                <Ionicons name="add-circle" size={24} color={colors.primary || '#000'} />
                <Text style={styles.addFirstOptionText}>Add Your First Option</Text>
              </TouchableOpacity>
            ) : (
              <>
                {formData.options.map((option, optionIndex) => (
                  <View key={option.id} style={styles.optionItem}>
                    {/* Option Header with Title and Delete */}
                    <View style={styles.optionHeader}>
                      <Text style={styles.optionTitle}>Option {optionIndex + 1}</Text>
                      <TouchableOpacity 
                        style={styles.removeOptionButton}
                        onPress={() => removeOption(option.id)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Ionicons name="trash-outline" size={20} color="#ff3b30" />
                      </TouchableOpacity>
                    </View>
                    
                    {/* Option Name Input */}
                    <View style={styles.optionInputContainer}>
                      <Text style={styles.optionInputLabel}>Option Name</Text>
                      <BottomSheetTextInput
                        style={styles.optionInput}
                        value={option.name}
                        onChangeText={(value) => updateOptionName(option.id, value)}
                        placeholder="e.g. Size, Color, Material"
                        placeholderTextColor="#ccc"
                      />
                    </View>
                    
                    {/* Required Toggle */}
                    <View style={styles.optionRequiredContainer}>
                      <Text style={styles.optionRequiredLabel}>Required option</Text>
                      <Switch
                        value={option.required}
                        onValueChange={() => toggleOptionRequired(option.id)}
                        trackColor={{ false: '#D1D1D6', true: colors.primary || '#000' }}
                        thumbColor="#FFFFFF"
                      />
                    </View>
                    
                    {/* Option Values Section */}
                    <View style={styles.optionValuesSection}>
                      <Text style={styles.optionValuesHeader}>Option Values</Text>
                      
                      {option.values.map((value, valueIndex) => (
                        <View key={`${option.id}-${valueIndex}`} style={styles.optionValueContainer}>
                          <Text style={styles.optionValueLabel}>Value {valueIndex + 1}</Text>
                          <View style={styles.optionValueInputRow}>
                            <BottomSheetTextInput
                              style={styles.optionValueInput}
                              value={value}
                              onChangeText={(newValue) => updateOptionValue(option.id, valueIndex, newValue)}
                              placeholder={`e.g. ${option.name === 'Size' ? 'Small, Medium, Large' : 
                                option.name === 'Color' ? 'Red, Blue, Green' : 'Enter a value'}`}
                              placeholderTextColor="#ccc"
                            />
                            
                            {option.values.length > 1 && (
                              <TouchableOpacity 
                                style={styles.removeValueButton}
                                onPress={() => removeOptionValue(option.id, valueIndex)}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                              >
                                <Ionicons name="close-circle" size={22} color="#ff3b30" />
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                      ))}
                      
                      {/* Add Value Button */}
                      <TouchableOpacity 
                        style={styles.addValueButton}
                        onPress={() => addOptionValue(option.id)}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="add-circle-outline" size={18} color={colors.primary || '#000'} />
                        <Text style={styles.addValueText}>Add Another Value</Text>
                      </TouchableOpacity>
                    </View>

                    {optionIndex < formData.options.length - 1 && (
                      <View style={styles.optionDivider} />
                    )}
                  </View>
                ))}
                
                {/* Add Another Option Button */}
                <TouchableOpacity 
                  style={styles.addAnotherOptionButton}
                  onPress={addOption}
                  activeOpacity={0.7}
                >
                  <Ionicons name="add-circle-outline" size={18} color={colors.primary || '#000'} />
                  <Text style={styles.addAnotherOptionText}>Add Another Option</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

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
    padding: 20,
  },
  imageSection: {
    marginBottom: 20,
    alignItems: 'center',
  },
  imageHandler: {
    marginTop: 8,
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
  // Price input with currency selector
  priceInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceInputContainer: {
    flex: 1,
    marginRight: 10,
  },
  priceInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    minWidth: 90,
    justifyContent: 'space-between',
  },
  currencySelectorText: {
    fontSize: 16,
    color: '#333',
    marginRight: 5,
  },
  // Currency selector bottom sheet
  currencySelectorSheet: {
    flex: 1,
    backgroundColor: '#fff',
  },
  currencySheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  currencySheetTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  currencySheetCloseButton: {
    padding: 4,
  },
  currencyList: {
    flex: 1,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedCurrencyItem: {
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  currencySymbol: {
    fontSize: 18,
    marginRight: 16,
    width: 20,
    textAlign: 'center',
  },
  currencyInfo: {
    flex: 1,
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: '500',
  },
  currencyName: {
    fontSize: 14,
    color: '#666',
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
    padding: 20,
    borderTopColor: '#eee',
  },
  saveButton: {
    backgroundColor: colors.primary || '#000',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Section styles
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666', 
    marginBottom: 16,
  },
  
  // Option item styles
  optionItem: {
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 16,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  optionDivider: {
    height: 1,
    backgroundColor: '#ddd',
    marginTop: 8,
  },
  
  // Add first option button (empty state)
  addFirstOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  addFirstOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary || '#000',
    marginLeft: 8,
  },
  
  // Option input styles
  optionInputContainer: {
    marginBottom: 12,
  },
  optionInputLabel: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  optionInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#fff',
  },
  optionRequiredContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  optionRequiredLabel: {
    fontSize: 15,
    color: '#333',
  },
  
  // Option values section
  optionValuesSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  optionValuesHeader: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 12,
    color: '#333',
  },
  optionValueContainer: {
    marginBottom: 12,
  },
  optionValueLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  optionValueInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionValueInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#fff',
  },
  removeValueButton: {
    marginLeft: 10,
    padding: 2,
  },
  
  // Add value button
  addValueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 4,
  },
  addValueText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.primary || '#000',
  },
  
  // Add another option button
  addAnotherOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  addAnotherOptionText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '500',
    color: colors.primary || '#000',
  },
});

export default ProductForm; 