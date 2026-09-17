import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
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
  LogOut,
  Zap,
  Moon,
  Sun,
  Search,
} from 'lucide-react';
import { useAuth, UserRole } from '../../store/AuthContext';
import { useTheme } from '../../store/ThemeContext';
import { demoApi, examApi, paperApi, centreApi, securityApi, blockchainApi } from '../../services/apiClient';
import { CommandPalette } from '../ui/CommandPalette';
import { toast } from 'sonner';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, switchRole } = useAuth();

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
  const { theme, toggleTheme } = useTheme();

  // Role-Aware Navigation Config
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

  const handleLogout = () => {
    logout(true);
    navigate('/signin');
  };

  return (
    <div className="flex h-screen bg-neutral-50/50 dark:bg-[#0A0A0B] text-neutral-900 dark:text-neutral-100 overflow-hidden transition-colors duration-200">
      {/* ⌘K Command Palette */}
      <CommandPalette />

      {/* Minimal Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? '70px' : '250px' }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex flex-col bg-white dark:bg-[#111113] border-r border-neutral-200 dark:border-neutral-800 z-20 select-none shadow-xs"
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-200 dark:border-neutral-800">
          <Link to="/" className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-bold tracking-tight text-sm text-neutral-950 dark:text-white">
                  VeriQ
                </span>
                <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                  WB-03 Secure
                </span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Human-Readable Role Badge */}
        {!isCollapsed && (
          <div className="px-4 pt-4 pb-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {formatRole(user?.role)}
            </span>
          </div>
        )}

        {/* Navigation List */}
        <nav className="flex-1 py-2 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-current' : 'text-neutral-500'}`} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Account & Logout */}
        <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-xs font-semibold text-neutral-700 dark:text-neutral-300 shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-200 truncate">{user?.name || 'Operator'}</p>
                <p className="text-[10px] text-neutral-400 font-mono truncate">{user?.email}</p>
              </div>
            )}
            {!isCollapsed && (
              <button
                onClick={handleLogout}
                className="p-1.5 text-neutral-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-[#0A0A0B]/90 backdrop-blur-md flex items-center justify-between px-6 z-10">
          {/* Persona Switcher & ⌘K Search button */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors shadow-2xs"
            >
              <Search className="w-3.5 h-3.5 text-neutral-400" />
              <span className="hidden sm:inline">Search VeriQ...</span>
              <kbd className="hidden sm:inline font-mono text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-500">
                ⌘K
              </kbd>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400 font-medium hidden md:inline">Role Persona:</span>
              <select
                value={user?.role || 'SUPER_ADMIN'}
                onChange={async (e) => {
                  const newRole = e.target.value as UserRole;
                  await switchRole(newRole);
                  navigate('/dashboard');
                }}
                className="bg-white dark:bg-[#111113] border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white font-medium"
              >
                <option value="SUPER_ADMIN">Super Admin (Dr. Rajesh Sharma)</option>
                <option value="PAPER_SETTER">Paper Setter (Prof. Ananya Sen)</option>
                <option value="CENTRE_ADMIN">Centre Admin (Suresh Kulkarni - C101)</option>
                <option value="INVIGILATOR">Invigilator (Rohit Verma - C101)</option>
              </select>
            </div>
          </div>

          {/* Theme Toggle & Simulation Triggers */}
          <div className="flex items-center gap-3">
            {/* Simulation triggers with restrained colors */}
            <div className="hidden lg:flex items-center gap-1.5">
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider flex items-center gap-1 mr-1">
                <Zap className="w-3 h-3 text-neutral-500" />
                Simulate:
              </span>
              <button
                onClick={() => triggerSimulation('EARLY_ACCESS', 'Early Access Blocked')}
                disabled={isSimulating}
                className="px-2.5 py-1 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111113] text-neutral-700 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors shadow-2xs"
              >
                Early Access
              </button>
              <button
                onClick={() => triggerSimulation('DOCUMENT_TAMPERING', 'Hash Mismatch')}
                disabled={isSimulating}
                className="px-2.5 py-1 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111113] text-neutral-700 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors shadow-2xs"
              >
                Tamper Hash
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white bg-white dark:bg-[#111113] border border-neutral-200 dark:border-neutral-800 transition-colors shadow-2xs"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>
          </div>
        </header>

        {/* Scrollable Dashboard Workspace */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
