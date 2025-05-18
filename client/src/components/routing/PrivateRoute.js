import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';

const PrivateRoute = ({ children }) => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, loading, loadUser } = authContext;

  useEffect(() => {
    if (localStorage.token && !isAuthenticated && !loading) {
      loadUser();
    }
  }, [isAuthenticated, loading, loadUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated && !loading) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute; 