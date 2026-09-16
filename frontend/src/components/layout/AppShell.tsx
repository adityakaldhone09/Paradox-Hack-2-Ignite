import React, { useState } from 'react';
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
  Laptop
} from 'lucide-react';
import { useAuth, UserRole } from '../../store/AuthContext';
import { useTheme } from '../../store/ThemeContext';
import { demoApi } from '../../services/apiClient';
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
  const { theme, toggleTheme } = useTheme();

  // Role-Aware Navigation Config
  const getNavItems = (role?: UserRole) => {
    switch (role) {
      case 'PAPER_SETTER':
        return [
          { label: 'Paper Workspace', path: '/dashboard', icon: LayoutDashboard },
          { label: 'My Papers', path: '/papers', icon: FileText },
          { label: 'Examinations', path: '/examinations', icon: GraduationCap },
          { label: 'Integrity Check', path: '/verify', icon: CheckCircle2 },
          { label: 'Chain of Custody', path: '/custody', icon: GitCommit },
        ];
      case 'CENTRE_ADMIN':
        return [
          { label: 'Centre Console', path: '/dashboard', icon: LayoutDashboard },
          { label: 'Assigned Exams', path: '/examinations', icon: GraduationCap },
          { label: 'Assigned Papers', path: '/papers', icon: FileText },
          { label: 'Time-Lock Release', path: '/timelock', icon: Lock },
          { label: 'Devices & Terminals', path: '/centres', icon: Laptop },
          { label: 'Verify Paper', path: '/verify', icon: CheckCircle2 },
          { label: 'Centre Incidents', path: '/incidents', icon: AlertTriangle },
        ];
      case 'INVIGILATOR':
        return [
          { label: 'Proctor Console', path: '/dashboard', icon: LayoutDashboard },
          { label: 'Active Examinations', path: '/examinations', icon: GraduationCap },
          { label: 'Paper Verification', path: '/verify', icon: CheckCircle2 },
          { label: 'Time-Lock Access', path: '/timelock', icon: Lock },
        ];
      case 'SUPER_ADMIN':
      default:
        return [
          { label: 'Command Center', path: '/dashboard', icon: LayoutDashboard },
          { label: 'Examinations', path: '/examinations', icon: GraduationCap },
          { label: 'Question Papers', path: '/papers', icon: FileText },
          { label: 'Integrity Verification', path: '/verify', icon: CheckCircle2 },
          { label: 'Time-Lock Release', path: '/timelock', icon: Lock },
          { label: 'Chain of Custody', path: '/custody', icon: GitCommit },
          { label: 'Blockchain Explorer', path: '/blockchain', icon: Boxes },
          { label: 'Centres & Devices', path: '/centres', icon: Building2 },
          { label: 'Security Operations', path: '/security-ops', icon: ShieldAlert },
          { label: 'Incident Alerts', path: '/incidents', icon: AlertTriangle },
          { label: 'Auditor Portal', path: '/audit', icon: FileCheck },
        ];
    }
  };

  const navItems = getNavItems(user?.role);

  const triggerSimulation = async (eventType: string, label: string) => {
    setIsSimulating(true);
    try {
      const res = await demoApi.simulateEvent(eventType);
      toast.error(`🚨 Security Event Triggered: ${label}`, {
        description: res.data?.description || `Recorded in Block #${res.data?.block_number}`,
        duration: 6000,
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
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans transition-colors duration-200">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? '72px' : '260px' }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="relative flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-20 select-none shadow-xs"
      >
        {/* Logo / Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
          <Link to="/" className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center shadow-md shadow-indigo-500/25 shrink-0">
              <Shield className="w-5 h-5 text-white font-bold" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-extrabold tracking-tight text-lg leading-none text-slate-900 dark:text-white">
                  VeriQ
                </span>
                <span className="text-[10px] tracking-wider text-indigo-600 dark:text-indigo-400 font-semibold uppercase mt-0.5">
                  WB-03 Certified
                </span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Role Badge Indicator */}
        {!isCollapsed && (
          <div className="px-4 pt-3 pb-1">
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80">
              {user?.role?.replace('_', ' ') || 'AUTHENTICATED'}
            </span>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 py-3 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shadow-2xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Current User & Logout */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-xs font-bold text-indigo-700 dark:text-indigo-300 shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{user?.name || 'Operator'}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">{user?.email}</p>
              </div>
            )}
            {!isCollapsed && (
              <button
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
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
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex items-center justify-between px-6 z-10">
          {/* Quick 4-Role Switcher */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">Active Persona:</span>
            <select
              value={user?.role || 'SUPER_ADMIN'}
              onChange={(e) => switchRole(e.target.value as UserRole)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
            >
              <option value="SUPER_ADMIN">Super Admin (Dr. Rajesh Sharma)</option>
              <option value="PAPER_SETTER">Paper Setter (Prof. Ananya Sen)</option>
              <option value="CENTRE_ADMIN">Centre Admin (Suresh Kulkarni - C101)</option>
              <option value="INVIGILATOR">Invigilator (Rohit Verma - C101)</option>
            </select>
          </div>

          {/* Theme Switcher & Simulation Quick Buttons */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Hackathon Simulation Quick Triggers */}
            <div className="flex items-center gap-1.5 hidden md:flex">
              <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1 mr-1">
                <Zap className="w-3.5 h-3.5" />
                Stress Test:
              </span>
              <button
                onClick={() => triggerSimulation('EARLY_ACCESS', 'Early Access Blocked')}
                disabled={isSimulating}
                className="px-2 py-1 text-xs font-medium rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors"
              >
                Early Access
              </button>
              <button
                onClick={() => triggerSimulation('DOCUMENT_TAMPERING', 'Hash Mismatch')}
                disabled={isSimulating}
                className="px-2 py-1 text-xs font-medium rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors"
              >
                Tamper Hash
              </button>
              <button
                onClick={() => triggerSimulation('DEVICE_MISMATCH', 'Rogue Hardware')}
                disabled={isSimulating}
                className="px-2 py-1 text-xs font-medium rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/60 transition-colors"
              >
                Rogue Device
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Page View */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-50/60 dark:bg-slate-950">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="max-w-7xl mx-auto space-y-6"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};
