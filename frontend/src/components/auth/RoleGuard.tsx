import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, UserRole } from '../../store/AuthContext';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // SUPER_ADMIN has system-wide clearance unless explicitly restricted
  const hasAccess = allowedRoles.includes(user.role) || user.role === 'SUPER_ADMIN';

  if (!hasAccess) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
