/**
 * Utility functions for efficient object comparison with memoization
 */

// Cache for memoizing object comparison results
const compareCache = new Map();
let cacheHits = 0;
let cacheMisses = 0;

/**
 * Generate a simple hash key for an object
 * @param {any} obj - Object to hash
 * @returns {string} Hash key
 */
export const generateHashKey = (obj) => {
  if (obj === null || obj === undefined) {
    return 'null';
  }
  
  if (typeof obj !== 'object') {
    return String(obj);
  }
  
  // Simple size-based hash for objects
  const str = JSON.stringify(obj);
  return `${typeof obj}:${Object.keys(obj).length}:${str.length}`;
};

/**
 * Deep equality comparison with memoization for better performance
 * @param {any} a - First value to compare
 * @param {any} b - Second value to compare
 * @returns {boolean} Whether the values are equal
 */
export const deepEqual = (a, b) => {
  // Fast path for primitive types and reference equality
  if (a === b) return true;
  
  // Handle null/undefined cases
  if (a === null || b === null || a === undefined || b === undefined) {
    return a === b;
  }
  
  // Different types can't be equal
  if (typeof a !== typeof b) return false;
  
  // If not objects, they must be different (since a !== b above)
  if (typeof a !== 'object') return false;
  
  // Handle arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    
    // Try cache lookup for large arrays
    if (a.length > 50) {
      const hashA = generateHashKey(a);
      const hashB = generateHashKey(b);
      const cacheKey = `${hashA}:${hashB}`;
      
      if (compareCache.has(cacheKey)) {
        cacheHits++;
        return compareCache.get(cacheKey);
      }
      
      cacheMisses++;
      
      // Compare each element
      const result = a.every((item, index) => deepEqual(item, b[index]));
      
      // Store in cache (but keep cache size reasonable)
      if (compareCache.size < 1000) {
        compareCache.set(cacheKey, result);
      } else if (Math.random() < 0.1) {
        // Randomly clear 10% of the time when full
        compareCache.clear();
      }
      
      return result;
    }
    
    // For smaller arrays, just compare directly without caching
    return a.every((item, index) => deepEqual(item, b[index]));
  }
  
  // Handle objects (but not arrays)
  if (!Array.isArray(a) && !Array.isArray(b)) {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    
    if (keysA.length !== keysB.length) return false;
    
    // Try cache lookup for large objects
    if (keysA.length > 20) {
      const hashA = generateHashKey(a);
      const hashB = generateHashKey(b);
      const cacheKey = `${hashA}:${hashB}`;
      
      if (compareCache.has(cacheKey)) {
        cacheHits++;
        return compareCache.get(cacheKey);
      }
      
      cacheMisses++;
      
      // Compare each property
      const result = keysA.every(key => 
        keysB.includes(key) && deepEqual(a[key], b[key])
      );
      
      // Store in cache (but keep cache size reasonable)
      if (compareCache.size < 1000) {
        compareCache.set(cacheKey, result);
      } else if (Math.random() < 0.1) {
        // Randomly clear 10% of the time when full
        compareCache.clear();
      }
      
      return result;
    }
    
    // For smaller objects, just compare directly without caching
    return keysA.every(key => 
      keysB.includes(key) && deepEqual(a[key], b[key])
    );
  }
  
  // Different types of objects (one is array, one is not)
  return false;
};

/**
 * Get cache statistics for debugging
 * @returns {Object} Cache stats
 */
export const getCompareStats = () => ({
  cacheSize: compareCache.size,
  hits: cacheHits,
  misses: cacheMisses,
  hitRate: cacheHits / (cacheHits + cacheMisses || 1)
});

/**
 * Clear the comparison cache
 */
export const clearCompareCache = () => {
  compareCache.clear();
  cacheHits = 0;
  cacheMisses = 0;
};

/**
 * Create a shallow copy of an object with only the fields that differ from the original
 * @param {Object} original - Original object
 * @param {Object} current - Current object
 * @returns {Object} Object containing only changed fields
 */
export const extractChanges = (original, current) => {
  if (!original || !current) return current;
  
  // Fast check if objects are identical
  if (deepEqual(original, current)) return {};
  
  const changes = {};
  const allKeys = new Set([...Object.keys(original), ...Object.keys(current)]);
  
  allKeys.forEach(key => {
    // Skip if both don't have the property
    if (!original.hasOwnProperty(key) && !current.hasOwnProperty(key)) {
      return;
    }
    
    // If property was added
    if (!original.hasOwnProperty(key)) {
      changes[key] = current[key];
      return;
    }
    
    // If property was removed
    if (!current.hasOwnProperty(key)) {
      changes[key] = null;
      return;
    }
    
    // If both values are objects, recursively compare
    if (
      typeof original[key] === 'object' && original[key] !== null &&
      typeof current[key] === 'object' && current[key] !== null &&
      !Array.isArray(original[key]) && !Array.isArray(current[key])
    ) {
      const nestedChanges = extractChanges(original[key], current[key]);
      if (Object.keys(nestedChanges).length > 0) {
        changes[key] = nestedChanges;
      }
    } 
    // For arrays or primitive values, compare directly
    else if (!deepEqual(original[key], current[key])) {
      changes[key] = current[key];
    }
  });
  
  return changes;
}; 