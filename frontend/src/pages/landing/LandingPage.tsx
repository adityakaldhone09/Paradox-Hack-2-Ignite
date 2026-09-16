import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  FileCheck2,
  Clock,
  Building2,
  Cpu,
  Boxes,
  Activity,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Sun,
  Moon,
  ShieldAlert,
  ChevronRight,
  Layers,
  FileText,
  UserCheck,
  Eye,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../../store/ThemeContext';
import { useAuth } from '../../store/AuthContext';
import { Button } from '../../components/ui/Button';

export const LandingPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, getDashboardUrl } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cycle the sequential workflow node animation in Hero
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveWorkflowStep((prev) => (prev + 1) % 6);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  const scrollToAnchor = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', `#${targetId}`);
    }
  };

  const workflowSteps = [
    { label: 'Paper Created', icon: FileText, desc: 'Drafted in isolated air-gapped environment' },
    { label: 'AES-256 Encrypted', icon: Lock, desc: 'Ephemeral 256-bit envelope encryption' },
    { label: 'SHA-256 Hashed', icon: KeyRound, desc: 'Cryptographic digest anchored to ledger' },
    { label: 'Centre Authorized', icon: Building2, desc: 'Bound to approved IP subnets & devices' },
    { label: 'Time-Lock Released', icon: Clock, desc: 'Decryption unlocked strictly at exam window' },
    { label: 'Verified & Audited', icon: CheckCircle2, desc: 'Proof verification and non-repudiation' },
  ];

  const features = [
    {
      icon: KeyRound,
      title: 'Cryptographic Integrity',
      subtitle: 'SHA-256 Document Verification',
      description: 'Every question paper generates an immutable SHA-256 digest anchored into the blockchain block ledger before distribution, making undetectable tampering mathematically impossible.',
      badge: 'Zero Tampering',
    },
    {
      icon: Lock,
      title: 'Authenticated Encryption',
      subtitle: 'Off-Chain AES-256-GCM Storage',
      description: 'Sensitive exam binaries are never exposed on-chain. Files are stored off-chain using AES-256-GCM envelope encryption with per-paper initialization vectors and 128-bit authentication tags.',
      badge: 'FIPS-140 Aligned',
    },
    {
      icon: Clock,
      title: 'Time-Locked Policy Gates',
      subtitle: 'Synchronized Release Windows',
      description: 'Decryption keys are gated behind multi-factor policy checks. Even authorized administrators cannot extract question papers until the configured early-release window opens.',
      badge: 'Anti-Leak Gate',
    },
    {
      icon: Building2,
      title: 'Centre & Hardware Whitelisting',
      subtitle: 'Hardware Fingerprint Binding',
      description: 'Access requests require verified superintendent credentials, approved local network IP CIDRs, and cryptographic MAC/Hardware terminal fingerprints.',
      badge: 'Perimeter Defense',
    },
    {
      icon: Boxes,
      title: 'Blockchain Auditability',
      subtitle: 'Proof-of-Authority Event Ledger',
      description: 'Every lifecycle action—upload, digital approval signature, centre assignment, decryption request, and verification attempt—is permanently committed to chained blocks.',
      badge: 'Immutable Trail',
    },
    {
      icon: Activity,
      title: 'Active Security Monitoring',
      subtitle: 'AI Anomaly & Threat Detection',
      description: 'Real-time telemetry flags early access attempts, rapid burst requests, and rogue hardware terminals with instant one-click remote emergency paper revocation.',
      badge: '24/7 SecOps',
    },
  ];

  const howItWorksSteps = [
    { num: '01', title: 'Create', desc: 'Paper Setter drafts examination paper with encrypted metadata.' },
    { num: '02', title: 'Encrypt', desc: 'Backend derives ephemeral AES-256-GCM key and authenticates payload.' },
    { num: '03', title: 'Hash', desc: 'SHA-256 digest is generated and broadcast to the blockchain smart contract.' },
    { num: '04', title: 'Authorize', desc: 'Authorized examination centres and specific physical terminals are whitelisted.' },
    { num: '05', title: 'Release', desc: 'Time-lock countdown unlocks ephemeral memory decryption at scheduled time.' },
    { num: '06', title: 'Verify', desc: 'Superintendent and Invigilator verify local document hash against ledger.' },
    { num: '07', title: 'Audit', desc: 'Complete chain of custody is permanently queryable by inspectors.' },
  ];

  const roleWorkflows = [
    {
      role: 'Super Admin',
      icon: ShieldCheck,
      responsibilities: ['Examination management', 'Emergency paper revocation', 'Device authorization', 'Blockchain explorer & SecOps triage'],
      badgeColor: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    },
    {
      role: 'Paper Setter',
      icon: FileCheck2,
      responsibilities: ['Question paper creation', 'Off-chain encryption trigger', 'Version tracking', 'Personal chain of custody review'],
      badgeColor: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    },
    {
      role: 'Centre Admin',
      icon: Building2,
      responsibilities: ['Centre terminal management', 'Release countdown monitoring', 'Time-locked access request', 'Centre security incident log'],
      badgeColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    },
    {
      role: 'Invigilator',
      icon: UserCheck,
      responsibilities: ['Hall paper integrity check', 'Active exam time access', 'Real-time incident reporting', 'Authorized examination oversight'],
      badgeColor: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* 1. STICKY NAVBAR */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-xs border-b border-slate-200/80 dark:border-slate-800/80 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center shadow-md shadow-indigo-500/25">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                VeriQ
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 -mt-0.5">
                WB-03 Certified
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a
              href="#product"
              onClick={(e) => scrollToAnchor(e, 'product')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            >
              Product
            </a>
            <a
              href="#features"
              onClick={(e) => scrollToAnchor(e, 'features')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => scrollToAnchor(e, 'how-it-works')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            >
              How It Works
            </a>
            <a
              href="#security"
              onClick={(e) => scrollToAnchor(e, 'security')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            >
              Security
            </a>
            <a
              href="#custody"
              onClick={(e) => scrollToAnchor(e, 'custody')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            >
              Custody
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2.5">
                <Link to="/signin">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to={getDashboardUrl(user?.role)}>
                  <Button variant="primary" size="sm" className="shadow-sm">
                    <span>Open Console</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <Link to="/signin">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section id="product" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]"
            >
              Secure Every Question Paper.{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-500 bg-clip-text text-transparent">
                Verify Every Action.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto"
            >
              VeriQ protects examination papers from creation to release through authenticated AES-256-GCM encryption, time-locked policy gates, hardware terminal binding, and an immutable blockchain chain of custody.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5"
            >
              <Link to="/signin">
                <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-md shadow-indigo-500/20 group">
                  <span>Launch Command Center</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Explore Architecture
                </Button>
              </a>
            </motion.div>
          </div>

          {/* Sequential Animated Security Pipeline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-14 max-w-4xl mx-auto"
          >
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/50">
              <div className="flex items-center justify-between mb-4 px-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-500" />
                  Sequential Security Execution Pipeline
                </span>
                <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                  Step {activeWorkflowStep + 1} of 6
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {workflowSteps.map((step, idx) => {
                  const isActive = idx === activeWorkflowStep;
                  const isCompleted = idx < activeWorkflowStep;
                  const Icon = step.icon;

                  return (
                    <div
                      key={step.label}
                      className={`relative p-3 rounded-xl border transition-all duration-300 text-left ${
                        isActive
                          ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/50 shadow-sm ring-2 ring-indigo-500/20'
                          : isCompleted
                          ? 'border-emerald-500/40 bg-emerald-50/30 dark:bg-emerald-950/20'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 opacity-70'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                            isActive
                              ? 'bg-indigo-600 text-white'
                              : isCompleted
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">0{idx + 1}</span>
                      </div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                        {step.label}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-tight line-clamp-2">
                        {step.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* 3. HERO VISUAL: Central Question Paper Verification Graphic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-12 max-w-3xl mx-auto"
          >
            <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl shadow-indigo-500/5">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                {/* Paper Block */}
                <div className="w-full sm:w-1/2 p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-left">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FileCheck2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">DBMS-2026-SET-A.PDF</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      SECURED
                    </span>
                  </div>

                  <div className="space-y-2 text-[11px] text-slate-500 dark:text-slate-400">
                    <div className="flex justify-between">
                      <span>Encryption:</span>
                      <span className="font-mono font-medium text-slate-700 dark:text-slate-200">AES-256-GCM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Auth Tag:</span>
                      <span className="font-mono text-[10px] text-slate-700 dark:text-slate-200">8f9e...c120</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Plaintext SHA-256:</span>
                      <span className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">
                        e3b0c44298fc1c14...
                      </span>
                    </div>
                  </div>
                </div>

                {/* Animated Bridge */}
                <div className="flex flex-col items-center justify-center shrink-0">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 animate-pulse">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 mt-1">PoA Merkle Anchor</span>
                </div>

                {/* Blockchain Proof Block */}
                <div className="w-full sm:w-1/2 p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-left">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Boxes className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Block #14,892</span>
                    </div>
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
                    </span>
                  </div>

                  <div className="space-y-2 text-[11px] text-slate-500 dark:text-slate-400">
                    <div className="flex justify-between">
                      <span>Network:</span>
                      <span className="font-medium text-slate-700 dark:text-slate-200">VeriQ PoA Consortium</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tx Hash:</span>
                      <span className="font-mono text-[10px] text-slate-700 dark:text-slate-200">0x7df4...88a1</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ledger Match:</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">100% IDENTICAL</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. TRUST / INSTITUTIONAL HIGHLIGHTS */}
      <section className="py-10 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">AES-256-GCM</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Off-Chain Envelope Encryption</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Zero On-Chain</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">No Raw Question Papers Leaked</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">6 Policy Gates</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Role, Time, IP, Device, Exam & Status</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">&lt; 0.1s</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Sub-Second Proof Verification</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SIX CORE FEATURES SECTION */}
      <section id="features" className="py-24 bg-white dark:bg-slate-950 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Institutional Security Standards
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
              Defense-in-Depth Examination Architecture
            </h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              Engineered to eradicate premature leakage, unauthorized interception, physical document tampering, and insider compromise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="group relative p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-xl hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {feature.title}
                  </h3>
                  <div className="text-xs font-medium text-indigo-600/80 dark:text-indigo-400/80 mb-2">
                    {feature.subtitle}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. HOW VERIQ WORKS (7 STAGES) */}
      <section id="how-it-works" className="py-24 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              End-to-End Examination Lifecycle
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
              How VeriQ Works
            </h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              From academic question paper creation to examination room access, every critical transition is strictly verified.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
            {howItWorksSteps.map((step, idx) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.06 }}
                className="relative p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-2xs hover:border-indigo-400 transition-colors"
              >
                <div>
                  <div className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                    {step.num}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. LAYERED SECURITY ARCHITECTURE */}
      <section id="security" className="py-24 bg-white dark:bg-slate-950 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Security Architecture
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
              Multi-Layered Protection Model
            </h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              VeriQ separates storage, policy evaluation, and proof verification into isolated tiers.
            </p>
          </div>

          <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-center">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Tier 1: Encryption</h4>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  AES-256-GCM ciphertext with authenticated 16-byte tag. Raw files never touch database or ledger.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Tier 2: Policy Gate</h4>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  6-factor evaluation: Role, centre allocation, hardware device fingerprint, IP subnet, and time-lock.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Tier 3: Integrity</h4>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Independent SHA-256 digest comparison against immutable blockchain receipts.
                </p>
              </div>
            </div>

            {/* Bottom Foundation Tier */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
              <div className="flex items-center justify-center gap-2 mb-1.5">
                <Boxes className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Foundational Ledger Tier: Proof-of-Authority Blockchain Audit
                </h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                Chained blocks with Merkle roots anchor every state transition, authorization event, and access attempt to prevent repudiation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CUSTODY & TAMPER DETECTION SHOWCASE */}
      <section id="custody" className="py-24 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="text-center max-w-xl mx-auto mb-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900 mb-3">
                <Boxes className="w-3.5 h-3.5" />
                Blockchain Chain of Custody & Tamper Defense
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Cryptographic Custody & Instant Tamper Detection
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Every lifecycle transition is immutably anchored on the ledger. Any bit-level alteration in question text or answer keys immediately produces a mismatched SHA-256 digest.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Original Document */}
              <div className="p-5 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Original Master Document</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 mb-3">
                  Anchored to Block #12,940 at Paper Approval
                </div>
                <div className="font-mono text-xs p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-900/60 text-slate-800 dark:text-slate-200 break-all">
                  a89d21c984b23190bf8e390291df410c558b...
                </div>
              </div>

              {/* Tampered Document */}
              <div className="p-5 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-rose-800 dark:text-rose-300">Modified / Intercepted File</span>
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 mb-3">
                  1 byte altered in question content
                </div>
                <div className="font-mono text-xs p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-400 break-all">
                  d71f40aa93e410bc30219ff883199e4ca201...
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-rose-100/70 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-rose-900 dark:text-rose-200">
                    Document Integrity Failure Detected
                  </div>
                  <div className="text-[11px] text-rose-700 dark:text-rose-300">
                    Decryption blocked • On-chain incident logged • Security Operations triage notified
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link to="/custody">
                  <Button variant="outline" size="sm" className="bg-white dark:bg-slate-900">
                    View Custody Chain
                  </Button>
                </Link>
                <Link to="/verify">
                  <Button variant="danger" size="sm">
                    Test Live Verifier
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FOUR INSTITUTIONAL ROLES */}
      <section className="py-24 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Role-Based Operational Segregation
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
              Strict 4-Role Architecture
            </h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              Every participant operates within explicit institutional boundaries with no privilege escalation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {roleWorkflows.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.role}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border mb-2 ${item.badgeColor}`}>
                    {item.role}
                  </div>
                  <ul className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                    {item.responsibilities.map((resp) => (
                      <li key={resp} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. FINAL CTA SECTION */}
      <section className="py-20 bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to secure your examination workflow?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Eliminate premature paper leaks, enforce mathematical non-repudiation, and verify every critical examination action on-chain.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signin">
              <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-lg shadow-indigo-500/30">
                Enter Command Center
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-white border-white/20 hover:bg-white/10">
                Controlled Onboarding
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 11. FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-base font-bold text-white tracking-tight">VeriQ</span>
                <span className="block text-[10px] text-slate-500">
                  Secure Examination Paper Distribution & Chain of Custody (WB-03)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6 text-slate-400">
              <a
                href="#product"
                onClick={(e) => scrollToAnchor(e, 'product')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Product
              </a>
              <a
                href="#security"
                onClick={(e) => scrollToAnchor(e, 'security')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Security
              </a>
              <a
                href="#features"
                onClick={(e) => scrollToAnchor(e, 'features')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Features
              </a>
              <Link to="/signin" className="hover:text-white transition-colors">
                Sign In
              </Link>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
            <div>© {new Date().getFullYear()} VeriQ Platform. All rights reserved. Problem Statement WB-03.</div>
            <div className="flex items-center gap-4">
              <span>AES-256-GCM Cryptographic Standard</span>
              <span>•</span>
              <span>SHA-256 Proofs</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
