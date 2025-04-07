import { deepEqual, extractChanges, clearCompareCache } from './compareUtils';

/**
 * Compare two objects and return differences
 * @param {Object} original - Original data object
 * @param {Object} current - Current data object
 * @returns {Object} Object containing changes
 */
export const getObjectDiff = (original, current) => {
  return extractChanges(original, current);
};

/**
 * Compare two sections arrays and identify which ones changed
 * @param {Array} originalSections - Original sections array
 * @param {Array} currentSections - Current sections array
 * @returns {Object} Object detailing section changes
 */
export const getSectionsDiff = (originalSections = [], currentSections = []) => {
  const result = {
    added: [],
    updated: [],
    deleted: [],
    reordered: false
  };

  // Check if sections were reordered
  const originalIds = originalSections.map(s => s.id);
  const currentIds = currentSections.map(s => s.id);
  
  // Find sections that exist in both arrays
  const commonIds = originalIds.filter(id => currentIds.includes(id));

  // Create position maps to determine if sections have been reordered
  const originalPositions = {};
  originalSections.forEach((section, index) => {
    originalPositions[section.id] = index;
  });
  
  const currentPositions = {};
  currentSections.forEach((section, index) => {
    currentPositions[section.id] = index;
  });

  // If order differs, mark as reordered
  result.reordered = !deepEqual(
    commonIds,
    currentIds.filter(id => commonIds.includes(id))
  );

  // Find added sections
  result.added = currentSections.filter(section => 
    !originalIds.includes(section.id)
  );

  // Find deleted sections
  result.deleted = originalSections
    .filter(section => !currentIds.includes(section.id))
    .map(section => section.id);

  // Find updated sections
  const originalMap = Object.fromEntries(
    originalSections.map(section => [section.id, section])
  );

  result.updated = currentSections
    .filter(section => 
      originalIds.includes(section.id) && 
      (!deepEqual(section, originalMap[section.id]) || 
       (originalPositions[section.id] !== currentPositions[section.id])) // Include if position changed
    )
    .map(section => {
      const changes = getObjectDiff(originalMap[section.id], section);
      
      // Add position change info to changes if position has changed
      if (originalPositions[section.id] !== currentPositions[section.id]) {
        changes.sort_order = currentPositions[section.id]
      }
      
      return {
        id: section.id,
        changes
      };
    });

  return result;
};

// Cache to store website changes for better performance
const changesCache = new Map();

/**
 * Generate a cache key for website data comparison
 * @param {Object} originalData - Original website data
 * @param {Object} currentData - Current website data
 * @returns {string} Cache key
 */
const generateCacheKey = (originalData, currentData) => {
  // Use hash-like approach based on data shapes and size
  const originalHash = JSON.stringify(originalData).length.toString(16);
  const currentHash = JSON.stringify(currentData).length.toString(16);
  return `${originalHash}-${currentHash}`;
};

/**
 * Compare original website data with current data and return all changes
 * With improved performance using caching
 * @param {Object} originalData - Original website data
 * @param {Object} currentData - Current website data
 * @returns {Object} Detailed changes object
 */
export const getWebsiteChanges = (originalData, currentData) => {
  if (!originalData || !currentData) {
    return { completeReplacement: true, data: currentData, hasChanges: true };
  }

  // Handle null values safely
  const safeOriginal = originalData || {};
  const safeCurrent = currentData || {};

  // Reset cache if it gets too large
  if (changesCache.size > 100) {
    changesCache.clear();
  }

  // Attempt to use cached result if available
  const cacheKey = generateCacheKey(safeOriginal, safeCurrent);
  if (changesCache.has(cacheKey)) {
    return changesCache.get(cacheKey);
  }

  const changes = {
    sections: null,
    header: null,
    themes: null,
    settings: null,
    hasChanges: false
  };

  // Fast equality check for common case (no changes)
  if (deepEqual(safeOriginal, safeCurrent)) {
    changesCache.set(cacheKey, changes);
    return changes;
  }

  // Check sections changes
  if (safeOriginal.sections || safeCurrent.sections) {
    changes.sections = getSectionsDiff(
      safeOriginal.sections || [],
      safeCurrent.sections || []
    );
    
    // Check if sections have any changes
    const hasSectionChanges = 
      changes.sections.added.length > 0 || 
      changes.sections.updated.length > 0 || 
      changes.sections.deleted.length > 0 ||
      changes.sections.reordered;
      
    changes.hasChanges = changes.hasChanges || hasSectionChanges;
  }

  // Check header changes
  if (safeOriginal.header || safeCurrent.header) {
    const headerDiff = getObjectDiff(
      safeOriginal.header || {}, 
      safeCurrent.header || {}
    );
    
    if (Object.keys(headerDiff).length > 0) {
      changes.header = headerDiff;
      changes.hasChanges = true;
    }
  }

  // Check themes changes
  if (safeOriginal.themes || safeCurrent.themes) {
    const themesDiff = getObjectDiff(
      safeOriginal.themes || {}, 
      safeCurrent.themes || {}
    );
    
    if (Object.keys(themesDiff).length > 0) {
      changes.themes = themesDiff;
      changes.hasChanges = true;
    }
  }

  // Check settings changes
  if (safeOriginal.settings || safeCurrent.settings) {
    const settingsDiff = getObjectDiff(
      safeOriginal.settings || {}, 
      safeCurrent.settings || {}
    );
    
    if (Object.keys(settingsDiff).length > 0) {
      changes.settings = settingsDiff;
      changes.hasChanges = true;
    }
  }

  // Cache the result
  changesCache.set(cacheKey, changes);
  return changes;
};

/**
 * Clear the changes cache to free memory
 */
export const clearChangesCache = () => {
  changesCache.clear();
  clearCompareCache();
}; 