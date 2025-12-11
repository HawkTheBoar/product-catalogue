import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../context/CartContext';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getCartCount } = useCart();

  const menuItems = [
    { label: 'Search', icon: <SearchIcon />, path: '/search' },
    { label: 'Categories', icon: <CategoryIcon />, path: '/categories' },
    { label: 'All Products', icon: <InventoryIcon />, path: '/' },
    { label: 'Cart', icon: <ShoppingCartIcon />, path: '/cart' },
  ];

  return (
    <Box
      sx={{
        width: 240,
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        backgroundColor: '#F5F5F5',
        borderRight: '1px solid #E0E0E0',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <List sx={{ pt: 4 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const cartCount = item.label === 'Cart' ? getCartCount() : 0;

          return (
            <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  mx: 2,
                  borderRadius: 2,
                  backgroundColor: isActive ? '#6B46C1' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#2C2C2C',
                  '&:hover': {
                    backgroundColor: isActive ? '#5A38A3' : 'rgba(107, 70, 193, 0.08)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive ? '#FFFFFF' : '#6B46C1',
                  }}
                >
                  {item.label === 'Cart' && cartCount > 0 ? (
                    <Badge badgeContent={cartCount} color="error">
                      {item.icon}
                    </Badge>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.95rem',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default Sidebar;
