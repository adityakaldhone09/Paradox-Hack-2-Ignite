import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  GraduationCap,
  FileText,
  CheckCircle2,
  Lock,
  GitCommit,
  Boxes,
  Building2,
  ShieldAlert,
  AlertTriangle,
  FileCheck,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  LogOut,
  Zap,
  Moon,
  Sun,
  Search,
  Check,
  Menu,
  X,
  MoreVertical,
  Shield,
  ExternalLink,
} from 'lucide-react';
import { useAuth, UserRole } from '../../store/AuthContext';
import { useTheme } from '../../store/ThemeContext';
import { demoApi, examApi, paperApi, centreApi, securityApi, blockchainApi } from '../../services/apiClient';
import { CommandPalette } from '../ui/CommandPalette';
import { VeriQLogo } from '../ui/VeriQLogo';
import { toast } from 'sonner';

interface AppShellProps {
  children: React.ReactNode;
}

const PERSONA_OPTIONS: { role: UserRole; title: string; subtitle: string }[] = [
  { role: 'SUPER_ADMIN', title: 'Super Admin', subtitle: 'Dr. Rajesh Sharma' },
  { role: 'PAPER_SETTER', title: 'Paper Setter', subtitle: 'Prof. Ananya Sen' },
  { role: 'CENTRE_ADMIN', title: 'Centre Admin', subtitle: 'Suresh Kulkarni • C101' },
  { role: 'INVIGILATOR', title: 'Invigilator', subtitle: 'Rohit Verma • C101' },
];

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const personaRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, switchRole } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (personaRef.current && !personaRef.current.contains(event.target as Node)) {
        setIsPersonaOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  // Role-Aware Navigation Config with semantic academic & security icon choices
  const getNavItems = (role?: UserRole) => {
    switch (role) {
      case 'PAPER_SETTER':
        return [
          { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
          { label: 'My Papers', path: '/papers', icon: FileText },
          { label: 'Examinations', path: '/examinations', icon: GraduationCap },
          { label: 'Verify Integrity', path: '/verify', icon: CheckCircle2 },
          { label: 'Chain of Custody', path: '/custody', icon: GitCommit },
        ];
      case 'CENTRE_ADMIN':
        return [
          { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
          { label: 'Assigned Exams', path: '/examinations', icon: GraduationCap },
          { label: 'Assigned Papers', path: '/papers', icon: FileText },
          { label: 'Devices & Terminals', path: '/centres', icon: Building2 },
          { label: 'Time-Lock Release', path: '/timelock', icon: Lock },
          { label: 'Verify Paper', path: '/verify', icon: CheckCircle2 },
          { label: 'Incidents', path: '/incidents', icon: AlertTriangle },
        ];
      case 'INVIGILATOR':
        return [
          { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
          { label: 'Active Exams', path: '/examinations', icon: GraduationCap },
          { label: 'Paper Verification', path: '/verify', icon: CheckCircle2 },
          { label: 'Time-Lock Access', path: '/timelock', icon: Lock },
        ];
      case 'SUPER_ADMIN':
      default:
        return [
          { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
          { label: 'Examinations', path: '/examinations', icon: GraduationCap },
          { label: 'Question Papers', path: '/papers', icon: FileText },
          { label: 'Centres & Devices', path: '/centres', icon: Building2 },
          { label: 'Integrity Verification', path: '/verify', icon: CheckCircle2 },
          { label: 'Time-Lock Release', path: '/timelock', icon: Lock },
          { label: 'Chain of Custody', path: '/custody', icon: GitCommit },
          { label: 'Security Operations', path: '/security-ops', icon: ShieldAlert },
          { label: 'Incident Alerts', path: '/incidents', icon: AlertTriangle },
          { label: 'Blockchain Explorer', path: '/blockchain', icon: Boxes },
          { label: 'Auditor Portal', path: '/audit', icon: FileCheck },
        ];
    }
  };

  const navItems = getNavItems(user?.role);

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

  const confirmLogout = () => {
    setIsLogoutModalOpen(false);
    logout(true);
    navigate('/signin');
  };

  // Reusable Sidebar Content Component (Shared between Desktop & Mobile)
  const renderSidebarContent = (inMobile = false) => (
    <div className="flex flex-col h-full select-none">
      {/* Brand Header: 32px – 40px visual height, No WB-03 */}
      <div className="h-20 flex items-center justify-between px-5 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
        <Link to="/" className="flex items-center gap-2.5 overflow-hidden group">
          <VeriQLogo size="md" compact={isCollapsed && !inMobile} />
        </Link>
        {!inMobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
        {inMobile && (
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Primary Navigation List */}
      <nav className="flex-1 py-3 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => inMobile && setMobileMenuOpen(false)}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 relative ${
                isActive
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/70'
              }`}
              title={isCollapsed && !inMobile ? item.label : undefined}
            >
              {/* Active Indicator Accent Bar */}
              {isActive && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-blue-500"
                  transition={{ duration: 0.2 }}
                />
              )}
              {/* Icon with smooth gray-to-blue hover transition */}
              <Icon
                className={`w-4 h-4 shrink-0 transition-all duration-200 group-hover:scale-105 group-hover:-translate-y-0.5 ${
                  isActive
                    ? 'text-current'
                    : 'text-neutral-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                }`}
              />
              {(!isCollapsed || inMobile) && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* ────────────────────────────────────────── */}
      {/* SECTION 7 & 8: ROLE PERSONA AT SIDEBAR BOTTOM */}
      {/* ────────────────────────────────────────── */}
      <div className="relative border-t border-neutral-200/90 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 shrink-0" ref={personaRef}>
        {(!isCollapsed || inMobile) ? (
          <div className="p-3">
            <div className="flex items-center justify-between mb-1.5 px-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-semibold">
                Persona
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Active Workspace" />
            </div>

            {/* Persona Selector Trigger Button */}
            <button
              onClick={() => setIsPersonaOpen(!isPersonaOpen)}
              className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111113] hover:border-blue-300 dark:hover:border-blue-800 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-all duration-200 flex items-center justify-between text-left group shadow-2xs"
              aria-label="Switch Persona"
              aria-expanded={isPersonaOpen}
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
                  isPersonaOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Animated Persona Dropdown (Opens Upwards Smoothly) */}
            <AnimatePresence>
              {isPersonaOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: 6 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute bottom-full left-3 right-3 mb-2 p-1.5 rounded-2xl bg-white dark:bg-[#161619] border border-neutral-200 dark:border-neutral-800 shadow-elevated z-30 space-y-1"
                >
                  <div className="px-2.5 py-1.5 text-[10px] font-mono text-neutral-400 uppercase tracking-wider border-b border-neutral-100 dark:border-neutral-800/80">
                    Switch Workspace Role
                  </div>

                  {PERSONA_OPTIONS.map((p) => {
                    const isSelected = user?.role === p.role;
                    return (
                      <button
                        key={p.role}
                        onClick={async () => {
                          setIsPersonaOpen(false);
                          if (!isSelected) {
                            await switchRole(p.role);
                            navigate('/dashboard');
                            if (inMobile) setMobileMenuOpen(false);
                          }
                        }}
                        className={`w-full p-2 rounded-xl text-left transition-all duration-180 flex items-center justify-between group ${
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-semibold'
                            : 'text-neutral-700 dark:text-neutral-300 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 hover:translate-x-0.5'
                        }`}
                      >
                        <div className="min-w-0 flex-1 pr-2">
                          <div className={`text-xs ${isSelected ? 'text-blue-600 dark:text-blue-400 font-bold' : 'font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}>
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
        ) : (
          /* Collapsed Persona Icon Button */
          <div className="p-2 flex justify-center">
            <button
              onClick={() => setIsPersonaOpen(!isPersonaOpen)}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title={`Role: ${formatRole(user?.role)}`}
            >
              <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </button>
          </div>
        )}
      </div>

      {/* ────────────────────────────────────────── */}
      {/* SECTION 12–14: USER PROFILE & LOGOUT SECTION */}
      {/* ────────────────────────────────────────── */}
      <div className="p-3 border-t border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#111113] shrink-0" ref={userMenuRef}>
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2.5 min-w-0 flex-1 p-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800/70 transition-all duration-200 text-left group"
          >
            {/* Avatar with neutral gray background and soft blue hover tint */}
            <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-950/60 text-neutral-800 dark:text-neutral-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center justify-center text-xs font-bold shrink-0 transition-colors border border-neutral-200 dark:border-neutral-700/60">
              {user?.name?.charAt(0) || 'U'}
            </div>
            {(!isCollapsed || inMobile) && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-neutral-950 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {user?.name || 'Operator'}
                </p>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                  <span className="font-medium text-blue-600 dark:text-blue-400">{formatRole(user?.role)}</span>
                  {user?.centre_id ? ` • ${user.centre_id}` : ''}
                </p>
              </div>
            )}
            {(!isCollapsed || inMobile) && (
              <MoreVertical className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 shrink-0" />
            )}
          </button>

          {/* Explicit Quick Sign Out Action (Clear recognizable action with danger tint) */}
          {(!isCollapsed || inMobile) && (
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="p-2 text-neutral-400 hover:text-red-600 dark:hover:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-180 shrink-0 group border border-transparent hover:border-red-100 dark:hover:border-red-900/40"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>

        {/* User Account Popover Menu */}
        <AnimatePresence>
          {isUserMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 6 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-full left-3 right-3 mb-2 p-2 rounded-2xl bg-white dark:bg-[#161619] border border-neutral-200 dark:border-neutral-800 shadow-elevated z-30 space-y-1 text-xs"
            >
              <div className="p-2 border-b border-neutral-100 dark:border-neutral-800">
                <div className="font-bold text-neutral-950 dark:text-white truncate">{user?.name}</div>
                <div className="text-[11px] text-neutral-400 font-mono truncate">{user?.email}</div>
              </div>

              <Link
                to="/dashboard"
                onClick={() => setIsUserMenuOpen(false)}
                className="w-full px-2.5 py-1.5 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2 transition-colors"
              >
                <span>Workspace Overview</span>
              </Link>

              <Link
                to="/verify"
                onClick={() => setIsUserMenuOpen(false)}
                className="w-full px-2.5 py-1.5 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2 transition-colors"
              >
                <span>Paper Integrity Tool</span>
              </Link>

              <button
                onClick={() => {
                  setIsUserMenuOpen(false);
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
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-neutral-50/50 dark:bg-[#0A0A0B] text-neutral-900 dark:text-neutral-100 overflow-hidden transition-colors duration-200 print:h-auto print:overflow-visible print:bg-white print:text-black">
      {/* ⌘K Command Palette */}
      <CommandPalette />

      {/* ────────────────────────────────────────── */}
      {/* DESKTOP SIDEBAR */}
      {/* ────────────────────────────────────────── */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? '76px' : '260px' }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:flex flex-col bg-white dark:bg-[#111113] border-r border-neutral-200 dark:border-neutral-800 z-20 shadow-xs print:hidden h-full"
      >
        {renderSidebarContent(false)}
      </motion.aside>

      {/* ────────────────────────────────────────── */}
      {/* MOBILE DRAWER SIDEBAR */}
      {/* ────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-neutral-950/50 backdrop-blur-xs"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-[280px] max-w-[85vw] h-full bg-white dark:bg-[#111113] border-r border-neutral-200 dark:border-neutral-800 shadow-2xl"
            >
              {renderSidebarContent(true)}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ────────────────────────────────────────── */}
      {/* MAIN CONTENT AREA */}
      {/* ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden print:h-auto print:overflow-visible">
        {/* ────────────────────────────────────────── */}
        {/* SECTION 3–6: DASHBOARD HEADER REDESIGN */}
        {/* Substantial height: Desktop 72-80px, Mobile 64-68px */}
        {/* Left: Search (280-360px) | Right: Status, Theme, Simulate, User */}
        {/* Role Persona switch MUST NOT appear here. */}
        {/* ────────────────────────────────────────── */}
        <header className="h-16 md:h-20 border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-[#0A0A0B]/95 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 md:px-8 z-10 print:hidden shrink-0">
          {/* Header Left: Mobile Hamburger + Search Bar */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-xl text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white md:hidden"
              aria-label="Open Sidebar Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Redesigned Search Bar: 280px – 360px compact width */}
            <button
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

          {/* Header Right: System Status, Simulation Quick Triggers, Theme Toggle, User Indicator */}
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

            {/* Simulation Quick Triggers */}
            <div className="hidden xl:flex items-center gap-1.5 pl-2 border-l border-neutral-200 dark:border-neutral-800">
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider flex items-center gap-1 mr-1">
                <Zap className="w-3 h-3 text-neutral-400" />
                Simulate:
              </span>
              <button
                onClick={() => triggerSimulation('EARLY_ACCESS', 'Early Access Blocked')}
                disabled={isSimulating}
                className="px-2.5 py-1 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111113] text-neutral-700 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-700 hover:text-neutral-950 dark:hover:text-white transition-colors shadow-2xs active:scale-95 disabled:opacity-50"
              >
                Early Access
              </button>
              <button
                onClick={() => triggerSimulation('DOCUMENT_TAMPERING', 'Hash Mismatch')}
                disabled={isSimulating}
                className="px-2.5 py-1 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111113] text-neutral-700 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-700 hover:text-neutral-950 dark:hover:text-white transition-colors shadow-2xs active:scale-95 disabled:opacity-50"
              >
                Tamper Hash
              </button>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 md:p-2.5 rounded-xl text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white bg-white dark:bg-[#111113] border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors shadow-2xs"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {/* User Quick Info Avatar Badge in Header */}
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

        {/* Scrollable Dashboard Workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 custom-scrollbar print:overflow-visible print:p-0 print:m-0">
          <div className="max-w-7xl mx-auto space-y-6 print:max-w-none print:m-0 print:p-0">
            {children}
          </div>
        </main>
      </div>

      {/* ────────────────────────────────────────── */}
      {/* SECTION 15: LOGOUT CONFIRMATION MODAL */}
      {/* ────────────────────────────────────────── */}
      <AnimatePresence>
        {isLogoutModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setIsLogoutModalOpen(false)}
              className="absolute inset-0 bg-neutral-950/60 backdrop-blur-xs"
            />
            {/* Modal Dialog */}
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
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
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
