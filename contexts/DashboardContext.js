import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';

// You can replace this with your actual API service
// import { updateSections, fetchSections } from '../services/api';

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch sections on initial load
  useEffect(() => {
    const loadSections = async () => {
      setLoading(true);
      try {
        // For now, we'll just use a mock data. Replace with your API call
        // const data = await fetchSections();
        const mockData = [
          {
            id: 'portfolio',
            title: 'Portfolio Showcase',
            description: 'Display your work and projects',
            type: 'portfolio',
            active: true,
            icon: 27,
            content: {
              items: [],
              settings: {
                displayStyle: 'grid',
                projectsPerPage: 6,
                showProjectLinks: true,
                showTags: true,
                sortableEnabled: true,
              }
            }
          },
          // Add more mock sections as needed
        ];
        
        setSections(mockData);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard sections');
        console.error('Error loading sections:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSections();
  }, []);

  // Add a new section - with fixed dependency array and proper state update
  const addSection = useCallback(async (sectionData) => {
    setLoading(true);
    try {
      // Create a new section with a unique ID
      const newSection = {
        ...sectionData,
        id: `section-${Date.now()}`,
      };

      // Update local state using function form to avoid stale closure issues
      setSections(prev => [...prev, newSection]);

      // Save to server (uncomment and replace with your API)
      // await updateSections(newSections);
      
      setError(null);
      return newSection;
    } catch (err) {
      setError('Failed to add section');
      console.error('Error adding section:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []); // Remove dependency on sections to prevent unnecessary recreation

  // Update an existing section - with fixed dependency array
  const updateSection = useCallback(async (updatedSection) => {
    setLoading(true);
    try {
      // Update in local state using function form to avoid stale closure issues
      setSections(prev => 
        prev.map(section => 
          section.id === updatedSection.id ? updatedSection : section
        )
      );

      // Save to server (uncomment and replace with your API)
      // await updateSections(updatedSections);
      
      setError(null);
      return true;
    } catch (err) {
      setError('Failed to update section');
      console.error('Error updating section:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []); // Remove dependency on sections to prevent unnecessary recreation

  // Delete a section - with fixed dependency array
  const deleteSection = useCallback(async (sectionId) => {
    setLoading(true);
    try {
      // Remove from local state using function form
      setSections(prev => prev.filter(section => section.id !== sectionId));

      // Save to server (uncomment and replace with your API)
      // await updateSections(filteredSections);
      
      setError(null);
      return true;
    } catch (err) {
      setError('Failed to delete section');
      console.error('Error deleting section:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []); // Remove dependency on sections to prevent unnecessary recreation

  // Reorder sections - already optimized
  const reorderSections = useCallback(async (newOrder) => {
    setLoading(true);
    try {
      setSections(newOrder);

      // Save to server (uncomment and replace with your API)
      // await updateSections(newOrder);
      
      setError(null);
      return true;
    } catch (err) {
      setError('Failed to reorder sections');
      console.error('Error reordering sections:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get section by ID - memoize with proper dependency
  const getSection = useCallback((sectionId) => {
    return sections.find(section => section.id === sectionId) || null;
  }, [sections]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    sections,
    loading,
    error,
    addSection,
    updateSection,
    deleteSection,
    reorderSections,
    getSection
  }), [
    sections,
    loading,
    error,
    addSection,
    updateSection,
    deleteSection,
    reorderSections,
    getSection
  ]);

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export default DashboardContext; 