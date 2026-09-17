import React, { useState, useEffect } from 'react';
import { useAuth } from '../../store/AuthContext';
import { examApi, paperApi, centreApi, securityApi, blockchainApi } from '../../services/apiClient';
import { CommandPalette } from '../ui/CommandPalette';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('veriq_sidebar_collapsed');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  // Persist sidebar collapsed/expanded preference (Section 57)
  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('veriq_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  // Background pre-warming of critical page datasets for zero-latency instant transitions
  useEffect(() => {
    if (!user) return;
    const prewarm = async () => {
      try {
        await Promise.allSettled([
          examApi.list(),
          paperApi.list(),
          centreApi.list(),
          securityApi.getSummary(),
          blockchainApi.getStatus(),
        ]);
      } catch {}
    };
    prewarm();
  }, [user?.role]);

  return (
    <div className="flex h-screen bg-neutral-50/50 dark:bg-[#0A0A0B] text-neutral-900 dark:text-neutral-100 overflow-hidden transition-colors duration-200 print:h-auto print:overflow-visible print:bg-white print:text-black">
      {/* ⌘K Command Palette */}
      <CommandPalette />

      {/* Modular Responsive Sidebar (248px expanded, 76px collapsed, fixed 40px icon center) */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapse}
        role={user?.role}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Content Workspace synchronized smoothly with Sidebar */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden print:h-auto print:overflow-visible min-w-0">
        <Topbar onOpenMobileMenu={() => setMobileOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 custom-scrollbar print:overflow-visible print:p-0 print:m-0">
          <div className="max-w-7xl mx-auto space-y-6 print:max-w-none print:m-0 print:p-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
