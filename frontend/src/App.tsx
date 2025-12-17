import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import AllProductsView from './pages/AllProductsView';
import CategoriesView from './pages/CategoriesView';
import SearchView from './pages/SearchView';
import ProductDetailView from './pages/ProductDetailView';
import CartView from './pages/CartView';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductManagement from './pages/admin/ProductManagement';
import CategoryManagement from './pages/admin/CategoryManagement';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Show sidebar only on non-admin routes */}
      {!isAdminRoute && <Sidebar />}

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          marginLeft: isAdminRoute ? 0 : '240px',
          minHeight: '100vh',
        }}
      >
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<AllProductsView />} />
          <Route path="/categories" element={<CategoriesView />} />
          <Route path="/search" element={<SearchView />} />
          <Route path="/product/:id" element={<ProductDetailView />} />
          <Route path="/cart" element={<CartView />} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute>
                <ProductManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute>
                <CategoryManagement />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
