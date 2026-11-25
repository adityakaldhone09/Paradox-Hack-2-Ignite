import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  AlertTriangle,
  Play,
  RotateCcw,
  Clock,
  Laptop,
  Fingerprint,
  CheckCircle2,
  XCircle,
  Sparkles,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { ScrambleText } from './ScrambleText';
import { BorderBeam } from './BorderBeam';
import { Spotlight } from './Spotlight';

export const CryptographicTerminalSimulator: React.FC = () => {
  const [examClockMinutes, setExamClockMinutes] = useState(15); // minutes before exam (0 = start time)
  const [tamperPayload, setTamperPayload] = useState(false);
  const [spoofMac, setSpoofMac] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const isTimeLocked = examClockMinutes > 0;
  const isMacUnauthorized = spoofMac;
  const isIntegrityFailed = tamperPayload;

  const canUnlock = !isTimeLocked && !isMacUnauthorized && !isIntegrityFailed;

  const resetSimulation = () => {
    setExamClockMinutes(15);
    setTamperPayload(false);
    setSpoofMac(false);
    setIsVerifying(false);
  };

  const advanceClockToStart = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setExamClockMinutes(0);
      setIsVerifying(false);
    }, 400);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-neutral-200/90 dark:border-neutral-800 bg-white/95 dark:bg-[#111113]/95 p-6 sm:p-8 md:p-10 shadow-elevated backdrop-blur-xl">
        <BorderBeam size={260} duration={10} colorFrom="#2563EB" colorTo="#3B82F6" />
        <Spotlight size={300} />

        {/* Console Header */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100 dark:border-neutral-800 text-xs">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-800/60">
              <Fingerprint className="w-4 h-4" />
            </span>
            <div>
              <span className="font-mono text-neutral-400 dark:text-neutral-500 text-[11px] uppercase tracking-wider block">
                Direction A // Cryptographic Command Console
              </span>
              <span className="font-bold text-neutral-900 dark:text-white text-sm">
                Live Verification & Attack Resistance Sandbox
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetSimulation}
              className="px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-xs font-medium flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset State
            </button>
          </div>
        </div>

        {/* 3-Column Command Architecture */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
          {/* Column 1: Test Vector Controls */}
          <div className="lg:col-span-4 space-y-4 rounded-2xl bg-neutral-50/70 dark:bg-neutral-900/50 border border-neutral-200/70 dark:border-neutral-800/70 p-5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 block pb-1">
              Test Attack Vectors
            </span>

            {/* Time Control */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#18181B] border border-neutral-200/80 dark:border-neutral-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  Scheduled Exam Window
                </span>
                <span className="font-mono text-[11px] font-bold text-neutral-900 dark:text-white">
                  T-{examClockMinutes}m
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                value={examClockMinutes}
                onChange={(e) => setExamClockMinutes(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
                <button
                  onClick={advanceClockToStart}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-bold"
                >
                  ⚡ Jump to Start Time (T-0)
                </button>
                <span>{examClockMinutes === 0 ? 'RELEASE ACTIVE' : 'LOCKED'}</span>
              </div>
            </div>

            {/* Hardware MAC Spoofing Toggle */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#18181B] border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                  <Laptop className="w-3.5 h-3.5 text-blue-500" />
                  Simulate Rogue Device
                </span>
                <span className="text-[11px] text-neutral-400 block">
                  {spoofMac ? 'Spoofed MAC (00:1A:2B:3C:4D)' : 'Whitelisted MAC (DEV-C101-4A)'}
                </span>
              </div>
              <button
                onClick={() => setSpoofMac(!spoofMac)}
                className={cn(
                  'px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-colors',
                  spoofMac
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                    : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300'
                )}
              >
                {spoofMac ? 'ROGUE MAC' : 'AUTHORIZED'}
              </button>
            </div>

            {/* Ciphertext Tampering Toggle */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#18181B] border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                  Inject 1-Bit Payload Mutation
                </span>
                <span className="text-[11px] text-neutral-400 block">
                  {tamperPayload ? 'Byte #0x42 flipped to 0xFF' : 'Pristine AES-256 binary'}
                </span>
              </div>
              <button
                onClick={() => setTamperPayload(!tamperPayload)}
                className={cn(
                  'px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-colors',
                  tamperPayload
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                    : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300'
                )}
              >
                {tamperPayload ? 'CORRUPTED' : 'PRISTINE'}
              </button>
            </div>
          </div>

          {/* Column 2: Live Gate Evaluation Pipeline */}
          <div className="lg:col-span-5 space-y-3 rounded-2xl bg-neutral-50/70 dark:bg-neutral-900/50 border border-neutral-200/70 dark:border-neutral-800/70 p-5 flex flex-col justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 block pb-1">
              Cryptographic Gate Evaluation
            </span>

            {/* Check 1: Time-Lock Gate */}
            <div className="p-3 rounded-xl bg-white dark:bg-[#18181B] border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                {isTimeLocked ? (
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                )}
                <div>
                  <span className="font-semibold text-neutral-900 dark:text-white">Gate 1: Time-Lock Barrier</span>
                  <span className="text-[11px] text-neutral-400 block">
                    {isTimeLocked
                      ? `Decryption keys locked until T-00:00 (Held in vault)`
                      : `Scheduled exam window reached; key escrow unlocked`}
                  </span>
                </div>
              </div>
              <span
                className={cn(
                  'text-[10px] font-mono font-bold px-2 py-0.5 rounded-full',
                  isTimeLocked
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                )}
              >
                {isTimeLocked ? 'BLOCKED' : 'PASSED'}
              </span>
            </div>

            {/* Check 2: Hardware Triple Bind */}
            <div className="p-3 rounded-xl bg-white dark:bg-[#18181B] border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                {isMacUnauthorized ? (
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                )}
                <div>
                  <span className="font-semibold text-neutral-900 dark:text-white">Gate 2: Hardware Triple-Bind</span>
                  <span className="text-[11px] text-neutral-400 block">
                    {isMacUnauthorized
                      ? 'Unauthorized device detected; hardware handshake rejected'
                      : 'Whitelisted hardware MAC + Proctor credential verified'}
                  </span>
                </div>
              </div>
              <span
                className={cn(
                  'text-[10px] font-mono font-bold px-2 py-0.5 rounded-full',
                  isMacUnauthorized
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                )}
              >
                {isMacUnauthorized ? 'UNAUTHORIZED' : 'VERIFIED'}
              </span>
            </div>

            {/* Check 3: Zero-Drift Blockchain Proof */}
            <div className="p-3 rounded-xl bg-white dark:bg-[#18181B] border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                {isIntegrityFailed ? (
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                )}
                <div>
                  <span className="font-semibold text-neutral-900 dark:text-white">Gate 3: Blockchain Hash Proof</span>
                  <span className="text-[11px] text-neutral-400 block">
                    {isIntegrityFailed
                      ? 'Checksum mismatch with block #1042 ledger proof'
                      : 'Exact mathematical match with ledger anchor proof'}
                  </span>
                </div>
              </div>
              <span
                className={cn(
                  'text-[10px] font-mono font-bold px-2 py-0.5 rounded-full',
                  isIntegrityFailed
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                )}
              >
                {isIntegrityFailed ? 'TAMPERED' : 'VALID'}
              </span>
            </div>

            {/* Live Terminal Cipher Display */}
            <div className="p-2.5 rounded-xl bg-neutral-950 text-cyan-400 font-mono text-[11px] border border-neutral-800">
              <span className="text-[10px] text-neutral-500 block">SHA-256 ACTIVE DIGEST:</span>
              <ScrambleText intervalMs={20} triggerKey={`${examClockMinutes}-${tamperPayload}-${spoofMac}`}>
                {tamperPayload
                  ? '0xDEADBEEF94A7C12F0099BA8237FA18939023'
                  : '0xA89D214FE94921CBA90812EA123B9481920F'}
              </ScrambleText>
            </div>
          </div>

          {/* Column 3: Decryption Outcome */}
          <div className="lg:col-span-3 rounded-2xl bg-neutral-50/70 dark:bg-neutral-900/50 border border-neutral-200/70 dark:border-neutral-800/70 p-5 flex flex-col justify-between text-center">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 block pb-1">
              Final Release Outcome
            </span>

            <div className="py-6 flex flex-col items-center justify-center space-y-3">
              <div
                className={cn(
                  'w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 border',
                  canUnlock
                    ? 'bg-emerald-500 text-white border-emerald-400 shadow-md ring-4 ring-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                )}
              >
                {canUnlock ? <Unlock className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
              </div>

              <div>
                <h4 className="text-sm font-bold text-neutral-950 dark:text-white">
                  {canUnlock ? 'Paper Decrypted & Ready' : 'Access Mathematically Denied'}
                </h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 max-w-[200px] mx-auto">
                  {canUnlock
                    ? 'Authenticated examination hall print authorization issued.'
                    : isTimeLocked
                    ? 'Time barrier locked: 0.00ms early window tolerance.'
                    : isMacUnauthorized
                    ? 'Rogue hardware detected: incident logged to chain.'
                    : 'Bit-drift detected: payload isolated immediately.'}
                </p>
              </div>
            </div>

            <div
              className={cn(
                'p-2.5 rounded-xl font-mono text-[11px] font-bold border',
                canUnlock
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800'
              )}
            >
              {canUnlock ? 'STATUS: AUTH_GRANTED' : 'STATUS: POLICY_ENFORCED'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptographicTerminalSimulator;
