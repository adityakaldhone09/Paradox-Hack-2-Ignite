export type VeriQRole = 'SUPER_ADMIN' | 'PAPER_SETTER' | 'CENTRE_ADMIN' | 'INVIGILATOR';

export const roleConfig: Record<VeriQRole, { label: string; description: string; dashboard: string }> = {
  SUPER_ADMIN: { label: 'Super Admin', description: 'System-wide control and security oversight.', dashboard: '/dashboard/admin' },
  PAPER_SETTER: { label: 'Paper Setter', description: 'Create, protect, and release examination papers.', dashboard: '/dashboard/paper-setter' },
  CENTRE_ADMIN: { label: 'Centre Admin', description: 'Manage centre readiness and authorised access.', dashboard: '/dashboard/centre' },
  INVIGILATOR: { label: 'Invigilator', description: 'Verify papers and run secure examinations.', dashboard: '/dashboard/invigilator' },
};

export const roleOptions = Object.entries(roleConfig) as [VeriQRole, (typeof roleConfig)[VeriQRole]][];
