import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  Mail,
  User,
  Lock,
  ArrowRight,
  Sun,
  Moon,
  ArrowLeft,
  AlertCircle,
  Check,
} from 'lucide-react';
import { useAuth, UserRole } from '../../store/AuthContext';
import { useTheme } from '../../store/ThemeContext';
import { Button } from '../../components/ui/Button';
import { VeriQLogo } from '../../components/ui/VeriQLogo';

export const SignUpPage: React.FC = () => {
  const { signup, getDashboardUrl } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('PAPER_SETTER');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const roles = [
    {
      role: 'SUPER_ADMIN' as UserRole,
      title: 'Super Admin',
      desc: 'Institutional examination controller',
    },
    {
      role: 'PAPER_SETTER' as UserRole,
      title: 'Paper Setter',
      desc: 'Academic author & paper encrypter',
    },
    {
      role: 'CENTRE_ADMIN' as UserRole,
      title: 'Centre Admin',
      desc: 'Physical centre superintendent & terminals',
    },
    {
      role: 'INVIGILATOR' as UserRole,
      title: 'Invigilator',
      desc: 'Hall proctor & verification officer',
    },
  ];

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const user = await signup({
        name,
        email,
        password,
        role: selectedRole,
      });
      navigate(getDashboardUrl(user.role), { replace: true });
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0B] text-neutral-900 dark:text-neutral-100 flex flex-col justify-center py-12 px-6 sm:px-8 transition-colors duration-200 bg-tech-grid">
      {/* Top Header Bar */}
      <div className="fixed top-6 inset-x-6 max-w-5xl mx-auto flex items-center justify-between z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white bg-white/80 dark:bg-[#111113]/80 border border-neutral-200 dark:border-neutral-800 backdrop-blur-md transition-all shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white bg-white/80 dark:bg-[#111113]/80 border border-neutral-200 dark:border-neutral-800 backdrop-blur-md transition-all shadow-xs"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>
      </div>

      <div className="max-w-xl w-full mx-auto space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center justify-center mb-2">
            <VeriQLogo size="lg" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">
            Request access to VeriQ
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Join the secure cryptographic distribution network.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#111113] p-8 shadow-card text-left">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 flex items-start gap-2.5 text-red-700 dark:text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-5">
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Operational Role
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {roles.map((r) => {
                  const isSelected = selectedRole === r.role;
                  return (
                    <div
                      key={r.role}
                      onClick={() => setSelectedRole(r.role)}
                      className={`cursor-pointer p-3 rounded-2xl border transition-all text-left ${
                        isSelected
                          ? 'border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-800/80 shadow-xs'
                          : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-neutral-900 dark:text-white">
                          {r.title}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-neutral-950 dark:text-white" />}
                      </div>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-snug">
                        {r.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Prof. A. Sharma"
                    className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18181B] text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 text-sm py-2.5 pl-10 pr-3.5 focus:border-neutral-900 dark:focus:border-neutral-400 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Institutional Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="officer@examination.edu"
                    className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18181B] text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 text-sm py-2.5 pl-10 pr-3.5 focus:border-neutral-900 dark:focus:border-neutral-400 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Master Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Minimum 8 characters"
                    className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18181B] text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 text-sm py-2.5 pl-10 pr-3.5 focus:border-neutral-900 dark:focus:border-neutral-400 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-3"
              isLoading={isLoading}
            >
              Request Credentials <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-neutral-100 dark:border-neutral-800 text-center">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Already have an authorized credential?{' '}
              <Link
                to="/signin"
                className="font-medium text-neutral-900 dark:text-white hover:underline ml-1"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
