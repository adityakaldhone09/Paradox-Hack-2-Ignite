import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, Check, GraduationCap, UserCheck } from 'lucide-react';
import { useAuth, UserRole } from '../../store/AuthContext';
import { useNavigate } from 'react-router-dom';

interface SidebarPersonaProps {
  isCollapsed: boolean;
  inMobile?: boolean;
  onPersonaSwitched?: () => void;
}

const PERSONA_OPTIONS: { role: UserRole; title: string; subtitle: string }[] = [
  { role: 'SUPER_ADMIN', title: 'Super Admin', subtitle: 'Dr. Rajesh Sharma' },
  { role: 'PAPER_SETTER', title: 'Paper Setter', subtitle: 'Prof. Ananya Sen' },
  { role: 'CENTRE_ADMIN', title: 'Centre Admin', subtitle: 'Suresh Kulkarni • C101' },
  { role: 'INVIGILATOR', title: 'Invigilator', subtitle: 'Rohit Verma • C101' },
];

export const SidebarPersona: React.FC<SidebarPersonaProps> = ({
  isCollapsed,
  inMobile = false,
  onPersonaSwitched,
}) => {
  const { user, switchRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
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

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectRole = async (role: UserRole) => {
    setIsOpen(false);
    if (user?.role !== role) {
      await switchRole(role);
      navigate('/dashboard');
      if (onPersonaSwitched) onPersonaSwitched();
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 shrink-0 w-full"
    >
      {!isCollapsed || inMobile ? (
        /* ────────────────────────────────────────── */
        /* EXPANDED PERSONA SELECTOR */
        /* ────────────────────────────────────────── */
        <div className="p-3">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-semibold">
              Persona
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Active Workspace" />
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111113] hover:border-blue-300 dark:hover:border-blue-800 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-all duration-200 flex items-center justify-between text-left group shadow-2xs"
            aria-label="Switch Persona"
            aria-expanded={isOpen}
          >
            <div className="min-w-0 flex-1 mr-2">
              <div className="text-xs font-bold text-neutral-950 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {formatRole(user?.role)}
              </div>
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                {user?.name || 'Operator'} {user?.centre_id ? `• ${user.centre_id}` : ''}
              </div>
            </div>
            <ChevronUp
              className={`w-4 h-4 text-neutral-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>
      ) : (
        /* ────────────────────────────────────────── */
        /* COLLAPSED PERSONA COMPACT AVATAR (Section 31) */
        /* Centered at x = 38px */
        /* ────────────────────────────────────────── */
        <div
          className="p-2.5 flex justify-center w-full relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`w-10 h-10 rounded-xl grid place-items-center transition-all duration-200 border shadow-2xs ${
              isOpen
                ? 'bg-blue-50 text-blue-600 border-blue-300 dark:bg-blue-950/50 dark:border-blue-700'
                : 'bg-white dark:bg-[#111113] text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:border-blue-300 hover:text-blue-600'
            }`}
            title={`Role Persona: ${formatRole(user?.role)}`}
            aria-label="Switch Persona"
          >
            <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </button>

          {/* Collapsed Tooltip */}
          <AnimatePresence>
            {!isOpen && isHovered && (
              <motion.div
                initial={{ opacity: 0, x: 8, scale: 0.96 }}
                animate={{ opacity: 1, x: 14, scale: 1 }}
                exit={{ opacity: 0, x: 8, scale: 0.96 }}
                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="fixed z-50 pointer-events-none px-3 py-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-semibold shadow-xl whitespace-nowrap border border-neutral-700/50 dark:border-neutral-200 text-left"
                style={{ left: '76px' }}
              >
                <div className="font-bold">{formatRole(user?.role)}</div>
                <div className="text-[10px] text-neutral-400 dark:text-neutral-500 font-normal">
                  {user?.name} {user?.centre_id ? `• ${user.centre_id}` : ''}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ────────────────────────────────────────── */}
      {/* UPWARD ANIMATED DROPDOWN (Works for both states) */}
      {/* ────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 6 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute bottom-full mb-2 p-1.5 rounded-2xl bg-white dark:bg-[#161619] border border-neutral-200 dark:border-neutral-800 shadow-elevated z-40 space-y-1 ${
              isCollapsed && !inMobile
                ? 'left-2 w-[220px]'
                : 'left-3 right-3'
            }`}
          >
            <div className="px-2.5 py-1.5 text-[10px] font-mono text-neutral-400 uppercase tracking-wider border-b border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
              <span>Switch Demo Persona</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>

            {PERSONA_OPTIONS.map((p) => {
              const isSelected = user?.role === p.role;
              return (
                <button
                  key={p.role}
                  type="button"
                  onClick={() => handleSelectRole(p.role)}
                  className={`w-full p-2 rounded-xl text-left transition-all duration-180 flex items-center justify-between group ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-semibold'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 hover:translate-x-0.5'
                  }`}
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <div
                      className={`text-xs ${
                        isSelected
                          ? 'text-blue-600 dark:text-blue-400 font-bold'
                          : 'font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400'
                      }`}
                    >
                      {p.title}
                    </div>
                    <div className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                      {p.subtitle}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
