/**
 * Section type definitions and metadata
 */

// Section type constants
export const SECTION_TYPES = {
  ABOUT: 'about',
  PORTFOLIO: 'portfolio',
  PRODUCTS: 'products',
  VIDEOS: 'videos',
  BLOG: 'blog',
  SERVICES: 'services',
  CONTACT: 'contact',
};

// Section metadata
export const SECTION_METADATA = {
  [SECTION_TYPES.ABOUT]: {
    id: SECTION_TYPES.ABOUT,
    title: 'About Me',
    description: 'Share your story and background',
    defaultActive: true,
    sortOrder: 1,
  },
  [SECTION_TYPES.PORTFOLIO]: {
    id: SECTION_TYPES.PORTFOLIO,
    title: 'Portfolio Showcase',
    description: 'Display your work and projects',
    defaultActive: true,
    sortOrder: 2,
  },
  [SECTION_TYPES.PRODUCTS]: {
    id: SECTION_TYPES.PRODUCTS,
    title: 'Products',
    description: 'Showcase items you\'re selling',
    defaultActive: false,
    sortOrder: 3,
  },
  [SECTION_TYPES.VIDEOS]: {
    id: SECTION_TYPES.VIDEOS,
    title: 'Videos',
    description: 'Share video content with your audience',
    defaultActive: false,
    sortOrder: 4,
  },
  [SECTION_TYPES.BLOG]: {
    id: SECTION_TYPES.BLOG,
    title: 'Blog Posts',
    description: 'Share your thoughts and articles',
    defaultActive: false,
    sortOrder: 5,
  },
  [SECTION_TYPES.SERVICES]: {
    id: SECTION_TYPES.SERVICES,
    title: 'Services',
    description: 'Highlight or directly buy services you offer',
    defaultActive: false,
    sortOrder: 6,
  },
  [SECTION_TYPES.CONTACT]: {
    id: SECTION_TYPES.CONTACT,
    title: 'Contact Form',
    description: 'Let visitors get in touch with you',
    defaultActive: true,
    sortOrder: 7,
  },
};

// Get metadata for a section type
export function getSectionMetadata(type) {
  return SECTION_METADATA[type] || null;
}

// Get all section types
export function getAllSectionTypes() {
  return Object.values(SECTION_TYPES);
}

// Get all section metadata
export function getAllSectionMetadata() {
  return Object.values(SECTION_METADATA);
}

// Create a default section object
export function createDefaultSection(type) {
  const metadata = SECTION_METADATA[type];
  if (!metadata) return null;
  
  return {
    id: type,
    title: metadata.title,
    description: metadata.description,
    type: type,
    active: metadata.defaultActive,
    items: []
  };
}

// Create initial sections
export function createInitialSections() {
  return Object.values(SECTION_TYPES)
    .map(type => createDefaultSection(type))
    .filter(section => section && section.active)
    .sort((a, b) => {
      const aOrder = SECTION_METADATA[a.id].sortOrder;
      const bOrder = SECTION_METADATA[b.id].sortOrder;
      return aOrder - bOrder;
    });
} 