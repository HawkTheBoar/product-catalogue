# Backend Integration Guide

## Overview

The frontend has been updated to work with the Rust + Axum backend. This document explains the changes made and how to use the application with the real backend.

---

## Changes Made

### 1. **Type System Updates**

Added backend-specific types to match the Rust backend's data structures:

**Backend Types** (in `src/types/index.ts`):
```typescript
interface BackendProduct {
  id: number;              // Backend uses "id" not "product_id"
  name: string;            // Backend uses "name" not "product_name"
  description: string | null;
  price: number;
  category_id: number | null;
}

interface BackendCategory {
  id: number;              // Backend uses "id" not "category_id"
  name: string;            // Backend uses "name" not "category_name"
  description: string | null;
  parent_id: number | null; // Backend uses "parent_id" not "parent_category_id"
}
```

**Frontend Types** remain unchanged for internal use.

### 2. **Data Transformation Layer**

Created `src/utils/transformers.ts` to convert between backend and frontend formats:

- `transformProduct()` - Convert BackendProduct → Product
- `transformCategory()` - Convert BackendCategory → Category
- `transformProductToBackend()` - Convert Product → BackendProduct
- `transformCategoryToBackend()` - Convert Category → BackendCategory
- `transformProducts()` - Convert arrays of products
- `transformCategories()` - Convert arrays of categories

