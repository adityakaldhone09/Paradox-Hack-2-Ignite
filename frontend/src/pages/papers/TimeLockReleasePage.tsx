import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Lock,
  Unlock,
  Clock,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Server,
  Zap
} from 'lucide-react';
import { paperApi, centreApi, accessApi, deviceApi, demoApi } from '../../services/apiClient';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CountdownTimer } from '../../components/ui/CountdownTimer';
import { StatusBadge } from '../../components/ui/StatusBadge';
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
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center justify-center gap-2">
          <Lock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          Time-Locked Examination Paper Release Engine
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Cryptographic release keys remain time-locked by server consensus until the verified start of the examination window.
        </p>
      </div>

      {/* Clock & Paper Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-5 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Server Synchronized Clock</span>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                <Server className="w-3.5 h-3.5" /> NTP Synced
              </div>
            </div>
            <div className="text-3xl font-mono font-black text-slate-900 dark:text-white tracking-tight mt-4 text-center">
              {serverTime}
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Select Examination Paper *</label>
              <select
                value={selectedPaperId}
                onChange={(e) => {
                  setSelectedPaperId(e.target.value);
                  setAccessResult(null);
                }}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-brand-500"
              >
                {papers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.paper_id} — {p.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Select Examination Centre *</label>
              <select
                value={selectedCentreId}
                onChange={(e) => setSelectedCentreId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-brand-500"
              >
                {centres.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.centre_id} — {c.name}
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
        <Card className="p-5 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Target Release Window
            </h3>
            <CountdownTimer targetDate={targetRelease} />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center mt-3">
              Scheduled Release: {new Date(targetRelease).toLocaleString()}
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button
              onClick={handleAttemptAccess}
              isLoading={isAttempting}
              className="w-full"
            >
              <Lock className="w-4 h-4" /> Request Authorized Decryption
            </Button>
            <Button
              variant="outline"
              onClick={handleSimulateEarlyAccess}
              disabled={isAttempting}
              className="w-full border-amber-300 dark:border-amber-500/40 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10"
              title="Simulate accessing prior to the designated release window"
            >
              <Zap className="w-4 h-4" /> Test Early Access Block Scenario
            </Button>
          </div>
        </Card>
      </div>

      {/* Access Evaluation Result Display */}
      {accessResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-2xl border ${
            accessResult.allowed
              ? 'bg-emerald-50/60 dark:bg-emerald-500/5 border-emerald-200 dark:border-emerald-500/30'
              : 'bg-rose-50/60 dark:bg-rose-500/5 border-rose-200 dark:border-rose-500/40 animate-pulse-subtle'
          } space-y-4 shadow-xl`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              accessResult.allowed ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400'
            }`}>
              {accessResult.allowed ? <CheckCircle2 className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
            </div>
            <div>
              <h3 className={`text-lg font-bold ${accessResult.allowed ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
                {accessResult.allowed ? 'ACCESS GRANTED' : '🚨 ACCESS BLOCKED'}
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300">{accessResult.message}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs space-y-2 shadow-xs">
            <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
              <span>Denial / Authorization Code:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-200">{accessResult.reason}</span>
            </div>
            <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
              <span>Ledger Transaction Anchor:</span>
              <span className="font-mono text-brand-600 dark:text-brand-400">{accessResult.tx_hash || 'N/A'}</span>
            </div>
            {!accessResult.allowed && (
              <p className="text-[11px] text-amber-400/90 pt-1 border-t border-slate-800/80">
                Notice: Security Incident has been automatically dispatched and anchored to the audit ledger.
              </p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};
