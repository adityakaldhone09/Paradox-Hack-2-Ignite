import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  FileText,
  Lock,
  KeyRound,
  Building2,
  Clock,
  CheckCircle2,
  Boxes,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Fingerprint,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { ScrambleText } from './ScrambleText';
import { BorderBeam } from './BorderBeam';
import { Spotlight } from './Spotlight';

export interface PipelineNode {
  id: string;
  step: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  badge: string;
  details: {
    protocol: string;
    throughput: string;
    guarantee: string;
    sampleHash: string;
  };
}

const PIPELINE_NODES: PipelineNode[] = [
  {
    id: 'authoring',
    step: '01',
    title: 'Isolated Draft',
    subtitle: 'Authoring Sandbox',
    icon: FileText,
    tag: 'OFF-CHAIN AIRGAP',
    badge: 'STAGE 1',
    details: {
      protocol: 'Isolated RAM authoring session',
      throughput: '< 12ms snapshot buffer',
      guarantee: 'Zero disk persistence of plaintext',
      sampleHash: '0x94f1...8a01',
    },
  },
  {
    id: 'envelope',
    step: '02',
    title: 'Envelope Sealing',
    subtitle: 'AES-256-GCM Binary',
    icon: Lock,
    tag: 'AUTHENTICATED CIPHER',
    badge: 'STAGE 2',
    details: {
      protocol: '256-bit symmetric payload envelope',
      throughput: '128 MB/sec hardware accelerated',
      guarantee: 'Ciphertext integrity verified with GCM tag',
      sampleHash: '0x3ec8...72bf',
    },
  },
  {
    id: 'digest',
    step: '03',
    title: 'Cryptographic Hash',
    subtitle: 'SHA-256 Parallel Digest',
    icon: KeyRound,
    tag: 'FINGERPRINT SEAL',
    badge: 'STAGE 3',
    details: {
      protocol: 'Deterministic double SHA-256 fingerprint',
      throughput: 'Instantaneous computation',
      guarantee: 'Zero bit-drift non-repudiation',
      sampleHash: '0xa89d...4f19',
    },
  },
  {
    id: 'triple-bind',
    step: '04',
    title: 'Hardware Triple-Bind',
    subtitle: 'Centre & MAC Verification',
    icon: Building2,
    tag: 'HARDWARE BOUND',
    badge: 'STAGE 4',
    details: {
      protocol: 'Centre ID + Whitelisted MAC + Proctor JWT',
      throughput: 'Concurrent tripartite challenge',
      guarantee: 'Rejects unauthorized networks & spoofed devices',
      sampleHash: 'DEV-C101-MAC:4A:88:B1',
    },
  },
  {
    id: 'timelock',
    step: '05',
    title: 'Time-Lock Gate',
    subtitle: 'Atomic Clock NTP Release',
    icon: Clock,
    tag: 'TEMPORAL BARRIER',
    badge: 'STAGE 5',
    details: {
      protocol: 'NTP authenticated synchronized clock gate',
      throughput: '0.00ms early execution tolerance',
      guarantee: 'Keys remain inaccessible until scheduled window',
      sampleHash: 'T-LOCK: 2026-11-25T10:00:00Z',
    },
  },
  {
    id: 'checksum',
    step: '06',
    title: 'Integrity Match',
    subtitle: 'Zero Tamper Proof',
    icon: CheckCircle2,
    tag: 'BLOCKCHAIN PROVEN',
    badge: 'STAGE 6',
    details: {
      protocol: 'Decryption digest matched against blockchain state',
      throughput: 'Single-cycle validation',
      guarantee: 'Immediate isolation on single-byte anomaly',
      sampleHash: 'VERIFIED_VALID: 100.00%',
    },
  },
  {
    id: 'anchor',
    step: '07',
    title: 'Ledger Commit',
    subtitle: 'PoA Consensus Block',
    icon: Boxes,
    tag: 'PERMANENT RECORD',
    badge: 'STAGE 7',
    details: {
      protocol: 'Immutable Proof-of-Authority ledger anchor',
      throughput: 'Sub-second block finality',
      guarantee: 'Forensic auditor inspection ready',
      sampleHash: 'BLOCK #1490 // PO-AUTH',
    },
  },
];

