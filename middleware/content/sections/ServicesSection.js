/**
 * Services section implementation
 */
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import TouchableButton from '../../../components/global/ButtonTap';
import colors from '../../../utils/colors';

// Default content structure
export const defaultContent = {
  items: [],
};

// Configuration component for onboarding
export const ConfigSheet = ({ onSave, initialData = {} }) => {
  return (
    <View style={styles.sheetContainer}>
      <Text style={styles.sheetTitle}>Services</Text>
      <Text style={styles.sheetDescription}>
        You can add your services in the dashboard after completing the setup.
      </Text>
      <TouchableButton
        style={styles.saveButton}
        onPress={() => onSave({ items: initialData.items || [] })}
      >
        <Text style={styles.saveButtonText}>Continue</Text>
      </TouchableButton>
    </View>
  );
};

// Dashboard editor component
export const DashboardEditor = ({ data, onSave }) => {
  const [items, setItems] = useState(data?.items || []);
  const [currentItem, setCurrentItem] = useState(null);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');

  const handleAddItem = () => {
    if (!title.trim()) return;
    
    const newItem = {
      id: `service-${Date.now()}`,
      title: title.trim(),
      price: price.trim(),
      description: description.trim(),
      duration: duration.trim(),
      type: 'service'
    };
    
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    resetForm();
  };

  const handleUpdateItem = () => {
    if (!currentItem || !title.trim()) return;
    
    const updatedItems = items.map(item => 
      item.id === currentItem.id 
        ? { 
            ...item, 
            title: title.trim(),
            price: price.trim(),
            description: description.trim(),
            duration: duration.trim()
          } 
        : item
    );
    
    setItems(updatedItems);
    resetForm();
  };

  const handleDeleteItem = (itemId) => {
    const updatedItems = items.filter(item => item.id !== itemId);
    setItems(updatedItems);
    
    if (currentItem && currentItem.id === itemId) {
      resetForm();
    }
  };

  const handleEditItem = (item) => {
    setCurrentItem(item);
    setTitle(item.title);
    setPrice(item.price || '');
    setDescription(item.description || '');
    setDuration(item.duration || '');
  };

  const resetForm = () => {
    setCurrentItem(null);
    setTitle('');
    setPrice('');
    setDescription('');
    setDuration('');
  };

  const handleSave = () => {
    onSave({ items });
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <View style={styles.itemDetails}>
          {item.price ? (
            <Text style={styles.itemPrice}>${item.price}</Text>
          ) : null}
          {item.duration ? (
            <Text style={styles.itemDuration}>{item.duration}</Text>
          ) : null}
        </View>
        {item.description ? (
          <Text style={styles.itemDescription} numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}
      </View>
      <View style={styles.itemActions}>
        <TouchableOpacity 
          style={styles.itemActionButton}
          onPress={() => handleEditItem(item)}
        >
          <Text style={styles.itemActionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.itemActionButton, styles.deleteButton]}
          onPress={() => handleDeleteItem(item.id)}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.editorContainer}>
      <Text style={styles.editorTitle}>
        {currentItem ? 'Edit Service' : 'Add New Service'}
      </Text>
      
      <TextInput
        style={styles.input}
        placeholder="Service Name"
        value={title}
        onChangeText={setTitle}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Price (e.g. 99.99)"
        value={price}
        onChangeText={setPrice}
        keyboardType="decimal-pad"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Duration (e.g. 1 hour, 30 minutes)"
        value={duration}
        onChangeText={setDuration}
      />
      
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Service Description"
        multiline
        value={description}
        onChangeText={setDescription}
      />
      
      <View style={styles.formActions}>
        {currentItem ? (
          <>
            <TouchableButton
              style={[styles.actionButton, styles.cancelButton]}
              onPress={resetForm}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableButton>
            <TouchableButton
              style={styles.actionButton}
              onPress={handleUpdateItem}
            >
              <Text style={styles.actionButtonText}>Update</Text>
            </TouchableButton>
          </>
        ) : (
          <TouchableButton
            style={styles.actionButton}
            onPress={handleAddItem}
          >
            <Text style={styles.actionButtonText}>Add Service</Text>
          </TouchableButton>
        )}
      </View>
      
      <View style={styles.divider} />
      
      <Text style={styles.listTitle}>Your Services</Text>
      
      {items.length > 0 ? (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
        />
      ) : (
        <Text style={styles.emptyText}>
          No services added yet. Add your first service above.
        </Text>
      )}
      
      <TouchableButton
        style={styles.saveButton}
        onPress={handleSave}
      >
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableButton>
    </View>
  );
};

// Create a new item for this section
export function createItem() {
  return {
    id: `service-${Date.now()}`,
    title: 'New Service',
    price: '',
    description: '',
    duration: '',
    type: 'service'
  };
}

// Validate section data
export function validateData(data) {
  return data && Array.isArray(data.items);
}

const styles = StyleSheet.create({
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
  saveButton: {
    backgroundColor: '#000',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  editorContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  editorTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.lightBorder,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 8,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  cancelButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginVertical: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 12,
  },
  list: {
    maxHeight: 300,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
    marginBottom: 8,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  itemDetails: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: 'green',
    marginRight: 8,
  },
  itemDuration: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.6)',
  },
  itemDescription: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.6)',
  },
  itemActions: {
    justifyContent: 'center',
  },
  itemActionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 4,
    marginBottom: 4,
  },
  itemActionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: 'rgba(255,0,0,0.1)',
  },
  deleteText: {
    color: 'red',
  },
  emptyText: {
    fontSize: 16,
    color: 'rgba(0,0,0,0.5)',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 20,
  },
}); 