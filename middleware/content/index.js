/**
 * Content section middleware main export
 */
import { 
  SECTION_TYPES, 
  SECTION_METADATA, 
  getSectionMetadata,
  getAllSectionTypes,
  getAllSectionMetadata,
  createDefaultSection,
  createInitialSections
} from './sectionTypes';
import { SECTION_ICONS, getSectionIcon } from './sectionIcons';

// Import all section implementations
import * as AboutSection from './sections/AboutSection';
import * as PortfolioSection from './sections/PortfolioSection';
import * as ProductsSection from './sections/ProductsSection';
import * as VideosSection from './sections/VideosSection';
import * as BlogSection from './sections/BlogSection';
import * as ServicesSection from './sections/ServicesSection';
import * as ContactSection from './sections/ContactSection';

// Map section types to their implementations
const SECTION_IMPLEMENTATIONS = {
  [SECTION_TYPES.ABOUT]: AboutSection,
  [SECTION_TYPES.PORTFOLIO]: PortfolioSection,
  [SECTION_TYPES.PRODUCTS]: ProductsSection,
  [SECTION_TYPES.VIDEOS]: VideosSection,
  [SECTION_TYPES.BLOG]: BlogSection,
  [SECTION_TYPES.SERVICES]: ServicesSection,
  [SECTION_TYPES.CONTACT]: ContactSection,
};

// Get section implementation
export function getSectionImplementation(type) {
  return SECTION_IMPLEMENTATIONS[type] || null;
}

// Get editor component for a section type (used in both onboarding and dashboard)
export function getSectionEditor(type) {
  const implementation = getSectionImplementation(type);
  return implementation ? implementation.Editor : null;
}

// Get default content for a section type
export function getDefaultContent(type) {
  const implementation = getSectionImplementation(type);
  return implementation ? { ...implementation.defaultContent } : {};
}

// Create a new section with default content
export function createSection(type) {
  const section = createDefaultSection(type);
  if (!section) return null;
  
  section.icon = getSectionIcon(type);
  section.content = getDefaultContent(type);
  
  return section;
}

// Create a new item for a section
export function createSectionItem(type) {
  const implementation = getSectionImplementation(type);
  return implementation && implementation.createItem ? 
    implementation.createItem() : 
    { id: `item-${Date.now()}`, title: 'New Item', type: 'generic' };
}

// Validate section data
export function validateSectionData(type, data) {
  const implementation = getSectionImplementation(type);
  return implementation && implementation.validateData ? 
    implementation.validateData(data) : 
    true;
}

// Export everything
export {
  SECTION_TYPES,
  SECTION_METADATA,
  SECTION_ICONS,
  getSectionMetadata,
  getAllSectionTypes,
  getAllSectionMetadata,
  getSectionIcon,
  createDefaultSection,
  createInitialSections
}; 