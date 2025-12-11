import type { Product, Category, CategoryResponse } from '../types';
import {
  mockProducts,
  getProductById,
  getProductsByCategory,
  searchProductsByQuery,
  getPaginatedProducts,
} from '../data/mockProducts';
import {
  mockCategories,
  getParentCategories,
  getSubCategories,
  getCategoryById,
} from '../data/mockCategories';

// Simulate API delay
const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Get paginated products
 * Simulates: GET /products/:page
 */
export const getProducts = async (page: number = 1): Promise<Product[]> => {
  await delay();
  return getPaginatedProducts(page, 12);
};

/**
 * Search products by query
 * Simulates: GET /product/search/:query
 */
export const searchProducts = async (query: string): Promise<Product[]> => {
  await delay();
  return searchProductsByQuery(query);
};

/**
 * Get single product by ID
 * Simulates: GET /product/:id
 */
export const getProduct = async (id: number): Promise<Product> => {
  await delay();
  const product = getProductById(id);
  if (!product) {
    throw new Error('Product not found');
  }
  return product;
};

/**
 * Get all parent categories
 * Simulates: GET /categories
 */
export const getCategories = async (): Promise<Category[]> => {
  await delay();
  return getParentCategories();
};

/**
 * Get category by ID with products, subcategories, and parent categories
 * Simulates: GET /category/:id
 */
export const getCategory = async (id: number): Promise<CategoryResponse> => {
  await delay();

  const category = getCategoryById(id);
  if (!category) {
    throw new Error('Category not found');
  }

  const products = getProductsByCategory(id);
  const sub_categories = getSubCategories(id);

  // Get parent categories (breadcrumb trail)
  const parent_categories: Category[] = [];
  let currentCategory = category;
  while (currentCategory.parent_category_id !== null) {
    const parent = getCategoryById(currentCategory.parent_category_id);
    if (parent) {
      parent_categories.unshift(parent);
      currentCategory = parent;
    } else {
      break;
    }
  }

  return {
    products,
    sub_categories,
    parent_categories,
  };
};

// Admin functions (for future use)
export const adminLogin = async (username: string, password: string): Promise<string> => {
  await delay();
  // Mock authentication
  if (username === 'admin' && password === 'admin') {
    return 'mock-session-token-' + Date.now();
  }
  throw new Error('Invalid credentials');
};

export const createProduct = async (product: Partial<Product>): Promise<Product> => {
  await delay();
  throw new Error('Create product not implemented in mock API');
};

export const updateProduct = async (product: Product): Promise<Product> => {
  await delay();
  throw new Error('Update product not implemented in mock API');
};

export const deleteProduct = async (productId: number): Promise<void> => {
  await delay();
  throw new Error('Delete product not implemented in mock API');
};

export const createCategory = async (category: Partial<Category>): Promise<Category> => {
  await delay();
  throw new Error('Create category not implemented in mock API');
};

export const updateCategory = async (category: Category): Promise<Category> => {
  await delay();
  throw new Error('Update category not implemented in mock API');
};

export const deleteCategory = async (categoryId: number): Promise<void> => {
  await delay();
  throw new Error('Delete category not implemented in mock API');
};
