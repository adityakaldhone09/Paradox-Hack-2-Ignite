import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Sun,
  Moon,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useAuth, UserRole } from '../../store/AuthContext';
import { useTheme } from '../../store/ThemeContext';
import { Button } from '../../components/ui/Button';
import { VeriQLogo } from '../../components/ui/VeriQLogo';

export const SignInPage: React.FC = () => {
  const { login, getDashboardUrl } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const [email, setEmail] = useState('admin@veriq.local');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [authStage, setAuthStage] = useState<'idle' | 'authenticating' | 'securing' | 'success'>('idle');

  const demoRoles = [
    { role: 'SUPER_ADMIN' as UserRole, title: 'Super Admin', email: 'admin@veriq.local' },
    { role: 'PAPER_SETTER' as UserRole, title: 'Paper Setter', email: 'setter@veriq.local' },
    { role: 'CENTRE_ADMIN' as UserRole, title: 'Centre Admin', email: 'centre@veriq.local' },
    { role: 'INVIGILATOR' as UserRole, title: 'Invigilator', email: 'invigilator@veriq.local' },
  ];

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Invalid email address format.';
    }
    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setAuthStage('authenticating');

    try {
      const user = await login(email, password);
      setAuthStage('securing');
      setTimeout(() => {
        setAuthStage('success');
        setTimeout(() => {
          const target = redirectUrl || getDashboardUrl(user.role);
          navigate(target, { replace: true });
        }, 350);
      }, 350);
    } catch (err: any) {
      setServerError('Unable to sign in. Check your email and password and try again.');
      setAuthStage('idle');
      setIsLoading(false);
    }
  };

  const selectDemoRole = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('password123');
    setServerError(null);
    setFieldErrors({});
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0B] text-neutral-900 dark:text-neutral-100 flex flex-col justify-center py-8 px-4 sm:px-6 transition-colors duration-200 bg-tech-grid">
      {/* Top Controls: Home & Theme Toggle */}
      <div className="fixed top-5 inset-x-5 max-w-4xl mx-auto flex items-center justify-between z-10 pointer-events-none">
        <Link
          to="/"
          className="pointer-events-auto group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white bg-white/90 dark:bg-[#111113]/90 border border-neutral-200 dark:border-neutral-800 hover:bg-[#F7F7F5] dark:hover:bg-neutral-800 backdrop-blur-md transition-all shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Home</span>
        </Link>
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="pointer-events-auto p-2 rounded-xl text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white bg-white/90 dark:bg-[#111113]/90 border border-neutral-200 dark:border-neutral-800 backdrop-blur-md hover:bg-[#F7F7F5] dark:hover:bg-neutral-800 transition-all shadow-xs"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>
      </div>

      <div className="w-full max-w-[440px] mx-auto space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center justify-center mb-1">
            <VeriQLogo size="lg" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">
            Welcome back.
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Secure access to your examination workspace.
          </p>
        </div>

        {/* Auth Form Card */}
        <div className="rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#111113] p-6 sm:p-7 shadow-xs text-left space-y-5">
          {/* Interactive Role Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300">
              Select workspace role
            </label>
            <div className="grid grid-cols-2 gap-2">
              {demoRoles.map((item) => {
                const isSelected = email === item.email;
                return (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => selectDemoRole(item.email)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl border text-xs font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white ${
                      isSelected
                        ? 'border-neutral-900 dark:border-white bg-[#F7F7F5] dark:bg-neutral-800 text-neutral-950 dark:text-white font-semibold shadow-xs ring-1 ring-neutral-900/10 dark:ring-white/20'
                        : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18181B] text-neutral-600 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
                    }`}
                  >
                    <span>{item.title}</span>
                    {isSelected ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-white shrink-0 ml-1" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full border border-neutral-300 dark:border-neutral-600 shrink-0 ml-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Server Error Alert */}
          {serverError && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 flex items-start gap-2.5 text-red-700 dark:text-red-400 text-xs"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </motion.div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4" noValidate>
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-neutral-800 dark:text-neutral-200">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: undefined });
                  }}
                  placeholder="name@veriq.local"
                  className={`w-full h-11 rounded-xl border bg-white dark:bg-[#18181B] text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 text-sm pl-10 pr-3.5 transition-all outline-none ${
                    fieldErrors.email
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 focus:border-neutral-900 dark:focus:border-white focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-white/10'
                  }`}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{fieldErrors.email}</span>
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-neutral-800 dark:text-neutral-200">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: undefined });
                  }}
                  placeholder="••••••••••••"
                  className={`w-full h-11 rounded-xl border bg-white dark:bg-[#18181B] text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 text-sm pl-10 pr-10 transition-all outline-none ${
                    fieldErrors.password
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 focus:border-neutral-900 dark:focus:border-white focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-white/10'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{fieldErrors.password}</span>
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-1">
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full h-11 text-sm font-medium"
                isLoading={isLoading}
              >
                {authStage === 'authenticating'
                  ? 'Signing in...'
                  : authStage === 'securing'
                  ? 'Checking access...'
                  : authStage === 'success'
                  ? 'Access Granted'
                  : 'Sign In'}
              </Button>
            </div>
          </form>

          {/* Institutional Access link */}
          <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 text-center">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Need access for your institution?{' '}
              <Link
                to="/signup"
                className="font-medium text-neutral-900 dark:text-white hover:underline ml-1"
              >
                Request access
              </Link>
            </p>
          </div>
        </div>

        {/* Security Statement Footer */}
        <div className="text-center text-[11px] text-neutral-500 dark:text-neutral-400">
          Protected workspace • Encrypted session
        </div>
      </div>
    </div>
  );
};
