import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistApi } from '../services/api';
import { sampleProducts } from '../data/sampleData';

const WishlistContext = createContext(null);

// Local storage key
const WISHLIST_STORAGE_KEY = 'cranberry_wishlist';
const AUTH_TOKEN_KEY = 'auth_token';

// Check if user is authenticated
const isAuthenticated = () => !!localStorage.getItem(AUTH_TOKEN_KEY);

// Helper functions for local storage
const getStoredWishlist = () => {
    try {
        const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
        if (!stored) return [];

        const parsed = JSON.parse(stored);

        // If we previously stored just an array of products/items
        if (Array.isArray(parsed)) {
            return parsed;
        }

        // If we previously stored the full WishlistResponse object { items: [...] }
        if (parsed && Array.isArray(parsed.items)) {
            return parsed.items;
        }

        return [];
    } catch {
        return [];
    }
};

const saveWishlistToStorage = (items) => {
    try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
        console.warn('Failed to save wishlist to localStorage:', error);
    }
};

export const WishlistProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOffline, setIsOffline] = useState(false);

    // Load wishlist on mount
    useEffect(() => {
        loadWishlist();
    }, []);

    const loadWishlist = async () => {
        // Only call backend if authenticated
        if (!isAuthenticated()) {
            const localWishlist = getStoredWishlist();
            setItems(localWishlist);
            setIsOffline(true);
            setIsLoading(false);
            return;
        }

        try {
            const wishlist = await wishlistApi.getWishlist();
            const wishlistItems = Array.isArray(wishlist)
                ? wishlist
                : Array.isArray(wishlist?.items)
                    ? wishlist.items
                    : [];

            setItems(wishlistItems);
            setIsOffline(false);
            // Sync to local storage as backup
            saveWishlistToStorage(wishlistItems);
        } catch (error) {
            // Only log once, not spam
            if (!isOffline) {
                console.info('💜 Wishlist: Using local storage (not logged in or backend offline)');
            }
            // Load from local storage when backend is offline
            const localWishlist = getStoredWishlist();
            setItems(localWishlist);
            setIsOffline(true);
        } finally {
            setIsLoading(false);
        }
    };

    // Get product details from sample data for offline mode
    const getProductById = (productId) => {
        return sampleProducts.find(p => p.id === productId);
    };

    const addToWishlist = useCallback(async (productId) => {
        if (!isOffline) {
            try {
                await wishlistApi.addToWishlist(productId);
                await loadWishlist();
                return true;
            } catch (error) {
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
            // Check if already in wishlist
            if (prevItems.some(item => item.id === productId)) {
                return prevItems;
            }
            const newItems = [...prevItems, product];
            saveWishlistToStorage(newItems);
            return newItems;
        });
        return true;
    }, [isOffline]);

    const removeFromWishlist = useCallback(async (productId) => {
        if (!isOffline) {
            try {
                await wishlistApi.removeFromWishlist(productId);
                await loadWishlist();
                return true;
            } catch (error) {
                setIsOffline(true);
            }
        }

        // Offline mode
        setItems(prevItems => {
            const newItems = prevItems.filter(item => item.id !== productId);
            saveWishlistToStorage(newItems);
            return newItems;
        });
        return true;
    }, [isOffline]);

    const isInWishlist = useCallback((productId) => {
        const idToCheck = Number(productId);
        return Array.isArray(items) && items.some(item => {
            const backendProductId = item.productId != null ? Number(item.productId) : null;
            const localId = item.id != null ? Number(item.id) : null;
            return backendProductId === idToCheck || localId === idToCheck;
        });
    }, [items]);

    const toggleWishlist = useCallback(async (productId) => {
        if (isInWishlist(productId)) {
            return removeFromWishlist(productId);
        } else {
            return addToWishlist(productId);
        }
    }, [isInWishlist, addToWishlist, removeFromWishlist]);

    const value = {
        items,
        isLoading,
        isOffline,
        itemCount: items.length,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        refreshWishlist: loadWishlist
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};

export default WishlistContext;
