import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Dimensions,
  SafeAreaView
} from 'react-native';
import { DraggableGrid } from 'react-native-draggable-grid';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import { useBottomSheet } from '../../../../contexts/BottomSheet';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import ProductForm from './ProductForm';
import ProductCard from './ProductCard';
import colors from '../../../../utils/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export const EditorSheet = ({ data = {}, onSave, onClose }) => {
  // State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [displayStyle, setDisplayStyle] = useState('grid'); // 'grid', 'horizontal', or 'list'
  const { openBottomSheet, closeBottomSheet } = useBottomSheet();
  const initialDataRef = useRef(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const insets = useSafeAreaInsets();
  
  // Use refs to prevent infinite loops with changing data
  const dataRef = useRef(data);

  // Refs for the FlatLists to completely unmount and remount them when switching views
  const horizontalListKey = useRef(`horizontal-${Date.now()}`);
  const verticalListKey = useRef(`vertical-${Date.now()}`);

  // Initialize products from data passed to the component - run only once
  useEffect(() => {
    const currentData = dataRef.current;
    if (currentData) {
      // Extract products from items array and ensure they have required properties
      const loadedProducts = (currentData.items || [])
        .filter(item => item && (item.type === 'product' || !item.type))
        .map(product => ({
          ...product,
          key: product.id.toString(),
          type: 'product' // Ensure type is set
        }));

      // Only use test products if we have no products
      setProducts(loadedProducts);

      // Set display style from settings
      if (currentData.settings?.displayStyle) {
        setDisplayStyle(currentData.settings.displayStyle);
      }

      // Store initial data for comparison
      initialDataRef.current = JSON.stringify({
        items: loadedProducts,
        settings: currentData.settings || { displayStyle }
      });
    }
  }, []); // Empty dependency array = only run once on mount

  // Track changes to determine if user has unsaved work
  useEffect(() => {
    if (initialDataRef.current) {
      const currentData = JSON.stringify({
        items: products,
        settings: { displayStyle }
      });
      setHasUnsavedChanges(currentData !== initialDataRef.current);
    }
  }, [products, displayStyle]);

  // Reset list keys when switching between views to force complete remount
  useEffect(() => {
    if (displayStyle === 'horizontal') {
      horizontalListKey.current = `horizontal-${Date.now()}`;
    } else if (displayStyle === 'list') {
      verticalListKey.current = `vertical-${Date.now()}`;
    }
  }, [displayStyle]);

  // Save changes - optimized to avoid unnecessary work
  const saveChanges = useCallback(() => {
    setLoading(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Ensure all products have the correct type
    const productsWithType = products.map(product => ({
      ...product,
      type: 'product'
    }));

    const currentData = dataRef.current;

    // Preserve non-product items
    const nonProductItems = (currentData.items || []).filter(item => item && item.type !== 'product');

    // Create the updated content object that matches the expected format
    const updatedContent = {
      items: [...nonProductItems, ...productsWithType],
      settings: {
        ...(currentData.settings || {}),
        displayStyle
      }
    };

    // Log what we're saving for debugging
    console.log('Saving product data:', updatedContent);

    // Call the onSave function with the updated content
    onSave(updatedContent);

    // Use requestAnimationFrame for smoother UI
    requestAnimationFrame(() => {
      setTimeout(() => {
        setLoading(false);
        setHasUnsavedChanges(false);
        if (onClose) onClose();
      }, 300); // Reduced timeout for better responsiveness
    });
  }, [products, displayStyle, onSave, onClose]);

  // Add product - optimized
  const handleAddProduct = useCallback(() => {
    const timestamp = Date.now();
    const newProduct = {
      id: `product-${timestamp}`,
      key: `product-${timestamp}`,
      title: '',
      price: '',
      imageUrl: '',
      description: '',
      type: 'product'
    };

    const sheetId = openBottomSheet(
      <ProductForm
        product={newProduct}
        isNew={true}
        onSave={(productData) => {
          // Use functional update to avoid stale closures
          setProducts(prev => [...prev, { ...newProduct, ...productData, type: 'product' }]);
          closeBottomSheet(sheetId);

          // Provide haptic feedback
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

          // Brief loading indicator with requestAnimationFrame
          setLoading(true);
          requestAnimationFrame(() => {
            setTimeout(() => setLoading(false), 200);
          });
        }}
        onClose={() => closeBottomSheet(sheetId)}
      />,
      ['80%']
    );
  }, [openBottomSheet, closeBottomSheet]);

  // Edit product - optimized
  const handleEditProduct = useCallback((product) => {
    const sheetId = openBottomSheet(
      <ProductForm
        product={product}
        isNew={false}
        onSave={(productData) => {
          // Use functional update with map for immutability
          setProducts(prev =>
            prev.map(item =>
              item.id === product.id
                ? { ...item, ...productData, type: 'product' }
                : item
            )
          );
          closeBottomSheet(sheetId);

          // Brief loading indicator with requestAnimationFrame
          setLoading(true);
          requestAnimationFrame(() => {
            setTimeout(() => setLoading(false), 200);
          });
        }}
        onClose={() => closeBottomSheet(sheetId)}
      />,
      ['80%']
    );
  }, [openBottomSheet, closeBottomSheet]);

  // Delete product - optimized
  const handleDeleteProduct = useCallback((productId) => {
    // Use functional update with filter for immutability
    setProducts(prev => prev.filter(item => item.id !== productId));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  // Render grid item for DraggableGrid - memoized
  const renderGridItem = useCallback((item, index) => {
    if (!item) return null;

    return (
      <View style={[styles.gridItemContainer]} key={item.key}>
        <ProductCard
          item={item}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          displayStyle="grid"
        />
      </View>
    );
  }, [handleEditProduct, handleDeleteProduct]);

  // Render item for horizontal DraggableFlatList - optimized with ScaleDecorator
  const renderHorizontalItem = useCallback(({ item, drag, isActive }) => {
    return (
      <ScaleDecorator activeScale={1.05}>
        <TouchableOpacity
          onLongPress={drag}
          delayLongPress={200}
          activeOpacity={1}
        >
          <ProductCard
            item={item}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            isActive={isActive}
            displayStyle="horizontal"
          />
        </TouchableOpacity>
      </ScaleDecorator>
    );
  }, [handleEditProduct, handleDeleteProduct]);

  // Render item for vertical list DraggableFlatList - optimized with ScaleDecorator
  const renderListItem = useCallback(({ item, drag, isActive }) => {
    return (
      <ScaleDecorator activeScale={1.02}>
        <TouchableOpacity
          onLongPress={drag}
          delayLongPress={200}
          activeOpacity={1}
        >
          <ProductCard
            item={item}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            isActive={isActive}
            displayStyle="list"
          />
        </TouchableOpacity>
      </ScaleDecorator>
    );
  }, [handleEditProduct, handleDeleteProduct]);

  // View toggle buttons - memoized
  const ViewToggleButtons = useMemo(() => (
    <View style={styles.viewToggleContainer}>
      <TouchableOpacity
        style={[
          styles.viewToggleButton,
          displayStyle === 'grid' && styles.activeViewToggle
        ]}
        onPress={() => setDisplayStyle('grid')}
      >
        <Image source={require('../../../../assets/icons/home/grid interface-125-1658433281.png')} style={[styles.viewToggleImage, displayStyle === 'grid' && { tintColor: '#fff' }]} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.viewToggleButton,
          displayStyle === 'horizontal' && styles.activeViewToggle
        ]}
        onPress={() => setDisplayStyle('horizontal')}
      >
        <View>
          <Image source={require('../../../../assets/icons/home/multitasking-128-1658433281.png')} style={[styles.viewToggleImage, displayStyle === 'horizontal' && { tintColor: '#fff' }]} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.viewToggleButton,
          displayStyle === 'list' && styles.activeViewToggle
        ]}
        onPress={() => setDisplayStyle('list')}
      >
        <View>
          <Image source={require('../../../../assets/icons/home/multitasking-127-1658433281.png')} style={[styles.viewToggleImage, displayStyle === 'list' && { tintColor: '#fff' }]} />
        </View>
      </TouchableOpacity>
    </View>
  ), [displayStyle]);

  // Header component - memoized
  const Header = useMemo(() => (
    <View style={styles.improvedHeader}>
      <TouchableOpacity
        style={styles.headerButton}
        onPress={onClose}
      >
        <Image source={require('../../../../assets/icons/home/chevron left-8-1696832126.png')} style={[styles.closeButton]} />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Products</Text>

      <TouchableOpacity
        style={styles.headerButton}
        onPress={saveChanges}
      >
        <View>
          <Text style={styles.doneText}>Done</Text>
        </View>
      </TouchableOpacity>
    </View>
  ), [onClose, saveChanges]);

  // Subheader component - memoized
  const Subheader = useMemo(() => (
    <View style={styles.subHeader}>
      <Text style={styles.productCount}>{products.length} items</Text>
      {ViewToggleButtons}
    </View>
  ), [products.length, ViewToggleButtons]);

  // Add button component - memoized
  const AddButton = useMemo(() => (
    <TouchableOpacity
      style={styles.addButton}
      onPress={handleAddProduct}
    >
      <View style={styles.addButtonContent}>
        <Image source={require('../../../../assets/icons/home/plus 2-10-1662493809.png')} style={styles.addButtonImage} />
        <Text style={styles.addButtonText}>Add Product</Text>
      </View>
    </TouchableOpacity>
  ), [handleAddProduct]);

  // Empty state
  if (products.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {Header}

          <View style={styles.emptyState}>
            <Ionicons name="basket-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No Products Yet</Text>
            <Text style={styles.emptyDescription}>
              Add products to showcase on your website
            </Text>
            <TouchableOpacity
              style={styles.emptyAddButton}
              onPress={handleAddProduct}
            >
              <View>
                <Text style={styles.emptyAddButtonText}>Add Your First Product</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Render the appropriate view based on displayStyle - optimized for performance
  const renderProductList = () => {
    if (displayStyle === 'grid') {
      return (
        <DraggableGrid
          numColumns={2}
          data={products}
          renderItem={renderGridItem}
          onDragRelease={(data) => {
            setProducts(data);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
          onDragStart={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
          itemHeight={CARD_WIDTH + 80}
          style={styles.grid}
          itemWidth={(width - 48) / 2}
          // Performance optimizations
          keyExtractor={item => item.key}
          maxScale={1.05}
        />
      );
    } else if (displayStyle === 'horizontal') {
      // Use key to force complete remount
      return (
        <DraggableFlatList
          key={horizontalListKey.current}
          data={products}
          renderItem={renderHorizontalItem}
          keyExtractor={item => item.key}
          horizontal={true}
          contentContainerStyle={styles.horizontalList}
          onDragEnd={({ data }) => {
            setProducts(data);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
          onDragBegin={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
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
      // Use key to force complete remount
      return (
        <DraggableFlatList
          key={verticalListKey.current}
          data={products}
          renderItem={renderListItem}
          keyExtractor={item => item.key}
          horizontal={false}
          contentContainerStyle={styles.verticalList}
          onDragEnd={({ data }) => {
            setProducts(data);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
          onDragBegin={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
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

  // Main view - optimized
  return (
    <View style={styles.safeArea}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {Header}
        {Subheader}

        <View style={styles.gridContainer}>
          {renderProductList()}
          {AddButton}
        </View>

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="small" color={colors.primary || '#000'} />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  closeButton: {
    width: 24,
    height: 24,
    tintColor: '#000',
    marginLeft: -6,
  },
  improvedHeader: {
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
  doneText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary || '#000',
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  productCount: {
    fontSize: 14,
    color: '#666',
  },
  viewToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    padding: 6,
    gap: 6,
  },
  viewToggleButton: {
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  activeViewToggle: {
    backgroundColor: colors.primary || '#000',
  },
  gridContainer: {
    flex: 1,
    paddingBottom: 80,
  },
  grid: {
    flex: 1
  },
  gridItemContainer: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 5,
    paddingVertical: 5,
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
    bottom: 25,
    left: 16,
    right: 16,
    backgroundColor: colors.primary || '#000',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  addButtonImage: {
    width: 24,
    height: 24,
    tintColor: '#fff',
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  viewToggleImage: {
    width: 20,  
    height: 20,
    tintColor: '#666',
  },
  emptyAddButton: {
    backgroundColor: colors.primary || '#000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default EditorSheet; 
