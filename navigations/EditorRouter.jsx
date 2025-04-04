import React, { useMemo, memo, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Import all section editors
import { EditorSheet as ProductsEditor } from '../components/sections/content/products/EditorSheet';
import { EditorSheet as PortfolioEditor } from '../components/sections/content/portfolio/EditorSheet';

// Import middleware to get editors (for future editors)
import { getSectionEditor } from '../components/sections';

// Import our dashboard context
import { useDashboard } from '../contexts/DashboardContext';

// Memoized error component to prevent unnecessary rerenders
const ErrorMessage = memo(({ message }) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>{message}</Text>
  </View>
));

const EditorRouter = ({ route, navigation }) => {
  const { section, websiteId } = route.params || {};
  const { updateSection } = useDashboard();
  
  // Early return with memoized error component if no section
  if (!section) {
    return <ErrorMessage message="No section data provided" />;
  }

  // Memoize the save handler to prevent recreation on re-renders
  const handleSave = useCallback(async (contentData) => {
    try {
      console.log('EditorRouter saving:', section.type, contentData);

      // Build the updated section correctly based on the content data structure
      let updatedSection;
      
      // Handle different section content structures without losing data
      if (contentData && typeof contentData === 'object') {
        // For sections like portfolio and products that pass {items, settings}
        if (contentData.items !== undefined) {
          updatedSection = {
            ...section,
            content: {
              ...(section.content || {}),
              ...contentData
            }
          };
        } else {
          // For simple content structures
          updatedSection = {
            ...section,
            content: contentData
          };
        }
      } else {
        // Fallback for primitive content data
        updatedSection = {
          ...section,
          content: contentData
        };
      }
      
      // Save via context
      await updateSection(updatedSection);
    } catch (error) {
      console.error('Failed to save section:', error);
    }
  }, [section, updateSection]);
  
  // Memoize the close handler
  const handleClose = useCallback(() => {
    navigation.goBack();
  }, [navigation]);
  
  // Memoize editor component selection based on section type
  const EditorComponent = useMemo(() => {
    switch (section.type) {
      case 'products':
        return ProductsEditor;
        
      case 'portfolio':
        return PortfolioEditor;
        
      default:
        // Try to get the editor from middleware for other section types
        return getSectionEditor(section.type);
    }
  }, [section.type]);
  
  // If no editor found, return error component
  if (!EditorComponent) {
    return <ErrorMessage message={`No editor available for section type: ${section.type}`} />;
  }

  return (
    <View style={styles.container}>
      <EditorComponent
        data={section.content}
        onSave={handleSave}
        onClose={handleClose}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  errorText: {
    fontSize: 16,
    color: 'rgba(0,0,0,0.6)',
    textAlign: 'center'
  }
});

export default memo(EditorRouter); 