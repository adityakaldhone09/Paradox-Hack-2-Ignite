import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  KeyRound,
  Building2,
  UserCheck,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useAuth, UserRole } from '../../store/AuthContext';
import { useTheme } from '../../store/ThemeContext';
import { Button } from '../../components/ui/Button';
import { Sun, Moon, ArrowLeft } from 'lucide-react';

export const SignInPage: React.FC = () => {
  const { login, getDashboardUrl } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const [email, setEmail] = useState('admin@veriq.local');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const demoRoles = [
    {
      role: 'SUPER_ADMIN' as UserRole,
      title: 'Super Admin',
      email: 'admin@veriq.local',
      icon: ShieldCheck,
      desc: 'System governance, exams & blockchain records',
    },
    {
      role: 'PAPER_SETTER' as UserRole,
      title: 'Paper Setter',
      email: 'setter@veriq.local',
      icon: FileCheck2,
      desc: 'Draft, encrypt & verify question papers',
    },
    {
      role: 'CENTRE_ADMIN' as UserRole,
      title: 'Centre Admin',
      email: 'centre@veriq.local',
      icon: Building2,
      desc: 'Centre operations, devices & release locks',
    },
    {
      role: 'INVIGILATOR' as UserRole,
      title: 'Invigilator',
      email: 'invigilator@veriq.local',
      icon: UserCheck,
      desc: 'Active exam verification & incident reporting',
    },
  ];

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const user = await login(email, password);
      const target = redirectUrl || getDashboardUrl(user.role);
      navigate(target, { replace: true });
    } catch (err: any) {
      setError(err.message || 'The email or password is incorrect.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectDemoRole = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('password123');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-200">
      {/* Top Controls: Back to Home & Theme Toggle */}
      <div className="fixed top-4 inset-x-4 max-w-5xl mx-auto flex items-center justify-between z-10 pointer-events-none">
        <Link
          to="/"
          className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 backdrop-blur-sm transition-colors shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="pointer-events-auto p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            VeriQ
          </span>
        </Link>

        <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Secure Examination Command Portal
        </h2>
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
          Institutional Question Paper Lifecycle & Chain-of-Custody System
        </p>
      </div>

      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-xl px-4 sm:px-0">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-10 shadow-xl shadow-slate-200/50 dark:shadow-black/40 rounded-2xl border border-slate-200/80 dark:border-slate-800"
        >
          {/* Quick Persona Fill Banner */}
          <div className="mb-6 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Quick-Select 4-Role Persona (Demo Mode)
              </span>
              <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                Auto-fills credentials
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {demoRoles.map((item) => {
                const isSelected = email === item.email;
                const Icon = item.icon;
                return (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => selectDemoRole(item.email)}
                    className={`flex flex-col items-center text-center p-2 rounded-lg border transition-all text-xs ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold shadow-xs ring-1 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                    <span className="leading-tight text-[11px] truncate w-full">{item.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-5 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/60 flex items-start gap-2.5 text-red-700 dark:text-red-400 text-xs"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Authorized Email Address
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@veriq.local"
                  className="block w-full pl-9 pr-3 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 text-slate-900 dark:text-white placeholder-slate-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Master Security Password
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="block w-full pl-9 pr-10 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 text-slate-900 dark:text-white placeholder-slate-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 dark:bg-slate-800"
                />
                <span>Remember this terminal</span>
              </label>

              <Link
                to="/forgot-password"
                className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full justify-center mt-2 group"
              isLoading={isLoading}
            >
              <span>Authenticate Securely</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </form>

          {/* Animated Security Flow Preview */}
          <div className="mt-7 pt-5 border-t border-slate-100 dark:border-slate-800">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-center mb-3">
              Cryptographic Safeguard Pipeline
            </div>

            <div className="flex items-center justify-between px-2 text-[11px] text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1">
                <FileCheck2 className="w-3.5 h-3.5 text-indigo-500" />
                <span>Paper</span>
              </div>
              <span className="text-slate-300 dark:text-slate-600">→</span>
              <div className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-500" />
                <span>AES-256</span>
              </div>
              <span className="text-slate-300 dark:text-slate-600">→</span>
              <div className="flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                <span>SHA-256</span>
              </div>
              <span className="text-slate-300 dark:text-slate-600">→</span>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                <span>Authorized</span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Need an institutional credential?{' '}
            <Link to="/signup" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              Request Controlled Onboarding
            </Link>
          </div>
        </motion.div>

        {/* Institutional Trust Footnote */}
        <div className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500 flex items-center justify-center gap-4">
          <span className="inline-flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-500" /> AES-256-GCM Envelope
          </span>
          <span>•</span>
          <span className="inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-blue-500" /> On-Chain Nonce Proofs
          </span>
          <span>•</span>
          <span>FIPS-140 Aligned</span>
        </div>
      </div>
    </div>
  );
};
