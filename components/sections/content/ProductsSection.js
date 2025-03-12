/**
 * Products section implementation with unified editor
 */
// Import the EditorSheet component
import { EditorSheet } from './products/EditorSheet';

// Default content structure
export const defaultContent = {
  items: [],
  settings: {
    showPrices: true,
    enablePurchase: false,
    displayStyle: 'grid', // 'grid' or 'list'
    productsPerPage: 6,
    sortBy: 'newest' // 'newest', 'price-asc', 'price-desc', 'name'
  }
};

// Export the EditorSheet component
export { EditorSheet };
