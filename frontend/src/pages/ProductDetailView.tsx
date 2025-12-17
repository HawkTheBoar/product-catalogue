import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
  IconButton,
  Snackbar,
  Alert,
  Divider,
  Chip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { getProduct } from '../services/api';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';

const ProductDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct(parseInt(id));
    }
  }, [id]);

  const fetchProduct = async (productId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProduct(productId);
      setProduct(data);
    } catch (err) {
      setError('Failed to load product details.');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      setShowSuccess(true);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress sx={{ color: '#6B46C1' }} />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>
          {error || 'Product not found'}
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/')}
          sx={{ backgroundColor: '#6B46C1', '&:hover': { backgroundColor: '#5A38A3' } }}
        >
          Back to Products
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: '#FAFAFA' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Back Button */}
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            mb: 3,
            color: '#6B46C1',
            '&:hover': { backgroundColor: 'rgba(107, 70, 193, 0.08)' },
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        {/* Product Main Section */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1.2fr' },
            gap: 5,
          }}
        >
          {/* Product Image Placeholder */}
          <Box>
            <Box
              sx={{
                height: { xs: 300, md: 400 },
                backgroundColor: '#E8E4F3',
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
              }}
            >
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                }}
              >
                <LocalOfferIcon sx={{ color: '#6B46C1', fontSize: 60 }} />
              </Box>
            </Box>

            {/* Product Meta Info */}
            <Box sx={{ mt: 3, p: 2, backgroundColor: '#FFFFFF', borderRadius: 2, boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)' }}>
              <Typography variant="caption" sx={{ color: '#757575', display: 'block', mb: 0.5 }}>
                Product ID
              </Typography>
              <Typography variant="body2" sx={{ color: '#2C2C2C', fontWeight: 600, mb: 2 }}>
                #{product.product_id}
              </Typography>

              <Divider sx={{ my: 1.5 }} />

              <Typography variant="caption" sx={{ color: '#757575', display: 'block', mb: 0.5 }}>
                Published
              </Typography>
              <Typography variant="body2" sx={{ color: '#2C2C2C' }}>
                {new Date(product.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Typography>
            </Box>
          </Box>

          {/* Product Info */}
          <Box>
            {/* Product Name */}
            <Typography
              variant="h3"
              sx={{
                mb: 2,
                fontWeight: 700,
                color: '#2C2C2C',
                fontSize: { xs: '2rem', md: '2.5rem' },
              }}
            >
              {product.product_name}
            </Typography>

            {/* Price */}
            <Box sx={{ mb: 3 }}>
              <Chip
                label={`$${product.price.toFixed(2)}`}
                sx={{
                  backgroundColor: '#6B46C1',
                  color: '#FFFFFF',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  height: 48,
                  px: 2,
                  '& .MuiChip-label': {
                    px: 1,
                  },
                }}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Description */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 1.5,
                  fontWeight: 600,
                  color: '#2C2C2C',
                }}
              >
                Description
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#555555',
                  lineHeight: 1.8,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {product.description || 'No description available for this product.'}
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Add to Cart Button */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleAddToCart}
                startIcon={<ShoppingCartIcon />}
                sx={{
                  backgroundColor: '#6B46C1',
                  color: '#FFFFFF',
                  px: 5,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  flexGrow: 1,
                  '&:hover': {
                    backgroundColor: '#5A38A3',
                  },
                }}
              >
                Add to Cart
              </Button>

              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/')}
                sx={{
                  borderColor: '#6B46C1',
                  color: '#6B46C1',
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: '#5A38A3',
                    backgroundColor: 'rgba(107, 70, 193, 0.04)',
                  },
                }}
              >
                Continue Shopping
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          sx={{ width: '100%' }}
          variant="filled"
        >
          {product?.product_name} added to cart!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductDetailView;
