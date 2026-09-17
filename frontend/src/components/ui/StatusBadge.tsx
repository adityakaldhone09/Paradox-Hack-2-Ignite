import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, Lock, Clock, CheckCircle2, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  className?: string;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '', showIcon = true }) => {
  const normalized = (status || '').toUpperCase();

  switch (normalized) {
    case 'APPROVED':
    case 'CONFIRMED':
    case 'AUTHORIZED':
    case 'VERIFIED':
    case 'VERIFIED_VALID':
    case 'SUCCESS':
    case 'ACTIVE':
    case 'RESOLVED':
    case 'SECURED':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/50 ${className}`}>
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
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/80 dark:border-rose-800/50 ${className}`}>
          {showIcon && <AlertOctagon className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />}
          {status}
        </span>
      );

    case 'RELEASE_SCHEDULED':
    case 'ASSIGNED':
    case 'LOCKED':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-200/80 dark:border-purple-800/50 ${className}`}>
          {showIcon && <Lock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />}
          {status}
        </span>
      );

    case 'HIGH':
    case 'WARNING':
    case 'INVESTIGATING':
    case 'OPEN':
    case 'SUBMITTED':
    case 'ELEVATED':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/80 dark:border-amber-800/50 ${className}`}>
          {showIcon && <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
          {status}
        </span>
      );

    case 'RELEASED':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200/80 dark:border-blue-800/50 ${className}`}>
          {showIcon && <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
          {status}
        </span>
      );

    case 'EXPIRED':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 ${className}`}>
          {showIcon && <XCircle className="w-3.5 h-3.5 text-neutral-500" />}
          {status}
        </span>
      );

    case 'SCHEDULED':
    case 'DRAFT':
    case 'PENDING':
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700 dark:bg-neutral-800/80 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700/60 ${className}`}>
          {showIcon && <Clock className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />}
          {status}
        </span>
      );
  }
};
