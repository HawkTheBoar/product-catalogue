import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, CircularProgress } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ProductCard from '../components/ProductCard';
import FilterChips from '../components/FilterChips';
import { getProducts } from '../services/api';
import type { Product } from '../types';

const filters = [
  { id: 'all', label: 'All Products' },
  { id: 'new', label: 'New Arrivals' },
  { id: 'popular', label: 'Popular' },
  { id: 'sale', label: 'On Sale' },
  { id: 'featured', label: 'Featured' },
];

const AllProductsView: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts(currentPage);
      setProducts(data);
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId);
    // In a real app, this would filter products or fetch filtered data from API
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: '#FAFAFA' }}>
      <Container maxWidth={false} sx={{ py: 4, px: 4 }}>
        {/* Filter Chips */}
        <FilterChips filters={filters} activeFilter={activeFilter} onFilterChange={handleFilterChange} />

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#6B46C1' }} />
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="error">
              {error}
            </Typography>
            <Button
              variant="contained"
              onClick={fetchProducts}
              sx={{ mt: 2, backgroundColor: '#6B46C1', '&:hover': { backgroundColor: '#5A38A3' } }}
            >
              Retry
            </Button>
          </Box>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)',
                  xl: 'repeat(6, 1fr)',
                },
                gap: 3,
              }}
            >
              {products.map((product) => (
                <ProductCard key={product.product_id} product={product} />
              ))}
            </Box>

            {/* Empty State */}
            {products.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  No products found.
                </Typography>
              </Box>
            )}

            {/* Pagination Controls */}
            {products.length > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
                <Button
                  variant="outlined"
                  startIcon={<NavigateBeforeIcon />}
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  sx={{
                    borderColor: '#6B46C1',
                    color: '#6B46C1',
                    '&:hover': {
                      borderColor: '#5A38A3',
                      backgroundColor: 'rgba(107, 70, 193, 0.08)',
                    },
                  }}
                >
                  Previous
                </Button>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', px: 2 }}>
                  Page {currentPage}
                </Typography>
                <Button
                  variant="outlined"
                  endIcon={<NavigateNextIcon />}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={products.length === 0}
                  sx={{
                    borderColor: '#6B46C1',
                    color: '#6B46C1',
                    '&:hover': {
                      borderColor: '#5A38A3',
                      backgroundColor: 'rgba(107, 70, 193, 0.08)',
                    },
                  }}
                >
                  Next
                </Button>
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default AllProductsView;
