import { request } from './requests';
import { getToken } from './token';
import { getWebsiteChanges } from './websiteDataDiff';

/**
 * Cache to track ongoing save operations and prevent duplicates
 * Key: websiteId, Value: operation identifier
 */
const saveOperationsCache = new Map();

/**
 * API request helper for updating website data
 * @param {string} websiteId - Website identifier
 * @param {string} endpoint - API endpoint suffix
 * @param {Object} data - Data payload to send
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} API response
 */
async function updateWebsitePart(websiteId, endpoint, data, token) {
  const url = `https://api.oblien.com/sites/${websiteId}${endpoint ? `/${endpoint}` : ''}`;
  console.log(`Saving to: ${url}`);

  try {
    console.log(JSON.stringify(data),'data');
    return await request(url, data, 'PUT', { Authorization: `Bearer ${token}` });
  } catch (error) {
    console.error(`Error saving ${endpoint || 'website'} changes:`, error);
    throw error;
  }
}

/**
 * Check if a save operation is in progress for a website
 * @param {string} websiteId - Website identifier
 * @returns {boolean} Whether a save operation is in progress
 */
export function isSaving(websiteId) {
  return saveOperationsCache.has(websiteId);
}

/**
 * Save website changes with optimized performance
 * @param {string} websiteId - Website identifier
 * @param {Object} originalData - Original website data 
 * @param {Object} currentData - Current website data with changes
 * @param {Object} [options] - Save options
 * @param {boolean} [options.sendFullData=false] - Force sending full data instead of changes
 * @returns {Promise<boolean>} Success indicator
 */
export async function saveWebsiteChanges(websiteId, originalData, currentData, options = {}) {
  // Validate required parameters
  if (!websiteId || !originalData || !currentData) {
    console.error('Missing required data for saveWebsiteChanges');
    return false;
  }

  // Extract options
  const { sendFullData = false } = options;

  // Prevent duplicate save operations
  if (isSaving(websiteId)) {
    console.log('A save operation is already in progress for this website');
    return false;
  }

  // Start tracking this save operation
  const operationId = `save-${websiteId}-${Date.now()}`;
  saveOperationsCache.set(websiteId, operationId);

  try {
    // Detect changes between original and current data
    const changes = getWebsiteChanges(originalData, currentData);

    // Skip if nothing changed
    if (!changes.hasChanges) {
      console.log('No changes detected to save');
      return true;
    }

    // Get authentication token
    const token = await getToken();

    // Prepare updates map
    const updates = prepareUpdates(changes, currentData, sendFullData);

    // Execute the updates
    const response = await executeUpdates(websiteId, updates, token);
    return response;
  } catch (error) {
    console.error('Error saving website changes:', error);
    throw error;
  } finally {
    // Clear operation marker only if it's still the current operation
    if (saveOperationsCache.get(websiteId) === operationId) {
      saveOperationsCache.delete(websiteId);
    }
  }
}

/**
 * Prepare the updates based on detected changes
 * @param {Object} changes - Changes detected by getWebsiteChanges
 * @param {Object} currentData - Current website data
 * @param {boolean} sendFullData - Whether to always send full data
 * @returns {Object} Updates map
 */
function prepareUpdates(changes, currentData, sendFullData) {
  const updates = {
    header: changes.header !== null ? {
      data: currentData.header,
      endpoint: 'header',
      type: 'header'
    } : null,

    settings: changes.settings !== null ? {
      data: currentData.settings,
      endpoint: 'settings',
      type: 'settings'
    } : null,

    sections: null
  };

  // Handle section changes if any
  if (changes.sections) {
    prepareSectionUpdates(updates, changes.sections, currentData, sendFullData);
  }

  return updates;
}

/**
 * Prepare section-specific updates
 * @param {Object} updates - Updates map to modify
 * @param {Object} sectionChanges - Section changes from diff
 * @param {Object} currentData - Current website data
 * @param {boolean} sendFullData - Whether to always send full data
 */
function prepareSectionUpdates(updates, sectionChanges, currentData, sendFullData) {
  const { added, updated, deleted } = sectionChanges;

  // Skip if no changes
  if (added.length === 0 && updated.length === 0 && deleted.length === 0) {
    return;
  }

  // Note: Sections have a flattened structure - properties like 'items' and 'settings'
  // are now directly at the section root level, not nested under 'content'

  // Check if we should send full data or just the changes
  if (sendFullData) {
    // Send the complete sections array
    updates.sections = {
      data: currentData.sections,
      endpoint: 'sections',
      type: 'full-update'
    };
  } else {
    // Send only the changed parts (added, updated, deleted)
    updates.sections = {
      data: { updated, added, deleted },
      endpoint: 'sections',
      type: 'partial-update'
    };
  }
}

/**
 * Execute all the prepared updates
 * @param {string} websiteId - Website identifier
 * @param {Object} updates - Updates map
 * @param {string} token - Authentication token
 */
async function executeUpdates(websiteId, updates, token) {
  // Filter out null values and count updates
  const validUpdates = Object.values(updates).filter(Boolean);
  const updateCount = validUpdates.length;

  // If only one part needs updating, use specific endpoint
  if (updateCount === 1) {
    const update = validUpdates[0];
    return await updateWebsitePart(websiteId, update.endpoint, update.data, token);
  }
  // If multiple parts need updating, handle them in parallel
  else if (updateCount > 1) {

    const promises = validUpdates.map(update => {
      return updateWebsitePart(websiteId, update.endpoint, update.data, token);
    });

    return await Promise.all(promises);
  }
} 