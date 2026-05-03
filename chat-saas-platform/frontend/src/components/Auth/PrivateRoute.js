import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen">جاري التحميل...</div>;
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;