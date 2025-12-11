# Mock Data Guide

Mock data has been added to the frontend for development without requiring a backend.

## Quick Start

The app is now running with mock data at **http://localhost:5173**

Mock data mode is **enabled by default** (see `.env` file).

## Toggle Mock Data

Edit `.env` file:

```bash
# Use mock data (no backend needed)
VITE_USE_MOCK_DATA=true

# Use real API (backend required)
VITE_USE_MOCK_DATA=false
```

**Note:** You must restart the dev server after changing the `.env` file.

## Mock Data Contents

### 60 Products
Distributed across 5 main categories with varied data:
- **Prices:** $5 - $2,500
- **Timestamps:** From today to 120 days ago
- **Categories:** Electronics, Clothing, Home & Garden, Sports & Outdoors, Books & Media

### Product Examples

#### Electronics (15 products)
- **Smartphones** (4): iPhone 15 Pro, Samsung Galaxy S24, Google Pixel 8, OnePlus 12
- **Laptops** (4): MacBook Pro 16", Dell XPS 15, ThinkPad X1 Carbon, ASUS ROG Zephyrus
- **Tablets** (3): iPad Pro 12.9", Samsung Galaxy Tab S9, Microsoft Surface Pro 9
- **Audio** (4): Sony WH-1000XM5, AirPods Pro 2, Bose QuietComfort Ultra, JBL Flip 6

#### Clothing (16 products)
- **Men's Clothing** (4): Denim Jacket, Casual Shirt, Chino Pants, Winter Coat
- **Women's Clothing** (4): Summer Dress, Yoga Pants, Blazer, Cardigan
- **Shoes** (4): Running Shoes, Leather Boots, Canvas Sneakers, Hiking Boots
- **Accessories** (4): Leather Wallet, Designer Sunglasses, Silk Scarf, Leather Belt

#### Home & Garden (16 products)
- **Furniture** (4): Modern Sofa, Dining Table Set, Office Chair, Bookshelf
- **Kitchen** (4): Coffee Maker, Blender, Knife Set, Cookware Set
- **Decor** (4): Wall Art Canvas, Table Lamp, Throw Pillows, Area Rug
- **Garden** (4): Garden Tool Set, Lawn Mower, Garden Hose, Plant Pots Set

#### Sports & Outdoors (8 products)
- **Fitness** (4): Yoga Mat, Dumbbell Set, Resistance Bands, Exercise Bike
- **Camping** (4): Camping Tent, Sleeping Bag, Hiking Backpack, Portable Stove

#### Books & Media (5 products)
- Fiction books, cookbooks, mystery thrillers, sci-fi, photography guides

### 25 Categories
**5 Parent Categories:**
1. Electronics
2. Clothing
3. Home & Garden
4. Sports & Outdoors
5. Books & Media

**20 Subcategories:**
- Each parent has 4-5 subcategories
- Fully hierarchical structure with parent-child relationships

## Features Tested with Mock Data

✅ **All Products View** - Pagination works with 12 products per page (5 pages total)
✅ **Categories View** - Browse by category with working subcategories
✅ **Search** - Full-text search across product names and descriptions
✅ **Product Detail** - Click any product to see full details
✅ **Cart** - Add to cart, update quantities, remove items
✅ **Timestamps** - See relative dates ("Updated today", "Updated 2 days ago", etc.)

## API Functions Available

All mock API functions simulate 300ms delay for realistic experience:

```typescript
// Public endpoints
getProducts(page)           // Returns 12 products per page
searchProducts(query)       // Search by name/description
getProduct(id)              // Get single product
getCategories()             // Get all parent categories
getCategory(id)             // Get category with products & subcategories

// Admin endpoints (not fully implemented)
adminLogin(username, password)  // Mock: admin/admin
```

## Data Files Location

```
src/data/
├── mockCategories.ts   # 25 categories with helpers
└── mockProducts.ts     # 60 products with category mapping

src/services/
└── mockApi.ts          # Mock API implementation
```

## Switching to Real Backend

1. Update `.env`:
   ```bash
   VITE_USE_MOCK_DATA=false
   VITE_API_BASE_URL=http://your-backend-url
   ```

2. Restart dev server:
   ```bash
   npm run dev
   ```

3. Console will show: `[API] Using REAL data`

## Development Tips

### Adding More Products
Edit `src/data/mockProducts.ts`:

```typescript
{
  product_id: 61,
  product_name: 'New Product',
  description: 'Description here',
  price: 99.99,
  created_at: daysAgo(5),
  updated_at: daysAgo(1)
}
```

Don't forget to add to `productCategoryMap`!

### Adding Categories
Edit `src/data/mockCategories.ts`:

```typescript
{
  category_id: 60,
  category_name: 'New Category',
  description: 'Description',
  parent_category_id: null  // or parent ID
}
```

### Changing API Delay
Edit `src/services/mockApi.ts`:

```typescript
const delay = (ms: number = 300) => // Change 300 to your value
```

## Console Logging

When the app loads, check the console:
- `[API] Using MOCK data` - Mock data mode active ✅
- `[API] Using REAL data` - Connecting to backend ⚠️

## Troubleshooting

**Products not showing?**
- Check console for `[API] Using MOCK data`
- Verify `.env` has `VITE_USE_MOCK_DATA=true`
- Restart dev server after changing `.env`

**Search not working?**
- Mock search is case-insensitive
- Searches both product name and description
- Try: "phone", "laptop", "shoes", "book"

**Categories empty?**
- Categories are auto-loaded on mount
- Check console for errors
- Verify `mockCategories.ts` imported correctly

---

**Happy Coding! 🚀**

All features are fully functional with mock data - no backend required for development!
