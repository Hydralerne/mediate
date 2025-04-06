import React, { memo, useMemo } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { getImage } from '../../../../utils/media/imagesServices';

const { width } = Dimensions.get('window');

// Memoized utility functions (outside component to avoid recreation)
const getPlaceholderColor = (() => {
  const colors = ['#f2f7ff', '#f7f2ff', '#fff2f2', '#f2fff7', '#f5f5f5'];
  return () => colors[Math.floor(Math.random() * colors.length)];
})();

// Get a color for tag based on tag text
const getTagColor = (() => {
  const colors = [
    { bg: '#f0f7ff', text: '#3b82f6' }, // blue
    { bg: '#f0fff5', text: '#10b981' }, // green
    { bg: '#fff0f0', text: '#ef4444' }, // red
    { bg: '#f5f0ff', text: '#8b5cf6' }, // purple
    { bg: '#fef3c7', text: '#d97706' }, // amber
  ];
  
  return (tag) => {
    if (!tag) return { bg: '#f0f0f0', text: '#666' };
    // Simple hash function to consistently get the same color for the same tag
    const hashCode = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hashCode % colors.length];
  };
})();

// Memoized components to prevent unnecessary re-renders
const ImageComponent = memo(({ imageUrl, hasValidImage, placeholderColor, placeholderChar, containerStyle, imageStyle, placeholderStyle, textStyle }) => {
  return (
    <View style={containerStyle}>
      {hasValidImage ? (
        <Image
          source={{ uri: getImage(imageUrl, 'medium') }}
          style={imageStyle}
          resizeMode="cover"
        />
      ) : (
        <View style={[placeholderStyle, { backgroundColor: placeholderColor }]}>
          <Text style={textStyle}>{placeholderChar}</Text>
        </View>
      )}
    </View>
  );
});

const TagsComponent = memo(({ tags, containerStyle, tagStyle, textStyle, limit }) => {
  if (!tags || tags.length === 0) return null;
  
  return (
    <View style={containerStyle}>
      {tags.slice(0, limit).map((tag, index) => {
        const tagColor = getTagColor(tag);
        return (
          <View key={index} style={[styles.tag, tagStyle, { backgroundColor: tagColor.bg }]}>
            <Text style={[styles.tagText, textStyle, { color: tagColor.text }]}>{tag}</Text>
          </View>
        );
      })}
      {tags.length > limit && (
        <Text style={styles.moreTagsText}>+{tags.length - limit}</Text>
      )}
    </View>
  );
});

