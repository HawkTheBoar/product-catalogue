# E-Shop Frontend

A modern e-commerce frontend application built with React, TypeScript, and Material-UI. Features a purple-themed design with product catalog, categories, search, and shopping cart functionality.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Material-UI (MUI)** - Component library with custom purple theme
- **React Router v6** - Client-side routing
- **Axios** - HTTP client for API calls
- **Context API** - State management for cart

## Features

### Views
1. **All Products View** - Paginated grid of all products with filters
2. **Categories View** - Browse products by category with subcategories
3. **Search View** - Search products by query
4. **Product Detail View** - Detailed product information with "Add to Cart"
5. **Cart View** - Shopping cart with quantity management and checkout

### Components
- **Sidebar** - Fixed navigation with active states and cart badge
- **ProductCard** - Reusable product cards with placeholder images
- **SearchBar** - Centered search with hamburger menu and search icons
- **FilterChips** - Category/filter chips with active states
- **CartItem** - Cart item cards with quantity controls

### Design
- Custom purple theme (#6B46C1 primary color)
- Light purple card backgrounds (#E8E4F3)
- Responsive 12-column grid layout
- Placeholder images with icon patterns
- Relative timestamps ("Updated today", "Updated yesterday")

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and update the API base URL:
   ```
   VITE_API_BASE_URL=http://localhost:3000
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

4. **Build for production**
   ```bash
   npm run build
   ```

## API Integration

The app is ready to connect to a REST API backend with the following endpoints:

### Public Endpoints
- `GET /products/:page` - Get paginated products
- `GET /product/search/:query` - Search products
- `GET /product/:id` - Get single product
- `GET /categories` - Get all parent categories
- `GET /category/:id` - Get category with products and subcategories

### Admin Endpoints (requires authentication)
- `POST /admin/login` - Admin login
- `POST /admin/product` - Create product
- `PATCH /admin/product` - Update product
- `DELETE /admin/product` - Delete product
- `POST /admin/category` - Create category
- `PATCH /admin/category` - Update category
- `DELETE /admin/category` - Delete category

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Sidebar.tsx
│   ├── ProductCard.tsx
│   ├── SearchBar.tsx
│   ├── FilterChips.tsx
│   └── CartItem.tsx
├── pages/              # Route pages
│   ├── AllProductsView.tsx
│   ├── CategoriesView.tsx
│   ├── SearchView.tsx
│   ├── ProductDetailView.tsx
│   └── CartView.tsx
├── context/            # State management
│   └── CartContext.tsx
├── services/           # API layer
│   └── api.ts
├── types/              # TypeScript types
│   └── index.ts
├── theme/              # MUI theme
│   └── theme.ts
├── App.tsx             # Main app with routing
└── main.tsx            # Entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## State Management

### Cart Context
The app uses React Context API for cart state management:

- `addToCart(product, quantity)` - Add product to cart
- `removeFromCart(productId)` - Remove product from cart
- `updateQuantity(productId, quantity)` - Update product quantity
- `clearCart()` - Clear all items from cart
- `getCartTotal()` - Get total cart price
- `getCartCount()` - Get total item count

Cart state is in-memory and will reset on page refresh.

## Design System

### Colors
- **Primary Purple**: #6B46C1
- **Card Background**: #E8E4F3
- **Page Background**: #FAFAFA
- **Text Primary**: #2C2C2C
- **Text Secondary**: #757575

### Typography
- Sans-serif font family
- Clear hierarchy with 6 heading levels
- Body text with proper line heights

### Components
- Rounded corners (8-12px border radius)
- Subtle shadows for depth
- Hover states with purple accent
- Smooth transitions

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is part of a school assignment for NOSQL course.
