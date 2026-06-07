import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex-center" style={{ height: '100vh', flexDirection: 'column', gap: '1rem' }}>
        <div className="spinner"></div>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Loading, please wait...</p>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page and keep track of where they were trying to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // User role is not authorized for this route
    return <Navigate to="/403" replace />;
  }

  return children;
};

export default ProtectedRoute;