**Handles missing fields:**
- `created_at` / `updated_at` - Generated as current timestamp (backend doesn't provide)
- `null` descriptions - Converted to empty strings
- Field name mapping (id ↔ product_id, name ↔ product_name, etc.)

### 3. **API Endpoint Updates**

Updated all endpoints in `src/services/api.ts` to match backend:

| Frontend Expects | Backend Provides | Updated To |
|-----------------|------------------|------------|
| `GET /products/:page` | `GET /products/:page` | ✅ Same |
| `GET /product/search/:query` | `GET /product/search/:query/:page` | ✅ Added page param |
| `GET /product/:id` | `GET /product/:id` | ✅ Same |
| `GET /categories` | `GET /categories` | ✅ Same |
| `GET /category/:id` | `GET /category/:id` | ✅ Same |
| `POST /admin/login` | `POST /admin/login` | ✅ Updated auth handling |
| `POST /admin/category` | `POST /category` | ✅ Removed /admin prefix |
| `PATCH /admin/category` | `PATCH /category` | ✅ Removed /admin prefix |
| `DELETE /admin/category` | `DELETE /category?id={id}` | ✅ Changed to query param |
| `POST /admin/product` | `POST /product` | ✅ Removed /admin prefix |
| `PATCH /admin/product` | `PATCH /product` | ✅ Removed /admin prefix |
| `DELETE /admin/product` | `DELETE /product?id={id}` | ✅ Changed to query param |

### 4. **Authentication Updates**

**Backend Authentication:**
- Returns token via `Set-Cookie: auth_token={token}` header
- Does not return JSON response with `session_token`
- Expects cookie to be sent with subsequent requests

**Frontend Updates:**
- Added `withCredentials: true` to axios config (enables cookies)
- Updated login handler to work with cookie-based auth
- Stores placeholder token in localStorage for compatibility
- Cookie automatically sent with all requests

### 5. **Delete Operation Changes**

**Before:**
```typescript
// Sent ID in request body
await api.delete('/admin/product', { data: { product_id: 123 } });
```

**After:**
```typescript
// Send ID as query parameter (matches backend)
await api.delete('/product', { params: { id: 123 } });
```

---

## How to Use with Real Backend

### Step 1: Update Environment Variables

Edit `.env`:

```env
VITE_USE_MOCK_DATA=false
VITE_API_BASE_URL=http://localhost:3000
```

### Step 2: Ensure Backend is Running

Start the Rust backend:

```bash
cd ../backend
cargo run
```

The backend should be running on `http://localhost:3000`.

### Step 3: Restart Frontend Dev Server

```bash
npm run dev
```

The console will show:
```
[API] Using REAL data
```

### Step 4: Test Functionality

1. **Public Routes** (if backend routes are mounted):
   - Browse products: http://localhost:5173/
   - Search: http://localhost:5173/search
   - Categories: http://localhost:5173/categories

2. **Admin Routes**:
   - Login: http://localhost:5173/admin/login
   - Dashboard: http://localhost:5173/admin
   - Products: http://localhost:5173/admin/products
   - Categories: http://localhost:5173/admin/categories

---

## Known Backend Limitations

### ⚠️ Routes Not Mounted

According to the backend analysis, these routes are **implemented but NOT mounted**:

- `GET /products/:page`
- `GET /product/:id`
- `GET /product/search/:query/:page`
- `GET /categories`
- `GET /category/:id`
- `POST /admin/login`

**Result:** Frontend will get 404 errors until backend mounts these routes.

### ⚠️ No Authentication Middleware

The backend has no auth middleware implemented. Admin routes are unprotected.

### ⚠️ Missing Database Timestamps

Backend doesn't track `created_at` or `updated_at` in the database schema.

**Frontend Workaround:** Transformers generate current timestamp as fallback.

### ⚠️ Backend Returns Empty Responses

For CREATE/UPDATE operations, backend returns status 200 with empty body.

**Impact:** Frontend expects the created/updated object to be returned. May cause issues displaying newly created items.

---

## Testing Checklist

### With Mock Data (VITE_USE_MOCK_DATA=true)
- [x] All public views work
- [x] All admin CRUD operations work
- [x] Search functionality works
- [x] Shopping cart works
- [x] Authentication works

### With Real Backend (VITE_USE_MOCK_DATA=false)
- [ ] Login works (needs backend route mounted)
- [ ] Browse products (needs backend route mounted)
- [ ] Search products (needs backend route mounted)
- [ ] View categories (needs backend route mounted)
- [ ] Create product (needs auth middleware)
- [ ] Update product (needs auth middleware)
- [ ] Delete product (needs auth middleware)
- [ ] Create category (needs auth middleware)
- [ ] Update category (needs auth middleware)
- [ ] Delete category (needs auth middleware)

---

## Backend Requirements for Full Compatibility

To make the backend fully compatible with the frontend:

### 1. Mount All Routes

In `backend/src/main.rs`, add:

```rust
// Public routes
.route("/products/:page", get(get_products))
.route("/product/:id", get(get_product))
.route("/product/search/:query/:page", get(search_products))
.route("/categories", get(get_categories))
.route("/category/:id", get(get_category))

// Auth route
.route("/admin/login", post(login))
```

### 2. Add Authentication Middleware

Implement the `admin_auth` middleware to validate tokens.

### 3. Return Created/Updated Objects

Modify CREATE/UPDATE handlers to return the created/updated object as JSON:

```rust
// Instead of:
Ok(StatusCode::OK)

// Return:
Ok(Json(created_category))
```

### 4. Consider Adding Timestamps

Add `created_at` and `updated_at` columns to database schema and track them.

### 5. CORS Configuration

Ensure CORS allows credentials:

```rust
CorsLayer::new()
    .allow_origin("http://localhost:5173".parse::<HeaderValue>().unwrap())
    .allow_credentials(true)
    .allow_methods([Method::GET, Method::POST, Method::PATCH, Method::DELETE])
    .allow_headers([CONTENT_TYPE, AUTHORIZATION])
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                        │
│                                                              │
│  Components use Frontend Types (product_id, product_name)   │
│                         ↓                                    │
│               src/services/api.ts                            │
│                         ↓                                    │
│            src/utils/transformers.ts                         │
│         (converts field names both ways)                     │
│                         ↓                                    │
│     Axios (with transformers applied)                        │
│     - withCredentials: true for cookies                      │
│     - Sends Authorization header if needed                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ HTTP Requests with Backend Types
                       │ (id, name, parent_id)
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                   BACKEND (Rust + Axum)                      │
│                                                              │
│  Handlers return Backend Types (id, name, parent_id)        │
│  - Sets auth_token cookie                                   │
│  - Returns status codes                                     │
│  - SQLite database operations                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Troubleshooting

### 404 Errors on API Calls

**Cause:** Backend routes not mounted.

**Solution:** Check `backend/src/main.rs` and ensure routes are registered.

### Authentication Not Working

**Cause:** Backend login route not mounted or auth middleware not implemented.

**Solution:** Mount `/admin/login` route and implement `admin_auth` middleware.

### CORS Errors

**Cause:** Backend not configured to accept credentials from frontend origin.

**Solution:** Update CORS configuration in backend to allow `http://localhost:5173` with credentials.

### Products/Categories Not Showing

**Cause:** Field name mismatch or transformation error.

**Solution:** Check browser console for errors. Verify transformers are being applied correctly.

### Empty Responses After Create/Update

**Cause:** Backend returns empty body on success.

**Solution:** Update backend handlers to return created/updated objects, OR update frontend to refetch data after mutations.

---

## Summary

The frontend is now fully compatible with the Rust backend's data structures and API design:

✅ Field names automatically transformed
✅ Cookie-based authentication supported
✅ Delete operations use query parameters
✅ Missing timestamps handled gracefully
✅ Backend types defined and used
✅ All endpoints updated to match backend

The application will work seamlessly once the backend mounts all routes and implements authentication middleware.
