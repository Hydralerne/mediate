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
  createInitialSections,
  getSectionIcon
} from './sectionTypes';

// Import all section implementations
import * as AboutSection from './content/AboutSection';
import * as PortfolioSection from './content/PortfolioSection';
import * as ProductsSection from './content/ProductsSection';
import * as VideosSection from './content/VideosSection';
import * as BlogSection from './content/BlogSection';
import * as ServicesSection from './content/ServicesSection';
import * as ContactSection from './content/ContactSection';

// Map section types to their implementations
const SECTION_IMPLEMENTATIONS = {
  about: AboutSection,
  portfolio: PortfolioSection,
  products: ProductsSection,
  videos: VideosSection,
  blog: BlogSection,
  services: ServicesSection,
  contact: ContactSection,
};

// Get section implementation
export function getSectionImplementation(type) {
  return SECTION_IMPLEMENTATIONS[type] || null;
}

// Get editor component for a section type (used in both onboarding and dashboard)
export function getSectionEditor(type) {
  const implementation = getSectionImplementation(type);
  return implementation ? implementation.EditorSheet : null;
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


// Export everything
export {
  SECTION_TYPES,
  SECTION_METADATA,
  getSectionMetadata,
  getAllSectionTypes,
  getAllSectionMetadata,
  getSectionIcon,
  createDefaultSection,
  createInitialSections
}; 