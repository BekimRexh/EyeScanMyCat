import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window'); // Get device dimensions
const BASE_WIDTH = 375; // Your design base width (commonly iPhone 11 size)
const BASE_HEIGHT = 812; // Your design base height (commonly iPhone 11 size)

/**
 * Scales the size based on device width
 * @param size - the design size
 * @returns scaled size
 */
export const scale = (size: number): number => (width / BASE_WIDTH) * size;

/**
 * Scales the size based on device height
 * @param size - the design size
 * @returns scaled size
 */
export const verticalScale = (size: number): number => (height / BASE_HEIGHT) * size;

/**
 * Scales the size based on device width, with an optional factor
 * Useful for moderate scaling where 0.5 means 50% of the scaling difference
 * @param size - the design size
 * @param factor - controls how much scaling to apply (0.5 = halfway)
 * @returns scaled size
 */
export const moderateScale = (size: number, factor: number = 0.5): number =>
  size + (scale(size) - size) * factor;

// Export device dimensions if needed elsewhere
export const DEVICE_WIDTH = width;
export const DEVICE_HEIGHT = height;
