import React from 'react';
import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAdmin } from '../context/AdminContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAdmin();

  if (!isAuthenticated) {
    // Redirect to admin login if not authenticated
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
