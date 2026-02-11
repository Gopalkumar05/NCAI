

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../common/Loader';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isAdmin, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loader while auth is loading
  if (loading) {
    console.log('ProtectedRoute: Loading auth state...');
    return <Loader />;
  }

  // Check if we have a token in localStorage (this helps during initialization)
  const hasToken = localStorage.getItem('token');
  const hasUserData = localStorage.getItem('user');

  // If we have auth data but context hasn't loaded it yet
  if (hasToken && hasUserData && !user) {
    console.log('ProtectedRoute: Auth data exists but context not loaded yet, waiting...');
    return <Loader />;
  }

  // If no auth data at all, redirect to login
  if (!hasToken && !isAuthenticated) {
    console.log('ProtectedRoute: No auth data found, redirecting to login');
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    console.log('ProtectedRoute: Not authenticated, redirecting to login');
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }

  // Check admin requirement if needed
  if (requireAdmin && !isAdmin) {
    console.log('ProtectedRoute: Admin required but not admin, redirecting');
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }

  console.log('ProtectedRoute: Access granted to', user?.email);
  return children;
};

export default ProtectedRoute;