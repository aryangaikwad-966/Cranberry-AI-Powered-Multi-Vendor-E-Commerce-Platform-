import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
/**
 * Format price in INR
 * Backend stores prices in base currency (USD for sample products, INR for vendor-added products)
 * This function detects the likely currency and formats appropriately
 * 
 * @param {number} price - The price value
 * @param {boolean} forceINR - If true, assumes price is already in INR
 * @returns {string} Formatted price string
 */
export function formatPrice(price, forceINR = false) {
  if (price === null || price === undefined || isNaN(price)) {
    return '0.00';
  }

  // If price is already likely in INR (>= 500 and reasonable consumer range)
  // or if explicitly marked as INR, don't convert
  // Sample products are typically < $5000 USD = ~415,000 INR
  // If price > 500 and < 500,000, it's probably already in INR
  const isLikelyINR = forceINR || (price >= 500 && price < 500000);

  const inrPrice = isLikelyINR ? price : price * 83;

  return inrPrice.toLocaleString('en-IN', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  });
}

/**
 * Get the raw price in INR for calculations
 * @param {number} price - The price value
 * @param {boolean} forceINR - If true, assumes price is already in INR
 * @returns {number} Price in INR
 */
export function getPriceInINR(price, forceINR = false) {
  if (price === null || price === undefined || isNaN(price)) {
    return 0;
  }

  const isLikelyINR = forceINR || (price >= 500 && price < 500000);
  return isLikelyINR ? price : price * 83;
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