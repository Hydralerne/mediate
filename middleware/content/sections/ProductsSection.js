/**
 * Products section implementation with unified editor
 */
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Image, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet,
  ScrollView,
  Switch
} from 'react-native';
import TouchableButton from '../../../components/global/ButtonTap';
import colors from '../../../utils/colors';

// Default content structure
export const defaultContent = {
  items: [],
  settings: {
    showPrices: true,
    enablePurchase: false,
    displayStyle: 'grid', // 'grid' or 'list'
    productsPerPage: 6,
    sortBy: 'newest' // 'newest', 'price-asc', 'price-desc', 'name'
  }
};

// Unified editor component for both onboarding and dashboard
export const Editor = ({ data = {}, onSave, isOnboarding = false }) => {
  const [content, setContent] = useState({
    ...defaultContent,
    ...data
  });
  const [activeTab, setActiveTab] = useState('products');
  const [editMode, setEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    imageUrl: '',
    inventory: '',
    category: '',
    featured: false
  });
  
  const updateSettings = (key, value) => {
    setContent({
      ...content,
      settings: {
        ...content.settings,
        [key]: value
      }
    });
  };

  const handleAddProduct = () => {
    resetForm();
    setEditMode(true);
    setCurrentProduct(null);
  };

  const handleEditProduct = (product) => {
    setFormData({
      title: product.title,
      price: product.price || '',
      description: product.description || '',
      imageUrl: product.imageUrl || '',
      inventory: product.inventory || '',
      category: product.category || '',
      featured: product.featured || false
    });
    setEditMode(true);
    setCurrentProduct(product);
  };

  const handleDeleteProduct = (productId) => {
    const updatedItems = content.items.filter(item => item.id !== productId);
    setContent({
      ...content,
      items: updatedItems
    });
  };

  const handleSaveProduct = () => {
    if (!formData.title.trim()) return;
    
    if (currentProduct) {
      // Update existing product
      const updatedItems = content.items.map(item => 
        item.id === currentProduct.id 
          ? { 
              ...item, 
              title: formData.title.trim(),
              price: formData.price.trim(),
              description: formData.description.trim(),
              imageUrl: formData.imageUrl.trim(),
              inventory: formData.inventory.trim(),
              category: formData.category.trim(),
              featured: formData.featured
            } 
          : item
      );
      
      setContent({
        ...content,
        items: updatedItems
      });
    } else {
      // Add new product
      const newProduct = {
        id: `product-${Date.now()}`,
        title: formData.title.trim(),
        price: formData.price.trim(),
        description: formData.description.trim(),
        imageUrl: formData.imageUrl.trim(),
        inventory: formData.inventory.trim(),
        category: formData.category.trim(),
        featured: formData.featured,
        type: 'product'
      };
      
      setContent({
        ...content,
        items: [...content.items, newProduct]
      });
    }
    
    setEditMode(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      price: '',
      description: '',
      imageUrl: '',
      inventory: '',
      category: '',
      featured: false
    });
  };

  const handleSave = () => {
    onSave(content);
  };

  const updateFormField = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  // Simplified view for onboarding
  if (isOnboarding) {
    return (
      <View style={styles.sheetContainer}>
        <Text style={styles.sheetTitle}>Products</Text>
        <Text style={styles.sheetDescription}>
          You can add your products in the dashboard after completing the setup.
        </Text>
        <TouchableButton
          style={styles.saveButton}
          onPress={() => onSave(content)}
        >
          <Text style={styles.saveButtonText}>Continue</Text>
        </TouchableButton>
      </View>
    );
  }

  // Product form for adding/editing products
  const renderProductForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>
        {currentProduct ? 'Edit Product' : 'Add New Product'}
      </Text>
      
      <View style={styles.formField}>
        <Text style={styles.fieldLabel}>Product Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter product name"
          value={formData.title}
          onChangeText={(value) => updateFormField('title', value)}
        />
      </View>
      
      <View style={styles.formField}>
        <Text style={styles.fieldLabel}>Price</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter price (e.g. 19.99)"
          value={formData.price}
          onChangeText={(value) => updateFormField('price', value)}
          keyboardType="decimal-pad"
        />
      </View>
      
      <View style={styles.formField}>
        <Text style={styles.fieldLabel}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter product description"
          multiline
          value={formData.description}
          onChangeText={(value) => updateFormField('description', value)}
        />
      </View>
      
      <View style={styles.formField}>
        <Text style={styles.fieldLabel}>Image URL</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter image URL"
          value={formData.imageUrl}
          onChangeText={(value) => updateFormField('imageUrl', value)}
        />
      </View>
      
      <View style={styles.formField}>
        <Text style={styles.fieldLabel}>Category</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter product category"
          value={formData.category}
          onChangeText={(value) => updateFormField('category', value)}
        />
      </View>
      
      <View style={styles.formField}>
        <Text style={styles.fieldLabel}>Inventory</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter available inventory"
          value={formData.inventory}
          onChangeText={(value) => updateFormField('inventory', value)}
          keyboardType="number-pad"
        />
      </View>
      
      <View style={styles.switchField}>
        <Text style={styles.fieldLabel}>Featured Product</Text>
        <Switch
          value={formData.featured}
          onValueChange={(value) => updateFormField('featured', value)}
        />
      </View>
      
      <View style={styles.formActions}>
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => {
            setEditMode(false);
            resetForm();
          }}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.saveFormButton}
          onPress={handleSaveProduct}
        >
          <Text style={styles.saveFormButtonText}>
            {currentProduct ? 'Update Product' : 'Add Product'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Product list view
  const renderProductItem = ({ item }) => (
    <View style={styles.productCard}>
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
      ) : (
        <View style={styles.productImagePlaceholder}>
          <Text style={styles.productImagePlaceholderText}>No Image</Text>
        </View>
      )}
      
      <View style={styles.productInfo}>
        <Text style={styles.productTitle}>{item.title}</Text>
        
        {item.price ? (
          <Text style={styles.productPrice}>${item.price}</Text>
        ) : null}
        
        {item.featured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}
      </View>
      
      <View style={styles.productActions}>
        <TouchableOpacity 
          style={styles.productActionButton}
          onPress={() => handleEditProduct(item)}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.productActionButton, styles.deleteButton]}
          onPress={() => handleDeleteProduct(item.id)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Settings tab content
  const renderSettingsTab = () => (
    <View style={styles.settingsContainer}>
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Show Prices</Text>
        <Switch
          value={content.settings.showPrices}
          onValueChange={(value) => updateSettings('showPrices', value)}
        />
      </View>
      
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Enable Purchase</Text>
        <Switch
          value={content.settings.enablePurchase}
          onValueChange={(value) => updateSettings('enablePurchase', value)}
        />
      </View>
      
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Display Style</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter display style (e.g. 'grid' or 'list')"
          value={content.settings.displayStyle}
          onChangeText={(value) => updateSettings('displayStyle', value)}
        />
      </View>
      
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Products Per Page</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter products per page"
          value={content.settings.productsPerPage.toString()}
          onChangeText={(value) => updateSettings('productsPerPage', parseInt(value))}
          keyboardType="number-pad"
        />
      </View>
      
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Sort By</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter sort by option"
          value={content.settings.sortBy}
          onChangeText={(value) => updateSettings('sortBy', value)}
        />
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.editorContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Your Tagline</Text>
            <TextInput
              style={styles.input}
              placeholder="A short phrase that describes you"
              value={content.tagline}
              onChangeText={(value) => updateField('tagline', value)}
              maxLength={50}
            />
            <Text style={styles.fieldHint}>
              This appears below your name. Keep it short and impactful.
            </Text>
          </View>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Your Bio</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Tell visitors about yourself, your background, and what you do"
              multiline
              value={content.bio}
              onChangeText={(value) => updateField('bio', value)}
            />
            <Text style={styles.fieldHint}>
              This is the main content of your About section. Be authentic and engaging.
            </Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Image</Text>
          
          <View style={styles.imagePickerContainer}>
            {content.profileImage ? (
              <View style={styles.imagePreviewContainer}>
                <Image 
                  source={{ uri: content.profileImage }} 
                  style={styles.imagePreview} 
                />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => updateField('profileImage', null)}
                >
                  <Text style={styles.removeImageText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.imagePicker}
                onPress={() => {
                  // In a real implementation, this would open an image picker
                  // For now, we'll just set a placeholder URL
                  updateField('profileImage', 'https://via.placeholder.com/150');
                }}
              >
                <View style={styles.imagePickerInner}>
                  <Image 
                    // source={require('../../../assets/icons/home/plus-17-1658431404.png')} 
                    style={styles.imagePickerIcon}
                  />
                  <Text style={styles.imagePickerText}>Add Profile Image</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
          
          <Text style={styles.fieldHint}>
            A professional photo helps visitors connect with you.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Skills</Text>
          
          <View style={styles.skillInputContainer}>
            <TextInput
              style={styles.skillInput}
              placeholder="Add a skill (e.g. 'Web Design')"
              value={skillInput}
              onChangeText={setSkillInput}
            />
            <TouchableOpacity 
              style={styles.addSkillButton}
              onPress={addSkill}
            >
              <Text style={styles.addSkillText}>Add</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.fieldHint}>
            Highlight your key skills to showcase your expertise.
          </Text>
          
          <View style={styles.skillsContainer}>
            {content.skills && content.skills.length > 0 ? (
              content.skills.map((skill, index) => (
                <View key={index} style={styles.skillBadge}>
                  <Text style={styles.skillText}>{skill}</Text>
                  <TouchableOpacity
                    style={styles.removeSkillButton}
                    onPress={() => removeSkill(index)}
                  >
                    <Text style={styles.removeSkillText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.noSkillsText}>
                No skills added yet. Add your key skills above.
              </Text>
            )}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preview</Text>
          
          <View style={styles.previewContainer}>
            <View style={styles.aboutPreview}>
              {content.profileImage ? (
                <Image 
                  source={{ uri: content.profileImage }} 
                  style={styles.previewProfileImage} 
                />
              ) : (
                <View style={styles.previewProfilePlaceholder}>
                  <Text style={styles.previewProfilePlaceholderText}>Add Image</Text>
                </View>
              )}
              
              {content.tagline ? (
                <Text style={styles.previewTagline}>{content.tagline}</Text>
              ) : null}
              
              {content.bio ? (
                <Text style={styles.previewBio}>{content.bio}</Text>
              ) : (
                <Text style={styles.previewEmptyBio}>Add your bio to see it here</Text>
              )}
              
              {content.skills && content.skills.length > 0 ? (
                <View style={styles.previewSkillsContainer}>
                  <Text style={styles.previewSkillsTitle}>Skills</Text>
                  <View style={styles.previewSkillsList}>
                    {content.skills.map((skill, index) => (
                      <View key={index} style={styles.previewSkillBadge}>
                        <Text style={styles.previewSkillText}>{skill}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ) : null}
            </View>
          </View>
        </View>
        
        <TouchableButton
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableButton>
      </View>
    </ScrollView>
  );
};

// Create a new item for this section
export function createItem() {
  return {
    id: `product-${Date.now()}`,
    title: 'New Product',
    price: '0.00',
    description: '',
    imageUrl: '',
    type: 'product'
  };
}

// Validate section data
export function validateData(data) {
  return data && Array.isArray(data.items);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  editorContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.lightBorder,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  fieldHint: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.5)',
    marginTop: 4,
  },
  imagePickerContainer: {
    marginVertical: 8,
  },
  imagePicker: {
    height: 150,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    borderRadius: 8,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  imagePickerInner: {
    alignItems: 'center',
  },
  imagePickerIcon: {
    width: 24,
    height: 24,
    tintColor: 'rgba(0,0,0,0.4)',
    marginBottom: 8,
  },
  imagePickerText: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.6)',
  },
  imagePreviewContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  removeImageText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  skillInputContainer: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  skillInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginRight: 8,
  },
  addSkillButton: {
    backgroundColor: '#000',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 8,
  },
  addSkillText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  skillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  skillText: {
    fontSize: 14,
    color: '#000',
    marginRight: 4,
  },
  removeSkillButton: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeSkillText: {
    fontSize: 12,
    color: '#000',
    fontWeight: 'bold',
    lineHeight: 16,
  },
  noSkillsText: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.5)',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 16,
  },
  previewContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
  },
  aboutPreview: {
    alignItems: 'center',
  },
  previewProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  previewProfilePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  previewProfilePlaceholderText: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.5)',
  },
  previewTagline: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  previewBio: {
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(0,0,0,0.8)',
    textAlign: 'center',
    marginBottom: 16,
  },
  previewEmptyBio: {
    fontSize: 14,
    fontStyle: 'italic',
    color: 'rgba(0,0,0,0.4)',
    textAlign: 'center',
    marginBottom: 16,
  },
  previewSkillsContainer: {
    width: '100%',
    marginTop: 12,
  },
  previewSkillsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  previewSkillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  previewSkillBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    margin: 3,
  },
  previewSkillText: {
    fontSize: 12,
    color: '#000',
  },
  saveButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  sheetContainer: {
    padding: 20,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 16,
    textAlign: 'center',
  },
  sheetDescription: {
    fontSize: 16,
    color: 'rgba(0,0,0,0.7)',
    marginBottom: 20,
    textAlign: 'center',
  },
  formContainer: {
    padding: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 12,
  },
  formField: {
    marginBottom: 12,
  },
  switchField: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cancelButton: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: 12,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
  saveFormButton: {
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 8,
  },
  saveFormButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  productCard: {
    flexDirection: 'row',
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
    marginBottom: 8,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 12,
  },
  productImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginRight: 12,
  },
  productImagePlaceholderText: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.5)',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: 'green',
    marginBottom: 4,
  },
  productActions: {
    justifyContent: 'center',
  },
  productActionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 4,
    marginBottom: 4,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: 'rgba(255,0,0,0.1)',
  },
  deleteButtonText: {
    color: 'red',
  },
  settingsContainer: {
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  settingLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
}); 