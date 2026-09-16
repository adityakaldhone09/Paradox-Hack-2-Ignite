import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  Lock,
  Binary,
  CheckCircle2,
  Boxes,
  FileCheck2,
  ArrowRight,
  ShieldAlert,
  Clock,
  EyeOff,
  Cpu
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const LandingPage: React.FC = () => {
  const pipelineSteps = [
    { title: 'Question Paper', desc: 'Authoritative PDF upload', icon: FileCheck2, color: 'text-blue-400' },
    { title: 'AES-256-GCM', desc: 'Off-chain encryption', icon: Lock, color: 'text-purple-400' },
    { title: 'SHA-256 Digest', desc: 'Cryptographic hash proof', icon: Binary, color: 'text-brand-400' },
    { title: 'Authorization', desc: 'Centre & device whitelist', icon: Cpu, color: 'text-amber-400' },
    { title: 'Blockchain Anchor', desc: 'Immutable ledger proof', icon: Boxes, color: 'text-indigo-400' },
    { title: 'Integrity Verified', desc: 'Tamper-free distribution', icon: CheckCircle2, color: 'text-emerald-400' },
  ];

  return (
    <div className="space-y-16 py-6 max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center space-y-6 pt-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/25 text-brand-400 text-xs font-semibold uppercase tracking-wider"
        >
          <Shield className="w-4 h-4" />
          WB-03 — Secure Examination Paper Distribution
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto"
        >
          Secure Every Question Paper.{' '}
          <span className="bg-gradient-to-r from-brand-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
            Verify Every Action.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
        >
          VeriQ protects examination papers from premature leaks, unauthorized access, and document tampering through off-chain AES-256-GCM encryption and blockchain-anchored cryptographic chain of custody.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-4 pt-2"
        >
          <Link to="/dashboard">
            <Button size="lg" className="shadow-xl shadow-brand-500/25">
              Enter Command Center <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </Link>
          <Link to="/verify">
            <Button variant="outline" size="lg">
              Verify Paper Hash
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Animated 6-Stage Cryptographic Pipeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-panel-glow p-8 rounded-2xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-white tracking-tight">
            End-to-End Cryptographic Security Pipeline
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Zero sensitive bytes on blockchain. 100% auditable proof verification.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 relative">
          {pipelineSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="flex flex-col items-center text-center p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-brand-500/40 transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-3 shadow-inner ${step.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-200">{step.title}</span>
                <span className="text-[11px] text-slate-500 mt-1 leading-snug">{step.desc}</span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Architecture Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-xl space-y-3">
          <div className="w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400">
            <EyeOff className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Off-Chain Confidentiality</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Sensitive papers are never stored on public or consortium chains. Document bytes remain encrypted at rest with hardware-grade AES-256-GCM.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-xl space-y-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Time-Locked Release</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Decryption authorization is cryptographically locked until the exact scheduled examination timestamp, blocking early leaks.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-xl space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Tamper Detection & SOC</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Any modification to file bytes immediately violates the SHA-256 anchor, triggering real-time alerts and blockchain incident logging.
          </p>
        </div>
      </div>
    </div>
  );
};
