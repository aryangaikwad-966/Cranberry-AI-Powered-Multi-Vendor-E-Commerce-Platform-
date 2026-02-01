import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartApi } from '../services/api';
import { sampleProducts } from '../data/sampleData';
import { getPriceInINR } from '../lib/utils';

const CartContext = createContext(null);

// Local storage keys
const CART_STORAGE_KEY = 'cranberry_cart';
const AUTH_TOKEN_KEY = 'auth_token';

// Check if user is authenticated
const isAuthenticated = () => !!localStorage.getItem(AUTH_TOKEN_KEY);

// Helper functions for local storage
const getStoredCart = () => {
    try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

const saveCartToStorage = (items) => {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
        console.warn('Failed to save cart to localStorage:', error);
    }
};

export const CartProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOffline, setIsOffline] = useState(false);

    // Load cart on mount
    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = async () => {
        // Only call backend if authenticated
        if (!isAuthenticated()) {
            const localCart = getStoredCart();
            setItems(localCart);
            setIsOffline(true);
            setIsLoading(false);
            return;
        }

        try {
            const result = await cartApi.getCart();
            // Backend returns { items, totalItems, totalPrice }
            const cartItems = result?.items || result || [];
            setItems(cartItems);
            setIsOffline(false);
            // Sync to local storage as backup
            saveCartToStorage(cartItems);
        } catch (error) {
            // Only log once, not spam
            if (!isOffline) {
                console.info('📦 Cart: Using local storage (not logged in or backend offline)');
            }
            // Load from local storage when backend is offline
            const localCart = getStoredCart();
            setItems(localCart);
            setIsOffline(true);
        } finally {
            setIsLoading(false);
        }
    };

    // Get product details from sample data for offline mode
    const getProductById = (productId) => {
        return sampleProducts.find(p => p.id === productId);
    };

    const addToCart = useCallback(async (productId, quantity = 1) => {
        // Try backend first
        if (!isOffline) {
            try {
                await cartApi.addToCart(productId, quantity);
                await loadCart();
                return true;
            } catch (error) {
                // Silently switch to offline mode
                setIsOffline(true);
            }
        }

        // Offline mode - use local storage
        const product = getProductById(productId);
        if (!product) {
            console.error('Product not found:', productId);
            return false;
        }

        setItems(prevItems => {
            const existingIndex = prevItems.findIndex(
                item => (item.product?.id || item.productId) === productId
            );

            let newItems;
            if (existingIndex >= 0) {
                // Update quantity
                newItems = [...prevItems];
                newItems[existingIndex] = {
                    ...newItems[existingIndex],
                    quantity: newItems[existingIndex].quantity + quantity
                };
            } else {
                // Add new item
                newItems = [...prevItems, {
                    id: Date.now(),
                    productId: product.id,
                    product: product,
                    quantity: quantity
                }];
            }
            saveCartToStorage(newItems);
            return newItems;
        });
        return true;
    }, [isOffline]);

    const updateQuantity = useCallback(async (productId, quantity) => {
        if (!isOffline) {
            try {
                await cartApi.updateQuantity(productId, quantity);
                await loadCart();
                return true;
            } catch (error) {
                setIsOffline(true);
            }
        }

        // Offline mode
        setItems(prevItems => {
            const newItems = prevItems.map(item => {
                if ((item.product?.id || item.productId) === productId) {
                    return { ...item, quantity };
                }
                return item;
            });
            saveCartToStorage(newItems);
            return newItems;
        });
        return true;
    }, [isOffline]);

    const removeFromCart = useCallback(async (productId) => {
        if (!isOffline) {
            try {
                await cartApi.removeFromCart(productId);
                await loadCart();
                return true;
            } catch (error) {
                setIsOffline(true);
            }
        }

        // Offline mode
        setItems(prevItems => {
            const newItems = prevItems.filter(
                item => (item.product?.id || item.productId) !== productId
            );
            saveCartToStorage(newItems);
            return newItems;
        });
        return true;
    }, [isOffline]);

    const clearCart = useCallback(async () => {
        if (!isOffline) {
            try {
                await cartApi.clearCart();
                setItems([]);
                saveCartToStorage([]);
                return true;
            } catch (error) {
                setIsOffline(true);
            }
        }

        // Offline mode
        setItems([]);
        saveCartToStorage([]);
        return true;
    }, [isOffline]);

    // Calculate totals - prices are normalized to INR using getPriceInINR
    const subtotal = items.reduce((sum, item) => {
        const price = item.product?.price || 0;
        const priceInINR = getPriceInINR(price);
        return sum + priceInINR * item.quantity;
    }, 0);

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    // Shipping: Free for orders over ₹5000
    const shipping = subtotal > 5000 ? 0 : 99;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    const value = {
        items,
        isLoading,
        isOffline,
        itemCount,
        subtotal,
        shipping,
        tax,
        total,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart: loadCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export default CartContext;
