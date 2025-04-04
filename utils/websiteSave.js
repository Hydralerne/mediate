import { request } from './requests';
import { getToken } from './token';
import { getWebsiteChanges } from './websiteDataDiff';

// Cache for tracking save operations
const saveOperationsCache = new Map();

/**
 * Save website changes based on what has been modified
 * With optimized performance for larger websites
 * @param {string} websiteId - ID of the website to update
 * @param {Object} originalData - Original website data before changes
 * @param {Object} currentData - Current website data with changes
 * @returns {Promise<boolean>} - Success indicator
 */
export const saveWebsiteChanges = async (websiteId, originalData, currentData) => {
  if (!websiteId || !originalData || !currentData) {
    console.error('Missing required data for saveWebsiteChanges');
    return false;
  }
  
  // Generate operation ID for tracking parallel operations
  const operationId = `save-${websiteId}-${Date.now()}`;
  
  // Skip if the same save is already in progress
  if (saveOperationsCache.has(websiteId)) {
    console.log('A save operation is already in progress for this website');
    return false;
  }
  
  // Mark this website as being saved
  saveOperationsCache.set(websiteId, operationId);
  
  try {
    // Calculate what has changed
    const changes = getWebsiteChanges(originalData, currentData);
    
    if (!changes.hasChanges) {
      console.log('No changes detected to save');
      return true;
    }
    
    const token = await getToken();
    
    // Determine what to update based on the changes
    if (changes.header && !changes.sections && !changes.settings) {
      // Only header changed - use header update endpoint
      console.log('Saving header changes');
      await request(
        `https://api.oblien.com/sites/${websiteId}/header`,
        currentData.header,
        'PUT',
        { Authorization: `Bearer ${token}` }
      );
    } 
    else if (changes.sections && !changes.header && !changes.settings) {
      // Only sections changed - use sections update endpoint
      console.log('Saving section changes');
      await request(
        `https://api.oblien.com/sites/${websiteId}/sections`,
        currentData.sections,
        'PUT',
        { Authorization: `Bearer ${token}` }
      );
    }
    else if (changes.settings && !changes.header && !changes.sections) {
      // Only settings changed - use settings update endpoint
      console.log('Saving settings changes');
      await request(
        `https://api.oblien.com/sites/${websiteId}/settings`,
        currentData.settings,
        'PUT',
        { Authorization: `Bearer ${token}` }
      );
    }
    else {
      // Multiple things changed - use full website update
      console.log('Saving full website changes');
      await request(
        `https://api.oblien.com/sites/${websiteId}`,
        currentData,
        'PUT',
        { Authorization: `Bearer ${token}` }
      );
    }
    
    return true;
  } catch (error) {
    console.error('Error saving website changes:', error);
    throw error;
  } finally {
    // Only clear the marker if this is still the current operation
    if (saveOperationsCache.get(websiteId) === operationId) {
      saveOperationsCache.delete(websiteId);
    }
  }
};

/**
 * Check if a save operation is in progress for a website
 * @param {string} websiteId - ID of the website to check
 * @returns {boolean} - Whether a save operation is in progress
 */
export const isSaving = (websiteId) => {
  return saveOperationsCache.has(websiteId);
}; 