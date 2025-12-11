import type { Category } from '../types';

export const mockCategories: Category[] = [
  // Electronics
  { category_id: 1, category_name: 'Electronics', description: 'Electronic devices and gadgets', parent_category_id: null },
  { category_id: 11, category_name: 'Smartphones', description: 'Mobile phones and accessories', parent_category_id: 1 },
  { category_id: 12, category_name: 'Laptops', description: 'Portable computers', parent_category_id: 1 },
  { category_id: 13, category_name: 'Tablets', description: 'Tablet devices', parent_category_id: 1 },
  { category_id: 14, category_name: 'Audio', description: 'Headphones, speakers, and audio equipment', parent_category_id: 1 },

  // Clothing
  { category_id: 2, category_name: 'Clothing', description: 'Fashion and apparel', parent_category_id: null },
  { category_id: 21, category_name: "Men's Clothing", description: 'Clothing for men', parent_category_id: 2 },
  { category_id: 22, category_name: "Women's Clothing", description: 'Clothing for women', parent_category_id: 2 },
  { category_id: 23, category_name: 'Shoes', description: 'Footwear for all', parent_category_id: 2 },
  { category_id: 24, category_name: 'Accessories', description: 'Fashion accessories', parent_category_id: 2 },

  // Home & Garden
  { category_id: 3, category_name: 'Home & Garden', description: 'Home improvement and garden supplies', parent_category_id: null },
  { category_id: 31, category_name: 'Furniture', description: 'Home furniture', parent_category_id: 3 },
  { category_id: 32, category_name: 'Kitchen', description: 'Kitchen appliances and tools', parent_category_id: 3 },
  { category_id: 33, category_name: 'Decor', description: 'Home decoration items', parent_category_id: 3 },
  { category_id: 34, category_name: 'Garden', description: 'Garden tools and supplies', parent_category_id: 3 },

  // Sports & Outdoors
  { category_id: 4, category_name: 'Sports & Outdoors', description: 'Sports equipment and outdoor gear', parent_category_id: null },
  { category_id: 41, category_name: 'Fitness', description: 'Fitness equipment', parent_category_id: 4 },
  { category_id: 42, category_name: 'Camping', description: 'Camping and hiking gear', parent_category_id: 4 },
  { category_id: 43, category_name: 'Team Sports', description: 'Equipment for team sports', parent_category_id: 4 },
  { category_id: 44, category_name: 'Water Sports', description: 'Water sports equipment', parent_category_id: 4 },

  // Books & Media
  { category_id: 5, category_name: 'Books & Media', description: 'Books, movies, and music', parent_category_id: null },
  { category_id: 51, category_name: 'Fiction', description: 'Fiction books', parent_category_id: 5 },
  { category_id: 52, category_name: 'Non-Fiction', description: 'Non-fiction books', parent_category_id: 5 },
  { category_id: 53, category_name: 'Movies', description: 'Movies and TV shows', parent_category_id: 5 },
  { category_id: 54, category_name: 'Music', description: 'Music albums and instruments', parent_category_id: 5 },
];

export const getParentCategories = (): Category[] => {
  return mockCategories.filter(cat => cat.parent_category_id === null);
};

export const getSubCategories = (parentId: number): Category[] => {
  return mockCategories.filter(cat => cat.parent_category_id === parentId);
};

export const getCategoryById = (id: number): Category | undefined => {
  return mockCategories.find(cat => cat.category_id === id);
};
