import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Container, Typography, CircularProgress } from '@mui/material';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import { searchProducts } from '../services/api';
import type { Product } from '../types';

const SearchView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      handleSearch(query);
    }
  }, [searchParams]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await searchProducts(query);
      setProducts(data);
    } catch (err) {
      setError('Failed to search products. Please try again.');
      console.error('Error searching products:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: '#FAFAFA' }}>
      <Container maxWidth={false} sx={{ py: 4, px: 4 }}>
        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} placeholder="Search products..." />

        {/* Search Results Header */}
        {searchQuery && !loading && (
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#2C2C2C' }}>
            Search results for "{searchQuery}"
          </Typography>
        )}

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
          </Box>
        )}

        {/* Products Grid */}
        {!loading && !error && searchQuery && (
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
                  No products found for "{searchQuery}".
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Try searching with different keywords.
                </Typography>
              </Box>
            )}
          </>
        )}

        {/* Initial State */}
        {!searchQuery && !loading && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              Enter a search query to find products.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default SearchView;
