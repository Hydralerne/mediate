/**
 * Icon mappings for section types
 */
import { SECTION_TYPES } from './sectionTypes';

// Icon mappings
export const SECTION_ICONS = {
  [SECTION_TYPES.ABOUT]: require('../../assets/icons/home/user information-309-1658436041.png'),
  [SECTION_TYPES.PORTFOLIO]: require('../../assets/icons/home/roadmap-47-1681196106.png'),
  [SECTION_TYPES.PRODUCTS]: require('../../assets/icons/home/store-116-1658238103.png'),
  [SECTION_TYPES.VIDEOS]: require('../../assets/icons/home/youtube circle-0-1693375323.png'),
  [SECTION_TYPES.BLOG]: require('../../assets/icons/home/feedly-180-1693375492.png'),
  [SECTION_TYPES.SERVICES]: require('../../assets/icons/home/payoneer-0-1693375216.png'),
  [SECTION_TYPES.CONTACT]: require('../../assets/icons/home/email sendng-69-1659689482.png'),
};

// Get icon for a section type
export function getSectionIcon(type) {
  return SECTION_ICONS[type] || null;
} 