import type { Product } from '../types';

// Helper to generate dates for "Updated X ago"
const daysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

export const mockProducts: Product[] = [
  // Electronics - Smartphones
  { product_id: 1, product_name: 'iPhone 15 Pro', description: 'Latest Apple smartphone with A17 Pro chip and titanium design', price: 999.99, created_at: daysAgo(30), updated_at: daysAgo(0) },
  { product_id: 2, product_name: 'Samsung Galaxy S24', description: 'Flagship Android phone with AI features and 200MP camera', price: 899.99, created_at: daysAgo(25), updated_at: daysAgo(1) },
  { product_id: 3, product_name: 'Google Pixel 8', description: 'Pure Android experience with amazing computational photography', price: 699.99, created_at: daysAgo(20), updated_at: daysAgo(2) },
  { product_id: 4, product_name: 'OnePlus 12', description: 'Fast charging flagship killer with Snapdragon 8 Gen 3', price: 799.99, created_at: daysAgo(15), updated_at: daysAgo(5) },

  // Electronics - Laptops
  { product_id: 5, product_name: 'MacBook Pro 16"', description: 'Powerful laptop with M3 Max chip for professionals', price: 2499.99, created_at: daysAgo(40), updated_at: daysAgo(0) },
  { product_id: 6, product_name: 'Dell XPS 15', description: 'Premium Windows laptop with OLED display', price: 1799.99, created_at: daysAgo(35), updated_at: daysAgo(3) },
  { product_id: 7, product_name: 'ThinkPad X1 Carbon', description: 'Business laptop with legendary keyboard', price: 1599.99, created_at: daysAgo(30), updated_at: daysAgo(7) },
  { product_id: 8, product_name: 'ASUS ROG Zephyrus', description: 'Gaming laptop with RTX 4080 and 240Hz display', price: 2299.99, created_at: daysAgo(28), updated_at: daysAgo(10) },

  // Electronics - Tablets
  { product_id: 9, product_name: 'iPad Pro 12.9"', description: 'Professional tablet with M2 chip and ProMotion display', price: 1099.99, created_at: daysAgo(50), updated_at: daysAgo(1) },
  { product_id: 10, product_name: 'Samsung Galaxy Tab S9', description: 'Android tablet with S Pen included', price: 799.99, created_at: daysAgo(45), updated_at: daysAgo(4) },
  { product_id: 11, product_name: 'Microsoft Surface Pro 9', description: '2-in-1 tablet that replaces your laptop', price: 999.99, created_at: daysAgo(42), updated_at: daysAgo(14) },

  // Electronics - Audio
  { product_id: 12, product_name: 'Sony WH-1000XM5', description: 'Industry-leading noise cancelling headphones', price: 399.99, created_at: daysAgo(60), updated_at: daysAgo(0) },
  { product_id: 13, product_name: 'AirPods Pro 2', description: 'Apple wireless earbuds with spatial audio', price: 249.99, created_at: daysAgo(55), updated_at: daysAgo(2) },
  { product_id: 14, product_name: 'Bose QuietComfort Ultra', description: 'Premium noise cancelling headphones', price: 429.99, created_at: daysAgo(52), updated_at: daysAgo(6) },
  { product_id: 15, product_name: 'JBL Flip 6', description: 'Portable waterproof Bluetooth speaker', price: 129.99, created_at: daysAgo(48), updated_at: daysAgo(21) },

  // Clothing - Men's
  { product_id: 16, product_name: "Men's Denim Jacket", description: 'Classic blue denim jacket with vintage wash', price: 89.99, created_at: daysAgo(70), updated_at: daysAgo(1) },
  { product_id: 17, product_name: "Men's Casual Shirt", description: 'Cotton blend button-down shirt', price: 49.99, created_at: daysAgo(65), updated_at: daysAgo(3) },
  { product_id: 18, product_name: "Men's Chino Pants", description: 'Slim fit chino pants in khaki', price: 59.99, created_at: daysAgo(62), updated_at: daysAgo(8) },
  { product_id: 19, product_name: "Men's Winter Coat", description: 'Waterproof insulated winter jacket', price: 149.99, created_at: daysAgo(58), updated_at: daysAgo(15) },

  // Clothing - Women's
  { product_id: 20, product_name: "Women's Summer Dress", description: 'Floral print midi dress, perfect for summer', price: 79.99, created_at: daysAgo(75), updated_at: daysAgo(0) },
  { product_id: 21, product_name: "Women's Yoga Pants", description: 'High-waist leggings with moisture wicking', price: 45.99, created_at: daysAgo(72), updated_at: daysAgo(2) },
  { product_id: 22, product_name: "Women's Blazer", description: 'Professional blazer for office wear', price: 119.99, created_at: daysAgo(68), updated_at: daysAgo(9) },
  { product_id: 23, product_name: "Women's Cardigan", description: 'Cozy knit cardigan sweater', price: 65.99, created_at: daysAgo(64), updated_at: daysAgo(22) },

  // Clothing - Shoes
  { product_id: 24, product_name: 'Running Shoes', description: 'Lightweight running shoes with cushioned sole', price: 119.99, created_at: daysAgo(80), updated_at: daysAgo(1) },
  { product_id: 25, product_name: 'Leather Boots', description: 'Premium leather ankle boots', price: 159.99, created_at: daysAgo(77), updated_at: daysAgo(4) },
  { product_id: 26, product_name: 'Canvas Sneakers', description: 'Classic white canvas sneakers', price: 59.99, created_at: daysAgo(74), updated_at: daysAgo(11) },
  { product_id: 27, product_name: 'Hiking Boots', description: 'Waterproof hiking boots with ankle support', price: 139.99, created_at: daysAgo(71), updated_at: daysAgo(28) },

  // Clothing - Accessories
  { product_id: 28, product_name: 'Leather Wallet', description: 'Genuine leather bifold wallet', price: 39.99, created_at: daysAgo(85), updated_at: daysAgo(0) },
  { product_id: 29, product_name: 'Designer Sunglasses', description: 'Polarized UV protection sunglasses', price: 149.99, created_at: daysAgo(82), updated_at: daysAgo(5) },
  { product_id: 30, product_name: 'Silk Scarf', description: 'Elegant silk scarf with floral pattern', price: 45.99, created_at: daysAgo(79), updated_at: daysAgo(12) },
  { product_id: 31, product_name: 'Leather Belt', description: 'Classic leather belt with metal buckle', price: 34.99, created_at: daysAgo(76), updated_at: daysAgo(30) },

  // Home & Garden - Furniture
  { product_id: 32, product_name: 'Modern Sofa', description: '3-seater fabric sofa in gray', price: 799.99, created_at: daysAgo(90), updated_at: daysAgo(1) },
  { product_id: 33, product_name: 'Dining Table Set', description: 'Oak dining table with 6 chairs', price: 1299.99, created_at: daysAgo(87), updated_at: daysAgo(3) },
  { product_id: 34, product_name: 'Office Chair', description: 'Ergonomic office chair with lumbar support', price: 299.99, created_at: daysAgo(84), updated_at: daysAgo(13) },
  { product_id: 35, product_name: 'Bookshelf', description: '5-tier wooden bookshelf', price: 159.99, created_at: daysAgo(81), updated_at: daysAgo(35) },

  // Home & Garden - Kitchen
  { product_id: 36, product_name: 'Coffee Maker', description: 'Programmable drip coffee maker', price: 79.99, created_at: daysAgo(95), updated_at: daysAgo(0) },
  { product_id: 37, product_name: 'Blender', description: 'High-speed blender for smoothies', price: 129.99, created_at: daysAgo(92), updated_at: daysAgo(6) },
  { product_id: 38, product_name: 'Knife Set', description: '15-piece stainless steel knife set', price: 89.99, created_at: daysAgo(89), updated_at: daysAgo(16) },
  { product_id: 39, product_name: 'Cookware Set', description: 'Non-stick 10-piece cookware set', price: 199.99, created_at: daysAgo(86), updated_at: daysAgo(40) },

  // Home & Garden - Decor
  { product_id: 40, product_name: 'Wall Art Canvas', description: 'Abstract art canvas print 24x36"', price: 69.99, created_at: daysAgo(100), updated_at: daysAgo(2) },
  { product_id: 41, product_name: 'Table Lamp', description: 'Modern LED table lamp with USB port', price: 49.99, created_at: daysAgo(97), updated_at: daysAgo(7) },
  { product_id: 42, product_name: 'Throw Pillows', description: 'Set of 4 decorative throw pillows', price: 39.99, created_at: daysAgo(94), updated_at: daysAgo(18) },
  { product_id: 43, product_name: 'Area Rug', description: 'Modern geometric area rug 5x7 ft', price: 149.99, created_at: daysAgo(91), updated_at: daysAgo(45) },

  // Home & Garden - Garden
  { product_id: 44, product_name: 'Garden Tool Set', description: '7-piece stainless steel garden tools', price: 59.99, created_at: daysAgo(105), updated_at: daysAgo(1) },
  { product_id: 45, product_name: 'Lawn Mower', description: 'Electric push lawn mower', price: 299.99, created_at: daysAgo(102), updated_at: daysAgo(8) },
  { product_id: 46, product_name: 'Garden Hose', description: '50ft expandable garden hose', price: 34.99, created_at: daysAgo(99), updated_at: daysAgo(20) },
  { product_id: 47, product_name: 'Plant Pots Set', description: 'Set of 5 ceramic plant pots', price: 44.99, created_at: daysAgo(96), updated_at: daysAgo(50) },

  // Sports & Outdoors - Fitness
  { product_id: 48, product_name: 'Yoga Mat', description: 'Non-slip eco-friendly yoga mat', price: 29.99, created_at: daysAgo(110), updated_at: daysAgo(0) },
  { product_id: 49, product_name: 'Dumbbell Set', description: 'Adjustable dumbbell set 5-50 lbs', price: 299.99, created_at: daysAgo(107), updated_at: daysAgo(4) },
  { product_id: 50, product_name: 'Resistance Bands', description: 'Set of 5 resistance bands with handles', price: 24.99, created_at: daysAgo(104), updated_at: daysAgo(10) },
  { product_id: 51, product_name: 'Exercise Bike', description: 'Stationary exercise bike with digital display', price: 399.99, created_at: daysAgo(101), updated_at: daysAgo(25) },

  // Sports & Outdoors - Camping
  { product_id: 52, product_name: 'Camping Tent', description: '4-person waterproof camping tent', price: 149.99, created_at: daysAgo(115), updated_at: daysAgo(3) },
  { product_id: 53, product_name: 'Sleeping Bag', description: 'Cold weather sleeping bag rated to 0°F', price: 79.99, created_at: daysAgo(112), updated_at: daysAgo(9) },
  { product_id: 54, product_name: 'Hiking Backpack', description: '50L hiking backpack with rain cover', price: 89.99, created_at: daysAgo(109), updated_at: daysAgo(24) },
  { product_id: 55, product_name: 'Portable Stove', description: 'Camping stove with fuel canisters', price: 44.99, created_at: daysAgo(106), updated_at: daysAgo(60) },

  // Books & Media
  { product_id: 56, product_name: 'The Great Novel', description: 'Bestselling fiction novel of the year', price: 24.99, created_at: daysAgo(120), updated_at: daysAgo(1) },
  { product_id: 57, product_name: 'Cookbook: Healthy Meals', description: '100 easy and healthy recipes', price: 29.99, created_at: daysAgo(117), updated_at: daysAgo(5) },
  { product_id: 58, product_name: 'Mystery Thriller', description: 'Page-turning mystery thriller', price: 19.99, created_at: daysAgo(114), updated_at: daysAgo(14) },
  { product_id: 59, product_name: 'Science Fiction Epic', description: 'Award-winning sci-fi adventure', price: 27.99, created_at: daysAgo(111), updated_at: daysAgo(70) },
  { product_id: 60, product_name: 'Photography Guide', description: 'Complete guide to digital photography', price: 34.99, created_at: daysAgo(108), updated_at: daysAgo(2) },
];

