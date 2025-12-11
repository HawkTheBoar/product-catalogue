import { createTheme } from '@mui/material/styles';

// Color palette matching the design mockups
const theme = createTheme({
  palette: {
    primary: {
      main: '#6B46C1', // Purple from design
      light: '#8B6BCE',
      dark: '#5A38A3',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#E8E4F3', // Light purple for cards
      light: '#F5F3FA',
      dark: '#D5CFE8',
      contrastText: '#2C2C2C',
    },
    background: {
      default: '#FAFAFA', // Off-white page background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2C2C2C', // Dark gray for titles
      secondary: '#757575', // Medium gray for metadata
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#2C2C2C',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#2C2C2C',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#2C2C2C',
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#2C2C2C',
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 500,
      color: '#2C2C2C',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      color: '#2C2C2C',
    },
    body1: {
      fontSize: '1rem',
      color: '#2C2C2C',
    },
    body2: {
      fontSize: '0.875rem',
      color: '#757575',
    },
  },
  shape: {
    borderRadius: 8, // Rounded corners from design
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none', // No uppercase
          fontWeight: 500,
          padding: '10px 20px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(107, 70, 193, 0.25)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
