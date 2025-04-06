/**
 * Utility functions for exporting website data
 */

/**
 * Extract the complete website data for the given website ID
 * @param {Object} websiteDataMap - Map of website data keyed by website ID
 * @param {string} websiteId - ID of the website to extract
 * @returns {Object} Complete website data or null if not found
 */
export const extractWebsiteData = (websiteDataMap, websiteId) => {
  if (!websiteId || !websiteDataMap || !websiteDataMap[websiteId]) {
    return null;
  }
  
  // Return a deep copy to prevent accidental mutations
  return JSON.parse(JSON.stringify(websiteDataMap[websiteId]));
};

/**
 * Extract website data directly from refs (for immediate access)
 * @param {Object} websiteDataMapRef - Ref containing map of website data
 * @param {Object} currentWebsiteIdRef - Ref containing current website ID
 * @returns {Object} Complete website data or null if not found
 */
export const extractCurrentWebsiteData = (websiteDataMapRef, currentWebsiteIdRef) => {
  if (!websiteDataMapRef?.current || !currentWebsiteIdRef?.current) {
    return null;
  }
  
  const websiteId = currentWebsiteIdRef.current;
  const websiteData = websiteDataMapRef.current[websiteId];
  
  if (!websiteData) {
    return null;
  }
  
  // Return a deep copy to prevent accidental mutations
  return JSON.parse(JSON.stringify(websiteData));
};

/**
 * Create a downloadable JSON file from website data
 * @param {Object} websiteData - Website data to export
 * @param {string} websiteId - ID of the website (for filename)
 * @returns {string} URL to download the file
 */
export const createWebsiteDataDownload = (websiteData, websiteId) => {
  if (!websiteData) return null;
  
  // Create a Blob with the JSON data
  const jsonData = JSON.stringify(websiteData, null, 2);
  const blob = new Blob([jsonData], { type: 'application/json' });
  
  // Create a download URL
  const url = URL.createObjectURL(blob);
  
  // Create a timestamp for the filename
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `website-${websiteId}-${timestamp}.json`;
  
  return {
    url,
    filename,
    cleanup: () => URL.revokeObjectURL(url) // Call this when done to free memory
  };
};

/**
 * Extract and prepare website data for export to external systems
 * @param {Object} websiteData - Website data to normalize
 * @returns {Object} Normalized data ready for export
 */
export const normalizeWebsiteData = (websiteData) => {
  if (!websiteData) return null;
  
  // Create a clean copy without internal fields
  const normalized = {
    id: websiteData.id,
    name: websiteData.name,
    header: websiteData.header || {},
    sections: websiteData.sections || [],
    settings: websiteData.settings || {},
    // Include any extra top-level fields that don't start with underscore
    ...Object.fromEntries(
      Object.entries(websiteData)
        .filter(([key]) =>
          !key.startsWith('_') && 
          !['id', 'name', 'header', 'sections', 'settings'].includes(key)
        )
    )
  };
  
  return normalized;
};

/**
 * Export the current website data as a normalized object
 * For use with the DashboardContext
 */
export const exportCurrentWebsite = (dashboardContext) => {
  if (!dashboardContext) {
    console.error('Missing dashboard context');
    return null;
  }
  
  const { websiteData, currentWebsiteId } = dashboardContext;
  
  if (!websiteData || !currentWebsiteId) {
    console.error('No active website to export');
    return null;
  }
  
  return normalizeWebsiteData(websiteData);
}; 