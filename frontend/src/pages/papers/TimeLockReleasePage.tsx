import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Lock,
  Clock,
  ShieldAlert,
  CheckCircle2,
  Server,
  Zap,
} from 'lucide-react';
import { paperApi, centreApi, accessApi, deviceApi, demoApi } from '../../services/apiClient';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CountdownTimer } from '../../components/ui/CountdownTimer';
import { PaperSelector } from '../../components/ui/PaperSelector';
import { toast } from 'sonner';

export const TimeLockReleasePage: React.FC = () => {
  const [papers, setPapers] = useState<any[]>([]);
  const [centres, setCentres] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [selectedPaperId, setSelectedPaperId] = useState('');
  const [selectedCentreId, setSelectedCentreId] = useState('');
  const [selectedDeviceId, setSelectedDeviceId] = useState('auto');
  const [serverTime, setServerTime] = useState(new Date().toLocaleTimeString());
  const [accessResult, setAccessResult] = useState<any>(null);
  const [isAttempting, setIsAttempting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setServerTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const loadData = async () => {
    try {
      const [pRes, cRes, dRes] = await Promise.all([
        paperApi.list(),
        centreApi.list(),
        deviceApi.list(),
      ]);
      setPapers(pRes.data);
      setCentres(cRes.data);
      setDevices(dRes.data);
      if (pRes.data.length > 0) setSelectedPaperId(pRes.data[0].id);
      if (cRes.data.length > 0) setSelectedCentreId(cRes.data[0].id);
    } catch (err) {
      console.error('Error loading timelock papers', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const centreDevices = devices.filter((d) => d.centre_id === selectedCentreId);

  const handleAttemptAccess = async () => {
    setIsAttempting(true);
    setAccessResult(null);

    try {
      // Determine device fingerprint based on selection
      let fingerprint = '';
      if (selectedDeviceId === 'rogue') {
        fingerprint = 'ROGUE_UNREGISTERED_DEVICE_HARDWARE_TPM_FAIL';
      } else if (selectedDeviceId !== 'auto') {
        const dev = devices.find((d) => d.id === selectedDeviceId);
        fingerprint = dev?.device_fingerprint || '';
      } else if (centreDevices.length > 0) {
        fingerprint = centreDevices[0].device_fingerprint;
      } else {
        fingerprint = 'DEFAULT_TERMINAL_FINGERPRINT';
      }

      const res = await accessApi.requestAccess({
        paper_id: selectedPaperId,
        centre_id: selectedCentreId,
        device_fingerprint: fingerprint,
      });

      setAccessResult(res.data);
      if (res.data.allowed) {
        toast.success('Access authorized! Cryptographic decryption key issued.');
      } else {
        toast.error('ACCESS BLOCKED: ' + res.data.message);
      }
    } catch (err: any) {
      toast.error('Access error: ' + (err.response?.data?.detail || err.message));
    } finally {
      setIsAttempting(false);
    }
  };

  const handleSimulateEarlyAccess = async () => {
    setIsAttempting(true);
    setAccessResult(null);
    try {
      const res = await demoApi.simulate('EARLY_ACCESS');
      setAccessResult({
        allowed: false,
        reason: res.data.reason || 'RELEASE_WINDOW_NOT_STARTED',
        message: res.data.description || 'Early access attempt blocked: release window has not started.',
        tx_hash: res.data.blockchain_tx_hash,
      });
      toast.error('🚨 Early access attempt intercepted and logged to blockchain ledger!');
    } catch (err: any) {
      toast.error('Simulation error: ' + (err.response?.data?.detail || err.message));
    } finally {
      setIsAttempting(false);
    }
  };

  const selectedPaper = papers.find((p) => p.id === selectedPaperId);
  const targetRelease = selectedPaper?.release_time || new Date(Date.now() + 7200 * 1000).toISOString();

  return (
    <div className="space-y-8 max-w-4xl mx-auto text-left">
      {/* Title */}
      <div className="text-center space-y-1.5 pb-3 border-b border-neutral-200/80 dark:border-neutral-800">
        <h1 className="text-2xl font-bold text-neutral-950 dark:text-white tracking-tight flex items-center justify-center gap-2.5">
          <Lock className="w-5 h-5 text-neutral-900 dark:text-white" />
          Time-Locked Examination Paper Release Engine
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-lg mx-auto">
          Cryptographic release keys remain time-locked by server consensus until the verified start of the examination window.
        </p>
      </div>

      {/* Clock & Paper Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#111113] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800 text-xs">
              <span className="text-neutral-500">Server Synchronized Clock</span>
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-medium">
                <Server className="w-3.5 h-3.5" /> NTP Synced
              </div>
            </div>
            <div className="text-3xl font-mono font-extrabold text-neutral-950 dark:text-white tracking-tight mt-5 text-center">
              {serverTime}
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs">
            <div>
              <label className="block text-neutral-700 dark:text-neutral-300 mb-1.5 font-medium">
                Select Examination Centre
              </label>
              <select
                value={selectedCentreId}
                onChange={(e) => setSelectedCentreId(e.target.value)}
                className="w-full bg-neutral-50 dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 rounded-xl p-2.5 text-xs text-neutral-900 dark:text-white outline-none"
              >
                {centres.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.centre_id} — {c.name} ({c.city})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Authorized Hardware Terminal / Device *</label>
              <select
                value={selectedDeviceId}
                onChange={(e) => setSelectedDeviceId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-brand-500 font-mono"
              >
                <option value="auto">Auto-detect Centre Terminal ({centreDevices.length} available)</option>
                {centreDevices.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.device_name} ({d.device_id}) — {d.status}
                  </option>
                ))}
                <option value="rogue">⚠️ Rogue / Unregistered Terminal (Simulate Attack)</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Live Countdown Card */}
        <Card className="p-6 border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#111113] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800 text-xs mb-4">
              <span className="text-neutral-500">Target Release Window</span>
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
            </div>
            <CountdownTimer targetDate={targetRelease} />
            <p className="text-[11px] font-mono text-neutral-400 text-center mt-3">
              Scheduled: {new Date(targetRelease).toLocaleString()}
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <Button
              variant="primary"
              size="md"
              onClick={handleAttemptAccess}
              isLoading={isAttempting}
              className="w-full h-10 text-xs font-medium"
            >
              <Lock className="w-3.5 h-3.5 mr-1" /> Request Authorized Decryption
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={handleSimulateEarlyAccess}
              disabled={isAttempting}
              className="w-full h-10 text-xs font-medium border-amber-200 dark:border-amber-900/60 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20"
              title="Simulate accessing prior to the designated release window"
            >
              <Zap className="w-3.5 h-3.5 mr-1 text-amber-500" /> Test Early Access Block Scenario
            </Button>
          </div>
        </Card>
      </div>

      {/* Modern Paper Selector */}
      <PaperSelector
        papers={papers}
        selectedPaperId={selectedPaperId}
        onSelect={(id) => {
          setSelectedPaperId(id);
          setAccessResult(null);
        }}
        isLoading={isLoading}
      />

      {/* Access Evaluation Result Display */}
      {accessResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`p-6 rounded-2xl border ${
            accessResult.allowed
              ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-800/60'
              : 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200/80 dark:border-rose-800/60'
          } space-y-4 shadow-xs`}
        >
          <div className="flex items-center gap-3.5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              accessResult.allowed
                ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400'
            }`}>
              {accessResult.allowed ? <CheckCircle2 className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
            </div>
            <div>
              <h3 className={`text-base font-bold ${accessResult.allowed ? 'text-emerald-800 dark:text-emerald-300' : 'text-rose-800 dark:text-rose-300'}`}>
                {accessResult.allowed ? 'ACCESS GRANTED' : 'ACCESS BLOCKED'}
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">{accessResult.message}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#111113] border border-neutral-200 dark:border-neutral-800 text-xs space-y-2 shadow-2xs">
            <div className="flex justify-between items-center text-neutral-500">
              <span>Denial / Authorization Code:</span>
              <span className="font-mono font-semibold text-neutral-900 dark:text-neutral-200">{accessResult.reason}</span>
            </div>
            <div className="flex justify-between items-center text-neutral-500">
              <span>Ledger Transaction Anchor:</span>
              <span className="font-mono text-neutral-800 dark:text-neutral-300">{accessResult.tx_hash || 'Recorded in Block'}</span>
            </div>
            {!accessResult.allowed && (
              <p className="text-[11px] text-amber-600 dark:text-amber-400 pt-1 border-t border-neutral-100 dark:border-neutral-800">
                Notice: Security Incident has been automatically recorded to the audit ledger.
              </p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};
