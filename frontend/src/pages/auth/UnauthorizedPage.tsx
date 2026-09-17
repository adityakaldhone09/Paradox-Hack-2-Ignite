import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home, Lock } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { Button } from '../../components/ui/Button';

export const UnauthorizedPage: React.FC = () => {
  const { user, getDashboardUrl } = useAuth();
  const dashboardUrl = getDashboardUrl(user?.role);

  const formatRole = (role?: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'Super Admin';
      case 'PAPER_SETTER': return 'Paper Setter';
      case 'CENTRE_ADMIN': return 'Centre Admin';
      case 'INVIGILATOR': return 'Invigilator';
      default: return 'Authorized Operator';
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0B] text-neutral-900 dark:text-neutral-100 flex items-center justify-center p-6 transition-colors duration-200 bg-tech-grid">
      <div className="max-w-md w-full text-center bg-white dark:bg-[#111113] p-8 sm:p-10 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-card">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400 mb-5">
          <ShieldAlert className="w-6 h-6" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 mb-3">
          <Lock className="w-3 h-3" />
          HTTP 403 Forbidden
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">
          Access Restricted
        </h1>

        <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Your active profile clearance (<strong className="text-neutral-900 dark:text-white">{formatRole(user?.role)}</strong>) does not permit access to this resource perimeter.
        </p>

        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to={dashboardUrl} className="w-full sm:w-auto">
            <Button variant="primary" size="md" className="w-full justify-center">
              <Home className="w-4 h-4 mr-2" />
              Role Dashboard
            </Button>
          </Link>
          <Link to="/signin" className="w-full sm:w-auto">
            <Button variant="secondary" size="md" className="w-full justify-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Switch Terminal
            </Button>
          </Link>
        </div>

        <div className="mt-8 pt-5 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-400">
          This unauthorized request has been logged in the VeriQ tamper-evident ledger.
        </div>
      </div>
    </div>
  );
};
