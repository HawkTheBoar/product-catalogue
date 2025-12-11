import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Divider } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CartItem from '../components/CartItem';
import { useCart } from '../context/CartContext';

const CartView: React.FC = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <Box
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          backgroundColor: '#FAFAFA',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <ShoppingCartIcon sx={{ fontSize: 80, color: '#E0E0E0', mb: 2 }} />
          <Typography variant="h5" sx={{ mb: 2, color: '#757575' }}>
            Your cart is empty
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{
              backgroundColor: '#6B46C1',
              '&:hover': { backgroundColor: '#5A38A3' },
            }}
          >
            Browse Products
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: '#FAFAFA' }}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 600, color: '#2C2C2C' }}>
          Items
        </Typography>

        {/* Cart Items */}
        <Box sx={{ mb: 4 }}>
          {cart.map((item) => (
            <CartItem
              key={item.product.product_id}
              item={item}
              onQuantityChange={updateQuantity}
              onRemove={removeFromCart}
            />
          ))}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Cart Summary */}
        <Box
          sx={{
            p: 3,
            backgroundColor: '#FFFFFF',
            borderRadius: 2,
            border: '1px solid #E0E0E0',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body1" sx={{ color: '#757575' }}>
              Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, color: '#2C2C2C' }}>
              ${getCartTotal().toFixed(2)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body1" sx={{ color: '#757575' }}>
              Shipping
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, color: '#2C2C2C' }}>
              Free
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#2C2C2C' }}>
              Total
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#6B46C1' }}>
              ${getCartTotal().toFixed(2)}
            </Typography>
          </Box>

          <Button
            variant="contained"
            fullWidth
            size="large"
            sx={{
              backgroundColor: '#6B46C1',
              color: '#FFFFFF',
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              mb: 2,
              '&:hover': {
                backgroundColor: '#5A38A3',
              },
            }}
            onClick={() => alert('Checkout functionality to be implemented')}
          >
            Proceed to Checkout
          </Button>

          <Button
            variant="outlined"
            fullWidth
            onClick={clearCart}
            sx={{
              borderColor: '#E0E0E0',
              color: '#757575',
              '&:hover': {
                borderColor: '#D32F2F',
                backgroundColor: 'rgba(211, 47, 47, 0.08)',
                color: '#D32F2F',
              },
            }}
          >
            Clear Cart
          </Button>
        </Box>

        {/* Continue Shopping */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Button
            variant="text"
            onClick={() => navigate('/')}
            sx={{
              color: '#6B46C1',
              '&:hover': {
                backgroundColor: 'rgba(107, 70, 193, 0.08)',
              },
            }}
          >
            ← Continue Shopping
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default CartView;
