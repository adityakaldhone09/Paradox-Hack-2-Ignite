import React from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  FileText,
  Building2,
  CheckCircle2,
  Lock,
  GitCommit,
  ShieldAlert,
  AlertTriangle,
  Boxes,
  FileCheck,
} from 'lucide-react';
import { UserRole } from '../../store/AuthContext';
import { SidebarItem, NavItemConfig } from './SidebarItem';

interface SidebarNavigationProps {
  role?: UserRole;
  isCollapsed: boolean;
  onItemClick?: () => void;
}

// Section 21 & 74: Centralized Navigation Catalog with Semantic Accent Colors
export const NAV_CATALOG: Record<string, NavItemConfig> = {
  overview: {
    label: 'Overview',
    path: '/dashboard',
    icon: LayoutDashboard,
    semanticColor: '#2563EB', // Blue
  },
  examinations: {
    label: 'Examinations',
    path: '/examinations',
    icon: GraduationCap,
    semanticColor: '#4F46E5', // Indigo
  },
  papers: {
    label: 'Question Papers',
    path: '/papers',
    icon: FileText,
    semanticColor: '#475569', // Slate
  },
  centres: {
    label: 'Centres & Devices',
    path: '/centres',
    icon: Building2,
    semanticColor: '#0D9488', // Teal
  },
  verify: {
    label: 'Integrity Verification',
    path: '/verify',
    icon: CheckCircle2,
    semanticColor: '#16A34A', // Green
  },
  timelock: {
    label: 'Time-Lock Release',
    path: '/timelock',
    icon: Lock,
    semanticColor: '#D97706', // Amber
  },
  custody: {
    label: 'Chain of Custody',
    path: '/custody',
    icon: GitCommit,
    semanticColor: '#7C3AED', // Violet
  },
  securityOps: {
    label: 'Security Operations',
    path: '/security-ops',
    icon: ShieldAlert,
    semanticColor: '#1D4ED8', // Deep Blue
  },
  incidents: {
    label: 'Incident Alerts',
    path: '/incidents',
    icon: AlertTriangle,
    semanticColor: '#E11D48', // Coral / Red
  },
  blockchain: {
    label: 'Blockchain Explorer',
    path: '/blockchain',
    icon: Boxes,
    semanticColor: '#9333EA', // Purple
  },
  audit: {
    label: 'Audit Portal',
    path: '/audit',
    icon: FileCheck,
    semanticColor: '#059669', // Emerald
  },
};

// Section 75–79: Strict Role-Based Filtering
export const getRoleNavigation = (role?: UserRole): NavItemConfig[] => {
  switch (role) {
    case 'INVIGILATOR':
      // Section 44 & 76: Invigilator interface — proctor focused, NO create exam/user mgmt
      return [
        NAV_CATALOG.overview,
        { ...NAV_CATALOG.examinations, label: 'Active Exams' },
        { ...NAV_CATALOG.verify, label: 'Paper Verification' },
        { ...NAV_CATALOG.timelock, label: 'Time-Lock Access' },
      ];
    case 'CENTRE_ADMIN':
      // Section 45 & 77: Centre Admin interface
      return [
        NAV_CATALOG.overview,
        { ...NAV_CATALOG.examinations, label: 'Assigned Exams' },
        { ...NAV_CATALOG.papers, label: 'Assigned Papers' },
        { ...NAV_CATALOG.centres, label: 'Devices & Terminals' },
        NAV_CATALOG.timelock,
        { ...NAV_CATALOG.verify, label: 'Verify Paper' },
        NAV_CATALOG.incidents,
      ];
    case 'PAPER_SETTER':
      // Section 78: Paper Setter interface
      return [
        NAV_CATALOG.overview,
        { ...NAV_CATALOG.papers, label: 'My Papers' },
        NAV_CATALOG.examinations,
        NAV_CATALOG.verify,
        NAV_CATALOG.custody,
      ];
    case 'SUPER_ADMIN':
    default:
      // Section 79: Super Admin full scope
      return [
        NAV_CATALOG.overview,
        NAV_CATALOG.examinations,
        NAV_CATALOG.papers,
        NAV_CATALOG.centres,
        NAV_CATALOG.verify,
        NAV_CATALOG.timelock,
        NAV_CATALOG.custody,
        NAV_CATALOG.securityOps,
        NAV_CATALOG.incidents,
        NAV_CATALOG.blockchain,
        NAV_CATALOG.audit,
      ];
  }
};

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  role,
  isCollapsed,
  onItemClick,
}) => {
  const navItems = getRoleNavigation(role);

  return (
    <nav className="flex-1 py-3 space-y-1.5 overflow-y-auto custom-scrollbar flex flex-col items-center w-full">
      {navItems.map((item) => (
        <SidebarItem
          key={item.path + item.label}
          item={item}
          isCollapsed={isCollapsed}
          onClick={onItemClick}
        />
      ))}
    </nav>
  );
};
