import React, { memo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../../../utils/colors';

const ProductCard = ({ 
  item, 
  onEdit, 
  onDelete, 
  isActive = false, 
  displayStyle = 'grid' 
}) => {
  if (!item) return null;
  
  const isGrid = displayStyle === 'grid';
  const isHorizontal = displayStyle === 'horizontal';
  const isList = displayStyle === 'list';
  
  return (
    <View 
      style={[
        isGrid ? styles.gridCard : 
        isHorizontal ? styles.horizontalCard : 
        styles.listCard, 
        isActive && styles.activeCard
      ]}
    >
      {/* Image */}
      <View style={[
        styles.imageContainer,
        isList && styles.listImageContainer
      ]}>
        {item.imageUrl ? (
          <Image 
            source={{ uri: item.imageUrl }} 
            style={styles.productImage} 
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={isList ? 24 : 32} color="#ccc" />
          </View>
        )}
      </View>
      
      {/* Info */}
      <View style={[
        styles.infoContainer,
        isList && styles.listInfoContainer
      ]}>
        <Text style={[
          styles.productTitle, 
          isList && styles.listProductTitle
        ]} numberOfLines={1}>
          {item.title || 'Untitled Product'}
        </Text>
        <Text style={styles.productPrice}>
          {item.price ? `$${item.price}` : 'No price'}
        </Text>
        
        {/* Featured badge for list view */}
        {isList && item.featured && (
          <View style={styles.listFeaturedBadge}>
            <Ionicons name="star" size={12} color="#fff" />
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}
      </View>
      
      {/* Edit button */}
      <TouchableOpacity 
        style={[
          styles.editButton,
          isList && styles.listEditButton
        ]}
        onPress={() => onEdit(item)}
      >
        <View>
          <Ionicons name="pencil" size={16} color="#fff" />
        </View>
      </TouchableOpacity>
      
      {/* Delete button */}
      <TouchableOpacity 
        style={[
          styles.deleteButton,
          isList && styles.listDeleteButton
        ]}
        onPress={() => onDelete(item.id)}
      >
        <View>
          <Ionicons name="trash" size={16} color="#fff" />
        </View>
      </TouchableOpacity>
      
      {/* Drag handle - more visible */}
      <View style={[
        styles.dragHandleContainer,
        isList && styles.listDragHandleContainer
      ]}>
        <Ionicons name="menu" size={18} color="#666" />
      </View>
      
      {/* Featured badge for grid and horizontal views */}
      {!isList && item.featured && (
        <View style={styles.featuredBadge}>
          <Ionicons name="star" size={12} color="#fff" />
          <Text style={styles.featuredText}>Featured</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  gridCard: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  horizontalCard: {
    width: 180,
    height: 260,
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  listCard: {
    flexDirection: 'row',
    width: '100%',
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
    overflow: 'hidden',
  },
  activeCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    transform: [{ scale: 1.02 }],
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1, // 1:1 ratio
    backgroundColor: '#f5f5f5',
  },
  listImageContainer: {
    width: 100,
    height: '100%',
    aspectRatio: 1,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    padding: 10,
  },
  listInfoContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 50, // Space for buttons
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  listProductTitle: {
    fontSize: 16,
  },
  productPrice: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  editButton: {
    position: 'absolute',
    top: 8,
    right: 44,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary || '#000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  listEditButton: {
    top: 'auto',
    bottom: 8,
    right: 44,
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ff3b30',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  listDeleteButton: {
    top: 'auto',
    bottom: 8,
  },
  dragHandleContainer: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  listDragHandleContainer: {
    top: 8,
    bottom: 'auto',
  },
  featuredBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: colors.primary || '#000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 3,
  },
  listFeaturedBadge: {
    backgroundColor: colors.primary || '#000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  featuredText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default memo(ProductCard); 