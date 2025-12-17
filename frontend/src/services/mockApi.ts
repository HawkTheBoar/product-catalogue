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

// Admin functions
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

  // Generate new ID
  const newId = Math.max(...mockProducts.map((p) => p.product_id), 0) + 1;

  const newProduct: Product = {
    product_id: newId,
    product_name: product.product_name || 'New Product',
    description: product.description || '',
    price: product.price || 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  mockProducts.push(newProduct);
  return newProduct;
};

export const updateProduct = async (product: Product): Promise<Product> => {
  await delay();

  const index = mockProducts.findIndex((p) => p.product_id === product.product_id);
  if (index === -1) {
    throw new Error('Product not found');
  }

  const updatedProduct = {
    ...product,
    updated_at: new Date().toISOString(),
  };

  mockProducts[index] = updatedProduct;
  return updatedProduct;
};

export const deleteProduct = async (productId: number): Promise<void> => {
  await delay();

  const index = mockProducts.findIndex((p) => p.product_id === productId);
  if (index === -1) {
    throw new Error('Product not found');
  }

  mockProducts.splice(index, 1);
};

export const createCategory = async (category: Partial<Category>): Promise<Category> => {
  await delay();

  // Generate new ID
  const newId = Math.max(...mockCategories.map((c) => c.category_id), 0) + 1;

  const newCategory: Category = {
    category_id: newId,
    category_name: category.category_name || 'New Category',
    description: category.description || '',
    parent_category_id: category.parent_category_id || null,
  };

  mockCategories.push(newCategory);
  return newCategory;
};

export const updateCategory = async (category: Category): Promise<Category> => {
  await delay();

  const index = mockCategories.findIndex((c) => c.category_id === category.category_id);
  if (index === -1) {
    throw new Error('Category not found');
  }

  mockCategories[index] = category;
  return category;
};

export const deleteCategory = async (categoryId: number): Promise<void> => {
  await delay();

  const index = mockCategories.findIndex((c) => c.category_id === categoryId);
  if (index === -1) {
    throw new Error('Category not found');
  }

  // Check if category has subcategories
  const hasSubcategories = mockCategories.some((c) => c.parent_category_id === categoryId);
  if (hasSubcategories) {
    throw new Error('Cannot delete category with subcategories');
  }

  mockCategories.splice(index, 1);
};
