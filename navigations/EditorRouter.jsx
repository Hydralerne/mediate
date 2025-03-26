import React, { useMemo, memo, useCallback } from 'react';
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
  const { section } = route.params || {};
  const { updateSection } = useDashboard();
  
  // Early return with memoized error component if no section
  if (!section) {
    return <ErrorMessage message="No section data provided" />;
  }

  // Memoize the save handler to prevent recreation on re-renders
  const handleSave = useCallback(async (contentData) => {
    // Create updated section object
    const updatedSection = {
      ...section,
      content: contentData
    };
    
    // Save via context
    await updateSection(updatedSection);
    
    // Navigate back regardless of success
    // (Error handling is managed by the context)
    navigation.goBack();
  }, [section, updateSection, navigation]);
  
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