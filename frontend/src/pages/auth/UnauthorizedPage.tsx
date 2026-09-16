import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft, Home, Lock } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { Button } from '../../components/ui/Button';

export const UnauthorizedPage: React.FC = () => {
  const { user, getDashboardUrl } = useAuth();
  const dashboardUrl = getDashboardUrl(user?.role);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center p-4 transition-colors duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full text-center bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-200 dark:border-slate-800"
      >
        <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400 mb-5 shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100/80 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80 mb-3">
          <Lock className="w-3 h-3" />
          HTTP 403 Forbidden
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Access Restricted
        </h1>

        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Your current authenticated profile ({user ? <strong className="text-slate-800 dark:text-slate-200">{user.role.replace('_', ' ')}</strong> : 'Unknown'}) does not hold the required policy clearance to view or execute actions on this resource.
        </p>

        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to={dashboardUrl} className="w-full sm:w-auto">
            <Button variant="primary" size="md" className="w-full justify-center">
              <Home className="w-4 h-4 mr-2" />
              Return to Role Dashboard
            </Button>
          </Link>
          <Link to="/signin" className="w-full sm:w-auto">
            <Button variant="outline" size="md" className="w-full justify-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Switch Terminal
            </Button>
          </Link>
        </div>

        <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
          This unauthorized request has been registered in the VeriQ tamper-evident security log.
        </div>
      </motion.div>
    </div>
  );
};
