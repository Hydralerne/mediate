import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { request } from '../utils/requests';
import { getToken } from '../utils/token';
import { getWebsiteChanges, clearChangesCache } from '../utils/websiteDataDiff';
import { saveWebsiteChanges, isSaving } from '../utils/websiteSave';
import { deepEqual } from '../utils/compareUtils';
import { extractCurrentWebsiteData, normalizeWebsiteData, createWebsiteDataDownload } from '../utils/websiteDataExport';

// You can replace this with your actual API service
// import { updateSections, fetchSections } from '../services/api';

// Simple debounce utility function to limit frequent state updates
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  // Store all website data by website ID
  const [websiteDataMap, setWebsiteDataMap] = useState({});
  const [currentWebsiteId, setCurrentWebsiteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Refs to track state internally for immediate access
  const loadingRef = useRef(false);
  const savingRef = useRef(false);
  const originalWebsiteDataRef = useRef({});
  // Ref for website data map to avoid async state issues
  const websiteDataMapRef = useRef({});
  // Ref for immediate access to current website ID
  const currentWebsiteIdRef = useRef(null);

  // Update the refs when state changes
  useEffect(() => {
    websiteDataMapRef.current = websiteDataMap;
  }, [websiteDataMap]);

  // Get sections for current website
  const sections = useMemo(() => {
    return currentWebsiteId ? (websiteDataMap[currentWebsiteId]?.sections || []) : [];
  }, [currentWebsiteId, websiteDataMap]);

  // Get website data for current website
  const websiteData = useMemo(() => {
    return currentWebsiteId ? (websiteDataMap[currentWebsiteId] || {}) : null;
  }, [currentWebsiteId, websiteDataMap]);

  // Optimized loading state setter with debounce
  const setLoadingDebounced = useCallback(debounce((isLoading) => {
    if (isLoading !== loadingRef.current) {
      loadingRef.current = isLoading;
      setLoading(isLoading);
    }
  }, 100), []);

  // Optimized saving state setter with debounce
  const setSavingDebounced = useCallback(debounce((isSavingState) => {
    if (isSavingState !== savingRef.current) {
      savingRef.current = isSavingState;
      setSaving(isSavingState);
    }
  }, 100), []);

  // Check for unsaved changes using the ref for immediate access
  const hasUnsavedChanges = useCallback(() => {
    const websiteId = currentWebsiteIdRef.current;
    if (!websiteId) return false;

    // Get data from refs for immediate access
    const originalData = originalWebsiteDataRef.current[websiteId];
    const currentData = websiteDataMapRef.current[websiteId];

    if (!originalData || !currentData) return false;

    // The websiteDataDiff utility already uses internal caching
    const changes = getWebsiteChanges(originalData, currentData);
    return changes.hasChanges;
  }, []);

  // Check if a website is currently being saved
  const checkIsSaving = useCallback(() => {
    const websiteId = currentWebsiteIdRef.current;
    return websiteId ? isSaving(websiteId) : false;
  }, []);

  // Export the current website data
  const exportWebsiteData = useCallback((shouldNormalize = true) => {
    // Use the ref for immediate access
    const websiteId = currentWebsiteIdRef.current;
    if (!websiteId) {
      console.error('No active website to export');
      return null;
    }

    // Extract full website data using the refs for immediate access
    const websiteData = extractCurrentWebsiteData(websiteDataMapRef, currentWebsiteIdRef);
    
    // Return normalized data if requested
    return shouldNormalize ? normalizeWebsiteData(websiteData) : websiteData;
  }, []);

  // Set the active website ID and load its data if needed
  const setActiveWebsite = useCallback(async (websiteId) => {
    if (!websiteId) return;

    // Update both state and ref - ref updates immediately
    currentWebsiteIdRef.current = websiteId;
    setCurrentWebsiteId(websiteId);

    // Invalidate changes cache when switching websites
    clearChangesCache();

    // Use the ref for immediate access
    if (!websiteDataMapRef.current[websiteId]) {
      await loadWebsiteData(websiteId);
    }
  }, [loadWebsiteData]);

  // Fetch all data for a specific website ID in a single request
  const loadWebsiteData = useCallback(async (websiteId) => {
    if (!websiteId) return;

    // Skip if already loading
    if (loadingRef.current) return;

    loadingRef.current = true;
    setLoadingDebounced(true);
    try {
      const token = await getToken();
      const websiteData = await request(`https://api.oblien.com/sites/${websiteId}`, {}, 'GET', {
        Authorization: `Bearer ${token}`
      });

      // Update the ref immediately for synchronous access
      websiteDataMapRef.current = {
        ...websiteDataMapRef.current,
        [websiteId]: websiteData
      };
      
      // Also update the state for UI rendering
      setWebsiteDataMap(prev => ({
        ...prev,
        [websiteId]: websiteData
      }));

      // Store a deep copy of the original data for change tracking
      originalWebsiteDataRef.current[websiteId] = JSON.parse(JSON.stringify(websiteData));
      
      // Clear caches to ensure fresh change detection
      clearChangesCache();

      setError(null);
    } catch (err) {
      setError('Failed to load website data');
      console.error('Error loading website data:', err);
    } finally {
      loadingRef.current = false;
      setLoadingDebounced(false);
    }
  }, [setLoadingDebounced]);

  // Refresh website data using the ref for immediate access
  const refreshWebsite = useCallback(async () => {
    const websiteId = currentWebsiteIdRef.current;
    if (!websiteId) {
      console.error('No active website to refresh');
      return false;
    }

    // Skip if the website is currently being saved
    if (checkIsSaving()) {
      console.log('Cannot refresh while website is being saved');
      return false;
    }

    try {
      await loadWebsiteData(websiteId);
      return true;
    } catch (err) {
      console.error('Failed to refresh website data:', err);
      return false;
    }
  }, [loadWebsiteData, checkIsSaving]);

  // Save all changes for the current website
  const saveChanges = useCallback(async () => {
    const websiteId = currentWebsiteIdRef.current;
    if (!websiteId) {
      console.error('No active website to save');
      return false;
    }

    // Skip if already saving
    if (savingRef.current || checkIsSaving()) {
      console.log('A save operation is already in progress');
      return false;
    }

    savingRef.current = true;
    setSavingDebounced(true);
    try {
      // Get original and current data from refs for immediate access
      const originalData = originalWebsiteDataRef.current[websiteId];
      const currentData = websiteDataMapRef.current[websiteId];

      if (!originalData || !currentData) {
        console.error('Missing data for saving changes');
        return false;
      }

      // Check if there are actually changes to save
      if (!hasUnsavedChanges()) {
        console.log('No changes to save');
        return true;
      }

      // Use the utility function to save changes
      const success = await saveWebsiteChanges(
        websiteId,
        originalData,
        currentData
      );

      if (success) {
        // Update the original data ref to reflect the saved state
        originalWebsiteDataRef.current[websiteId] = JSON.parse(JSON.stringify(currentData));
        
        // Clear caches to ensure fresh change detection
        clearChangesCache();
      }

      setError(null);
      return success;
    } catch (err) {
      setError('Failed to save changes');
      console.error('Error saving changes:', err);
      return false;
    } finally {
      savingRef.current = false;
      setSavingDebounced(false);
    }
  }, [setLoadingDebounced, setSavingDebounced, hasUnsavedChanges, checkIsSaving]);

  // Discard all unsaved changes for the current website
  const discardChanges = useCallback(() => {
    const websiteId = currentWebsiteIdRef.current;
    if (!websiteId) {
      console.error('No active website to discard changes from');
      return false;
    }

    // Skip if the website is currently being saved
    if (checkIsSaving()) {
      console.log('Cannot discard changes while website is being saved');
      return false;
    }

    const originalData = originalWebsiteDataRef.current[websiteId];
    if (!originalData) {
      console.error('No original data found to restore');
      return false;
    }

    // Skip if there are no changes to discard
    if (!hasUnsavedChanges()) {
      console.log('No changes to discard');
      return true;
    }

    // Restore original data to both ref and state
    const restoredData = JSON.parse(JSON.stringify(originalData));
    
    // Update ref immediately
    websiteDataMapRef.current = {
      ...websiteDataMapRef.current,
      [websiteId]: restoredData
    };
    
    // Update state for UI rendering
    setWebsiteDataMap(prev => ({
      ...prev,
      [websiteId]: restoredData
    }));
    
    // Clear caches to ensure fresh change detection
    clearChangesCache();

    setError(null);
    return true;
  }, [hasUnsavedChanges, checkIsSaving]);

  // Add a new section to the current website
  const addSection = useCallback(async (sectionData) => {
    const websiteId = currentWebsiteIdRef.current;
    if (!websiteId) {
      console.error('No active website selected');
      return null;
    }

    // Skip if the website is currently being saved
    if (checkIsSaving()) {
      console.log('Cannot add section while website is being saved');
      return null;
    }

    loadingRef.current = true;
    setLoadingDebounced(true);
    try {
      // Create a new section with a unique ID
      const newSection = {
        ...sectionData,
        id: `section-${Date.now()}`,
      };

      // Get current website data from ref
      const currentWebsiteData = websiteDataMapRef.current[websiteId] || {};
      const updatedSections = [...(currentWebsiteData.sections || []), newSection];
      
      // Create updated website data
      const updatedWebsiteData = {
        ...currentWebsiteData,
        sections: updatedSections
      };
      
      // Update ref immediately for synchronous access
      websiteDataMapRef.current = {
        ...websiteDataMapRef.current,
        [websiteId]: updatedWebsiteData
      };
      
      // Update state for UI rendering
      setWebsiteDataMap(prev => ({
        ...prev,
        [websiteId]: updatedWebsiteData
      }));
      
      // Clear caches to ensure fresh change detection
      clearChangesCache();

      setError(null);
      return newSection;
    } catch (err) {
      setError('Failed to add section');
      console.error('Error adding section:', err);
      return null;
    } finally {
      loadingRef.current = false;
      setLoadingDebounced(false);
    }
  }, [setLoadingDebounced, checkIsSaving]);

  // Update an existing section for the current website
  const updateSection = useCallback(async (updatedSection) => {
    const websiteId = currentWebsiteIdRef.current;
    if (!websiteId) {
      console.error('No active website selected');
      return false;
    }

    // Skip if the website is currently being saved
    if (checkIsSaving()) {
      console.log('Cannot update section while website is being saved');
      return false;
    }

    loadingRef.current = true;
    setLoadingDebounced(true);
    try {
      // Get current website data from ref
      const currentWebsiteData = websiteDataMapRef.current[websiteId] || {};
      const currentSections = currentWebsiteData.sections || [];
      
      // Update the section
      const updatedSections = currentSections.map(section =>
        section.id === updatedSection.id ? updatedSection : section
      );
      
      // Create updated website data
      const updatedWebsiteData = {
        ...currentWebsiteData,
        sections: updatedSections
      };
      
      // Update ref immediately for synchronous access
      websiteDataMapRef.current = {
        ...websiteDataMapRef.current,
        [websiteId]: updatedWebsiteData
      };
      
      // Update state for UI rendering
      setWebsiteDataMap(prev => ({
        ...prev,
        [websiteId]: updatedWebsiteData
      }));
      
      // Clear caches to ensure fresh change detection
      clearChangesCache();

      setError(null);
      return true;
    } catch (err) {
      setError('Failed to update section');
      console.error('Error updating section:', err);
      return false;
    } finally {
      loadingRef.current = false;
      setLoadingDebounced(false);
    }
  }, [setLoadingDebounced, checkIsSaving]);

  // Delete a section from the current website
  const deleteSection = useCallback(async (sectionId) => {
    const websiteId = currentWebsiteIdRef.current;
    if (!websiteId) {
      console.error('No active website selected');
      return false;
    }

    // Skip if the website is currently being saved
    if (checkIsSaving()) {
      console.log('Cannot delete section while website is being saved');
      return false;
    }

    loadingRef.current = true;
    setLoadingDebounced(true);
    try {
      // Get current website data from ref
      const currentWebsiteData = websiteDataMapRef.current[websiteId] || {};
      const currentSections = currentWebsiteData.sections || [];
      
      // Filter out the section to delete
      const updatedSections = currentSections.filter(section => section.id !== sectionId);
      
      // Create updated website data
      const updatedWebsiteData = {
        ...currentWebsiteData,
        sections: updatedSections
      };
      
      // Update ref immediately for synchronous access
      websiteDataMapRef.current = {
        ...websiteDataMapRef.current,
        [websiteId]: updatedWebsiteData
      };
      
      // Update state for UI rendering
      setWebsiteDataMap(prev => ({
        ...prev,
        [websiteId]: updatedWebsiteData
      }));
      
      // Clear caches to ensure fresh change detection
      clearChangesCache();

      setError(null);
      return true;
    } catch (err) {
      setError('Failed to delete section');
      console.error('Error deleting section:', err);
      return false;
    } finally {
      loadingRef.current = false;
      setLoadingDebounced(false);
    }
  }, [setLoadingDebounced, checkIsSaving]);

  // Reorder sections for the current website
  const reorderSections = useCallback(async (newOrder) => {
    const websiteId = currentWebsiteIdRef.current;
    if (!websiteId) {
      console.error('No active website selected');
      return false;
    }

    // Skip if the website is currently being saved
    if (checkIsSaving()) {
      console.log('Cannot reorder sections while website is being saved');
      return false;
    }

    loadingRef.current = true;
    setLoadingDebounced(true);
    try {
      // Get current website data from ref
      const currentWebsiteData = websiteDataMapRef.current[websiteId] || {};
      
      // Create updated website data
      const updatedWebsiteData = {
        ...currentWebsiteData,
        sections: newOrder
      };
      
      // Update ref immediately for synchronous access
      websiteDataMapRef.current = {
        ...websiteDataMapRef.current,
        [websiteId]: updatedWebsiteData
      };
      
      // Update state for UI rendering
      setWebsiteDataMap(prev => ({
        ...prev,
        [websiteId]: updatedWebsiteData
      }));
      
      // Clear caches to ensure fresh change detection
      clearChangesCache();

      setError(null);
      return true;
    } catch (err) {
      setError('Failed to reorder sections');
      console.error('Error reordering sections:', err);
      return false;
    } finally {
      loadingRef.current = false;
      setLoadingDebounced(false);
    }
  }, [setLoadingDebounced, checkIsSaving]);

  // Get section by ID from the current website using ref for immediate access
  const getSection = useCallback((sectionId) => {
    const websiteId = currentWebsiteIdRef.current;
    if (!websiteId) return null;
    
    const websiteData = websiteDataMapRef.current[websiteId];
    if (!websiteData) return null;
    
    const sectionsForWebsite = websiteData.sections || [];
    return sectionsForWebsite.find(section => section.id === sectionId) || null;
  }, []);

  // Update website header for the current website
  const updateWebsiteHeader = useCallback(async (headerData) => {
    const websiteId = currentWebsiteIdRef.current;
    if (!websiteId) {
      console.error('No active website selected');
      return false;
    }

    if (!headerData) {
      console.error('Invalid header data provided to updateWebsiteHeader');
      return false;
    }

    // Skip if the website is currently being saved
    if (checkIsSaving()) {
      console.log('Cannot update header while website is being saved');
      return false;
    }

    loadingRef.current = true;
    setLoadingDebounced(true);
    try {
      // Get current website data from ref
      const currentWebsiteData = websiteDataMapRef.current[websiteId] || {};
      
      // Skip update if no actual changes
      if (deepEqual(currentWebsiteData.header, headerData)) {
        console.log('No changes to header, skipping update');
        return true;
      }
      
      // Create updated website data
      const updatedWebsiteData = {
        ...currentWebsiteData,
        header: headerData
      };
      
      // Update ref immediately for synchronous access
      websiteDataMapRef.current = {
        ...websiteDataMapRef.current,
        [websiteId]: updatedWebsiteData
      };
      
      // Update state for UI rendering
      setWebsiteDataMap(prev => ({
        ...prev,
        [websiteId]: updatedWebsiteData
      }));
      
      // Clear caches to ensure fresh change detection
      clearChangesCache();

      setError(null);
      return true;
    } catch (err) {
      setError('Failed to update website header');
      console.error('Error updating website header:', err);
      return false;
    } finally {
      loadingRef.current = false;
      setLoadingDebounced(false);
    }
  }, [setLoadingDebounced, checkIsSaving]);


  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    sections,
    websiteData,
    loading,
    saving,
    error,
    hasUnsavedChanges,
    isSaving: checkIsSaving,
    setActiveWebsite,
    addSection,
    updateSection,
    deleteSection,
    reorderSections,
    getSection,
    updateWebsiteHeader,
    // Keep using state for the UI, but provide the getter function for immediate value
    currentWebsiteId,
    getCurrentWebsiteId: () => currentWebsiteIdRef.current,
    refreshWebsite,
    saveChanges,
    discardChanges,
    // Data export functions
    exportWebsiteData
  }), [
    sections,
    websiteData,
    loading,
    saving,
    error,
    hasUnsavedChanges,
    checkIsSaving,
    setActiveWebsite,
    addSection,
    updateSection,
    deleteSection,
    reorderSections,
    getSection,
    updateWebsiteHeader,
    currentWebsiteId,
    refreshWebsite,
    saveChanges,
    discardChanges,
    exportWebsiteData
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