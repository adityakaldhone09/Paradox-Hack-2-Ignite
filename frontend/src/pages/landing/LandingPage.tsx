import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Lock,
  KeyRound,
  FileCheck2,
  Clock,
  Building2,
  Boxes,
  CheckCircle2,
  ArrowRight,
  Sun,
  Moon,
  AlertOctagon,
  FileText,
  UserCheck,
  Layers,
  ChevronRight,
  Laptop,
  Check,
  Menu,
  X,
  ShieldAlert,
  GitCommit,
} from 'lucide-react';
import { useTheme } from '../../store/ThemeContext';
import { useAuth } from '../../store/AuthContext';
import { Button } from '../../components/ui/Button';

export const LandingPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, getDashboardUrl } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hero calm continuous animation loop (0 = document, 1 = lock, 2 = hash, 3 = blockchain, 4 = verified)
  const [heroLoopStep, setHeroLoopStep] = useState(0);

  // Sticky story active stage
  const [activeStoryStage, setActiveStoryStage] = useState(0);

  // Tamper detection simulation state
  const [isTampered, setIsTampered] = useState(false);

  // 4-Role interactive experience active tab
  const [activeRole, setActiveRole] = useState<'super_admin' | 'paper_setter' | 'centre_admin' | 'invigilator'>('super_admin');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calm, slow-paced hero animation loop (every 3.2 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroLoopStep((prev) => (prev + 1) % 5);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const heroStages = [
    { title: 'Question Paper Created', desc: 'Paper author drafts question items inside an isolated session', icon: FileText },
    { title: 'AES-256 Envelope Encrypted', desc: 'Symmetric encryption seals the payload before transmission', icon: Lock },
    { title: 'SHA-256 Digest Generated', desc: 'Cryptographic hash creates an immutable document fingerprint', icon: KeyRound },
    { title: 'Anchored to Ledger', desc: 'Block record is committed with timestamp and authority signatures', icon: Boxes },
    { title: 'Integrity Verified', desc: 'Download checksum matches blockchain proof with zero variance', icon: CheckCircle2 },
  ];

  const storyStages = [
    {
      num: '01',
      name: 'Create',
      title: 'Isolated Authoring',
      lead: 'Paper setters construct question papers inside a controlled workspace.',
      detail: 'Metadata headers, question hierarchies, and document hashes are established before any content leaves the authoring terminal.',
      tag: 'Session Isolated',
    },
    {
      num: '02',
      name: 'Protect',
      title: 'Authenticated Encryption',
      lead: 'Sensitive examination content remains protected off-chain.',
      detail: 'The question paper binary is sealed using authenticated AES-256-GCM. Decryption keys are enclosed in cryptographic capsules.',
      tag: 'AES-256-GCM',
    },
    {
      num: '03',
      name: 'Authorize',
      title: 'Triple-Bind Policy',
      lead: 'Only authorized combinations of centre, terminal, and proctor pass.',
      detail: 'Access requires an authorized centre ID, an authenticated hardware terminal fingerprint, and a verified superintendent credential.',
      tag: 'Hardware Whitelisted',
    },
    {
      num: '04',
      name: 'Release',
      title: 'Time-Lock Gates',
      lead: 'Decryption keys remain mathematically inaccessible until exam time.',
      detail: 'Pre-scheduled synchronized clock policies prevent premature decryption. Keys cannot be extracted before the release window opens.',
      tag: 'Time-Lock Synchronized',
    },
    {
      num: '05',
      name: 'Verify',
      title: 'Dual-Hash Tamper Check',
      lead: 'Compute SHA-256 digests on download and evaluate against ledger proof.',
      detail: 'The examination terminal calculates a fresh SHA-256 digest locally and compares it with the blockchain block record. Any byte modification halts access.',
      tag: 'Dual SHA-256 Proof',
    },
    {
      num: '06',
      name: 'Audit',
      title: 'Immutable Ledger Trail',
      lead: 'Every single state change, download, and verification is anchored.',
      detail: 'Non-repudiation is preserved through cryptographic event chaining. Independent auditors inspect the sequence without accessing confidential papers.',
      tag: 'Ledger Anchored',
    },
  ];

  const howItWorksSteps = [
    { step: '01', title: 'Create', desc: 'Structured drafting with schema validation' },
    { step: '02', title: 'Encrypt', desc: 'AES-256-GCM authenticated payload sealing' },
    { step: '03', title: 'Hash', desc: 'SHA-256 mathematical digest generation' },
    { step: '04', title: 'Authorize', desc: 'Centre, device, and superintendent verification' },
    { step: '05', title: 'Release', desc: 'Time-locked synchronized key issuance' },
    { step: '06', title: 'Verify', desc: 'Local digest validation against ledger anchor' },
    { step: '07', title: 'Audit', desc: 'Permanent tamper-evident blockchain log' },
  ];

  const rolesContent = {
    super_admin: {
      title: 'Super Admin',
      subtitle: 'Institutional Examination Authority',
      whatTheyDo: 'Oversee institutional exam schedules, configure time-lock policy gates, authorize physical centres, and respond to anomalies.',
      whatTheySee: 'System security posture, active examination schedules, centre whitelists, and live blockchain transaction telemetry.',
      capabilities: [
        'Global exam schedule orchestration',
        'Time-lock policy overrides and release controls',
        'Examination centre and terminal authorization',
        'Real-time incident review and emergency revocation',
        'Full blockchain ledger block exploration',
      ],
    },
    paper_setter: {
      title: 'Paper Setter',
      subtitle: 'Subject Specialist & Exam Author',
      whatTheyDo: 'Draft examination papers in isolated authoring sessions, apply envelope encryption, and submit for institutional review.',
      whatTheySee: 'Personal drafts, encrypted paper catalog, approval progression, and cryptographic digest verification.',
      capabilities: [
        'Isolated paper authoring environment',
        'Authenticated AES-256 encryption pipeline',
        'Dual-approval workflow submission',
        'Draft version tracking and history',
        'Zero exposure to centre decryption keys',
      ],
    },
    centre_admin: {
      title: 'Centre Admin',
      subtitle: 'Examination Centre Superintendent',
      whatTheyDo: 'Prepare physical examination facilities, register approved terminals, and receive time-synchronized question paper downloads.',
      whatTheySee: 'Assigned examination roster, release countdown timers, terminal status, and local security events.',
      capabilities: [
        'Assigned examination schedule viewing',
        'Physical terminal fingerprint registration',
        'Time-synchronized paper download trigger',
        'Local printer and decryption monitor',
        'Immediate security anomaly logging',
      ],
    },
    invigilator: {
      title: 'Invigilator',
      subtitle: 'Examination Hall Proctor',
      whatTheyDo: 'Verify question paper integrity inside the examination hall, monitor candidate sessions, and dispatch alerts.',
      whatTheySee: 'Today’s examination hall schedule, assigned paper checksum status, and emergency incident dispatch form.',
      capabilities: [
        'Examination session verification',
        'Paper delivery checksum confirmation',
        'Instant room incident escalation',
        'Focused single-task console',
        'Zero administrative access to master keys',
      ],
    },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0B] text-neutral-900 dark:text-neutral-100 selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-neutral-950 transition-colors duration-200">
      {/* 1. Sticky Navigation Bar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          isScrolled
            ? 'glass-panel-nav py-3.5 shadow-xs'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#111111] dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center transition-transform group-hover:scale-105">
              <Shield className="w-4 h-4" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-lg tracking-tight text-neutral-950 dark:text-white">
                VeriQ
              </span>
              <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                WB-03
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-neutral-600 dark:text-neutral-400">
            <a href="#how-it-works" className="hover:text-neutral-950 dark:hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#security" className="hover:text-neutral-950 dark:hover:text-white transition-colors">
              Security Architecture
            </a>
            <a href="#tamper-detection" className="hover:text-neutral-950 dark:hover:text-white transition-colors">
              Tamper Detection
            </a>
            <a href="#roles" className="hover:text-neutral-950 dark:hover:text-white transition-colors">
              Roles
            </a>
          </nav>

          {/* Action CTAs & Theme Toggle */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {isAuthenticated ? (
              <Link to={getDashboardUrl()}>
                <Button variant="primary" size="sm">
                  Workspace <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/signin">
                  <Button variant="ghost" size="sm">
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

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
              aria-label="Open Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Down Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-[#0A0A0B]/95 backdrop-blur-xl px-6 py-5 space-y-4"
            >
              <div className="flex flex-col space-y-3 text-sm font-medium">
                <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-neutral-600 dark:text-neutral-400">How It Works</a>
                <a href="#security" onClick={() => setMobileMenuOpen(false)} className="text-neutral-600 dark:text-neutral-400">Security Architecture</a>
                <a href="#tamper-detection" onClick={() => setMobileMenuOpen(false)} className="text-neutral-600 dark:text-neutral-400">Tamper Detection</a>
                <a href="#roles" onClick={() => setMobileMenuOpen(false)} className="text-neutral-600 dark:text-neutral-400">Four-Role Experience</a>
              </div>
              <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex flex-col gap-2">
                <Link to="/signin" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" className="w-full">Sign In</Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full">Get Started</Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 2. Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center px-6 pt-28 pb-16 overflow-hidden bg-tech-grid text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Subtitle tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-[#111113]/80 backdrop-blur-sm text-xs font-medium text-neutral-600 dark:text-neutral-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Problem Statement WB-03 • Examination Paper Chain of Custody</span>
          </div>

          {/* Primary Editorial Headline */}
          <h1 className="text-[clamp(2.75rem,7vw,5.5rem)] font-bold tracking-tight text-neutral-950 dark:text-white leading-[1.05]">
            Secure every<br className="hidden sm:inline" /> question paper.{' '}
            <span className="text-neutral-400 dark:text-neutral-500 font-normal block sm:inline">
              Verify every action.
            </span>
          </h1>

          {/* Supporting Statement */}
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto font-normal leading-relaxed text-balance">
            VeriQ protects examination papers with cryptographic security, controlled access, and blockchain-backed chain of custody.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a href="#how-it-works">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                Explore VeriQ
              </Button>
            </a>
            <Link to="/signin">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* 3. Hero Visual: Calm Continuous Lifecycle Animation Loop */}
        <div className="mt-14 w-full max-w-2xl mx-auto">
          <div className="rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#111113] p-6 shadow-xs text-left">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-neutral-400">ARTIFACT // CSE-301.pdf</span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                ACTIVE LIFECYCLE
              </span>
            </div>

            {/* Stepper Visual Nodes */}
            <div className="grid grid-cols-5 gap-2 pt-5">
              {heroStages.map((stg, idx) => {
                const Icon = stg.icon;
                const isCurrent = heroLoopStep === idx;
                const isPast = heroLoopStep > idx;
                return (
                  <div
                    key={stg.title}
                    onClick={() => setHeroLoopStep(idx)}
                    className={`cursor-pointer p-2.5 rounded-xl border text-center transition-all ${
                      isCurrent
                        ? 'border-neutral-900 dark:border-white bg-[#F7F7F5] dark:bg-neutral-800 shadow-xs'
                        : isPast
                        ? 'border-neutral-200 dark:border-neutral-800 opacity-90'
                        : 'border-transparent opacity-40 hover:opacity-70'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mx-auto mb-1 ${isCurrent ? 'text-neutral-950 dark:text-white' : 'text-neutral-400'}`} />
                    <span className="text-[10px] font-medium block truncate">{stg.title.split(' ')[0]}</span>
                  </div>
                );
              })}
            </div>

            {/* Active stage summary */}
            <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-neutral-950 dark:text-white">{heroStages[heroLoopStep].title}</p>
                <p className="text-[11px] text-neutral-500">{heroStages[heroLoopStep].desc}</p>
              </div>
              <span className="text-[10px] font-mono text-neutral-400 shrink-0 ml-4">
                STEP 0{heroLoopStep + 1} OF 05
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Minimal Trust Strip */}
      <section className="border-y border-neutral-200/80 dark:border-neutral-800/80 bg-[#F7F7F5]/60 dark:bg-[#0E0E10]/40 py-5 px-6">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-neutral-600 dark:text-neutral-400">
          <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-neutral-900 dark:text-white" /> Encrypted</span>
          <span className="hidden sm:inline text-neutral-300 dark:text-neutral-700">•</span>
          <span className="flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5 text-neutral-900 dark:text-white" /> Tamper-evident</span>
          <span className="hidden sm:inline text-neutral-300 dark:text-neutral-700">•</span>
          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-neutral-900 dark:text-white" /> Time-controlled</span>
          <span className="hidden sm:inline text-neutral-300 dark:text-neutral-700">•</span>
          <span className="flex items-center gap-1.5"><UserCheck className="w-3.5 h-3.5 text-neutral-900 dark:text-white" /> Role-based</span>
          <span className="hidden sm:inline text-neutral-300 dark:text-neutral-700">•</span>
          <span className="flex items-center gap-1.5"><Boxes className="w-3.5 h-3.5 text-neutral-900 dark:text-white" /> Auditable</span>
        </div>
      </section>

      {/* 5. Why VeriQ Section */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center space-y-4">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 dark:text-white">
          Security shouldn't depend on trust alone.
        </h2>
        <p className="text-base text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          VeriQ creates a verifiable chain of custody around every critical examination-paper action, substituting blind institutional trust with verifiable mathematical integrity.
        </p>
      </section>

      {/* 6. How It Works (7 Steps) */}
      <section id="how-it-works" className="py-20 px-6 max-w-6xl mx-auto text-left">
        <div className="max-w-xl mb-12 space-y-1.5">
          <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">Workflow Sequence</span>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 dark:text-white">
            Seven steps of custodial protection
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {howItWorksSteps.map((s) => (
            <div
              key={s.step}
              className="p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#111113] shadow-xs space-y-2"
            >
              <span className="text-xs font-mono font-bold text-neutral-400">{s.step}</span>
              <h4 className="text-sm font-bold text-neutral-950 dark:text-white">{s.title}</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Sticky Story Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column Stages */}
          <div className="lg:col-span-5 space-y-3">
            {storyStages.map((stg, idx) => {
              const isActive = activeStoryStage === idx;
              return (
                <div
                  key={stg.num}
                  onClick={() => setActiveStoryStage(idx)}
                  className={`cursor-pointer p-4 sm:p-5 rounded-2xl border transition-all text-left ${
                    isActive
                      ? 'border-neutral-900 dark:border-white bg-[#F7F7F5] dark:bg-neutral-800/80 shadow-xs'
                      : 'border-transparent hover:border-neutral-200 dark:hover:border-neutral-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono font-bold text-neutral-400">{stg.num} {stg.name.toUpperCase()}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-200/60 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300">
                      {stg.tag}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-neutral-950 dark:text-white">{stg.title}</h4>
                  {isActive && (
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1.5 leading-relaxed">
                      {stg.detail}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column Sticky Display */}
          <div className="lg:col-span-7 sticky top-28">
            <div className="rounded-3xl border border-neutral-200/90 dark:border-neutral-800 bg-[#F7F7F5]/50 dark:bg-[#111113] p-7 sm:p-8 min-h-[380px] flex flex-col justify-between shadow-xs">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800 text-xs">
                  <span className="font-mono text-neutral-400">STAGE {storyStages[activeStoryStage].num} / 06</span>
                  <span className="font-mono font-medium text-neutral-800 dark:text-neutral-200">{storyStages[activeStoryStage].name}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-neutral-950 dark:text-white leading-snug">
                  {storyStages[activeStoryStage].lead}
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {storyStages[activeStoryStage].detail}
                </p>
              </div>

              <div className="mt-8 pt-5 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs font-mono text-neutral-500">
                <span>SECURITY LEVEL: ENFORCED</span>
                <span>SHA-256 PARALLEL DIGEST</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Security Architecture Section */}
      <section id="security" className="py-24 px-6 border-y border-neutral-200/80 dark:border-neutral-800/80 bg-[#FAFAFA] dark:bg-[#0C0C0E]">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">Multi-Layer Topology</span>
            <h3 className="text-2xl sm:text-3xl font-bold text-neutral-950 dark:text-white">
              Security Architecture
            </h3>
            <p className="text-xs text-neutral-500 max-w-lg mx-auto">
              Three synchronized protection layers converging on a tamper-evident audit ledger.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111113] shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-white mb-3">
                <Lock className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-neutral-950 dark:text-white">Encryption</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                AES-256-GCM authenticated payload encapsulation. Sensitive binaries never touch public network memory or blockchains unencrypted.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111113] shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-white mb-3">
                <Building2 className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-neutral-950 dark:text-white">Access Control</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Whitelisted hardware terminal MAC addresses, centre subnets, and superintendent credentials required simultaneously.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111113] shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-white mb-3">
                <KeyRound className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-neutral-950 dark:text-white">Integrity</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Cryptographic SHA-256 digests computed at authoring and verified byte-by-byte at physical download before decryption.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111113] text-xs flex items-center justify-between max-w-md mx-auto">
            <div className="flex items-center gap-2">
              <Boxes className="w-4 h-4 text-neutral-500" />
              <span className="font-bold text-neutral-900 dark:text-white">Blockchain Audit Ledger</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">IMMUTABLE PROOF</span>
          </div>
        </div>
      </section>

      {/* 9. Blockchain Section */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center space-y-4">
        <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">Verifiable Record</span>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 dark:text-white">
          A record you can verify.
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed">
          Critical examination-paper events are recorded in a tamper-evident ledger while sensitive content remains securely off-chain.
        </p>
      </section>

      {/* 10. Tamper Detection Interactive Section */}
      <section id="tamper-detection" className="py-20 px-6 border-y border-neutral-200/80 dark:border-neutral-800/80 bg-[#F7F7F5]/50 dark:bg-[#0E0E10]/40">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">Interactive Simulation</span>
            <h3 className="text-2xl font-bold text-neutral-950 dark:text-white">
              Mathematical Tamper Detection
            </h3>
            <p className="text-xs text-neutral-500 max-w-md mx-auto">
              Test how VeriQ reacts when an examination paper is altered by even a single byte.
            </p>
          </div>

          {/* Interactive Toggle */}
          <div className="inline-flex items-center p-1 rounded-xl bg-neutral-200/80 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700">
            <button
              onClick={() => setIsTampered(false)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                !isTampered
                  ? 'bg-white dark:bg-[#111113] text-neutral-950 dark:text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
              }`}
            >
              Intact Original Document
            </button>
            <button
              onClick={() => setIsTampered(true)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isTampered
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
              }`}
            >
              Simulate 1-Byte Tamper
            </button>
          </div>

          {/* Simulation Output Card */}
          <div className="rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#111113] p-6 shadow-xs text-left space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-neutral-400 text-[11px]">HASH COMPARISON ENGINE</span>
              <span className={`font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                isTampered
                  ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-800'
                  : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
              }`}>
                {isTampered ? 'HASH MISMATCH' : 'MATCH CONFIRMED'}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-800">
                <span className="text-neutral-400 block text-[10px]">REGISTERED BLOCKCHAIN DIGEST:</span>
                <span className="text-neutral-900 dark:text-neutral-100 truncate block mt-0.5">
                  A89D214F8B92A170E3C1D9B3E7F41A862B904C51E06D2891F7A3B4E60128F8A1
                </span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-800">
                <span className="text-neutral-400 block text-[10px]">DOWNLOADED ARTIFACT DIGEST:</span>
                <span className={`truncate block mt-0.5 ${
                  isTampered
                    ? 'text-red-600 dark:text-red-400 line-through font-bold'
                    : 'text-neutral-900 dark:text-neutral-100'
                }`}>
                  {isTampered
                    ? 'D71F409C3270E3C1D9B3E7F41A862B904C51E06D2891F7A3B4E601289C32'
                    : 'A89D214F8B92A170E3C1D9B3E7F41A862B904C51E06D2891F7A3B4E60128F8A1'}
                </span>
              </div>
            </div>

            <div className={`p-3.5 rounded-xl border flex items-center gap-3 text-xs ${
              isTampered
                ? 'border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/20 text-red-800 dark:text-red-300'
                : 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300'
            }`}>
              {isTampered ? (
                <AlertOctagon className="w-5 h-5 shrink-0 text-red-600 dark:text-red-400" />
              ) : (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              )}
              <div>
                <p className="font-bold">{isTampered ? 'INTEGRITY ALERT DISPATCHED' : 'ZERO TAMPERING DETECTED'}</p>
                <p className="text-[11px] opacity-90">
                  {isTampered
                    ? 'Terminal decryption key revoked. Incident recorded in blockchain block.'
                    : 'Cryptographic proof confirms paper is identical to author master copy.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Role Experience Section */}
      <section id="roles" className="py-24 px-6 max-w-4xl mx-auto text-left">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">Role Segregation</span>
          <h3 className="text-2xl sm:text-3xl font-bold text-neutral-950 dark:text-white">
            Designed for institutional clarity
          </h3>
          <p className="text-xs text-neutral-500">
            Four distinct operational roles without overlapping keys or permissions.
          </p>
        </div>

        {/* Role Tab Selector */}
        <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
          {(
            [
              { id: 'super_admin', label: 'Super Admin' },
              { id: 'paper_setter', label: 'Paper Setter' },
              { id: 'centre_admin', label: 'Centre Admin' },
              { id: 'invigilator', label: 'Invigilator' },
            ] as const
          ).map((r) => (
            <button
              key={r.id}
              onClick={() => setActiveRole(r.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                activeRole === r.id
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Role Details Card */}
        <div className="p-6 sm:p-8 rounded-3xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#111113] shadow-xs space-y-6">
          <div className="pb-4 border-b border-neutral-100 dark:border-neutral-800">
            <h4 className="text-lg font-bold text-neutral-950 dark:text-white">
              {rolesContent[activeRole].title}
            </h4>
            <p className="text-xs text-neutral-500 font-mono mt-0.5">
              {rolesContent[activeRole].subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-2">
              <span className="font-semibold text-neutral-900 dark:text-white block">What They Do</span>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {rolesContent[activeRole].whatTheyDo}
              </p>
            </div>
            <div className="space-y-2">
              <span className="font-semibold text-neutral-900 dark:text-white block">What They See</span>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {rolesContent[activeRole].whatTheySee}
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block">
              Key Capabilities:
            </span>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-700 dark:text-neutral-300">
              {rolesContent[activeRole].capabilities.map((cap, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{cap}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 12. Final Call to Action */}
      <section className="py-28 px-6 max-w-4xl mx-auto text-center space-y-6">
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-950 dark:text-white">
          Secure your examination workflow.
        </h2>
        <p className="text-base text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
          Protect the paper. Control access. Verify every critical action.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link to="/signin">
            <Button variant="primary" size="lg">
              Enter VeriQ
            </Button>
          </Link>
          <Link to="/signup">
            <Button variant="secondary" size="lg">
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      {/* 13. Minimal Footer */}
      <footer className="border-t border-neutral-200/80 dark:border-neutral-800/80 py-10 px-6 bg-white dark:bg-[#0A0A0B]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-950 dark:text-white">VeriQ</span>
            <span>• Secure examination paper distribution</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#how-it-works" className="hover:text-neutral-950 dark:hover:text-white transition-colors">How It Works</a>
            <a href="#security" className="hover:text-neutral-950 dark:hover:text-white transition-colors">Security</a>
            <Link to="/signin" className="hover:text-neutral-950 dark:hover:text-white transition-colors">Sign In</Link>
            <span>© {new Date().getFullYear()} VeriQ</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
