/**
 * Portfolio section implementation
 */
import { EditorSheet } from './portfolio/EditorSheet';

// Default content structure
export const defaultContent = {
  items: [],
  settings: {
    displayStyle: 'grid', // 'grid' or 'list' or 'masonry'
    projectsPerPage: 6,
    showProjectLinks: true,
    showTags: true,
    sortBy: 'custom' // 'custom', 'newest', 'name'
  }
};

export { EditorSheet };