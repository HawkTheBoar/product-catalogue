import React from 'react';
import { Box, Typography, IconButton, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import SettingsIcon from '@mui/icons-material/Settings';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import type { CartItem as CartItemType } from '../types';

interface CartItemProps {
  item: CartItemType;
  onQuantityChange: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onQuantityChange, onRemove }) => {
  const { product, quantity } = item;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      onQuantityChange(product.product_id, newQuantity);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 2,
        mb: 2,
        backgroundColor: '#FFFFFF',
        borderRadius: 2,
        border: '1px solid #E0E0E0',
        transition: 'box-shadow 0.2s',
        '&:hover': {
          boxShadow: '0px 2px 8px rgba(107, 70, 193, 0.15)',
        },
      }}
    >
      {/* Thumbnail with placeholder icons */}
      <Box
        sx={{
          minWidth: 100,
          height: 100,
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
            width: 24,
            height: 24,
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ChangeHistoryIcon sx={{ color: '#6B46C1', fontSize: 14 }} />
        </Box>
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SettingsIcon sx={{ color: '#6B46C1', fontSize: 14 }} />
        </Box>
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CropSquareIcon sx={{ color: '#6B46C1', fontSize: 14 }} />
        </Box>
      </Box>

      {/* Product Info */}
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 500, fontSize: '1rem', mb: 0.5 }}>
          {product.product_name}
        </Typography>
        <Typography variant="body2" sx={{ color: '#757575', mb: 1 }}>
          {product.description.length > 80
            ? product.description.substring(0, 80) + '...'
            : product.description}
        </Typography>
        <Typography variant="h6" sx={{ color: '#6B46C1', fontWeight: 600 }}>
          ${product.price.toFixed(2)}
        </Typography>
      </Box>

      {/* Quantity */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          inputProps={{ min: 1, style: { textAlign: 'center' } }}
          sx={{
            width: 70,
            '& input': {
              padding: '8px',
            },
          }}
        />

        {/* Remove Button */}
        <IconButton
          onClick={() => onRemove(product.product_id)}
          sx={{
            color: '#757575',
            '&:hover': {
              color: '#D32F2F',
              backgroundColor: 'rgba(211, 47, 47, 0.08)',
            },
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default CartItem;
