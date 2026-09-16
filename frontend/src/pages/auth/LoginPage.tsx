import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, UserCheck } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { toast } from 'sonner';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('authority@veriq.local');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Authenticated successfully');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error('Login failed: ' + (err.response?.data?.detail || 'Invalid credentials'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickRole = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setIsLoading(true);
    try {
      await login(demoEmail, 'password123');
      toast.success(`Logged in as ${demoEmail}`);
      navigate('/dashboard');
    } catch (err: any) {
      toast.error('Quick login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background cyber-grid">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Tagline */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center shadow-xl shadow-brand-500/25 mx-auto mb-3">
            <Shield className="w-7 h-7 text-slate-950 font-bold" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">VeriQ Command Gateway</h1>
          <p className="text-xs text-slate-400">
            Secure Every Question Paper. Verify Every Action.
          </p>
        </div>

        {/* Login Card */}
        <Card className="p-6 border-slate-800 space-y-5 bg-slate-900/90 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-brand-500 focus:ring-0"
                />
                Remember terminal
              </label>
              <span className="text-brand-400 hover:underline cursor-pointer">Forgot password?</span>
            </div>

            <Button type="submit" isLoading={isLoading} className="w-full shadow-lg shadow-brand-500/25">
              Sign In to Command Center <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          {/* Quick 1-Click Demo Logins for Hackathon Evaluators (Section 45) */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
              Quick 1-Click Demo Evaluation Roles
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickRole('authority@veriq.local')}
                className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium text-left flex items-center justify-between"
              >
                <span>Authority</span>
                <span className="text-[9px] text-brand-400 font-mono">Full</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickRole('admin@veriq.local')}
                className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium text-left flex items-center justify-between"
              >
                <span>Admin</span>
                <span className="text-[9px] text-purple-400 font-mono">Super</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickRole('setter@veriq.local')}
                className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium text-left flex items-center justify-between"
              >
                <span>Paper Setter</span>
                <span className="text-[9px] text-blue-400 font-mono">Author</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickRole('centre@veriq.local')}
                className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium text-left flex items-center justify-between"
              >
                <span>Centre Admin</span>
                <span className="text-[9px] text-amber-400 font-mono">C101</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickRole('invigilator@veriq.local')}
                className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium text-left flex items-center justify-between"
              >
                <span>Invigilator</span>
                <span className="text-[9px] text-emerald-400 font-mono">Terminal</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickRole('auditor@veriq.local')}
                className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium text-left flex items-center justify-between"
              >
                <span>Auditor</span>
                <span className="text-[9px] text-cyan-400 font-mono">Audit</span>
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
