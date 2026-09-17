import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { authApi } from '../../services/apiClient';
import { Button } from '../../components/ui/Button';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await authApi.forgotPassword({ email });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Unable to process reset request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0B] text-neutral-900 dark:text-neutral-100 flex flex-col justify-center py-12 px-6 sm:px-8 transition-colors duration-200 bg-tech-grid">
      <div className="max-w-md w-full mx-auto space-y-8">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 mb-2 shadow-xs">
            <Shield className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">
            Reset access credentials
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Enter your institutional email to receive an authorization token
          </p>
        </div>

        <div className="rounded-3xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#111113] p-8 shadow-card text-left">
          {submitted ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                Authorization Dispatched
              </h2>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                If an authorized operator profile exists for <strong className="text-neutral-900 dark:text-white">{email}</strong>, a cryptographically signed reset token has been dispatched.
              </p>
              <div className="pt-2">
                <Link to="/signin">
                  <Button variant="secondary" size="md" className="w-full">
                    Return to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 flex items-start gap-2.5 text-red-700 dark:text-red-400 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

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

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2"
                isLoading={isLoading}
              >
                Send Reset Link
              </Button>

              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 text-center">
                <Link
                  to="/signin"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
