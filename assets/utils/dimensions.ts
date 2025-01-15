import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Device dimensions
export const DEVICE_WIDTH = width;
export const DEVICE_HEIGHT = height;

// Global margins for layout
export const LAYOUT_MARGIN_HORIZONTAL = DEVICE_WIDTH * 0.08; // 6% margin on left and right
export const LAYOUT_MARGIN_VERTICAL = DEVICE_HEIGHT * 0.005; // 2% margin on top and bottom

// Header and Footer heights
export const HEADER_HEIGHT = DEVICE_HEIGHT * 0.18; // 10% of total height
export const FOOTER_HEIGHT = DEVICE_HEIGHT * 0.13; // 10% of total height

// Total header and footer space (height + margin)
export const TOTAL_HEADER_SPACE = HEADER_HEIGHT + LAYOUT_MARGIN_VERTICAL;
export const TOTAL_FOOTER_SPACE = FOOTER_HEIGHT + LAYOUT_MARGIN_VERTICAL;

// Content height after subtracting header and footer
export const CONTENT_HEIGHT = DEVICE_HEIGHT - TOTAL_HEADER_SPACE - TOTAL_FOOTER_SPACE;

// Available width for content (accounting for left and right margins)
export const CONTENT_WIDTH = DEVICE_WIDTH - (2 * LAYOUT_MARGIN_HORIZONTAL);
