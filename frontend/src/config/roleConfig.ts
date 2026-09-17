import { UserRole } from '../types/roles';

export interface RoleDefinition {
  role: UserRole;
  label: string;
  description: string;
  dashboardUrl: string;
  badgeBg: string;
  badgeText: string;
  canCreateExam: boolean;
  canUploadPaper: boolean;
  canApprovePaper: boolean;
  canVerifyPaper: boolean;
  canManageCentres: boolean;
  canManageUsers: boolean;
}

export const ROLE_CONFIGS: Record<UserRole, RoleDefinition> = {
  SUPER_ADMIN: {
    role: 'SUPER_ADMIN',
    label: 'Super Admin',
    description: 'Full governance, paper approval, security monitoring, and cryptographic audit oversight.',
    dashboardUrl: '/dashboard/admin',
    badgeBg: 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-900',
    badgeText: 'text-blue-700 dark:text-blue-300',
    canCreateExam: true,
    canUploadPaper: true,
    canApprovePaper: true,
    canVerifyPaper: true,
    canManageCentres: true,
    canManageUsers: true,
  },
  PAPER_SETTER: {
    role: 'PAPER_SETTER',
    label: 'Paper Setter',
    description: 'Examination question paper authoring, AES-256-GCM encryption, and custody submissions.',
    dashboardUrl: '/dashboard/paper-setter',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    canCreateExam: false,
    canUploadPaper: true,
    canApprovePaper: false,
    canVerifyPaper: true,
    canManageCentres: false,
    canManageUsers: false,
  },
  CENTRE_ADMIN: {
    role: 'CENTRE_ADMIN',
    label: 'Centre Admin',
    description: 'Assigned examination oversight, terminal device authorizations, and local release handling.',
    dashboardUrl: '/dashboard/centre',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900',
    badgeText: 'text-amber-700 dark:text-amber-300',
    canCreateExam: false,
    canUploadPaper: false,
    canApprovePaper: false,
    canVerifyPaper: true,
    canManageCentres: true,
    canManageUsers: false,
  },
  INVIGILATOR: {
    role: 'INVIGILATOR',
    label: 'Invigilator',
    description: 'Proctoring hall operations, terminal paper integrity verification, and incident reporting.',
    dashboardUrl: '/dashboard/invigilator',
    badgeBg: 'bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-900',
    badgeText: 'text-purple-700 dark:text-purple-300',
    canCreateExam: false,
    canUploadPaper: false,
    canApprovePaper: false,
    canVerifyPaper: true,
    canManageCentres: false,
    canManageUsers: false,
  },
};

export const getRoleDashboardUrl = (role?: UserRole | string): string => {
  if (!role || !(role in ROLE_CONFIGS)) {
    return '/dashboard';
  }
  return ROLE_CONFIGS[role as UserRole].dashboardUrl;
};
