import axios from 'axios';

// API Service - Aligned with Cranberry Backend
// Backend: Spring Boot + MySQL + Ollama AI

const BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Single Axios instance for all API calls
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Offline mode detection - reduces console noise when backend is down
let isOfflineMode = false;
let lastOnlineCheck = 0;
const ONLINE_CHECK_INTERVAL = 30000; // Check every 30 seconds

// Export for components to check status
export const getOfflineStatus = () => isOfflineMode;

// Helper to get auth token
const getAuthToken = () => localStorage.getItem('auth_token');

// Attach Authorization header automatically
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize responses and handle errors consistently
apiClient.interceptors.response.use(
  (response) => {
    // Mark as online on any successful response
    isOfflineMode = false;

    const data = response.data;
    // Backend format: ApiResponse<T> => { success, message, data }
    if (data && Object.prototype.hasOwnProperty.call(data, 'data')) {
      return data.data;
    }
    return data;
  },
  (error) => {
    const now = Date.now();

    // Network / offline handling
    if (!error.response) {
      if (!isOfflineMode || now - lastOnlineCheck > ONLINE_CHECK_INTERVAL) {
        isOfflineMode = true;
        lastOnlineCheck = now;
      }
      return Promise.reject({
        status: 503,
        message: 'Backend offline or unreachable. Please ensure the Spring Boot backend is running.',
        success: false,
        offline: true,
      });
    }

    const { status, data } = error.response;
    const message =
      data?.message ||
      (status === 401
        ? 'Unauthorized. Please log in again.'
        : status === 403
          ? 'You do not have permission to perform this action.'
          : status === 404
            ? 'Requested resource was not found.'
            : 'Request failed');

    return Promise.reject({
      status,
      message,
      success: false,
    });
  }
);

// ============================================
// AUTH API - /api/auth/*
// ============================================
export const authApi = {
  // POST /api/auth/register
  register: async (userData) => {
    try {
      // Backend: POST /api/auth/register -> ApiResponse<AuthResponse>
      const authResponse = await apiClient.post('/api/auth/register', userData);
      if (authResponse?.token) {
        localStorage.setItem('auth_token', authResponse.token);
      }
      return authResponse;
    } catch (error) {
      if (error.offline || error.status === 503) {
        throw {
          status: 503,
          message:
            'Cannot create account - backend server is offline. Please start the Spring Boot backend.',
          success: false,
        };
      }
      throw error;
    }
  },

  // POST /api/auth/login
  login: async (email, password) => {
    try {
      // Backend: POST /api/auth/login -> ApiResponse<AuthResponse>
      const authResponse = await apiClient.post('/api/auth/login', { email, password });
      if (authResponse?.token) {
        localStorage.setItem('auth_token', authResponse.token);
      }
      return authResponse;
    } catch (error) {
      if (error.offline || error.status === 503) {
        throw {
          status: 503,
          message: 'Cannot login - backend server is offline. Please start the Spring Boot backend.',
          success: false,
        };
      }
      throw error;
    }
  },

  // GET /api/auth/me
  getProfile: async () => {
    return apiClient.get('/api/auth/me');
  },

  // Logout (client-side only)
  logout: async () => {
    localStorage.removeItem('auth_token');
    return { message: 'Logged out successfully' };
  },
};

// Decode JWT token
export const decodeToken = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    return JSON.parse(atob(parts[1]));
  } catch {
    return null;
  }
};

// ============================================
// PRODUCTS API - /api/products/*
// ============================================
export const productsApi = {
  // GET /api/products
  // Query params: category, minPrice, maxPrice, search, featured, limit
  getAll: async (filters = {}) => {
    return apiClient.get('/api/products', { params: filters });
  },

  // GET /api/products/approved (Customer Only)
  getApproved: async () => {
    return apiClient.get('/api/products/approved');
  },

  // GET /api/products/{id}
  getById: async (id) => {
    return apiClient.get(`/api/products/${id}`);
  },

  // GET /api/products?featured=true&limit={limit}
  getFeatured: async (limit = 8) => {
    return apiClient.get('/api/products', {
      params: { featured: true, limit },
    });
  },

  // POST /api/products (Vendor Only)
  create: async (productData) => {
    return apiClient.post('/api/products', productData);
  },

  // PUT /api/products/{id} (Vendor Only)
  update: async (id, productData) => {
    return apiClient.put(`/api/products/${id}`, productData);
  },

  // DELETE /api/products/{id} (Vendor Only)
  delete: async (id) => {
    return apiClient.delete(`/api/products/${id}`);
  },
};

