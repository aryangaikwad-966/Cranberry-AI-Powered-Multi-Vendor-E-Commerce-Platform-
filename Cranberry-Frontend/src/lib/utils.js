import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
/**
 * Format price in INR (Indian Rupees)
 * All prices in the system are stored in INR
 * 
 * @param {number} price - The price value in INR
 * @returns {string} Formatted price string with Indian number formatting
 */
export function formatPrice(price) {
  if (price === null || price === undefined || isNaN(price)) {
    return '0';
  }

  return price.toLocaleString('en-IN', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  });
}

/**
 * Get the raw price in INR for calculations
 * @param {number} price - The price value in INR
 * @returns {number} Price in INR
 */
export function getPriceInINR(price) {
  if (price === null || price === undefined || isNaN(price)) {
    return 0;
  }
  return price;
}

/**
 * Get product image URL with fallback
 * @param {object} product - Product object
 * @returns {string} Image URL
 */
export function getProductImage(product) {
  if (!product) return 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400';

  return product.imageUrl ||
    product.images?.[0] ||
    product.image ||
    'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400';
}

/**
 * Get order item image URL with fallback
 * @param {object} item - Order/cart item object
 * @returns {string} Image URL
 */
export function getItemImage(item) {
  if (!item) return 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400';

  return item.imageUrl ||
    item.product?.imageUrl ||
    item.product?.images?.[0] ||
    item.product?.image ||
    'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400';
}