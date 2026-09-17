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
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useTheme } from '../../store/ThemeContext';
import { useAuth } from '../../store/AuthContext';
import { Button } from '../../components/ui/Button';
import { VeriQLogo } from '../../components/ui/VeriQLogo';

export const LandingPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, getDashboardUrl } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Active Lifecycle 7-stage interactive loop & selection
  const [activeLifecycleStage, setActiveLifecycleStage] = useState(4); // Default to release/verify

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

  // Calm, continuous lifecycle animation loop irrespective of cursor hovering
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveLifecycleStage((prev) => (prev + 1) % 7);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  // Section 28 & 29: 7 Interactive Lifecycle Stages with Restrained Semantic Colors
  const lifecycleStages = [
    {
      id: 'create',
      num: '01',
      title: 'Create',
      label: 'Session Isolation',
      desc: 'Paper setters construct question papers in isolated cryptographic authoring sessions.',
      status: 'Payload Schema Validated',
      icon: FileText,
      color: 'blue',
      badge: 'OFF-CHAIN DRAFT',
    },
    {
      id: 'encrypt',
      num: '02',
      title: 'Encrypt',
      label: 'Envelope Sealing',
      desc: 'Symmetric AES-256-GCM authenticated encryption locks the binary before transmission.',
      status: 'Payload Cipher Encapsulated',
      icon: Lock,
      color: 'blue',
      badge: 'AES-256-GCM',
    },
    {
      id: 'hash',
      num: '03',
      title: 'Hash',
      label: 'Digest Fingerprint',
      desc: 'Cryptographic SHA-256 mathematical hash digest computed to seal tamper-proof identity.',
      status: 'SHA-256 Computed: a89d214f...',
      icon: KeyRound,
      color: 'blue',
      badge: 'SHA-256 PARALLEL',
    },
    {
      id: 'authorize',
      num: '04',
      title: 'Authorize',
      label: 'Triple-Bind Policy',
      desc: 'Mandates concurrent verification of Centre ID, whitelisted hardware MAC, and proctor credential.',
      status: 'DEV-C101-01 Hardware Authenticated',
      icon: Building2,
      color: 'green',
      badge: 'HARDWARE BOUND',
    },
    {
      id: 'release',
      num: '05',
      title: 'Release',
      label: 'Time-Lock Gate',
      desc: 'Decryption keys remain mathematically inaccessible until the atomic scheduled exam window.',
      status: 'Atomic NTP Time Gate Active',
      icon: Clock,
      color: 'amber',
      badge: 'TIME-SYNCHRONIZED',
    },
    {
      id: 'verify',
      num: '06',
      title: 'Verify',
      label: 'Integrity Match',
      desc: 'Download digest evaluated against immutable blockchain proof. Zero byte drift allowed.',
      status: 'Checksum Proof Confirmed',
      icon: CheckCircle2,
      color: 'green',
      badge: 'ZERO TAMPER DRIFT',
    },
    {
      id: 'audit',
      num: '07',
      title: 'Audit',
      label: 'Ledger Commit',
      desc: 'Permanent cryptographic non-repudiation event block sealed for regulatory inspection.',
      status: 'Ledger Block Anchor #1042',
      icon: Boxes,
      color: 'blue',
      badge: 'IMMUTABLE ANCHOR',
    },
  ];

  // Section 30: Seven Steps of Custodial Protection
  const howItWorksSteps = [
    { step: '01', title: 'Create', desc: 'Structured authoring inside an isolated session with cryptographic schema validation and author key binding.', icon: FileText },
    { step: '02', title: 'Encrypt', desc: 'AES-256-GCM authenticated payload sealing. Master plaintext is discarded before network transmission.', icon: Lock },
    { step: '03', title: 'Hash', desc: 'Dual-hash SHA-256 mathematical digest generation to create an immutable cryptographic fingerprint.', icon: KeyRound },
    { step: '04', title: 'Authorize', desc: 'Triple-bind authentication: physical centre ID, registered terminal fingerprint, and superintendent identity.', icon: Building2 },
    { step: '05', title: 'Release', desc: 'Time-locked cryptographic key distribution. Decryption keys cannot be requested before exam countdown ends.', icon: Clock },
    { step: '06', title: 'Verify', desc: 'Local SHA-256 comparison against on-chain block proof. Any altered bit triggers instant terminal shutdown.', icon: CheckCircle2 },
    { step: '07', title: 'Audit', desc: 'Permanent tamper-evident blockchain event log providing independent, cryptographically non-repudiable audit trails.', icon: Boxes },
  ];

  const storyStages = [
    {
      num: '01',
      name: 'Create',
      title: 'Isolated Authoring Environment',
      lead: 'Paper setters construct question papers inside an isolated cryptographic workspace.',
      detail: 'Metadata headers, question hierarchies, and document hashes are established before any content leaves the authoring terminal.',
      tag: 'Session Isolated',
    },
    {
      num: '02',
      name: 'Protect',
      title: 'Authenticated Payload Encryption',
      lead: 'Sensitive examination content remains completely protected off-chain.',
      detail: 'The question paper binary is sealed using authenticated AES-256-GCM. Decryption keys are enclosed in cryptographic capsules.',
      tag: 'AES-256-GCM',
    },
    {
      num: '03',
      name: 'Authorize',
      title: 'Triple-Bind Policy Enforcement',
      lead: 'Only authorized combinations of centre, hardware terminal, and proctor pass.',
      detail: 'Access requires an authorized centre ID, an authenticated hardware terminal fingerprint, and a verified superintendent credential.',
      tag: 'Hardware Whitelisted',
    },
    {
      num: '04',
      name: 'Release',
      title: 'Synchronized Time-Lock Gates',
      lead: 'Decryption keys remain mathematically inaccessible until exam start time.',
      detail: 'Pre-scheduled synchronized clock policies prevent premature decryption. Keys cannot be extracted before the release window opens.',
      tag: 'Time-Lock Synchronized',
    },
    {
      num: '05',
      name: 'Verify',
      title: 'Dual-Hash Tamper Detection',
      lead: 'Compute SHA-256 digests on download and evaluate against ledger proof.',
      detail: 'The examination terminal calculates a fresh SHA-256 digest locally and compares it with the blockchain block record. Any byte modification halts access.',
      tag: 'Dual SHA-256 Proof',
    },
    {
      num: '06',
      name: 'Audit',
      title: 'Immutable Ledger Chain of Custody',
      lead: 'Every single state change, download, and verification is permanently anchored.',
      detail: 'Non-repudiation is preserved through cryptographic event chaining. Independent auditors inspect the sequence without accessing confidential papers.',
      tag: 'Ledger Anchored',
    },
  ];

  const rolesContent = {
    super_admin: {
      title: 'Super Admin',
      subtitle: 'Institutional Examination Authority',
      whatTheyDo: 'Oversee institutional exam schedules, configure time-lock policy gates, authorize physical centres, and monitor network security telemetry.',
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
    <div className="min-h-screen bg-white dark:bg-[#0A0A0B] text-neutral-900 dark:text-neutral-100 selection:bg-blue-600 selection:text-white transition-colors duration-200">
      {/* ────────────────────────────────────────── */}
      {/* 1. STICKY NAVIGATION BAR */}
      {/* ────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          isScrolled ? 'glass-panel-nav py-3.5 shadow-xs' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo with academic emblem, no WB-03 */}
          <Link to="/" className="flex items-center group">
            <VeriQLogo size="md" />
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
              Role Segregation
            </a>
            <Link to="/verify" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Verify Paper
            </Link>
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
                <a href="#roles" onClick={() => setMobileMenuOpen(false)} className="text-neutral-600 dark:text-neutral-400">Role Segregation</a>
                <Link to="/verify" onClick={() => setMobileMenuOpen(false)} className="text-blue-600 dark:text-blue-400 font-semibold">Verify Integrity</Link>
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

      {/* ────────────────────────────────────────── */}
      {/* 2. HERO SECTION */}
      {/* Increased typographic scale: clamp(3.5rem, 7vw, 7rem) */}
      {/* Supporting text: 18px–21px desktop, max-width 680–760px */}
      {/* ────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex flex-col justify-center items-center px-6 pt-32 pb-20 overflow-hidden bg-tech-grid text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Subtle Institutional Security Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/80 text-neutral-600 dark:text-neutral-300 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Decentralized Chain of Custody System</span>
          </div>

          {/* Primary Editorial Headline: clamp(3.5rem, 7vw, 7rem) */}
          <h1 className="text-[clamp(3.5rem,7vw,7rem)] font-bold tracking-tight text-neutral-950 dark:text-white leading-[1.04]">
            Secure every<br className="hidden sm:inline" /> question paper.{' '}
            <span className="text-neutral-400 dark:text-neutral-500 font-normal block sm:inline">
              Verify every action.
            </span>
          </h1>

          {/* Supporting Statement: 18px – 21px desktop, max-width 720px */}
          <p className="text-lg sm:text-xl md:text-[20px] text-neutral-600 dark:text-neutral-300 max-w-[720px] mx-auto font-normal leading-relaxed text-balance">
            VeriQ eliminates institutional paper leaks using isolated encryption, hardware triple-binding, time-lock gates, and immutable blockchain proofs.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-3">
            <a href="#how-it-works">
              <Button variant="primary" size="lg" className="w-full sm:w-auto px-7 py-3 text-base">
                Explore How It Works
              </Button>
            </a>
            <Link to="/signin">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto px-7 py-3 text-base">
                Sign In to Workspace
              </Button>
            </Link>
          </div>
        </div>

        {/* ────────────────────────────────────────── */}
        {/* 3. ACTIVE LIFECYCLE COMPONENT (HERO-LEVEL VISUAL) */}
        {/* Interactive 7 stages: Create, Encrypt, Hash, Authorize, Release, Verify, Audit */}
        {/* Hover reactions, animated connector, restrained semantic colors */}
        {/* ────────────────────────────────────────── */}
        <div className="mt-16 w-full max-w-4xl mx-auto px-2 sm:px-4">
          <div className="rounded-3xl border border-neutral-200/90 dark:border-neutral-800 bg-white/95 dark:bg-[#111113]/95 p-6 sm:p-8 shadow-elevated text-left backdrop-blur-md">
            {/* Header with real-time status */}
            <div className="flex items-center justify-between pb-5 border-b border-neutral-100 dark:border-neutral-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-neutral-400 dark:text-neutral-500 text-xs font-semibold">
                  ARTIFACT // CSE-301-DATABASE-MANAGEMENT.pdf.enc
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
                  ACTIVE CUSTODY LIFECYCLE
                </span>
              </div>
            </div>

            {/* Stepper Visual Nodes (7 Steps) */}
            <div className="relative pt-4 pb-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 relative z-10">
                {lifecycleStages.map((stg, idx) => {
                  const Icon = stg.icon;
                  const isCurrent = activeLifecycleStage === idx;
                  const isPast = activeLifecycleStage > idx;
                  return (
                    <div
                      key={stg.id}
                      onClick={() => setActiveLifecycleStage(idx)}
                      className={`cursor-pointer p-3 rounded-2xl border text-center transition-all duration-300 ${
                        isCurrent
                          ? 'border-blue-600 dark:border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 shadow-sm scale-102 ring-1 ring-blue-500/20'
                          : isPast
                          ? 'border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/30 opacity-90'
                          : 'border-neutral-100 dark:border-neutral-800/40 bg-neutral-50/20 dark:bg-neutral-900/10 opacity-50'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 mx-auto mb-2 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          isCurrent
                            ? 'bg-blue-600 text-white shadow-xs scale-105'
                            : isPast
                            ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono text-neutral-400 block">{stg.num}</span>
                      <span className={`text-xs font-bold block truncate mt-0.5 ${isCurrent ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-900 dark:text-neutral-100'}`}>
                        {stg.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active Stage Detailed Feedback Box */}
            <div className="mt-6 pt-5 border-t border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-neutral-950 dark:text-white text-sm">
                    {lifecycleStages[activeLifecycleStage].num}. {lifecycleStages[activeLifecycleStage].title} — {lifecycleStages[activeLifecycleStage].label}
                  </span>
                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                    {lifecycleStages[activeLifecycleStage].badge}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-xl">
                  {lifecycleStages[activeLifecycleStage].desc}
                </p>
              </div>

              <div className="shrink-0 p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800 font-mono text-[11px] text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span>{lifecycleStages[activeLifecycleStage].status}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────── */}
      {/* 4. SECURITY STATEMENT SECTION */}
      {/* ────────────────────────────────────────── */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center space-y-4 border-t border-neutral-200/80 dark:border-neutral-800/80">
        <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">Institutional Mandate</span>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-950 dark:text-white leading-tight">
          Security shouldn't depend on trust alone.
        </h2>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          VeriQ creates a verifiable chain of custody around every critical examination-paper action, substituting blind institutional trust with verifiable mathematical integrity.
        </p>
      </section>

      {/* ────────────────────────────────────────── */}
      {/* 5. HOW IT WORKS (SEVEN STEPS OF CUSTODIAL PROTECTION) */}
      {/* Interactive cards: lift, subtle scale, accent border, icon color */}
      {/* ────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6 max-w-7xl mx-auto text-left border-t border-neutral-200/80 dark:border-neutral-800/80">
        <div className="max-w-2xl mb-14 space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-blue-600 dark:text-blue-400 font-semibold">
            Architectural Sequence
          </span>
          <h3 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-950 dark:text-white">
            Seven steps of custodial protection
          </h3>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xl">
            From isolated drafting to final on-site verification, each transition requires cryptographically validated proof.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {howItWorksSteps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="card-interactive p-6 rounded-3xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#111113] shadow-xs space-y-3 hover:border-blue-300 dark:hover:border-blue-800 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-neutral-400 group-hover:text-blue-600 transition-colors">
                    {s.step}
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/50 text-neutral-500 group-hover:text-blue-600 flex items-center justify-center transition-all">
                    <Icon className="w-4 h-4 icon-interactive" />
                  </div>
                </div>
                <h4 className="text-base font-bold text-neutral-950 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {s.title}
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ────────────────────────────────────────── */}
      {/* 6. STICKY PRODUCT STORY */}
      {/* ────────────────────────────────────────── */}
      <section className="py-24 px-6 max-w-7xl mx-auto text-left border-t border-neutral-200/80 dark:border-neutral-800/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column Stages */}
          <div className="lg:col-span-5 space-y-3">
            <div className="mb-6 space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">Deep Dive</span>
              <h3 className="text-2xl sm:text-3xl font-bold text-neutral-950 dark:text-white">
                Engineered for zero leakage
              </h3>
            </div>

            {storyStages.map((stg, idx) => {
              const isActive = activeStoryStage === idx;
              return (
                <div
                  key={stg.num}
                  onClick={() => setActiveStoryStage(idx)}
                  className={`cursor-pointer p-5 rounded-2xl border transition-all duration-200 text-left ${
                    isActive
                      ? 'border-neutral-900 dark:border-white bg-[#F7F7F5] dark:bg-neutral-800/80 shadow-xs translate-x-1'
                      : 'border-transparent hover:border-neutral-200 dark:hover:border-neutral-800 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-bold text-neutral-400">{stg.num} {stg.name.toUpperCase()}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-200/70 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300">
                      {stg.tag}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-neutral-950 dark:text-white">{stg.title}</h4>
                  {isActive && (
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
                      {stg.detail}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column Sticky Display */}
          <div className="lg:col-span-7 sticky top-28">
            <div className="rounded-3xl border border-neutral-200/90 dark:border-neutral-800 bg-[#F7F7F5]/60 dark:bg-[#111113] p-8 sm:p-10 min-h-[420px] flex flex-col justify-between shadow-xs">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800 text-xs">
                  <span className="font-mono text-neutral-400">STAGE {storyStages[activeStoryStage].num} / 06</span>
                  <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">{storyStages[activeStoryStage].name}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-neutral-950 dark:text-white leading-snug">
                  {storyStages[activeStoryStage].lead}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xl">
                  {storyStages[activeStoryStage].detail}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs font-mono text-neutral-500">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-500" />
                  SECURITY POLICY: ENFORCED
                </span>
                <span>SHA-256 PARALLEL DIGEST</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────── */}
      {/* 7. SECURITY ARCHITECTURE */}
      {/* ────────────────────────────────────────── */}
      <section id="security" className="py-24 px-6 border-t border-neutral-200/80 dark:border-neutral-800/80 bg-[#FAFAFA] dark:bg-[#0C0C0E]">
        <div className="max-w-5xl mx-auto text-center space-y-10">
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">Multi-Layer Topology</span>
            <h3 className="text-3xl sm:text-5xl font-bold text-neutral-950 dark:text-white">
              Security Architecture
            </h3>
            <p className="text-base text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
              Three synchronized protection layers converging on a tamper-evident audit ledger.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-7 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111113] shadow-xs space-y-3 hover:border-blue-300 dark:hover:border-blue-800 transition-colors group">
              <div className="w-10 h-10 rounded-2xl bg-neutral-100 dark:bg-neutral-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/60 text-neutral-900 dark:text-white group-hover:text-blue-600 flex items-center justify-center transition-colors">
                <Lock className="w-5 h-5 icon-interactive" />
              </div>
              <h4 className="text-base font-bold text-neutral-950 dark:text-white">Encryption</h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                AES-256-GCM authenticated payload encapsulation. Sensitive binaries never touch public networks or blockchains unencrypted.
              </p>
            </div>

            <div className="p-7 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111113] shadow-xs space-y-3 hover:border-blue-300 dark:hover:border-blue-800 transition-colors group">
              <div className="w-10 h-10 rounded-2xl bg-neutral-100 dark:bg-neutral-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/60 text-neutral-900 dark:text-white group-hover:text-blue-600 flex items-center justify-center transition-colors">
                <Building2 className="w-5 h-5 icon-interactive" />
              </div>
              <h4 className="text-base font-bold text-neutral-950 dark:text-white">Access Control</h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Whitelisted hardware terminal MAC addresses, centre subnets, and superintendent credentials required concurrently.
              </p>
            </div>

            <div className="p-7 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111113] shadow-xs space-y-3 hover:border-blue-300 dark:hover:border-blue-800 transition-colors group">
              <div className="w-10 h-10 rounded-2xl bg-neutral-100 dark:bg-neutral-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/60 text-neutral-900 dark:text-white group-hover:text-blue-600 flex items-center justify-center transition-colors">
                <KeyRound className="w-5 h-5 icon-interactive" />
              </div>
              <h4 className="text-base font-bold text-neutral-950 dark:text-white">Integrity Proof</h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Cryptographic SHA-256 digests computed at authoring and verified byte-by-byte at physical download prior to decryption.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111113] text-xs flex items-center justify-between max-w-md mx-auto">
            <div className="flex items-center gap-2.5">
              <Boxes className="w-4 h-4 text-blue-600" />
              <span className="font-bold text-neutral-900 dark:text-white">Blockchain Audit Ledger</span>
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">IMMUTABLE ANCHOR</span>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────── */}
      {/* 8. TAMPER DETECTION INTERACTIVE SIMULATION */}
      {/* ────────────────────────────────────────── */}
      <section id="tamper-detection" className="py-24 px-6 border-t border-neutral-200/80 dark:border-neutral-800/80 bg-[#F7F7F5]/60 dark:bg-[#0E0E10]/40">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-semibold">Interactive Simulation</span>
            <h3 className="text-2xl sm:text-3xl font-bold text-neutral-950 dark:text-white">
              Mathematical Tamper Detection
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
              Test how VeriQ reacts when an examination paper is altered by even a single byte.
            </p>
          </div>

          {/* Interactive Toggle */}
          <div className="inline-flex items-center p-1 rounded-2xl bg-neutral-200/80 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700">
            <button
              onClick={() => setIsTampered(false)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                !isTampered
                  ? 'bg-white dark:bg-[#111113] text-neutral-950 dark:text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
              }`}
            >
              Intact Original Document
            </button>
            <button
              onClick={() => setIsTampered(true)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isTampered
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
              }`}
            >
              Simulate 1-Byte Tamper
            </button>
          </div>

          {/* Simulation Output Card */}
          <div className="rounded-3xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#111113] p-7 shadow-xs text-left space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-neutral-400 text-[11px] font-semibold">HASH COMPARISON ENGINE</span>
              <span
                className={`font-mono text-[11px] font-bold px-3 py-1 rounded-full ${
                  isTampered
                    ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-800'
                    : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                }`}
              >
                {isTampered ? 'HASH MISMATCH' : 'MATCH CONFIRMED'}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-800">
                <span className="text-neutral-400 block text-[10px]">REGISTERED BLOCKCHAIN DIGEST:</span>
                <span className="text-neutral-900 dark:text-neutral-100 truncate block mt-0.5 font-bold">
                  A89D214F8B92A170E3C1D9B3E7F41A862B904C51E06D2891F7A3B4E60128F8A1
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-800">
                <span className="text-neutral-400 block text-[10px]">DOWNLOADED ARTIFACT DIGEST:</span>
                <span
                  className={`truncate block mt-0.5 ${
                    isTampered
                      ? 'text-red-600 dark:text-red-400 line-through font-bold'
                      : 'text-neutral-900 dark:text-neutral-100 font-bold'
                  }`}
                >
                  {isTampered
                    ? 'D71F409C3270E3C1D9B3E7F41A862B904C51E06D2891F7A3B4E601289C32'
                    : 'A89D214F8B92A170E3C1D9B3E7F41A862B904C51E06D2891F7A3B4E60128F8A1'}
                </span>
              </div>
            </div>

            <div
              className={`p-4 rounded-2xl border flex items-center gap-3.5 text-xs ${
                isTampered
                  ? 'border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/20 text-red-800 dark:text-red-300'
                  : 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300'
              }`}
            >
              {isTampered ? (
                <AlertOctagon className="w-5 h-5 shrink-0 text-red-600 dark:text-red-400" />
              ) : (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              )}
              <div>
                <p className="font-bold">{isTampered ? 'INTEGRITY ALERT DISPATCHED' : 'ZERO TAMPERING DETECTED'}</p>
                <p className="text-[11px] opacity-90 mt-0.5">
                  {isTampered
                    ? 'Terminal decryption key revoked. Incident recorded in blockchain block.'
                    : 'Cryptographic proof confirms paper is identical to author master copy.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────── */}
      {/* 9. ROLE SEGREGATION EXPERIENCE */}
      {/* ────────────────────────────────────────── */}
      <section id="roles" className="py-24 px-6 max-w-5xl mx-auto text-left border-t border-neutral-200/80 dark:border-neutral-800/80">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">Institutional Roles</span>
          <h3 className="text-3xl sm:text-4xl font-bold text-neutral-950 dark:text-white">
            Designed for institutional clarity
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
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
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeRole === r.id
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Role Details Card */}
        <div className="p-8 sm:p-10 rounded-3xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#111113] shadow-xs space-y-6">
          <div className="pb-4 border-b border-neutral-100 dark:border-neutral-800">
            <h4 className="text-xl font-bold text-neutral-950 dark:text-white">
              {rolesContent[activeRole].title}
            </h4>
            <p className="text-xs text-neutral-500 font-mono mt-1">
              {rolesContent[activeRole].subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-2">
              <span className="font-bold text-neutral-900 dark:text-white block text-sm">What They Do</span>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {rolesContent[activeRole].whatTheyDo}
              </p>
            </div>
            <div className="space-y-2">
              <span className="font-bold text-neutral-900 dark:text-white block text-sm">What They See</span>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {rolesContent[activeRole].whatTheySee}
              </p>
            </div>
          </div>

          <div className="space-y-2.5 pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block font-semibold">
              Key Capabilities:
            </span>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-neutral-700 dark:text-neutral-300">
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

      {/* ────────────────────────────────────────── */}
      {/* 10. FINAL CALL TO ACTION */}
      {/* ────────────────────────────────────────── */}
      <section className="py-28 px-6 max-w-4xl mx-auto text-center space-y-6 border-t border-neutral-200/80 dark:border-neutral-800/80">
        <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-neutral-950 dark:text-white leading-tight">
          Secure your examination workflow.
        </h2>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
          Protect the paper. Control access. Verify every critical action.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-3">
          <Link to="/signin">
            <Button variant="primary" size="lg" className="w-full sm:w-auto px-8 py-3 text-base">
              Enter VeriQ
            </Button>
          </Link>
          <Link to="/signup">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto px-8 py-3 text-base">
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      {/* ────────────────────────────────────────── */}
      {/* 11. REFINED PROFESSIONAL FOOTER */}
      {/* Section 33–35: Product, Account, Security, Legal */}
      {/* ────────────────────────────────────────── */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-16 px-6 bg-white dark:bg-[#0A0A0B]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10 text-xs">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-3">
            <VeriQLogo size="md" />
            <p className="text-neutral-500 dark:text-neutral-400 max-w-sm leading-relaxed text-xs">
              Secure examination paper distribution and blockchain-backed chain of custody. Decoupling high-performance off-chain content delivery from immutable on-chain integrity proofs.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Ledger Proof System v1.0
              </span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <div className="font-bold text-neutral-950 dark:text-white uppercase tracking-wider text-[11px] font-mono">
              Product
            </div>
            <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
              <li>
                <a href="#how-it-works" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#security" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Security Architecture
                </a>
              </li>
              <li>
                <a href="#tamper-detection" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Tamper Detection
                </a>
              </li>
              <li>
                <a href="#roles" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Role Segregation
                </a>
              </li>
            </ul>
          </div>

          {/* Account Links */}
          <div className="space-y-3">
            <div className="font-bold text-neutral-950 dark:text-white uppercase tracking-wider text-[11px] font-mono">
              Account
            </div>
            <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
              <li>
                <Link to="/signin" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Get Started
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Workspace Console
                </Link>
              </li>
              <li>
                <Link to="/verify" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Verify Paper
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Security */}
          <div className="space-y-3">
            <div className="font-bold text-neutral-950 dark:text-white uppercase tracking-wider text-[11px] font-mono">
              Security
            </div>
            <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
              <li>
                <Link to="/blockchain" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Blockchain Explorer
                </Link>
              </li>
              <li>
                <Link to="/custody" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Chain of Custody
                </Link>
              </li>
              <li>
                <Link to="/audit" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Auditor Portal
                </Link>
              </li>
              <li>
                <Link to="/incidents" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Incident Reporting
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div>
            <span>© {new Date().getFullYear()} VeriQ. Secure every question paper. Verify every action.</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors cursor-pointer">
              Terms of Service
            </span>
            <span className="hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors cursor-pointer">
              Security Compliance
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
