import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { adminLogin as apiAdminLogin, logout as apiLogout } from '../services/api';

interface AdminUser {
  username: string;
}

interface AdminContextType {
  isAuthenticated: boolean;
  adminUser: AdminUser | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem('session_token');
    const username = localStorage.getItem('admin_username');

    if (token && username) {
      setIsAuthenticated(true);
      setAdminUser({ username });
    }
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    try {
      const token = await apiAdminLogin({ username, password });

      // Store token and username
      localStorage.setItem('session_token', token);
      localStorage.setItem('admin_username', username);

      setIsAuthenticated(true);
      setAdminUser({ username });
    } catch (error) {
      // Clear any existing auth data
      localStorage.removeItem('session_token');
      localStorage.removeItem('admin_username');
      setIsAuthenticated(false);
      setAdminUser(null);
      throw error;
    }
  };

  const logout = (): void => {
    apiLogout();
    localStorage.removeItem('admin_username');
    setIsAuthenticated(false);
    setAdminUser(null);
  };

  const checkAuth = (): boolean => {
    const token = localStorage.getItem('session_token');
    return !!token && isAuthenticated;
  };

  const value: AdminContextType = {
    isAuthenticated,
    adminUser,
    login,
    logout,
    checkAuth,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
