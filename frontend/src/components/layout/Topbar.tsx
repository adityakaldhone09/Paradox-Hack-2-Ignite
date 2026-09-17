import React, { useState } from 'react';
import { Search, Moon, Sun, Zap, Menu } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { useTheme } from '../../store/ThemeContext';
import { demoApi } from '../../services/apiClient';
import { toast } from 'sonner';

interface TopbarProps {
  onOpenMobileMenu: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenMobileMenu }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isSimulating, setIsSimulating] = useState(false);

  const formatRole = (role?: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'Super Admin';
      case 'PAPER_SETTER': return 'Paper Setter';
      case 'CENTRE_ADMIN': return 'Centre Admin';
      case 'INVIGILATOR': return 'Invigilator';
      default: return 'Operator';
    }
  };

  const triggerSimulation = async (eventType: string, label: string) => {
    setIsSimulating(true);
    try {
      const res = await demoApi.simulateEvent(eventType);
      toast.error(`Security Event: ${label}`, {
        description: res.data?.description || `Recorded in Ledger Block #${res.data?.block_number}`,
        duration: 5000,
      });
      window.dispatchEvent(new Event('veriQ_refresh_data'));
    } catch (err: any) {
      toast.error('Simulation error: ' + (err.response?.data?.detail || err.message));
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <header className="h-[76px] border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-[#0A0A0B]/95 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 md:px-8 z-10 print:hidden shrink-0 transition-colors duration-200">
      {/* Topbar Left: Mobile Hamburger & Compact Search */}
      <div className="flex items-center gap-3 md:gap-4">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="p-2 -ml-2 rounded-xl text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white md:hidden"
          aria-label="Open Sidebar Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Compact Search Bar (280px – 340px) */}
        <button
          type="button"
          onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
          className="flex items-center justify-between w-[220px] sm:w-[280px] md:w-[320px] lg:w-[340px] px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/60 text-xs text-neutral-500 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-700 hover:text-neutral-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/30 dark:focus:ring-blue-500/30 transition-all duration-200 shadow-2xs group"
        >
          <div className="flex items-center gap-2.5 truncate">
            <Search className="w-3.5 h-3.5 text-neutral-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors shrink-0" />
            <span className="truncate font-normal">Search VeriQ...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center font-mono text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-500 shrink-0">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Topbar Right: Status, Simulation, Theme, User Avatar */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        {/* System Status Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="hidden lg:inline text-[11px] font-mono">SYSTEM STATUS:</span>
          <span className="font-semibold text-xs">Operational</span>
        </div>

        {/* Security Simulation Quick Triggers */}
        <div className="hidden xl:flex items-center gap-1.5 pl-2 border-l border-neutral-200 dark:border-neutral-800">
          <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider flex items-center gap-1 mr-1">
            <Zap className="w-3 h-3 text-neutral-400" />
            Simulate:
          </span>
          <button
            type="button"
            onClick={() => triggerSimulation('EARLY_ACCESS', 'Early Access Blocked')}
            disabled={isSimulating}
            className="px-2.5 py-1 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111113] text-neutral-700 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-700 hover:text-neutral-950 dark:hover:text-white transition-colors shadow-2xs active:scale-95 disabled:opacity-50"
          >
            Early Access
          </button>
          <button
            type="button"
            onClick={() => triggerSimulation('DOCUMENT_TAMPERING', 'Hash Mismatch')}
            disabled={isSimulating}
            className="px-2.5 py-1 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111113] text-neutral-700 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-700 hover:text-neutral-950 dark:hover:text-white transition-colors shadow-2xs active:scale-95 disabled:opacity-50"
          >
            Tamper Hash
          </button>
        </div>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="p-2 md:p-2.5 rounded-xl text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white bg-white dark:bg-[#111113] border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors shadow-2xs"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>

        {/* User Quick Info Avatar Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-neutral-200 dark:border-neutral-800">
          <div
            className="w-8 h-8 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center text-xs font-bold shadow-2xs"
            title={`${user?.name} (${formatRole(user?.role)})`}
          >
            {user?.name?.charAt(0) || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};
