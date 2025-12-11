import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from './components/Sidebar';
import AllProductsView from './pages/AllProductsView';
import CategoriesView from './pages/CategoriesView';
import SearchView from './pages/SearchView';
import ProductDetailView from './pages/ProductDetailView';
import CartView from './pages/CartView';

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        {/* Fixed Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            marginLeft: '240px', // Width of sidebar
            minHeight: '100vh',
          }}
        >
          <Routes>
            <Route path="/" element={<AllProductsView />} />
            <Route path="/categories" element={<CategoriesView />} />
            <Route path="/search" element={<SearchView />} />
            <Route path="/product/:id" element={<ProductDetailView />} />
            <Route path="/cart" element={<CartView />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
