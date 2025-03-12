/**
 * Section type definitions and metadata with integrated icons
 */

// Get icon for a section type
export function getSectionIcon(type) {
  return SECTION_METADATA[type]?.icon || null;
}
// Section metadata with integrated icons
// The order of keys in this object determines the display order
export const SECTION_METADATA = {
  portfolio: {
    id: 'portfolio',
    title: 'Portfolio Showcase',
    description: 'Display your work and projects',
    defaultActive: false,
    icon: require('../../assets/icons/home/roadmap-47-1681196106.png')
  },
  products: {
    id: 'products',
    title: 'Products',
    description: 'Showcase items you\'re selling',
    defaultActive: false,
    icon: require('../../assets/icons/home/store-116-1658238103.png')
  },
  pricing: {
    id: 'pricing',
    title: 'Pricing',
    description: 'Add a pricing plan for your products or services',
    defaultActive: false,
    icon: require('../../assets/icons/home/king-85-1658434754.png')
  },
  videos: {
    id: 'videos',
    title: 'Videos',
    description: 'Add youtube or tiktok or other video content',
    defaultActive: false,
    icon: require('../../assets/icons/home/youtube circle-0-1693375323.png')
  },
  blog: {
    id: 'blog',
    title: 'Blog Posts',
    description: 'Share your thoughts and articles',
    defaultActive: false,
    icon: require('../../assets/icons/home/feedly-180-1693375492.png')
  },
  link: {
    id: 'link',
    title: 'External Link',
    description: 'Share external link with your audience',
    defaultActive: false,
    icon: require('../../assets/icons/home/link-57-1663582874.png')
  },
  services: {
    id: 'services',
    title: 'Services',
    description: 'Highlight or directly buy services you offer',
    defaultActive: false,
    icon: require('../../assets/icons/home/payoneer-0-1693375216.png')
  },
  contact: {
    id: 'contact',
    title: 'Contact Form',
    description: 'Let visitors get in touch with you',
    defaultActive: false,
    icon: require('../../assets/icons/home/email sendng-69-1659689482.png')
  },
  document: {
    id: 'document',
    title: 'Document',
    description: 'Add your documents or pdfs',
    defaultActive: false,
    icon: require('../../assets/icons/home/document pdf-66-1662364367.png')
  },
  gallery: {
    id: 'gallery',
    title: 'Media Gallery',
    description: 'Add images or albums or slideshows',
    defaultActive: false,
    icon: require('../../assets/icons/home/gallery view-155-1658433281.png')
  },
  movies: {
    id: 'movies',
    title: 'Movies',
    description: 'Add movies cards or reviews',
    defaultActive: false,
    icon: require('../../assets/icons/home/movie reel 2-222-1658436129.png')
  },
  text: {
    id: 'text',
    title: 'Text',
    description: 'Add free text box section',
    defaultActive: false,
    icon: require('../../assets/icons/home/type-138-1692683664.png')
  },
  location: {
    id: 'location',
    title: 'Location',
    description: 'Add a location in map for your business',
    defaultActive: false,
    icon: require('../../assets/icons/home/map location-261-1658433758.png')
  },
  audio: {
    id: 'audio',
    title: 'Audio',
    description: 'Add an music or podcast',
    defaultActive: false,
    icon: require('../../assets/icons/home/song-74-1663753435.png')
  },
  app: {
    id: 'app',
    title: 'App',
    description: 'Share your app download link',
    defaultActive: false,
    icon: require('../../assets/icons/home/app store square-64-1693375491.png')
  },
  event: {
    id: 'event',
    title: 'Event',
    description: 'Add a link to tickets for your concerts and events',
    defaultActive: false,
    icon: require('../../assets/icons/home/tickets-155-1658435765.png')
  },
  promocode: {
    id: 'promocode',
    title: 'Promo Code',
    description: 'Share promo code or offer you provide',
    defaultActive: false,
    icon: require('../../assets/icons/home/discount-114-1658435460.png')
  },
  notification: {
    id: 'notification',
    title: 'Email or SMS',
    description: 'Collect subscribers data or send them notifications',
    defaultActive: false,
    icon: require('../../assets/icons/home/ringing-36-1662452248.png')
  },
  custom: {
    id: 'custom',
    title: 'Custom',
    description: 'Add a custom section with your own content',
    defaultActive: false,
    icon: require('../../assets/icons/home/filter-85-1658432731.png')
  },
  about: {
    id: 'about',
    title: 'About Me',
    description: 'Share your story and background',
    defaultActive: false,
    icon: require('../../assets/icons/home/user information-309-1658436041.png')
  },
  question: {
    id: 'question',
    title: 'Q&A or recommendation',
    description: 'Add a Q&A or recommendation section',
    defaultActive: false,
    icon: require('../../assets/icons/home/email sendng-69-1659689482.png')
  },
  testimonial: {
    id: 'testimonial',
    title: 'Testimonial',
    description: 'Add a your customers feedback',
    defaultActive: false,
    icon: require('../../assets/icons/home/star-101-1658435608.png')
  },
  faq: {
    id: 'faq',
    title: 'FAQ',
    description: 'Add a FAQ to your website',
    defaultActive: false,
    icon: require('../../assets/icons/home/question mark-31-1662452248.png')
  },
  vote: {
    id: 'vote',
    title: 'Poll',
    description: 'Add a votes section to get feedback from your audience',
    defaultActive: false,
    icon: require('../../assets/icons/home/vote-64-1662452248.png')
  },
  donation: {
    id: 'donation',
    title: 'Donation',
    description: 'Ask for donations or collect money for charity',
    defaultActive: false,
    icon: require('../../assets/icons/home/charity coins-155-1658432931.png')
  },
  hiring: {
    id: 'hiring',
    title: 'Hiring Link',
    description: 'Add a linked in or other hiring links',
    defaultActive: false,
    icon: require('../../assets/icons/home/building office-52-1658238103.png')
  },
  repository: {
    id: 'repository',
    title: 'Repository',
    description: 'Add a github or other repository link & preview',
    defaultActive: false,
    icon: require('../../assets/icons/home/git-8-1693375160.png')
  },
  roadmap: {
    id: 'roadmap',
    title: 'Roadmap',
    description: 'Add a roadmap for your projects',
    defaultActive: false,
    icon: require('../../assets/icons/home/roadmap-48-1681196106.png')
  },
  drawing: {
    id: 'drawing',
    title: 'Drawing',
    description: 'Add a drawing or signature board',
    defaultActive: false,
    icon: require('../../assets/icons/home/pen-288-1658238246.png')
  }
};

// Get metadata for a section type
export function getSectionMetadata(type) {
  return SECTION_METADATA[type] || null;
}

// Get all section types
export function getAllSectionTypes() {
  return Object.keys(SECTION_METADATA);
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
    icon: metadata.icon,
    items: []
  };
}

// Create initial sections
export function createInitialSections() {
  // Get active sections
  const activeSections = Object.keys(SECTION_METADATA)
    .map(type => createDefaultSection(type))
    .filter(section => section && section.active);

  // The order is already determined by the order of keys in SECTION_METADATA
  return activeSections;
} 