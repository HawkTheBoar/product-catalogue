import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { useAdmin } from '../../context/AdminContext';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAdmin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(username, password);
      navigate('/admin');
    } catch (err) {
      setError('Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FAFAFA',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              backgroundColor: '#6B46C1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <LockIcon sx={{ color: '#FFFFFF', fontSize: 30 }} />
          </Box>

          <Typography variant="h4" sx={{ mb: 1, fontWeight: 600, color: '#2C2C2C' }}>
            Admin Login
          </Typography>

          <Typography variant="body2" sx={{ mb: 3, color: '#757575' }}>
            Sign in to access the admin panel
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              required
              autoFocus
              disabled={loading}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              disabled={loading}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: '#6B46C1',
                '&:hover': {
                  backgroundColor: '#5A38A3',
                },
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#FFFFFF' }} /> : 'Sign In'}
            </Button>
          </Box>

          <Typography variant="body2" sx={{ mt: 2, color: '#757575', textAlign: 'center' }}>
            Demo credentials: <strong>admin / admin</strong>
          </Typography>

          <Button
            variant="text"
            onClick={() => navigate('/')}
            sx={{
              mt: 2,
              color: '#6B46C1',
              '&:hover': {
                backgroundColor: 'rgba(107, 70, 193, 0.08)',
              },
            }}
          >
            ← Back to Store
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminLogin;
