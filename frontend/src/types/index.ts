// Frontend types (used throughout the application)

export interface Product {
  product_id: number;
  product_name: string;
  description: string;
  price: number;
  created_at: string;
  updated_at: string;
  categories?: Category[]; // Optional, for when product includes category info
}

export interface Category {
  category_id: number;
  category_name: string;
  description: string;
  parent_category_id: number | null;
}

// Backend types (match the Rust backend structure)

export interface BackendProduct {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category_id: number | null;
}

export interface BackendCategory {
  id: number;
  name: string;
  description: string | null;
  parent_id: number | null;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

// API Response types
export interface ProductsResponse {
  products: Product[];
}

export interface CategoryResponse {
  products: Product[];
  sub_categories: Category[];
  parent_categories: Category[];
}

export interface CategoriesResponse {
  parent_categories: Category[];
}

export interface ProductResponse {
  product: Product;
}

// Admin types
export interface AdminLogin {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  session_token: string;
}
