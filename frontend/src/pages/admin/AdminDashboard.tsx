import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import LogoutIcon from '@mui/icons-material/Logout';
import StoreIcon from '@mui/icons-material/Store';
import { useAdmin } from '../../context/AdminContext';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { adminUser, logout } = useAdmin();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const cards = [
    {
      title: 'Product Management',
      description: 'Manage products, add new items, update prices and descriptions',
      icon: <InventoryIcon sx={{ fontSize: 48, color: '#6B46C1' }} />,
      path: '/admin/products',
    },
    {
      title: 'Category Management',
      description: 'Organize categories, create hierarchies, manage product classifications',
      icon: <CategoryIcon sx={{ fontSize: 48, color: '#6B46C1' }} />,
      path: '/admin/categories',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#FAFAFA', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 4,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#2C2C2C', mb: 0.5 }}>
              Admin Dashboard
            </Typography>
            <Typography variant="body1" sx={{ color: '#757575' }}>
              Welcome back, <strong>{adminUser?.username}</strong>!
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<StoreIcon />}
              onClick={() => navigate('/')}
              sx={{
                borderColor: '#6B46C1',
                color: '#6B46C1',
                '&:hover': {
                  borderColor: '#5A38A3',
                  backgroundColor: 'rgba(107, 70, 193, 0.08)',
                },
              }}
            >
              View Store
            </Button>

            <Button
              variant="contained"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                backgroundColor: '#6B46C1',
                '&:hover': {
                  backgroundColor: '#5A38A3',
                },
              }}
            >
              Logout
            </Button>
          </Box>
        </Paper>

        {/* Management Cards */}
        <Grid container spacing={3}>
          {cards.map((card) => (
            <Grid item xs={12} md={6} key={card.title}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0px 8px 16px rgba(107, 70, 193, 0.2)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 4 }}>
                  <Box sx={{ mb: 2 }}>{card.icon}</Box>

                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: '#2C2C2C' }}>
                    {card.title}
                  </Typography>

                  <Typography variant="body2" sx={{ color: '#757575' }}>
                    {card.description}
                  </Typography>
                </CardContent>

                <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate(card.path)}
                    sx={{
                      backgroundColor: '#6B46C1',
                      '&:hover': {
                        backgroundColor: '#5A38A3',
                      },
                    }}
                  >
                    Manage
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Quick Info */}
        <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#2C2C2C' }}>
            Quick Information
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2" sx={{ color: '#757575' }}>
              • Use the Product Management panel to create, update, or delete products
            </Typography>
            <Typography variant="body2" sx={{ color: '#757575' }}>
              • Use the Category Management panel to organize your product catalog
            </Typography>
            <Typography variant="body2" sx={{ color: '#757575' }}>
              • All changes are saved automatically
            </Typography>
            <Typography variant="body2" sx={{ color: '#757575' }}>
              • Currently running in{' '}
              <strong>{import.meta.env.VITE_USE_MOCK_DATA === 'true' ? 'MOCK' : 'PRODUCTION'}</strong>{' '}
              mode
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
