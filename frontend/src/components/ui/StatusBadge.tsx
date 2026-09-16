import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, Lock, Clock, CheckCircle2, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  className?: string;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '', showIcon = true }) => {
  const normalized = status.toUpperCase();

  switch (normalized) {
    case 'APPROVED':
    case 'CONFIRMED':
    case 'AUTHORIZED':
    case 'VERIFIED_VALID':
    case 'SUCCESS':
    case 'ACTIVE':
    case 'RESOLVED':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 ${className}`}>
          {showIcon && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
          {status}
        </span>
      );

    case 'CRITICAL':
    case 'REVOKED':
    case 'INTEGRITY_FAILURE':
    case 'BLOCKED':
    case 'FAILED':
    case 'SUSPENDED':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/30 animate-pulse-subtle ${className}`}>
          {showIcon && <AlertOctagon className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />}
          {status}
        </span>
      );

    case 'RELEASE_SCHEDULED':
    case 'ASSIGNED':
    case 'LOCKED':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20 ${className}`}>
          {showIcon && <Lock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />}
          {status}
        </span>
      );

    case 'HIGH':
    case 'WARNING':
    case 'INVESTIGATING':
    case 'OPEN':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 ${className}`}>
          {showIcon && <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
          {status}
        </span>
      );

    case 'SCHEDULED':
    case 'DRAFT':
    case 'PENDING':
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 ${className}`}>
          {showIcon && <Clock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />}
          {status}
        </span>
      );
  }
};
