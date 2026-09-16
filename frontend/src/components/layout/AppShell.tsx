import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  UserCheck,
  LogOut,
  Zap,
  Activity
} from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
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

  const navItems = [
    { label: 'Command Center', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Examinations', path: '/examinations', icon: GraduationCap },
    { label: 'Question Papers', path: '/papers', icon: FileText },
    { label: 'Integrity Verification', path: '/verify', icon: CheckCircle2 },
    { label: 'Time-Lock Release', path: '/release', icon: Lock },
    { label: 'Chain of Custody', path: '/custody', icon: GitCommit },
    { label: 'Blockchain Explorer', path: '/blockchain', icon: Boxes },
    { label: 'Centres & Devices', path: '/centres', icon: Building2 },
    { label: 'Security Operations', path: '/security', icon: ShieldAlert },
    { label: 'Incident Alerts', path: '/incidents', icon: AlertTriangle },
    { label: 'Auditor Portal', path: '/audit', icon: FileCheck },
  ];

  const triggerSimulation = async (eventType: string) => {
    setIsSimulating(true);
    try {
      const res = await demoApi.simulate(eventType);
      toast.error(res.data.toast_message, {
        description: res.data.description,
        duration: 6000,
      });
      // Navigate to incidents or refresh
      if (location.pathname === '/incidents' || location.pathname === '/dashboard') {
        window.dispatchEvent(new Event('veriQ_refresh_data'));
      }
    } catch (err: any) {
      toast.error('Simulation error: ' + (err.response?.data?.detail || err.message));
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="flex h-screen bg-background text-slate-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? '72px' : '260px' }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="relative flex flex-col bg-slate-950 border-r border-slate-800/80 z-20 select-none"
      >
        {/* Logo / Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80">
          <Link to="/" className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center shadow-lg shadow-brand-500/25 flex-shrink-0">
              <Shield className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-extrabold tracking-tight text-lg leading-none bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  VeriQ
                </span>
                <span className="text-[10px] tracking-wider text-brand-400 font-semibold uppercase mt-0.5">
                  Proof Ledger WB-03
                </span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-500/10 text-brand-400 border border-brand-500/30 shadow-sm shadow-brand-500/10'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-brand-400' : 'text-slate-400'}`} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Current User & Role Display */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-brand-400 flex-shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate">{user?.name || 'Authorized Operator'}</p>
                <p className="text-[10px] text-brand-400/90 font-mono truncate">{user?.role || 'EXAM_AUTHORITY'}</p>
              </div>
            )}
            {!isCollapsed && (
              <button
                onClick={logout}
                className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                title="Logout"
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
        <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-6 z-10">
          {/* Quick Demo Role Switcher */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">Active Role:</span>
            <select
              value={user?.email || 'authority@veriq.local'}
              onChange={(e) => switchRole(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-brand-500 font-medium"
            >
              <option value="authority@veriq.local">Authority (Vikramaditya Rao)</option>
              <option value="admin@veriq.local">Super Admin (Dr. Rajesh Sharma)</option>
              <option value="setter@veriq.local">Paper Setter (Prof. Ananya Sen)</option>
              <option value="centre@veriq.local">Centre Admin (Suresh Kulkarni - C101)</option>
              <option value="invigilator@veriq.local">Invigilator (Rohit Verma - C101)</option>
              <option value="auditor@veriq.local">Auditor (Pooja Hegde)</option>
            </select>
          </div>

          {/* Hackathon "Simulate Security Event" Quick Trigger Bar (Section 34) */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-amber-400/90 uppercase tracking-wider flex items-center gap-1 mr-1 hidden md:flex">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Simulate:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => triggerSimulation('EARLY_ACCESS')}
                disabled={isSimulating}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-colors"
                title="Attempt paper access before release time"
              >
                Early Access
              </button>
              <button
                onClick={() => triggerSimulation('DEVICE_MISMATCH')}
                disabled={isSimulating}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 transition-colors"
                title="Attempt access from unregistered terminal"
              >
                Device Mismatch
              </button>
              <button
                onClick={() => triggerSimulation('DOCUMENT_TAMPERING')}
                disabled={isSimulating}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-red-500/15 text-red-300 border border-red-500/40 hover:bg-red-500/25 transition-colors"
                title="Inject byte modification to trigger SHA-256 mismatch"
              >
                Tamper Hash
              </button>
              <button
                onClick={() => triggerSimulation('SUSPICIOUS_ACTIVITY')}
                disabled={isSimulating}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/30 hover:bg-purple-500/20 transition-colors hidden sm:block"
                title="Simulate rapid access burst"
              >
                AI Anomaly
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Page View */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#090d16] cyber-grid">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="max-w-7xl mx-auto space-y-6"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};
