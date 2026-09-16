import React from 'react';
import { useAuth } from '../../store/AuthContext';
import { SuperAdminDashboard } from './roles/SuperAdminDashboard';
import { PaperSetterDashboard } from './roles/PaperSetterDashboard';
import { CentreAdminDashboard } from './roles/CentreAdminDashboard';
import { InvigilatorDashboard } from './roles/InvigilatorDashboard';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case 'PAPER_SETTER':
      return <PaperSetterDashboard />;
    case 'CENTRE_ADMIN':
      return <CentreAdminDashboard />;
    case 'INVIGILATOR':
      return <InvigilatorDashboard />;
    case 'SUPER_ADMIN':
    default:
      return <SuperAdminDashboard />;
  }
};
