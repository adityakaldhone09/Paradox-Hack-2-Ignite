import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, MoreVertical, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

interface SidebarAccountProps {
  isCollapsed: boolean;
  inMobile?: boolean;
}

export const SidebarAccount: React.FC<SidebarAccountProps> = ({
  isCollapsed,
  inMobile = false,
}) => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const formatRole = (role?: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'Super Admin';
      case 'PAPER_SETTER': return 'Paper Setter';
      case 'CENTRE_ADMIN': return 'Centre Admin';
      case 'INVIGILATOR': return 'Invigilator';
      default: return 'Operator';
    }
  };

  // Close popover on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    logout(true);
    navigate('/signin');
  };

  return (
    <div
      ref={containerRef}
      className="p-3 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111113] shrink-0 w-full"
    >
      {!isCollapsed || inMobile ? (
        /* ────────────────────────────────────────── */
        /* EXPANDED ACCOUNT BLOCK */
        /* ────────────────────────────────────────── */
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2.5 min-w-0 flex-1 p-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800/70 transition-all duration-200 text-left group"
          >
            {/* Neutral circular avatar with soft blue hover */}
            <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-950/60 text-neutral-800 dark:text-neutral-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center justify-center text-xs font-bold shrink-0 transition-colors border border-neutral-200 dark:border-neutral-700/60">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-neutral-950 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {user?.name || 'Operator'}
              </p>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                <span className="font-medium text-blue-600 dark:text-blue-400">{formatRole(user?.role)}</span>
                {user?.centre_id ? ` • ${user.centre_id}` : ''}
              </p>
            </div>
            <MoreVertical className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 shrink-0" />
          </button>

          {/* Explicit Sign Out Action Button */}
          <button
            type="button"
            onClick={() => setIsLogoutModalOpen(true)}
            className="p-2 text-neutral-400 hover:text-red-600 dark:hover:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-180 shrink-0 group border border-transparent hover:border-red-100 dark:hover:border-red-900/40"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </button>
        </div>
      ) : (
        /* ────────────────────────────────────────── */
        /* COLLAPSED ACCOUNT COMPACT AVATAR */
        /* Centered at x = 38px */
        /* ────────────────────────────────────────── */
        <div
          className="flex justify-center w-full relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-blue-100 dark:hover:bg-blue-950/60 text-neutral-800 dark:text-neutral-200 hover:text-blue-600 dark:hover:text-blue-400 grid place-items-center text-xs font-bold border border-neutral-200 dark:border-neutral-700/60 shadow-2xs transition-colors"
            title={`${user?.name} — ${formatRole(user?.role)}`}
            aria-label="Account Menu"
          >
            {user?.name?.charAt(0) || 'U'}
          </button>

          {/* Collapsed Tooltip */}
          <AnimatePresence>
            {!isMenuOpen && isHovered && (
              <motion.div
                initial={{ opacity: 0, x: 8, scale: 0.96 }}
                animate={{ opacity: 1, x: 14, scale: 1 }}
                exit={{ opacity: 0, x: 8, scale: 0.96 }}
                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="fixed z-50 pointer-events-none px-3 py-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-semibold shadow-xl whitespace-nowrap border border-neutral-700/50 dark:border-neutral-200 text-left"
                style={{ left: '76px' }}
              >
                <div className="font-bold">{user?.name}</div>
                <div className="text-[10px] text-neutral-400 dark:text-neutral-500 font-normal">
                  {formatRole(user?.role)} {user?.centre_id ? `• ${user.centre_id}` : ''}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ────────────────────────────────────────── */}
      {/* ACCOUNT DETAILS & ACTIONS POPOVER */}
      {/* ────────────────────────────────────────── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 6 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute bottom-full mb-2 p-2 rounded-2xl bg-white dark:bg-[#161619] border border-neutral-200 dark:border-neutral-800 shadow-elevated z-40 space-y-1 text-xs ${
              isCollapsed && !inMobile
                ? 'left-2 w-[220px]'
                : 'left-3 right-3'
            }`}
          >
            <div className="p-2 border-b border-neutral-100 dark:border-neutral-800">
              <div className="font-bold text-neutral-950 dark:text-white truncate">{user?.name}</div>
              <div className="text-[11px] text-neutral-400 font-mono truncate">{user?.email}</div>
            </div>

            <Link
              to="/dashboard"
              onClick={() => setIsMenuOpen(false)}
              className="w-full px-2.5 py-1.5 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-neutral-400" />
              <span>Workspace Overview</span>
            </Link>

            <Link
              to="/verify"
              onClick={() => setIsMenuOpen(false)}
              className="w-full px-2.5 py-1.5 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
              <span>Paper Integrity Tool</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                setIsLogoutModalOpen(true);
              }}
              className="w-full px-2.5 py-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center justify-between transition-colors font-medium border-t border-neutral-100 dark:border-neutral-800 mt-1 pt-1.5"
            >
              <span className="flex items-center gap-1.5">
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">⌘Q</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ────────────────────────────────────────── */}
      {/* SECTION 15: LOGOUT CONFIRMATION MODAL */}
      {/* ────────────────────────────────────────── */}
      <AnimatePresence>
        {isLogoutModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setIsLogoutModalOpen(false)}
              className="absolute inset-0 bg-neutral-950/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-[#141416] border border-neutral-200 dark:border-neutral-800 p-6 shadow-modal space-y-4 text-left z-10"
            >
              <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center border border-red-200/80 dark:border-red-900/40">
                <LogOut className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-neutral-950 dark:text-white">
                  Sign out of VeriQ?
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  You will need to authenticate again to access your assigned examinations and cryptographic paper keys.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmLogout}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 text-white hover:bg-red-700 transition-all shadow-xs active:scale-95"
                >
                  Sign Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
