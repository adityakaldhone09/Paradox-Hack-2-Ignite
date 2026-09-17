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
  LucideIcon,
} from 'lucide-react';
import { UserRole } from '../types/roles';

export interface NavRouteConfig {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
  semanticColor: string;
  allowedRoles: UserRole[];
  badge?: string;
  section?: 'main' | 'operations' | 'security' | 'audit';
}

export const NAVIGATION_ROUTES: NavRouteConfig[] = [
  {
    id: 'overview',
    label: 'Overview',
    path: '/dashboard',
    icon: LayoutDashboard,
    semanticColor: '#2563EB',
    allowedRoles: ['SUPER_ADMIN', 'PAPER_SETTER', 'CENTRE_ADMIN', 'INVIGILATOR'],
    section: 'main',
  },
  {
    id: 'examinations',
    label: 'Examinations',
    path: '/examinations',
    icon: GraduationCap,
    semanticColor: '#4F46E5',
    allowedRoles: ['SUPER_ADMIN', 'PAPER_SETTER', 'CENTRE_ADMIN', 'INVIGILATOR'],
    section: 'main',
  },
  {
    id: 'papers',
    label: 'Question Papers',
    path: '/papers',
    icon: FileText,
    semanticColor: '#475569',
    allowedRoles: ['SUPER_ADMIN', 'PAPER_SETTER', 'CENTRE_ADMIN'],
    section: 'main',
  },
  {
    id: 'centres',
    label: 'Centres & Devices',
    path: '/centres',
    icon: Building2,
    semanticColor: '#0D9488',
    allowedRoles: ['SUPER_ADMIN', 'CENTRE_ADMIN'],
    section: 'operations',
  },
  {
    id: 'verify',
    label: 'Integrity Verification',
    path: '/verify',
    icon: CheckCircle2,
    semanticColor: '#16A34A',
    allowedRoles: ['SUPER_ADMIN', 'PAPER_SETTER', 'CENTRE_ADMIN', 'INVIGILATOR'],
    section: 'operations',
  },
  {
    id: 'timelock',
    label: 'Time-Lock Release',
    path: '/timelock',
    icon: Lock,
    semanticColor: '#D97706',
    allowedRoles: ['SUPER_ADMIN', 'CENTRE_ADMIN', 'INVIGILATOR'],
    section: 'operations',
  },
  {
    id: 'custody',
    label: 'Chain of Custody',
    path: '/custody',
    icon: GitCommit,
    semanticColor: '#7C3AED',
    allowedRoles: ['SUPER_ADMIN', 'PAPER_SETTER'],
    section: 'security',
  },
  {
    id: 'securityOps',
    label: 'Security Operations',
    path: '/security-ops',
    icon: ShieldAlert,
    semanticColor: '#1D4ED8',
    allowedRoles: ['SUPER_ADMIN'],
    section: 'security',
  },
  {
    id: 'incidents',
    label: 'Incident Alerts',
    path: '/incidents',
    icon: AlertTriangle,
    semanticColor: '#E11D48',
    allowedRoles: ['SUPER_ADMIN', 'CENTRE_ADMIN'],
    section: 'security',
  },
  {
    id: 'blockchain',
    label: 'Blockchain Explorer',
    path: '/blockchain',
    icon: Boxes,
    semanticColor: '#9333EA',
    allowedRoles: ['SUPER_ADMIN'],
    section: 'audit',
  },
  {
    id: 'audit',
    label: 'Audit Portal',
    path: '/audit',
    icon: FileCheck,
    semanticColor: '#059669',
    allowedRoles: ['SUPER_ADMIN'],
    section: 'audit',
  },
];

export const getNavigationForRole = (role?: UserRole): NavRouteConfig[] => {
  if (!role) {
    return NAVIGATION_ROUTES.filter((route) => route.allowedRoles.includes('SUPER_ADMIN'));
  }

  // Specialized contextual role customization
  switch (role) {
    case 'INVIGILATOR':
      return [
        { ...NAVIGATION_ROUTES.find((r) => r.id === 'overview')! },
        { ...NAVIGATION_ROUTES.find((r) => r.id === 'examinations')!, label: 'Active Exams' },
        { ...NAVIGATION_ROUTES.find((r) => r.id === 'verify')!, label: 'Paper Verification' },
        { ...NAVIGATION_ROUTES.find((r) => r.id === 'timelock')!, label: 'Time-Lock Access' },
      ];
    case 'CENTRE_ADMIN':
      return [
        { ...NAVIGATION_ROUTES.find((r) => r.id === 'overview')! },
        { ...NAVIGATION_ROUTES.find((r) => r.id === 'examinations')!, label: 'Assigned Exams' },
        { ...NAVIGATION_ROUTES.find((r) => r.id === 'papers')!, label: 'Assigned Papers' },
        { ...NAVIGATION_ROUTES.find((r) => r.id === 'centres')!, label: 'Devices & Terminals' },
        { ...NAVIGATION_ROUTES.find((r) => r.id === 'timelock')! },
        { ...NAVIGATION_ROUTES.find((r) => r.id === 'verify')!, label: 'Verify Paper' },
        { ...NAVIGATION_ROUTES.find((r) => r.id === 'incidents')! },
      ];
    case 'PAPER_SETTER':
      return [
        { ...NAVIGATION_ROUTES.find((r) => r.id === 'overview')! },
        { ...NAVIGATION_ROUTES.find((r) => r.id === 'papers')!, label: 'My Papers' },
        { ...NAVIGATION_ROUTES.find((r) => r.id === 'examinations')! },
        { ...NAVIGATION_ROUTES.find((r) => r.id === 'verify')! },
        { ...NAVIGATION_ROUTES.find((r) => r.id === 'custody')! },
      ];
    case 'SUPER_ADMIN':
    default:
      return NAVIGATION_ROUTES;
  }
};
