import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App.tsx';
import theme from './theme/theme';
import { CartProvider } from './context/CartContext';
import { AdminProvider } from './context/AdminContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AdminProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AdminProvider>
    </ThemeProvider>
  </StrictMode>
);