// ============================================
// CART API - /api/cart/*
// ============================================
export const cartApi = {
  // GET /api/cart
  getCart: async () => {
    return apiClient.get('/api/cart');
  },

  // POST /api/cart/add
  addToCart: async (productId, quantity = 1) => {
    return apiClient.post('/api/cart/add', { productId, quantity });
  },

  // PUT /api/cart/update
  updateQuantity: async (productId, quantity) => {
    return apiClient.put('/api/cart/update', { productId, quantity });
  },

  // DELETE /api/cart/remove/{productId}
  removeFromCart: async (productId) => {
    return apiClient.delete(`/api/cart/remove/${productId}`);
  },

  // DELETE /api/cart/clear
  clearCart: async () => {
    return apiClient.delete('/api/cart/clear');
  },
};

// ============================================
// ORDERS API - /api/orders/*
// ============================================
export const ordersApi = {
  // GET /api/orders (current user's orders)
  getAll: async () => {
    return apiClient.get('/api/orders');
  },

  // GET /api/orders/{id} (includes payment info)
  getById: async (id) => {
    return apiClient.get(`/api/orders/${id}`);
  },

  // POST /api/orders
  create: async (orderData) => {
    return apiClient.post('/api/orders', orderData);
  },

  // GET /api/orders/vendor (Vendor Only)
  getVendorOrders: async () => {
    return apiClient.get('/api/orders/vendor');
  },

  // PUT /api/orders/{id}/status?status=VALUE (Vendor/Admin)
  updateStatus: async (id, status) => {
    return apiClient.put(`/api/orders/${id}/status`, null, {
      params: { status },
    });
  },

  // DELETE /api/orders/{id} (Cancel order)
  cancel: async (id) => {
    return apiClient.delete(`/api/orders/${id}`);
  },

  // ============ ADMIN ENDPOINTS ============
  // GET /api/orders/admin/all
  getAllAdmin: async () => {
    return apiClient.get('/api/orders/admin/all');
  },

  // GET /api/orders/admin/filter
  getFiltered: async ({ status, startDate, endDate } = {}) => {
    const params = {};
    if (status) params.status = status;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    return apiClient.get('/api/orders/admin/filter', { params });
  },

  // GET /api/orders/admin/statistics
  getStatistics: async () => {
    return apiClient.get('/api/orders/admin/statistics');
  },

  // GET /api/orders/admin/paginated
  getPaginated: async (page = 0, size = 10) => {
    return apiClient.get('/api/orders/admin/paginated', {
      params: { page, size },
    });
  },
};

// ============================================
// PAYMENTS API - /api/payments/*
// ============================================
export const paymentsApi = {
  // GET /api/payments/config (get Razorpay key)
  getConfig: async () => {
    return apiClient.get('/api/payments/config');
  },

  // POST /api/payments/create/{orderId}
  createPayment: async (orderId) => {
    return apiClient.post(`/api/payments/create/${orderId}`);
  },

  // POST /api/payments/verify
  verifyPayment: async (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
    return apiClient.post('/api/payments/verify', null, {
      params: {
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      },
    });
  },

  // POST /api/payments/failure
  markFailure: async (razorpayOrderId, reason) => {
    return apiClient.post('/api/payments/failure', null, {
      params: { razorpayOrderId, reason },
    });
  },

  // POST /api/payments/retry/{orderId}
  retryPayment: async (orderId) => {
    return apiClient.post(`/api/payments/retry/${orderId}`);
  },

  // GET /api/payments/order/{orderId}
  getByOrderId: async (orderId) => {
    return apiClient.get(`/api/payments/order/${orderId}`);
  },
};


// ============================================
// USER API - /api/users/*
// ============================================
export const usersApi = {
  // GET /api/users/profile
  getProfile: async () => {
    return apiClient.get('/api/users/profile');
  },

  // PUT /api/users/profile
  updateProfile: async (updates) => {
    // Backend expects a map { name, email }
    return apiClient.put('/api/users/profile', updates);
  },
};

