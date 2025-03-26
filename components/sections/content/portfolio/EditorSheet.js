import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
  Animated,
  ActivityIndicator
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { useBottomSheet } from '../../../../contexts/BottomSheet';
import { Ionicons } from '@expo/vector-icons';

// Import our components
import ProjectForm from './ProjectForm';
import ProjectsList from './ProjectsList';
import PortfolioSettings from './PortfolioSettings';

// Dashboard editor component for Portfolio section
export const EditorSheet = ({ data, onSave, onClose }) => {
  // Access bottom sheet context
  const { openBottomSheet, closeAllSheets } = useBottomSheet();

  // Animation ref
  const slideAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  
  // State for projects and project form
  const [projects, setProjects] = useState(data.items?.filter(item => item && item.type === 'project') || []);
  const [currentProject, setCurrentProject] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const initialDataRef = useRef(null);
  
  // State for settings
  const [settings, setSettings] = useState({
    displayStyle: data.settings?.displayStyle || 'grid', // 'grid' or 'list' or 'masonry'
    projectsPerPage: data.settings?.projectsPerPage || 6,
    showProjectLinks: data.settings?.showProjectLinks !== false,
    showTags: data.settings?.showTags !== false,
    sortableEnabled: data.settings?.sortableEnabled !== false,
  });
  
  // State for toggling between projects and settings tab
  const [activeTab, setActiveTab] = useState('projects');

  // State for loading
  const [loading, setLoading] = useState(false);

  // Load initial data on component mount
  useEffect(() => {
    if (data) {
      // Make sure each project has a key property
      const projectsWithKeys = (data.items || []).map(project => ({
        ...project,
        key: project.id.toString()
      }));
      
      setProjects(projectsWithKeys);
      
      if (data.settings) {
        setSettings(prevSettings => ({
          ...prevSettings,
          ...data.settings
        }));
      }
      
      // Store initial data for comparison
      initialDataRef.current = JSON.stringify({
        items: projectsWithKeys,
        settings: data.settings || settings
      });
    }
  }, [data]);

  // Track changes to determine if user has unsaved work
  useEffect(() => {
    if (initialDataRef.current) {
      const currentData = JSON.stringify({ 
        items: projects, 
        settings 
      });
      setHasUnsavedChanges(currentData !== initialDataRef.current);
    }
  }, [projects, settings]);

  // Confirm exit if there are unsaved changes
  const checkForUnsavedChanges = () => {
    if (hasUnsavedChanges) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Do you want to save before leaving?',
        [
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => {},
          },
          {
            text: 'Save',
            style: 'default',
            onPress: handleSaveChanges,
          },
        ]
      );
      return true;
    }
    return false;
  };

  // Handle adding a new project
  const handleAddProject = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentProject(null);
    
    const newProject = {
      id: `project-${Date.now()}`,
      key: `project-${Date.now()}`,
      title: '',
      description: '',
      imageUrl: '',
      tags: [],
      type: 'project'
    };

    const sheetId = openBottomSheet(
      <ProjectForm
        project={newProject}
        onSave={(projectData) => {
          setProjects(prev => [...prev, { ...newProject, ...projectData, type: 'project' }]);
          setHasUnsavedChanges(true);
          closeAllSheets(sheetId);
          
          // Brief loading indicator
          setLoading(true);
          setTimeout(() => setLoading(false), 300);
          
          // Haptic feedback
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }}
        onCancel={() => closeAllSheets(sheetId)}
      />,
      ['80%']
    );
  }, [openBottomSheet, closeAllSheets]);

  // Handle editing a project
  const handleEditProject = useCallback((project) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentProject(project);
    
    const sheetId = openBottomSheet(
      <ProjectForm
        project={project}
        onSave={(projectData) => {
          setProjects(prev => 
            prev.map(item => 
              item.id === project.id 
                ? { ...item, ...projectData } 
                : item
            )
          );
          setHasUnsavedChanges(true);
          closeAllSheets(sheetId);
          
          // Brief loading indicator
          setLoading(true);
          setTimeout(() => setLoading(false), 300);
          
          // Haptic feedback
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }}
        onCancel={() => closeAllSheets(sheetId)}
      />,
      ['80%']
    );
  }, [openBottomSheet, closeAllSheets]);

  // Handle deleting a project
  const handleDeleteProject = useCallback((projectId) => {
    Alert.alert(
      'Delete Project',
      'Are you sure you want to delete this project?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            setProjects(prev => prev.filter(p => p.id !== projectId));
            setHasUnsavedChanges(true);
          },
          style: 'destructive',
        },
      ]
    );
  }, []);

  // Handle project order change
  const handleOrderChange = useCallback((newOrder) => {
    // Ensure we have the complete array with all properties
    setProjects(newOrder);
    setHasUnsavedChanges(true);
  }, []);

  // Handle saving changes to the entire portfolio section
  const handleSaveChanges = useCallback(() => {
    setLoading(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Create the updated data object
    const nonProjectItems = (data.items || []).filter(item => item && item.type !== 'project');
    const updatedItems = [...nonProjectItems, ...projects];

    onSave({
      ...data,
      items: updatedItems,
      settings: settings
    });

    // Use timeout to simulate saving process
    setTimeout(() => {
      setLoading(false);
      setHasUnsavedChanges(false);
      if (onClose) onClose();
    }, 300);
  }, [data, projects, settings, onSave, onClose]);

  // Handle settings changes
  const handleSettingChange = useCallback((key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasUnsavedChanges(true);
    
    // Haptic feedback for better UX
    Haptics.selectionAsync();
  }, []);

  // Manage the animation transforms
  const animatedStyles = {
    transform: [
      {
        translateY: slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [50, 0],
        }),
      },
    ],
    opacity: opacityAnim,
  };

  // Memoized header component with save button
  const Header = useMemo(() => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.headerButton}
        onPress={onClose}
      >
        <Ionicons name="close" size={24} color="#333" />
      </TouchableOpacity>
      
      <Text style={styles.headerTitle}>Portfolio</Text>
      
      <TouchableOpacity
        style={styles.headerButton}
        onPress={handleSaveChanges}
      >
        <Text style={[
          styles.saveText,
          hasUnsavedChanges && styles.unsavedChangesText
        ]}>
          {hasUnsavedChanges ? 'Save' : 'Done'}
        </Text>
      </TouchableOpacity>
    </View>
  ), [onClose, handleSaveChanges, hasUnsavedChanges]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Animated.View style={[styles.animatedContainer, animatedStyles]}>
        {Header}
        
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'projects' && styles.activeTab]}
            onPress={() => {
              Haptics.selectionAsync();
              setActiveTab('projects');
            }}
          >
            <Text style={[styles.tabText, activeTab === 'projects' && styles.activeTabText]}>
              Projects
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'settings' && styles.activeTab]}
            onPress={() => {
              Haptics.selectionAsync();
              setActiveTab('settings');
            }}
          >
            <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>
              Settings
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.contentContainer}>
          {activeTab === 'projects' ? (
            <ProjectsList
              projects={projects}
              onAddProject={handleAddProject}
              onEditProject={handleEditProject}
              onDeleteProject={handleDeleteProject}
              onReorderProjects={handleOrderChange}
              displayStyle={settings.displayStyle}
            />
          ) : (
            <PortfolioSettings
              settings={settings}
              onSettingChange={handleSettingChange}
            />
          )}
        </View>
        
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="small" color="#000" />
          </View>
        )}
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  animatedContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  unsavedChangesText: {
    color: '#000',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  tabText: {
    fontSize: 16,
    color: 'rgba(0,0,0,0.6)',
    fontWeight: '300',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '400',
  },
  contentContainer: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});

export default EditorSheet; 
