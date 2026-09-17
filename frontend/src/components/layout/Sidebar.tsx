import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserRole } from '../../store/AuthContext';
import { SidebarHeader } from './SidebarHeader';
import { SidebarNavigation } from './SidebarNavigation';
import { SidebarPersona } from './SidebarPersona';
import { SidebarAccount } from './SidebarAccount';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  role?: UserRole;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  role,
  mobileOpen,
  onCloseMobile,
}) => {
  return (
    <>
      {/* ────────────────────────────────────────── */}
      {/* DESKTOP SIDEBAR (Sections 3, 4, 5) */}
      {/* Width: 248px expanded, 76px collapsed */}
      {/* Transitions smoothly as one unified structure */}
      {/* ────────────────────────────────────────── */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 76 : 248 }}
        transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
        className="hidden md:flex flex-col bg-white dark:bg-[#111113] border-r border-neutral-200 dark:border-neutral-800 z-20 shadow-xs print:hidden h-screen shrink-0 select-none overflow-visible"
        style={{
          width: isCollapsed ? '76px' : '248px',
        }}
      >
        {/* Header Fixed Top */}
        <SidebarHeader isCollapsed={isCollapsed} onToggle={onToggleCollapse} />

        {/* Scrollable Role-Based Navigation */}
        <SidebarNavigation role={role} isCollapsed={isCollapsed} />

        {/* Pinned Persona Switcher (Section 7, 30) */}
        <SidebarPersona isCollapsed={isCollapsed} />

        {/* Pinned User Account & Sign Out (Section 12, 26) */}
        <SidebarAccount isCollapsed={isCollapsed} />
      </motion.aside>

      {/* ────────────────────────────────────────── */}
      {/* MOBILE DRAWER SIDEBAR (< 768px) */}
      {/* ────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onCloseMobile}
              className="absolute inset-0 bg-neutral-950/60 backdrop-blur-xs"
            />

            {/* Slide Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-[260px] max-w-[85vw] h-full bg-white dark:bg-[#111113] border-r border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col"
            >
              <SidebarHeader
                isCollapsed={false}
                onToggle={onCloseMobile}
                inMobile={true}
              />
              <SidebarNavigation
                role={role}
                isCollapsed={false}
                onItemClick={onCloseMobile}
              />
              <SidebarPersona
                isCollapsed={false}
                inMobile={true}
                onPersonaSwitched={onCloseMobile}
              />
              <SidebarAccount isCollapsed={false} inMobile={true} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
