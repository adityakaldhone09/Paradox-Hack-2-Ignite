import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  LayoutDashboard,
  FileText,
  GraduationCap,
  CheckCircle2,
  Lock,
  GitCommit,
  Boxes,
  Building2,
  ShieldAlert,
  AlertTriangle,
  FileCheck,
  X,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../store/AuthContext';

interface CommandItem {
  id: string;
  title: string;
  category: string;
  path: string;
  icon: React.ElementType;
  roles?: string[];
}

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();

  const commands: CommandItem[] = [
    { id: 'dashboard', title: 'Go to Overview Dashboard', category: 'Navigation', path: '/dashboard', icon: LayoutDashboard },
    { id: 'papers', title: 'Question Papers Workspace', category: 'Management', path: '/papers', icon: FileText },
    { id: 'examinations', title: 'Examination Schedules', category: 'Management', path: '/examinations', icon: GraduationCap },
    { id: 'verify', title: 'Cryptographic Integrity Verification', category: 'Security', path: '/verify', icon: CheckCircle2 },
    { id: 'timelock', title: 'Time-Lock Release Policies', category: 'Security', path: '/timelock', icon: Lock },
    { id: 'custody', title: 'Chain of Custody Timeline', category: 'Audit', path: '/custody', icon: GitCommit },
    { id: 'blockchain', title: 'Blockchain Ledger Explorer', category: 'Technology', path: '/blockchain', icon: Boxes, roles: ['SUPER_ADMIN'] },
    { id: 'centres', title: 'Centres & Terminal Authorization', category: 'Management', path: '/centres', icon: Building2, roles: ['SUPER_ADMIN', 'CENTRE_ADMIN'] },
    { id: 'security-ops', title: 'Security Command Center', category: 'Security', path: '/security-ops', icon: ShieldAlert, roles: ['SUPER_ADMIN'] },
    { id: 'incidents', title: 'Security Incident Logs', category: 'Security', path: '/incidents', icon: AlertTriangle },
    { id: 'audit', title: 'Independent Auditor Portal', category: 'Audit', path: '/audit', icon: FileCheck, roles: ['SUPER_ADMIN'] },
  ];

  const filteredCommands = commands.filter((cmd) => {
    if (cmd.roles && user?.role && !cmd.roles.includes(user.role)) return false;
    if (!query) return true;
    return cmd.title.toLowerCase().includes(query.toLowerCase()) || cmd.category.toLowerCase().includes(query.toLowerCase());
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  const handleKeyDownInMenu = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
    } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredCommands[selectedIndex].path);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-xl bg-white dark:bg-[#111113] rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"
            onKeyDown={handleKeyDownInMenu}
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-neutral-200 dark:border-neutral-800 gap-3">
              <Search className="w-4 h-4 text-neutral-400 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Search commands, papers, or pages... (Type to filter)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 outline-none"
              />
              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 border border-neutral-200 dark:border-neutral-700">
                ESC
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-72 overflow-y-auto p-2 space-y-1">
              {filteredCommands.length === 0 ? (
                <div className="py-8 text-center text-xs text-neutral-500 dark:text-neutral-400">
                  No matching commands found for "{query}"
                </div>
              ) : (
                filteredCommands.map((cmd, idx) => {
                  const Icon = cmd.icon;
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={cmd.id}
                      onClick={() => handleSelect(cmd.path)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-colors ${
                        isSelected
                          ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                          : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-neutral-500" />
                        <span className="font-medium text-left">{cmd.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium">
                          {cmd.category}
                        </span>
                        {isSelected && <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer info */}
            <div className="px-4 py-2 bg-neutral-50 dark:bg-neutral-900/50 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
              <span>Navigate with arrow keys</span>
              <span>Press ↵ to select</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
