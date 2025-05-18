import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';

const AdminRoute = ({ children }) => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, loading, user } = authContext;
  
  // Check if user is authenticated and is an admin
  const isAdmin = user && user.role === 'admin';

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default AdminRoute; 