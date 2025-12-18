import axios from 'axios';
import type {
  Product,
  Category,
  CategoryResponse,
  AdminLogin,
  AdminLoginResponse,
  BackendProduct,
  BackendCategory,
} from '../types';
import {
  transformProduct,
  transformProducts,
  transformCategory,
  transformCategories,
  transformProductToBackend,
  transformCategoryToBackend,
} from '../utils/transformers';
import * as mockApi from './mockApi';

// Check if we should use mock data
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// Configure base URL for API (update this when backend is ready)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

console.log(`[API] Using ${USE_MOCK_DATA ? 'MOCK' : 'REAL'} data`);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending/receiving cookies for auth
});

// Add auth token to requests if available (for cookie-based auth)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('session_token');
  if (token) {
    // Backend uses cookie-based auth, but we'll keep this for compatibility
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Public Endpoints

/**
 * Get paginated products
 * GET /products/:page -> 200 { product[] }, 404
 */
export const getProducts = async (page: number = 1): Promise<Product[]> => {
  if (USE_MOCK_DATA) {
    return mockApi.getProducts(page);
  }
  const response = await api.get<BackendProduct[]>(`/products/${page}`);
  return transformProducts(response.data);
};

/**
 * Search products by query
 * GET /product/search/:query/:page -> 200 { product[] }, 404
 */
export const searchProducts = async (query: string, page: number = 1): Promise<Product[]> => {
  if (USE_MOCK_DATA) {
    return mockApi.searchProducts(query);
  }
  const response = await api.get<BackendProduct[]>(`/product/search/${encodeURIComponent(query)}/${page}`);
  return transformProducts(response.data);
};

/**
 * Get single product by ID
 * GET /product/:id -> 200 { product }, 404
 */
export const getProduct = async (id: number): Promise<Product> => {
  if (USE_MOCK_DATA) {
    return mockApi.getProduct(id);
  }
  const response = await api.get<BackendProduct>(`/product/${id}`);
  return transformProduct(response.data);
};

/**
 * Get all parent categories
 * GET /categories -> 200 { parent_categories[] }
 */
export const getCategories = async (): Promise<Category[]> => {
  if (USE_MOCK_DATA) {
    return mockApi.getCategories();
  }
  const response = await api.get<BackendCategory[]>('/categories');
  return transformCategories(response.data);
};

/**
 * Get category by ID with products, subcategories, and parent categories
 * GET /category/:id -> 200 { product[], sub_categories[], parent_categories[] }, 404
 */
export const getCategory = async (id: number): Promise<CategoryResponse> => {
  if (USE_MOCK_DATA) {
    return mockApi.getCategory(id);
  }
  const response = await api.get<{
    products: BackendProduct[];
    sub_categories: BackendCategory[];
    parent_categories: BackendCategory[];
  }>(`/category/${id}`);

  return {
    products: transformProducts(response.data.products),
    sub_categories: transformCategories(response.data.sub_categories),
    parent_categories: transformCategories(response.data.parent_categories),
  };
};

// Admin Endpoints

/**
 * Admin login
 * POST /admin/login { username, password } -> 200 (returns Set-Cookie header)
 * Note: Backend returns token via Set-Cookie header, browser stores it automatically
 */
export const adminLogin = async (credentials: AdminLogin): Promise<string> => {
  if (USE_MOCK_DATA) {
    return mockApi.adminLogin(credentials.username, credentials.password);
  }

  // Call backend login endpoint
  await api.post('/admin/login', credentials);

  // Backend sets auth_token cookie via Set-Cookie header
  // Browser automatically stores and sends it with future requests
  // We store a marker in localStorage for the frontend to track login state
  const sessionMarker = 'backend-session-' + Date.now();
  localStorage.setItem('session_token', sessionMarker);
  return sessionMarker;
};

/**
 * Create category (admin)
 * POST /category { category } -> 200, 400, 401
 * Note: Backend may return empty response, so we return the input data
 */
export const createCategory = async (category: Partial<Category>): Promise<Category> => {
  const backendCategory = transformCategoryToBackend(category);
  const response = await api.post<BackendCategory>('/admin/category', backendCategory);

  // Backend might return empty response - use input data as fallback
  if (response.data && response.data.id) {
    return transformCategory(response.data);
  }

  // Return the category with a temporary ID if backend doesn't return one
  return {
    category_id: Date.now(), // Temporary ID
    category_name: category.category_name || '',
    description: category.description || '',
    parent_category_id: category.parent_category_id || null,
  };
};

/**
 * Update category (admin)
 * PATCH /admin/category { category } -> 200, 400, 401
 * Note: Backend may return empty response, so we return the input data
 */
export const updateCategory = async (category: Category): Promise<Category> => {
  const backendCategory = transformCategoryToBackend(category);
  const response = await api.patch<BackendCategory>('/admin/category', backendCategory);

  // Backend might return empty response - use input data as fallback
  if (response.data && response.data.id) {
    return transformCategory(response.data);
  }

  // Return the original category if backend doesn't return data
  return category;
};

/**
 * Delete category (admin)
 * DELETE /admin/category?id={id} -> 200, 400, 401
 */
export const deleteCategory = async (categoryId: number): Promise<void> => {
  await api.delete(`/admin/category`, { params: { id: categoryId } });
};

/**
 * Create product (admin)
 * POST /admin/product { product } -> 200, 400, 401
 * Note: Backend may return empty response, so we return the input data
 */
export const createProduct = async (product: Partial<Product>): Promise<Product> => {
  const backendProduct = transformProductToBackend(product);
  const response = await api.post<BackendProduct>('/admin/product', backendProduct);

  // Backend might return empty response - use input data as fallback
  if (response.data && response.data.id) {
    return transformProduct(response.data);
  }

  // Return the product with a temporary ID if backend doesn't return one
  return {
    product_id: Date.now(), // Temporary ID
    product_name: product.product_name || '',
    description: product.description || '',
    price: product.price || 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

/**
 * Update product (admin)
 * PATCH /admin/product { product } -> 200, 400, 401
 * Note: Backend may return empty response, so we return the input data
 */
export const updateProduct = async (product: Product): Promise<Product> => {
  const backendProduct = transformProductToBackend(product);
  const response = await api.patch<BackendProduct>('/admin/product', backendProduct);

  // Backend might return empty response - use input data as fallback
  if (response.data && response.data.id) {
    return transformProduct(response.data);
  }

  // Return the original product with updated timestamp
  return {
    ...product,
    updated_at: new Date().toISOString(),
  };
};

/**
 * Delete product (admin)
 * DELETE /admin/product?id={id} -> 200, 400, 401
 */
export const deleteProduct = async (productId: number): Promise<void> => {
  await api.delete(`/admin/product`, { params: { id: productId } });
};

/**
 * Logout (clear session token)
 */
export const logout = (): void => {
  localStorage.removeItem('session_token');
};

export default api;
