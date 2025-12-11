import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardActionArea, Box, Typography } from '@mui/material';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory'; // Triangle
import SettingsIcon from '@mui/icons-material/Settings'; // Gear
import CropSquareIcon from '@mui/icons-material/CropSquare'; // Square
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();

  // Format timestamp to relative time
  const getRelativeTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Updated today';
    if (diffInDays === 1) return 'Updated yesterday';
    if (diffInDays < 7) return `Updated ${diffInDays} days ago`;
    if (diffInDays < 30) return `Updated ${Math.floor(diffInDays / 7)} weeks ago`;
    return `Updated ${Math.floor(diffInDays / 30)} months ago`;
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#E8E4F3',
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0px 4px 12px rgba(107, 70, 193, 0.2)',
        },
      }}
    >
      <CardActionArea
        onClick={() => navigate(`/product/${product.product_id}`)}
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        {/* Placeholder Image with Icons */}
        <Box
          sx={{
            height: 180,
            backgroundColor: '#E8E4F3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
            p: 3,
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ChangeHistoryIcon sx={{ color: '#6B46C1', fontSize: 28 }} />
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SettingsIcon sx={{ color: '#6B46C1', fontSize: 28 }} />
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CropSquareIcon sx={{ color: '#6B46C1', fontSize: 28 }} />
          </Box>
        </Box>

        {/* Card Content */}
        <CardContent sx={{ flexGrow: 1, backgroundColor: '#E8E4F3' }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 500,
              fontSize: '1rem',
              color: '#2C2C2C',
              mb: 0.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {product.product_name}
          </Typography>
          <Typography variant="body2" sx={{ color: '#757575', fontSize: '0.875rem' }}>
            {getRelativeTime(product.updated_at)}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#6B46C1',
              fontWeight: 600,
              mt: 1,
            }}
          >
            ${product.price.toFixed(2)}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ProductCard;
