import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';

export const LogoutPage: React.FC = () => {
  const { logout } = useAuth();

  useEffect(() => {
    logout(true);
  }, []);

  return <Navigate to="/signin" replace />;
};
