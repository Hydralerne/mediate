import React, { memo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../../../utils/colors';
import { getImage } from '../../../../utils/media/imagesServices';

const ProductCard = ({
  item,
  onEdit,
  onDelete,
  isActive = false,
  displayStyle = 'grid'
}) => {
  if (!item) return null;

  const image = getImage(item?.image_urls?.[0], 'medium');

  const isGrid = displayStyle === 'grid';
  const isHorizontal = displayStyle === 'horizontal';
  const isList = displayStyle === 'list';

  return (
    <View
      style={[
        isGrid ? styles.gridCard :
          isHorizontal ? styles.horizontalCard :
            styles.listCard,
        isActive && styles.activeCard,
        isGrid && { margin: 10 }
      ]}
    >
      {/* Image */}
      <View style={[
        styles.imageContainer,
        isList && styles.listImageContainer
      ]}>
        {image ? (
          <Image
            source={{ uri: image }}
            style={[styles.productImage, isList && { borderRadius: 12, overflow: 'hidden' }]}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={isList ? 24 : 32} color="#ccc" />
          </View>
        )}
      </View>
      <View style={[!isList && styles.bottomContainer]}>
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
          {isList && item.featured === true && (
            <View style={styles.listFeaturedBadge}>
              <Ionicons name="star" size={12} color="#fff" />
              <Text style={styles.featuredText}>Featured</Text>
            </View>
          )}
        </View>
        {/* Drag handle - more visible */}
        <View style={[
          styles.dragHandleContainer,
          isList && styles.listDragHandleContainer
        ]}>
          <Image source={require('../../../../assets/icons/home/menu-62-1661490995.png')} style={styles.dragHandleImage} />
        </View>
      </View>
      {/* Edit button */}
      <TouchableOpacity
        style={[
          styles.editButton,
          isList && styles.listEditButton
        ]}
        onPress={() => onEdit(item)}
      >
        <Image source={require('../../../../assets/icons/home/pen-83-1666783638.png')} style={styles.editButtonImage} />
      </TouchableOpacity>
      {/* Delete button */}
      <TouchableOpacity
        style={[
          styles.deleteButton,
          isList && styles.listDeleteButton
        ]}
        onPress={() => onDelete(item.id)}
      >
        <Image source={require('../../../../assets/icons/home/delete-29-1661490994.png')} style={styles.deleteButtonImage} />
      </TouchableOpacity>
      {/* Featured badge for grid and horizontal views */}
      {!isList && item.featured === true && (
        <View style={styles.featuredBadge}>
          <Ionicons name="star" size={12} color="#fff" />
          <Text style={styles.featuredText}>Featured</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  editButtonImage: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dragHandleImage: {
    width: 20,
    height: 20,
    tintColor: '#666',
    right: 4,
    position: 'absolute',
  },
  deleteButtonImage: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
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
    overflow: 'hidden',
    borderRadius: 12,
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
    position: 'absolute',
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
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  listDragHandleContainer: {
    top: 8,
    position: 'absolute',
    right: 0,
    // bottom: 'auto',
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