import type { Product, Category, BackendProduct, BackendCategory } from '../types';

/**
 * Transform backend product to frontend format
 * Note: Backend stores price as integer (cents), frontend uses decimal (dollars)
 */
export const transformProduct = (backendProduct: BackendProduct): Product => {
  return {
    product_id: backendProduct.id,
    product_name: backendProduct.name,
    description: backendProduct.description || '',
    price: backendProduct.price / 100, // Convert cents to dollars
    // Backend doesn't provide timestamps, use current date as fallback
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

/**
 * Transform frontend product to backend format for API requests
 * Note: Backend stores price as integer (cents), frontend uses decimal (dollars)
 */
export const transformProductToBackend = (product: Partial<Product> & { category_id?: number | null }): Partial<BackendProduct> => {
  const backendProduct: Partial<BackendProduct> = {
    name: product.product_name,
    description: product.description || null,
    price: product.price ? Math.round(product.price * 100) : undefined, // Convert dollars to cents
    category_id: product.category_id || null,
  };

  if (product.product_id) {
    backendProduct.id = product.product_id;
  }

  return backendProduct;
};

/**
 * Transform backend category to frontend format
 */
export const transformCategory = (backendCategory: BackendCategory): Category => {
  return {
    category_id: backendCategory.id,
    category_name: backendCategory.name,
    description: backendCategory.description || '',
    parent_category_id: backendCategory.parent_id,
  };
};

/**
 * Transform frontend category to backend format for API requests
 */
export const transformCategoryToBackend = (category: Partial<Category>): Partial<BackendCategory> => {
  const backendCategory: Partial<BackendCategory> = {
    name: category.category_name,
    description: category.description || null,
    parent_id: category.parent_category_id,
  };

  if (category.category_id) {
    backendCategory.id = category.category_id;
  }

  return backendCategory;
};

/**
 * Transform array of backend products to frontend format
 */
export const transformProducts = (backendProducts: BackendProduct[]): Product[] => {
  return backendProducts.map(transformProduct);
};

/**
 * Transform array of backend categories to frontend format
 */
export const transformCategories = (backendCategories: BackendCategory[]): Category[] => {
  return backendCategories.map(transformCategory);
};
