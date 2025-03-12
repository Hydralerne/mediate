/**
 * Portfolio section implementation
 */
import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import TouchableButton from '../../../components/global/ButtonTap';
import colors from '../../../utils/colors';

// Default content structure
export const defaultContent = {
  items: [],
};

// Dashboard editor component
export const EditorSheet = ({ data, onSave }) => {
  const [items, setItems] = useState(data?.items || []);
  const [currentItem, setCurrentItem] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleAddItem = () => {
    if (!title.trim()) return;
    
    const newItem = {
      id: `portfolio-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim(),
      type: 'project'
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
            description: description.trim(),
            imageUrl: imageUrl.trim()
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
    setDescription(item.description || '');
    setImageUrl(item.imageUrl || '');
  };

  const resetForm = () => {
    setCurrentItem(null);
    setTitle('');
    setDescription('');
    setImageUrl('');
  };

  const handleSave = () => {
    onSave({ items });
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
      ) : (
        <View style={styles.itemImagePlaceholder} />
      )}
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.title}</Text>
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
        {currentItem ? 'Edit Project' : 'Add New Project'}
      </Text>
      
      <TextInput
        style={styles.input}
        placeholder="Project Title"
        value={title}
        onChangeText={setTitle}
      />
      
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Project Description"
        multiline
        value={description}
        onChangeText={setDescription}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Image URL"
        value={imageUrl}
        onChangeText={setImageUrl}
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
            <Text style={styles.actionButtonText}>Add Project</Text>
          </TouchableButton>
        )}
      </View>
      
      <View style={styles.divider} />
      
      <Text style={styles.listTitle}>Your Projects</Text>
      
      {items.length > 0 ? (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
        />
      ) : (
        <Text style={styles.emptyText}>
          No projects added yet. Add your first project above.
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

const styles = StyleSheet.create({

  
}); 