import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
  Paper,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import SettingsIcon from '@mui/icons-material/Settings';
import CropSquareIcon from '@mui/icons-material/CropSquare';
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

  // Mock detail items for the design
  const detailItems = [
    {
      title: 'Product Specifications',
      description: 'High-quality materials and craftsmanship ensure durability and long-lasting performance.',
    },
    {
      title: 'Shipping Information',
      description: 'Free shipping on orders over $50. Standard delivery takes 3-5 business days.',
    },
    {
      title: 'Return Policy',
      description: '30-day return policy. Items must be unused and in original packaging.',
    },
  ];

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
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 4,
            mb: 6,
          }}
        >
          {/* Product Image */}
          <Box>
            <Box
              sx={{
                height: 500,
                backgroundColor: '#E8E4F3',
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
              }}
            >
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ChangeHistoryIcon sx={{ color: '#6B46C1', fontSize: 40 }} />
              </Box>
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SettingsIcon sx={{ color: '#6B46C1', fontSize: 40 }} />
              </Box>
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CropSquareIcon sx={{ color: '#6B46C1', fontSize: 40 }} />
              </Box>
            </Box>
          </Box>

          {/* Product Info */}
          <Box>
            <Typography
              variant="caption"
              sx={{
                display: 'inline-block',
                px: 2,
                py: 0.5,
                mb: 2,
                backgroundColor: '#E8E4F3',
                borderRadius: 1,
                color: '#6B46C1',
                fontWeight: 600,
              }}
            >
              Label
            </Typography>

            <Typography variant="h3" sx={{ mb: 2, fontWeight: 700, color: '#2C2C2C' }}>
              {product.product_name}
            </Typography>

            <Typography variant="body2" sx={{ mb: 2, color: '#757575' }}>
              Published {new Date(product.created_at).toLocaleDateString()}
            </Typography>

            <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: '#6B46C1' }}>
              ${product.price.toFixed(2)}
            </Typography>

            <Typography variant="body1" sx={{ mb: 2, color: '#2C2C2C', lineHeight: 1.7 }}>
              {product.description}
            </Typography>

            <Typography variant="body1" sx={{ mb: 4, color: '#2C2C2C', lineHeight: 1.7 }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua.
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={handleAddToCart}
              sx={{
                backgroundColor: '#6B46C1',
                color: '#FFFFFF',
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#5A38A3',
                },
              }}
            >
              Add to Cart
            </Button>
          </Box>
        </Box>

        {/* Details Section */}
        <Box>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: '#2C2C2C' }}>
            Details
          </Typography>

          {detailItems.map((item, index) => (
            <Paper
              key={index}
              sx={{
                p: 3,
                mb: 2,
                display: 'flex',
                gap: 3,
                backgroundColor: '#FFFFFF',
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
              }}
            >
              {/* Thumbnail */}
              <Box
                sx={{
                  minWidth: 80,
                  height: 80,
                  backgroundColor: '#E8E4F3',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ChangeHistoryIcon sx={{ color: '#6B46C1', fontSize: 12 }} />
                </Box>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <SettingsIcon sx={{ color: '#6B46C1', fontSize: 12 }} />
                </Box>
              </Box>

              {/* Content */}
              <Box>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: '#2C2C2C' }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#757575', lineHeight: 1.6 }}>
                  {item.description}
                </Typography>
              </Box>
            </Paper>
          ))}
        </Box>
      </Container>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Product added to cart!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductDetailView;
