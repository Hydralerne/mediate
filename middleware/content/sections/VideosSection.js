/**
 * Videos section implementation
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
      <Text style={styles.sheetTitle}>Videos</Text>
      <Text style={styles.sheetDescription}>
        You can add your videos in the dashboard after completing the setup.
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
  const [videoUrl, setVideoUrl] = useState('');
  const [description, setDescription] = useState('');

  const handleAddItem = () => {
    if (!title.trim() || !videoUrl.trim()) return;
    
    const newItem = {
      id: `video-${Date.now()}`,
      title: title.trim(),
      videoUrl: videoUrl.trim(),
      description: description.trim(),
      type: 'video'
    };
    
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    resetForm();
  };

  const handleUpdateItem = () => {
    if (!currentItem || !title.trim() || !videoUrl.trim()) return;
    
    const updatedItems = items.map(item => 
      item.id === currentItem.id 
        ? { 
            ...item, 
            title: title.trim(),
            videoUrl: videoUrl.trim(),
            description: description.trim()
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
    setVideoUrl(item.videoUrl || '');
    setDescription(item.description || '');
  };

  const resetForm = () => {
    setCurrentItem(null);
    setTitle('');
    setVideoUrl('');
    setDescription('');
  };

  const handleSave = () => {
    onSave({ items });
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemUrl} numberOfLines={1}>{item.videoUrl}</Text>
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
        {currentItem ? 'Edit Video' : 'Add New Video'}
      </Text>
      
      <TextInput
        style={styles.input}
        placeholder="Video Title"
        value={title}
        onChangeText={setTitle}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Video URL (YouTube, Vimeo, etc.)"
        value={videoUrl}
        onChangeText={setVideoUrl}
      />
      
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Video Description"
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
            <Text style={styles.actionButtonText}>Add Video</Text>
          </TouchableButton>
        )}
      </View>
      
      <View style={styles.divider} />
      
      <Text style={styles.listTitle}>Your Videos</Text>
      
      {items.length > 0 ? (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
        />
      ) : (
        <Text style={styles.emptyText}>
          No videos added yet. Add your first video above.
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
    id: `video-${Date.now()}`,
    title: 'New Video',
    videoUrl: '',
    description: '',
    type: 'video'
  };
}

// Validate section data
export function validateData(data) {
  return data && Array.isArray(data.items);
}

const styles = StyleSheet.create({
  // Similar styles to ProductsSection with appropriate adjustments
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
  itemUrl: {
    fontSize: 14,
    color: 'blue',
    marginBottom: 4,
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