import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, ShieldAlert, ShieldCheck, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { easeApple } from '../../lib/motion';

export type VerificationStatusType = 'idle' | 'verifying' | 'verified' | 'tampered';

interface VerificationStatusProps {
  status: VerificationStatusType;
  message?: string;
  className?: string;
}

export const VerificationStatus: React.FC<VerificationStatusProps> = ({
  status,
  message,
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (status === 'verifying') {
    return (
      <motion.div
        role="status"
        aria-live="polite"
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: easeApple }}
        className={cn(
          'flex items-center gap-2.5 text-blue-600 dark:text-blue-400 font-medium text-xs sm:text-sm py-1.5 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60',
          className
        )}
      >
        <Loader2 className="h-4 w-4 animate-spin shrink-0 text-blue-600 dark:text-blue-400" />
        <span>{message || 'Verifying cryptographic integrity against ledger proof...'}</span>
      </motion.div>
    );
  }

  if (status === 'verified') {
    return (
      <motion.div
        role="status"
        aria-live="polite"
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: easeApple }}
        className={cn(
          'flex items-center gap-2.5 text-emerald-700 dark:text-emerald-300 font-semibold text-xs sm:text-sm py-2 px-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60',
          className
        )}
      >
        <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center shrink-0">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <span>Integrity Verified</span>
          {message && (
            <span className="block text-[11px] font-normal text-emerald-600/90 dark:text-emerald-400/90">
              {message}
            </span>
          )}
        </div>
      </motion.div>
    );
  }

  if (status === 'tampered') {
    return (
      <motion.div
        role="alert"
        aria-live="assertive"
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={
          shouldReduceMotion
            ? { opacity: 1 }
            : {
                opacity: 1,
                x: [0, -4, 4, -3, 3, 0],
              }
        }
        transition={{ duration: 0.35, ease: easeApple }}
        className={cn(
          'flex items-center gap-2.5 text-rose-700 dark:text-rose-300 font-semibold text-xs sm:text-sm py-2 px-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-800/60',
          className
        )}
      >
        <div className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-900/60 flex items-center justify-center shrink-0">
          <ShieldAlert className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
        </div>
        <div>
          <span>Tamper Detected</span>
          {message && (
            <span className="block text-[11px] font-normal text-rose-600/90 dark:text-rose-400/90">
              {message}
            </span>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 text-neutral-400 dark:text-neutral-500 text-xs py-1',
        className
      )}
    >
      <ShieldCheck className="h-4 w-4 shrink-0" />
      <span>{message || 'Ready for cryptographic ledger check'}</span>
    </div>
  );
};
