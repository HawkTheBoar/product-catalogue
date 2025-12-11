import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, CircularProgress, Divider } from '@mui/material';
import ProductCard from '../components/ProductCard';
import FilterChips from '../components/FilterChips';
import { getCategories, getCategory } from '../services/api';
import type { Product, Category } from '../types';

const CategoriesView: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchCategoryProducts(parseInt(selectedCategory));
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCategories();
      setCategories(data);
      if (data.length > 0) {
        setSelectedCategory(data[0].category_id.toString());
      }
    } catch (err) {
      setError('Failed to load categories.');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryProducts = async (categoryId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCategory(categoryId);
      setProducts(data.products);
      setSubCategories(data.sub_categories);
    } catch (err) {
      setError('Failed to load products for this category.');
      console.error('Error fetching category products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const filters = categories.map((cat) => ({
    id: cat.category_id.toString(),
    label: cat.category_name,
  }));

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: '#FAFAFA' }}>
      <Container maxWidth={false} sx={{ py: 4, px: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: '#2C2C2C' }}>
          Categories
        </Typography>

        {/* Category Filters */}
        {filters.length > 0 && (
          <FilterChips
            filters={filters}
            activeFilter={selectedCategory || ''}
            onFilterChange={handleCategoryChange}
          />
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

        {/* Sub-Categories */}
        {!loading && subCategories.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
              Subcategories
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              {subCategories.map((subCat) => (
                <Typography
                  key={subCat.category_id}
                  variant="body2"
                  sx={{
                    px: 2,
                    py: 1,
                    backgroundColor: '#E8E4F3',
                    borderRadius: 1,
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#6B46C1',
                      color: '#FFFFFF',
                    },
                  }}
                  onClick={() => setSelectedCategory(subCat.category_id.toString())}
                >
                  {subCat.category_name}
                </Typography>
              ))}
            </Box>
            <Divider sx={{ my: 3 }} />
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
                  No products in this category.
                </Typography>
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default CategoriesView;
