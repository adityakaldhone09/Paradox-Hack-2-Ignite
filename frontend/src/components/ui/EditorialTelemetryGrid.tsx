import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Boxes, Activity, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NumberTicker } from './NumberTicker';
import { Spotlight } from './Spotlight';
import { BorderBeam } from './BorderBeam';

export const EditorialTelemetryGrid: React.FC = () => {
  const metrics = [
    {
      label: 'Cryptographic Anchor Proofs',
      value: 1489,
      sub: 'PoA blockchain consensus blocks',
      change: '+100% Tamper Proof',
    },
    {
      label: 'Authorized Exam Centres',
      value: 10,
      sub: 'Tripartite hardware whitelisted',
      change: 'Active Telemetry',
    },
    {
      label: 'Early Leaks Tolerated',
      value: 0,
      sub: 'Atomic NTP time-lock gates',
      change: 'Zero Tolerance',
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* 3 Large Typographic Proof Cards (Editorial Linear Style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {metrics.map((m, idx) => (
          <div
            key={m.label}
            className="relative overflow-hidden rounded-3xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#111113] p-7 shadow-xs hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200 text-left group"
          >
            <Spotlight size={180} />
            <div className="relative z-10 space-y-2">
              <div className="flex items-center justify-between text-neutral-400 text-xs font-mono uppercase tracking-wider">
                <span>Metric 0{idx + 1}</span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
                  {m.change}
                </span>
              </div>
              <div className="text-4xl sm:text-5xl font-extrabold text-neutral-950 dark:text-white tracking-tight pt-1">
                <NumberTicker value={m.value} delay={idx * 0.05} />
              </div>
              <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 pt-1">
                {m.label}
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                {m.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Network Telemetry Bar */}
      <div className="relative overflow-hidden rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/50 p-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <BorderBeam size={160} duration={8} />
        <div className="flex items-center gap-4 text-neutral-600 dark:text-neutral-400">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <strong className="text-neutral-950 dark:text-white font-mono">CHAIN VALID:</strong> Block #1489
          </span>
          <span className="hidden md:inline font-mono text-neutral-300 dark:text-neutral-700">|</span>
          <span className="hidden md:inline">
            Deterministic SHA-256 • Proof-of-Authority Consensus
          </span>
        </div>

        <Link
          to="/blockchain"
          className="font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 shrink-0"
        >
          View Public Ledger Explorer <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default EditorialTelemetryGrid;