export const CustodyPipelineFlow: React.FC = () => {
  const [activeNode, setActiveNode] = useState<number>(3); // Default to Hardware Triple-Bind
  const shouldReduceMotion = useReducedMotion();

  const selected = PIPELINE_NODES[activeNode];
  const IconComponent = selected.icon;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Outer Enclosing Glass Card with Subtle Border Beam */}
      <div className="relative overflow-hidden rounded-3xl border border-neutral-200/90 dark:border-neutral-800 bg-white/95 dark:bg-[#111113]/95 p-6 sm:p-8 md:p-10 shadow-elevated backdrop-blur-xl">
        <BorderBeam size={280} duration={12} colorFrom="#2563EB" colorTo="#06B6D4" />
        <Spotlight size={320} />

        {/* Top Header / Protocol Status */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100 dark:border-neutral-800 text-xs">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <div>
              <span className="font-mono text-neutral-400 dark:text-neutral-500 text-[11px] uppercase tracking-wider block">
                Cryptographic Pipeline // Active Custody Bus
              </span>
              <span className="font-bold text-neutral-900 dark:text-white text-sm">
                Interactive Examination-Paper Transit Architecture
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-800/60 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              NON-REPUDIATION ENFORCED
            </span>
          </div>
        </div>

        {/* Interactive SVG Node Flow Pipeline */}
        <div className="relative z-10 py-8 overflow-x-auto custom-scrollbar">
          <div className="min-w-[820px] relative px-4">
            {/* Background connecting rail */}
            <div className="absolute top-[42px] left-[60px] right-[60px] h-[3px] bg-neutral-100 dark:bg-neutral-800/80 z-0 rounded-full" />

            {/* Active illuminated connecting rail beam */}
            <motion.div
              className="absolute top-[42px] left-[60px] h-[3px] bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-500 z-0 rounded-full"
              initial={false}
              animate={{
                width: `${(activeNode / (PIPELINE_NODES.length - 1)) * 100}%`,
              }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.45,
                ease: [0.16, 1, 0.3, 1],
              }}
            />

            {/* Nodes Row */}
            <div className="grid grid-cols-7 gap-3 relative z-10 text-center">
              {PIPELINE_NODES.map((node, index) => {
                const NodeIcon = node.icon;
                const isCurrent = activeNode === index;
                const isPassed = activeNode > index;

                return (
                  <div
                    key={node.id}
                    onClick={() => setActiveNode(index)}
                    className="cursor-pointer group flex flex-col items-center select-none"
                  >
                    {/* Node Circle */}
                    <div className="relative">
                      <motion.div
                        whileHover={shouldReduceMotion ? undefined : { scale: 1.1 }}
                        whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
                        className={cn(
                          'w-[52px] h-[52px] rounded-2xl flex items-center justify-center transition-all duration-200',
                          'border relative z-10',
                          isCurrent
                            ? 'bg-blue-600 text-white border-blue-500 shadow-md ring-4 ring-blue-500/20'
                            : isPassed
                            ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-transparent shadow-xs'
                            : 'bg-white dark:bg-[#18181B] text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                        )}
                      >
                        <NodeIcon className="w-5 h-5" />
                      </motion.div>

                      {/* Small Step Indicator Pill */}
                      <span
                        className={cn(
                          'absolute -bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-mono px-1.5 py-0.2 rounded-full font-bold z-20',
                          isCurrent
                            ? 'bg-blue-700 text-white'
                            : isPassed
                            ? 'bg-neutral-800 text-neutral-200 dark:bg-neutral-200 dark:text-neutral-800'
                            : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400'
                        )}
                      >
                        {node.step}
                      </span>
                    </div>

                    {/* Node Text Description */}
                    <div className="mt-4 space-y-0.5">
                      <span
                        className={cn(
                          'text-xs font-bold block truncate',
                          isCurrent
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-neutral-800 dark:text-neutral-200 group-hover:text-neutral-950 dark:group-hover:text-white'
                        )}
                      >
                        {node.title}
                      </span>
                      <span className="text-[10px] text-neutral-400 block truncate">
                        {node.subtitle}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dynamic Node Inspection Deep-Dive Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 mt-4 rounded-2xl bg-neutral-50/70 dark:bg-neutral-900/40 border border-neutral-200/70 dark:border-neutral-800/70 p-5 sm:p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Left Column: Stage description & verification guarantee */}
              <div className="md:col-span-7 space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300">
                    {selected.badge}
                  </span>
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                    {selected.tag}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-neutral-950 dark:text-white">
                      {selected.step}. {selected.title} — {selected.subtitle}
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  <span className="font-semibold text-neutral-950 dark:text-white">Protocol: </span>
                  {selected.details.protocol}.
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                  <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
                    <Cpu className="w-3.5 h-3.5 text-blue-500" />
                    <span>Throughput: <strong className="text-neutral-900 dark:text-neutral-100">{selected.details.throughput}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{selected.details.guarantee}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Proof Telemetry & Sample Hash */}
              <div className="md:col-span-5 p-4 rounded-xl bg-white dark:bg-[#111113] border border-neutral-200 dark:border-neutral-800 space-y-2.5 text-left shadow-2xs">
                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 border-b border-neutral-100 dark:border-neutral-800/80 pb-2">
                  <span className="flex items-center gap-1.5">
                    <Fingerprint className="w-3 h-3 text-cyan-500" />
                    CRYPTOGRAPHIC PROOF
                  </span>
                  <span className="text-emerald-500 font-bold">STATE ATTESTED</span>
                </div>

                <div className="space-y-1 font-mono text-xs">
                  <div className="text-[10px] text-neutral-400 uppercase tracking-wider">
                    Node Digest Output
                  </div>
                  <div className="px-2.5 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800/80 text-blue-600 dark:text-blue-400 border border-neutral-200/60 dark:border-neutral-700/60 break-all text-[11px]">
                    <ScrambleText intervalMs={24} triggerKey={selected.id}>
                      {selected.details.sampleHash}
                    </ScrambleText>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px] text-neutral-500">
                  <span>Inspection Status</span>
                  <span className="font-semibold text-neutral-900 dark:text-neutral-200">
                    Stage {activeNode + 1} of 7 Active
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CustodyPipelineFlow;
