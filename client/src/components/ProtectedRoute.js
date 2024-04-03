import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, isAdmin } from './auth';

const ProtectedRoute = ({ children, requireAuth, requireAdmin }) => {
  const authenticated = isAuthenticated();
  const admin = isAdmin();

  // Redirect unauthenticated users to the sign-in page
  if (requireAuth && !authenticated) {
    return <Navigate to="/signin" replace />;
  }

  // Redirect authenticated non-admin users to the homepage if admin rights are required
  if (requireAuth && requireAdmin && !admin) {
    return <Navigate to="/" replace />;
  }

  // If no redirection occurred, render the children components
  return children;
};

export default ProtectedRoute;