// ============================================
// VENDOR API - /api/vendor/*
// ============================================
export const vendorApi = {
  // GET /api/vendor/dashboard
  getDashboard: async () => {
    return apiClient.get('/api/vendor/dashboard');
  },

  // GET /api/vendor/products
  getProducts: async () => {
    return apiClient.get('/api/vendor/products');
  },
};

// ============================================
// WISHLIST API - /api/wishlist/*
// ============================================
export const wishlistApi = {
  getWishlist: async () => {
    return apiClient.get('/api/wishlist');
  },

  addToWishlist: async (productId) => {
    return apiClient.post('/api/wishlist/add', { productId });
  },

  removeFromWishlist: async (productId) => {
    return apiClient.delete(`/api/wishlist/remove/${productId}`);
  },
};

// ============================================
// AI API - /api/ai/*
// ============================================
export const aiApi = {
  // POST /api/ai/chat
  chat: async (message, userId = null) => {
    return apiClient.post('/api/ai/chat', { message, userId });
  },

  // POST /api/ai/search
  search: async (query) => {
    return apiClient.post('/api/ai/search', { query });
  },

  // POST /api/ai/recommend
  // type: 'personalized' (with userId) or 'similar' (with productId)
  recommend: async ({ type, userId = null, productId = null }) => {
    return apiClient.post('/api/ai/recommend', { type, userId, productId });
  },

  // POST /api/ai/price-suggest
  priceSuggest: async (productData) => {
    return apiClient.post('/api/ai/price-suggest', productData);
  },

  // GET /api/ai/health
  healthCheck: async () => {
    return apiClient.get('/api/ai/health');
  },

  // GET /api/ai/admin/order-insights (Admin Only)
  getOrderInsights: async () => {
    return apiClient.get('/api/ai/admin/order-insights');
  },
};

// ============================================
// VENDORS API - /api/admin/vendors/* (admin vendor management)
// ============================================
export const vendorsApi = {
  // GET /api/admin/vendors
  getAll: async (status) => {
    return apiClient.get('/api/admin/vendors', { params: { status } });
  },

  // GET /api/admin/vendors/{id}
  getById: async (id) => {
    return apiClient.get(`/api/admin/vendors/${id}`);
  },

  // PUT /api/admin/vendors/{id}/approve
  approve: async (id) => {
    return apiClient.put(`/api/admin/vendors/${id}/approve`);
  },

  // PUT /api/admin/vendors/{id}/reject
  reject: async (id) => {
    return apiClient.put(`/api/admin/vendors/${id}/reject`);
  },

  // DELETE /api/admin/vendors/{id}
  delete: async (id) => {
    return apiClient.delete(`/api/admin/vendors/${id}`);
  },
};

// ============================================
// ADMIN API - /api/admin/*
// ============================================
export const adminApi = {
  // Dashboard stats
  getStats: async () => {
    return apiClient.get('/api/admin/dashboard');
  },
  // Get all products (Admin version)
  getAllProducts: async () => {
    return apiClient.get('/api/admin/products');
  },
  // Moderate product status
  moderateProduct: async (id, status) => {
    return apiClient.put(`/api/admin/products/${id}/moderate`, null, { params: { status } });
  },
  // Delete product (Admin only)
  deleteProduct: async (id) => {
    return apiClient.delete(`/api/admin/products/${id}`);
  },
};

// ============================================
// ORDER STATUS CONSTANTS
// ============================================
export const ORDER_STATUSES = {
  CREATED: 'CREATED',
  PAYMENT_PENDING: 'PAYMENT_PENDING',
  PAID: 'PAID',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
};

export const ORDER_STATUS_LABELS = {
  CREATED: 'Order Created',
  PAYMENT_PENDING: 'Payment Pending',
  PAID: 'Payment Successful',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

// ============================================
// STATIC CATEGORIES (for filters)
// ============================================
export const categories = [
  { id: 'electronics', name: 'Electronics' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'home-living', name: 'Home & Living' },
  { id: 'beauty', name: 'Beauty' },
];

export default {
  authApi,
  productsApi,
  cartApi,
  ordersApi,
  paymentsApi,
  usersApi,
  vendorApi,
  vendorsApi,
  wishlistApi,
  aiApi,
  adminApi,
  categories,
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
};
