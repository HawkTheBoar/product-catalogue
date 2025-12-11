import axios from 'axios';
import type {
  Product,
  Category,
  CategoryResponse,
  AdminLogin,
  AdminLoginResponse,
} from '../types';
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
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('session_token');
  if (token) {
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
  const response = await api.get<Product[]>(`/products/${page}`);
  return response.data;
};

/**
 * Search products by query
 * GET /product/search/:query -> 200 { product[] }, 404
 */
export const searchProducts = async (query: string): Promise<Product[]> => {
  if (USE_MOCK_DATA) {
    return mockApi.searchProducts(query);
  }
  const response = await api.get<Product[]>(`/product/search/${encodeURIComponent(query)}`);
  return response.data;
};

/**
 * Get single product by ID
 * GET /product/:id -> 200 { product }, 404
 */
export const getProduct = async (id: number): Promise<Product> => {
  if (USE_MOCK_DATA) {
    return mockApi.getProduct(id);
  }
  const response = await api.get<Product>(`/product/${id}`);
  return response.data;
};

/**
 * Get all parent categories
 * GET /categories -> 200 { parent_categories[] }
 */
export const getCategories = async (): Promise<Category[]> => {
  if (USE_MOCK_DATA) {
    return mockApi.getCategories();
  }
  const response = await api.get<Category[]>('/categories');
  return response.data;
};

/**
 * Get category by ID with products, subcategories, and parent categories
 * GET /category/:id -> 200 { product[], sub_categories[], parent_categories[] }, 404
 */
export const getCategory = async (id: number): Promise<CategoryResponse> => {
  if (USE_MOCK_DATA) {
    return mockApi.getCategory(id);
  }
  const response = await api.get<CategoryResponse>(`/category/${id}`);
  return response.data;
};

// Admin Endpoints

/**
 * Admin login
 * POST /admin/login { username, password } -> 200 { session_token }, 400
 */
export const adminLogin = async (credentials: AdminLogin): Promise<string> => {
  const response = await api.post<AdminLoginResponse>('/admin/login', credentials);
  const { session_token } = response.data;
  localStorage.setItem('session_token', session_token);
  return session_token;
};

/**
 * Create category (admin)
 * POST /admin/category { category } -> 200, 400, 401
 */
export const createCategory = async (category: Partial<Category>): Promise<Category> => {
  const response = await api.post<Category>('/admin/category', category);
  return response.data;
};

/**
 * Update category (admin)
 * PATCH /admin/category { category } -> 200, 400, 401
 */
export const updateCategory = async (category: Category): Promise<Category> => {
  const response = await api.patch<Category>('/admin/category', category);
  return response.data;
};

/**
 * Delete category (admin)
 * DELETE /admin/category { category_id } -> 200, 400, 401
 */
export const deleteCategory = async (categoryId: number): Promise<void> => {
  await api.delete('/admin/category', { data: { category_id: categoryId } });
};

/**
 * Create product (admin)
 * POST /admin/product { product } -> 200, 400, 401
 */
export const createProduct = async (product: Partial<Product>): Promise<Product> => {
  const response = await api.post<Product>('/admin/product', product);
  return response.data;
};

/**
 * Update product (admin)
 * PATCH /admin/product { product } -> 200, 400, 401
 */
export const updateProduct = async (product: Product): Promise<Product> => {
  const response = await api.patch<Product>('/admin/product', product);
  return response.data;
};

/**
 * Delete product (admin)
 * DELETE /admin/product { product_id } -> 200, 400, 401
 */
export const deleteProduct = async (productId: number): Promise<void> => {
  await api.delete('/admin/product', { data: { product_id: productId } });
};

/**
 * Logout (clear session token)
 */
export const logout = (): void => {
  localStorage.removeItem('session_token');
};

export default api;