// Main component
const ProjectCard = memo(({ 
  project, 
  onEdit, 
  onDelete,
  isDragging = false,
  displayStyle = 'grid' 
}) => {
  // Extract common properties - computed only once per render
  const imageUrl = project?.imageUrls?.[0] || project?.imageUrl;
  const hasValidImage = Boolean(imageUrl);
  const placeholderColor = useMemo(() => getPlaceholderColor(), []);
  const placeholderChar = project.title ? project.title.charAt(0).toUpperCase() : "P";
  
  const handleEdit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onEdit(project);
  };
  
  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onDelete(project.id);
  };

  // Switch-case for different display styles
  switch (displayStyle) {
    case 'grid':
      return (
        <View style={[styles.gridCard, isDragging && styles.dragging]}>
          <View style={styles.gridImageContainer}>
            <ImageComponent 
              imageUrl={imageUrl}
              hasValidImage={hasValidImage}
              placeholderColor={placeholderColor}
              placeholderChar={placeholderChar}
              containerStyle={styles.gridImageContainer}
              imageStyle={styles.gridImage}
              placeholderStyle={styles.gridImagePlaceholder}
              textStyle={styles.placeholderText}
            />
            
            {/* Edit overlay button */}
            <TouchableOpacity
              style={styles.gridEditButton}
              onPress={handleEdit}
              hitSlop={{ top: 5, right: 5, bottom: 5, left: 5 }}
            >
              <Ionicons name="pencil" size={14} color="#fff" />
            </TouchableOpacity>
            
            {/* Drag handle in top-right */}
            <View style={styles.gridDragHandle}>
              <Ionicons name="menu" size={16} color="#fff" />
            </View>
          </View>
          
          {/* Content below image */}
          <View style={styles.gridContent}>
            <Text style={styles.gridTitle} numberOfLines={1}>
              {project.title || "Untitled Project"}
            </Text>
            
            {/* Description if available */}
            {project.description ? (
              <Text style={styles.gridDescription} numberOfLines={3}>
                {project.description}
              </Text>
            ) : null}
            
            {/* Tags */}
            <TagsComponent
              tags={project.tags}
              containerStyle={styles.gridTagsRow}
              limit={2}
            />
            
            {/* Delete button at bottom */}
            <TouchableOpacity
              style={styles.gridDeleteButton}
              onPress={handleDelete}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <Ionicons name="trash-outline" size={14} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
      );
      
    case 'masonry':
      return (
        <View style={[styles.horizontalCard, isDragging && styles.dragging]}>
          {/* Top image section */}
          <ImageComponent 
            imageUrl={imageUrl}
            hasValidImage={hasValidImage}
            placeholderColor={placeholderColor}
            placeholderChar={placeholderChar}
            containerStyle={styles.horizontalImageContainer}
            imageStyle={styles.horizontalImage}
            placeholderStyle={styles.horizontalImagePlaceholder}
            textStyle={styles.horizontalPlaceholderText}
          />
          
          {/* Drag handle in top-right of image */}
          <View style={styles.horizontalDragHandle}>
            <Ionicons name="menu" size={16} color="#fff" />
          </View>
          
          {/* Content section */}
          <View style={styles.horizontalContent}>
            <View style={styles.horizontalHeader}>
              <Text style={styles.horizontalTitle} numberOfLines={1}>
                {project.title || "Untitled Project"}
              </Text>
              
              {/* Action buttons in top-right */}
              <View style={styles.horizontalActions}>
                <TouchableOpacity
                  style={styles.smallActionButton}
                  onPress={handleEdit}
                  hitSlop={{ top: 5, right: 5, bottom: 5, left: 5 }}
                >
                  <Ionicons name="pencil-outline" size={16} color="#666" />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.smallActionButton}
                  onPress={handleDelete}
                  hitSlop={{ top: 5, right: 5, bottom: 5, left: 5 }}
                >
                  <Ionicons name="trash-outline" size={16} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Description if available */}
            {project.description ? (
              <Text style={styles.horizontalDescription} numberOfLines={4}>
                {project.description}
              </Text>
            ) : null}
            
            {/* Tags */}
            <TagsComponent
              tags={project.tags}
              containerStyle={styles.horizontalTagsRow}
              limit={3}
            />
          </View>
        </View>
      );
      
    default: // List view
      return (
        <View style={[styles.listCard, isDragging && styles.dragging]}>
          {/* Left side - Image or placeholder */}
          <ImageComponent 
            imageUrl={imageUrl}
            hasValidImage={hasValidImage}
            placeholderColor={placeholderColor}
            placeholderChar={placeholderChar}
            containerStyle={styles.listImageContainer}
            imageStyle={styles.listImage}
            placeholderStyle={styles.listImagePlaceholder}
            textStyle={styles.listPlaceholderText}
          />
          
          {/* Middle - Content */}
          <View style={styles.listContent}>
            <Text style={styles.listTitle} numberOfLines={1}>
              {project.title || "Untitled Project"}
            </Text>
            
            {project.description ? (
              <Text style={styles.listDescription} numberOfLines={3}>
                {project.description}
              </Text>
            ) : null}
            
            {/* Tags */}
            <TagsComponent
              tags={project.tags}
              containerStyle={styles.listTagsRow}
              tagStyle={styles.listTag}
              textStyle={styles.listTagText}
              limit={2}
            />
          </View>
          
          {/* Right side - Actions */}
          <View style={styles.listActions}>
            <TouchableOpacity
              style={styles.listActionButton}
              onPress={handleEdit}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <Ionicons name="pencil-outline" size={16} color="#666" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.listActionButton}
              onPress={handleDelete}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <Ionicons name="trash-outline" size={16} color="#666" />
            </TouchableOpacity>
            
            {/* Drag handle on right edge */}
            <View style={styles.listDragHandle}>
              <Ionicons name="menu" size={16} color="#999" />
            </View>
          </View>
        </View>
      );
  }
});

const styles = StyleSheet.create({
  // Common styles
  dragging: {
    transform: [{ scale: 1.02 }],
    borderColor: '#ccc',
    zIndex: 999,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginRight: 6,
    marginBottom: 3,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '500',
  },
  moreTagsText: {
    fontSize: 10,
    color: '#999',
    marginLeft: 4,
    alignSelf: 'center',
  },
  smallActionButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  
  // Grid view styles (2 columns)
  gridCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eaeaea',
    width: (width / 2) - 24, // Account for margins
  },
  gridImageContainer: {
    width: '100%',
    height: 140,
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 36,
    fontWeight: '500',
    color: '#999',
  },
  gridContent: {
    padding: 12,
    position: 'relative',
    minHeight: 110,
  },
  gridTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    paddingRight: 20, // Space for delete button
  },
  gridDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 10,
    lineHeight: 18,
  },
  gridTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 4,
  },
  gridEditButton: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  gridDragHandle: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  gridDeleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Horizontal card styles (for horizontal scrolling)
  horizontalCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: 260,
    overflow: 'hidden',
    marginHorizontal: 6,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  horizontalImageContainer: {
    width: '100%',
    height: 150,
    position: 'relative',
  },
  horizontalImage: {
    width: '100%',
    height: '100%',
  },
  horizontalImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontalPlaceholderText: {
    fontSize: 40,
    fontWeight: '500',
    color: '#999',
  },
  horizontalDragHandle: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontalContent: {
    padding: 16,
    minHeight: 130,
  },
  horizontalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  horizontalTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  horizontalActions: {
    flexDirection: 'row',
  },
  horizontalDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  horizontalTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  
  // List view styles (for vertical list)
  listCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 6,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  listImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
  },
  listImage: {
    width: '100%',
    height: '100%',
  },
  listImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listPlaceholderText: {
    fontSize: 30,
    fontWeight: '500',
    color: '#999',
  },
  listContent: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
    paddingRight: 8,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  listDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
    lineHeight: 18,
  },
  listTagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  listTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 6,
    marginBottom: 3,
  },
  listTagText: {
    fontSize: 10,
    fontWeight: '500',
  },
  listMoreTags: {
    fontSize: 10,
    color: '#999',
  },
  listActions: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingLeft: 12,
  },
  listActionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  listDragHandle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
});

export default ProjectCard; 