// Map products to categories (many-to-many relationship)
export const productCategoryMap: Record<number, number[]> = {
  // Electronics
  1: [1, 11], 2: [1, 11], 3: [1, 11], 4: [1, 11],
  5: [1, 12], 6: [1, 12], 7: [1, 12], 8: [1, 12],
  9: [1, 13], 10: [1, 13], 11: [1, 13],
  12: [1, 14], 13: [1, 14], 14: [1, 14], 15: [1, 14],

  // Clothing
  16: [2, 21], 17: [2, 21], 18: [2, 21], 19: [2, 21],
  20: [2, 22], 21: [2, 22], 22: [2, 22], 23: [2, 22],
  24: [2, 23], 25: [2, 23], 26: [2, 23], 27: [2, 23],
  28: [2, 24], 29: [2, 24], 30: [2, 24], 31: [2, 24],

  // Home & Garden
  32: [3, 31], 33: [3, 31], 34: [3, 31], 35: [3, 31],
  36: [3, 32], 37: [3, 32], 38: [3, 32], 39: [3, 32],
  40: [3, 33], 41: [3, 33], 42: [3, 33], 43: [3, 33],
  44: [3, 34], 45: [3, 34], 46: [3, 34], 47: [3, 34],

  // Sports & Outdoors
  48: [4, 41], 49: [4, 41], 50: [4, 41], 51: [4, 41],
  52: [4, 42], 53: [4, 42], 54: [4, 42], 55: [4, 42],

  // Books & Media
  56: [5, 51], 57: [5, 52], 58: [5, 51], 59: [5, 51], 60: [5, 52],
};

export const getProductById = (id: number): Product | undefined => {
  return mockProducts.find(p => p.product_id === id);
};

export const getProductsByCategory = (categoryId: number): Product[] => {
  const productIds = Object.entries(productCategoryMap)
    .filter(([, categories]) => categories.includes(categoryId))
    .map(([id]) => parseInt(id));

  return mockProducts.filter(p => productIds.includes(p.product_id));
};

export const searchProductsByQuery = (query: string): Product[] => {
  const lowerQuery = query.toLowerCase();
  return mockProducts.filter(
    p =>
      p.product_name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery)
  );
};

export const getPaginatedProducts = (page: number, perPage: number = 12): Product[] => {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  return mockProducts.slice(start, end);
};
