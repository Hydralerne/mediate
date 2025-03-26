import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { DraggableGrid } from 'react-native-draggable-grid';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import ProjectCard from './ProjectCard';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const ProjectsList = ({ 
  projects = [], 
  onAddProject,
  onEditProject,
  onDeleteProject,
  onReorderProjects,
  displayStyle: initialDisplayStyle = 'grid' // Default to grid
}) => {
  // State for view mode and interaction
  const [displayStyle, setDisplayStyle] = useState(initialDisplayStyle);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  // Update displayStyle when prop changes
  useEffect(() => {
    setDisplayStyle(initialDisplayStyle);
  }, [initialDisplayStyle]);

  // Refs for the FlatLists to completely unmount and remount them when switching views
  const horizontalListKey = useRef(`horizontal-${Date.now()}`);
  const verticalListKey = useRef(`vertical-${Date.now()}`);

  // Reset list keys when switching between views to force complete remount
  useEffect(() => {
    if (displayStyle === 'masonry') {
      horizontalListKey.current = `horizontal-${Date.now()}`;
    } else if (displayStyle === 'list') {
      verticalListKey.current = `vertical-${Date.now()}`;
    }
  }, [displayStyle]);

  // Render grid item for DraggableGrid - 2 columns like products
  const renderGridItem = useCallback((item, index) => {
    if (!item) return null;

    return (
      <View style={styles.gridItemContainer} key={item.id || item.key}>
        <ProjectCard
          project={item}
          onEdit={() => onEditProject(item)}
          onDelete={() => onDeleteProject(item.id)}
          isDragging={isDragging}
          displayStyle="grid"
        />
      </View>
    );
  }, [onEditProject, onDeleteProject, isDragging]);

  // Render item for horizontal DraggableFlatList
  const renderHorizontalItem = useCallback(({ item, drag, isActive }) => {
    return (
      <ScaleDecorator activeScale={1.05}>
        <TouchableOpacity
          onLongPress={drag}
          delayLongPress={200}
          activeOpacity={1}
          style={styles.horizontalItem}
        >
          <ProjectCard
            project={item}
            onEdit={() => onEditProject(item)}
            onDelete={() => onDeleteProject(item.id)}
            isDragging={isActive}
            displayStyle="masonry"
          />
        </TouchableOpacity>
      </ScaleDecorator>
    );
  }, [onEditProject, onDeleteProject]);

  // Render item for vertical list DraggableFlatList
  const renderListItem = useCallback(({ item, drag, isActive }) => {
    return (
      <ScaleDecorator activeScale={1.02}>
        <TouchableOpacity
          onLongPress={drag}
          delayLongPress={200}
          activeOpacity={1}
        >
          <ProjectCard
            project={item}
            onEdit={() => onEditProject(item)}
            onDelete={() => onDeleteProject(item.id)}
            isDragging={isActive}
            displayStyle="list"
          />
        </TouchableOpacity>
      </ScaleDecorator>
    );
  }, [onEditProject, onDeleteProject]);

  // Add button component - memoized like in products
  const AddButton = useMemo(() => (
    <TouchableOpacity
      style={styles.addButton}
      onPress={onAddProject}
    >
      <View style={styles.addButtonContent}>
        <Ionicons name="add-circle" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Add Project</Text>
      </View>
    </TouchableOpacity>
  ), [onAddProject]);

  // Empty state view
  if (projects.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.projectsCount}>No Projects</Text>
          <Text style={styles.headerNote}>Change view in settings</Text>
        </View>

        <View style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="document-outline" size={35} color="#ccc" />
          </View>
          <Text style={styles.emptyTitle}>No Projects Yet</Text>
          <Text style={styles.emptyDescription}>
            Showcase your work by adding portfolio projects
          </Text>
          <TouchableOpacity
            style={styles.emptyAddButton}
            onPress={onAddProject}
          >
            <Text style={styles.emptyAddButtonText}>Add Your First Project</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Subheader component - now with a note instead of view toggles
  const Subheader = (
    <View style={styles.subHeader}>
      <Text style={styles.projectsCount}>
        {projects.length} {projects.length === 1 ? 'Project' : 'Projects'}
      </Text>
      <Text style={styles.headerNote}>Change view in settings</Text>
    </View>
  );

  // Render the appropriate view based on displayStyle
  const renderProjectList = () => {
    if (displayStyle === 'grid') {
      return (
        <DraggableGrid
          numColumns={2}
          data={projects}
          renderItem={renderGridItem}
          onDragRelease={(data) => {
            onReorderProjects(data);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setIsDragging(false);
          }}
          onDragStart={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setIsDragging(true);
          }}
          itemHeight={CARD_WIDTH + 80}
          style={styles.grid}
          itemWidth={(width - 48) / 2}
          keyExtractor={item => item.id || item.key}
          maxScale={1.05}
        />
      );
    } else if (displayStyle === 'masonry') {
      return (
        <DraggableFlatList
          key={horizontalListKey.current}
          data={projects}
          renderItem={renderHorizontalItem}
          keyExtractor={item => item.id || item.key}
          horizontal={true}
          contentContainerStyle={styles.horizontalList}
          onDragEnd={({ data }) => {
            onReorderProjects(data);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
          showsHorizontalScrollIndicator={false}
          // Performance optimizations
          windowSize={5}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          initialNumToRender={6}
          removeClippedSubviews={true}
        />
      );
    } else {
      return (
        <DraggableFlatList
          key={verticalListKey.current}
          data={projects}
          renderItem={renderListItem}
          keyExtractor={item => item.id || item.key}
          horizontal={false}
          contentContainerStyle={styles.verticalList}
          onDragEnd={({ data }) => {
            onReorderProjects(data);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
          showsVerticalScrollIndicator={false}
          // Performance optimizations
          windowSize={5}
          maxToRenderPerBatch={8}
          updateCellsBatchingPeriod={50}
          initialNumToRender={8}
          removeClippedSubviews={true}
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      {Subheader}
      
      <View style={styles.gridContainer}>
        {renderProjectList()}
        {AddButton}
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color="#000" />
        </View>
      )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  projectsCount: {
    fontSize: 14,
    color: '#666',
  },
  headerNote: {
    fontSize: 13,
    color: '#999',
    fontStyle: 'italic',
  },
  gridContainer: {
    flex: 1,
    paddingBottom: 80,
  },
  grid: {
    padding: 16,
    marginTop: 20,
  },
  gridItemContainer: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 8,
  },
  horizontalItem: {
    width: 280,
    marginRight: 12,
  },
  horizontalList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  verticalList: {
    padding: 16,
    paddingBottom: 100, // Extra padding for the add button
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  // Empty state styling
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyAddButton: {
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyAddButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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

export default ProjectsList; 