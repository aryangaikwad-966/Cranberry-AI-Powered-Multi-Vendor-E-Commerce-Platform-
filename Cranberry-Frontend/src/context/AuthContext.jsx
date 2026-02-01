import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api, { decodeToken } from '../services/api';

const AuthContext = createContext(null);

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialize auth state from localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
        const storedUser = localStorage.getItem(AUTH_USER_KEY);

        if (storedToken) {
            const decoded = decodeToken(storedToken);
            if (decoded && decoded.exp > Date.now() / 1000) {
                setToken(storedToken);
                if (storedUser) {
                    try {
                        setUser(JSON.parse(storedUser));
                    } catch {
                        localStorage.removeItem(AUTH_USER_KEY);
                    }
                }
            } else {
                localStorage.removeItem(AUTH_TOKEN_KEY);
                localStorage.removeItem(AUTH_USER_KEY);
            }
        }
        setIsLoading(false);
    }, []);

    const login = useCallback(async (email, password) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await api.authApi.login(email, password);

            // Handle different backend response formats
            // Could be: { user, token } or { data: { user, token } } or just the user object with token
            const userData = result.user || result.data?.user || result;
            const tokenValue = result.token || result.data?.token || localStorage.getItem(AUTH_TOKEN_KEY);

            // Build user object with defaults
            const userObj = {
                id: userData.id || userData.userId,
                name: userData.name || userData.username || email.split('@')[0],
                email: userData.email || email,
                role: (userData.role || 'CUSTOMER').toLowerCase(),
                avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name || email}`
            };

            setUser(userObj);
            setToken(tokenValue);
            localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userObj));

            return { user: userObj, token: tokenValue };
        } catch (err) {
            setError(err.message || 'Login failed');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const register = useCallback(async (userData) => {
        setIsLoading(true);
        setError(null);
        try {
            await api.authApi.register(userData);
            // Do not set user or token here. Registration only.
            return true;
        } catch (err) {
            setError(err.message || 'Registration failed');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        setIsLoading(true);
        try {
            await api.authApi.logout();
            setUser(null);
            setToken(null);
            localStorage.removeItem(AUTH_USER_KEY);
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateProfile = useCallback(async (updates) => {
        setError(null);
        try {
            const updatedUser = await api.authApi.updateProfile(updates);
            setUser(updatedUser);
            localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updatedUser));
            return updatedUser;
        } catch (err) {
            setError(err.message || 'Profile update failed');
            throw err;
        }
    }, []);

    const value = {
        user,
        token,
        isLoading,
        error,
        isAuthenticated: !!user,
        isCustomer: user?.role === 'CUSTOMER' || user?.role === 'customer',
        isVendor: user?.role === 'VENDOR' || user?.role === 'vendor',
        isAdmin: user?.role === 'ADMIN' || user?.role === 'admin',
        login,
        register,
        logout,
        updateProfile,
        clearError: () => setError(null)
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
