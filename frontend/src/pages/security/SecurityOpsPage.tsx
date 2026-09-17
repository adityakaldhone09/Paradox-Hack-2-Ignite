import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Activity,
  AlertTriangle,
  Cpu,
  Flame,
  Radio,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { securityApi } from '../../services/apiClient';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { HashViewer } from '../../components/ui/HashViewer';

export const SecurityOpsPage: React.FC = () => {
  const [heatmap, setHeatmap] = useState<any[]>([]);
  const [threatFeed, setThreatFeed] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOpsData = async () => {
      try {
        const [hRes, tRes] = await Promise.all([
          securityApi.getHeatmap(),
          securityApi.getThreatFeed(),
        ]);
        setHeatmap(hRes.data);
        setThreatFeed(tRes.data);
      } catch (err) {
        console.error('Error fetching security ops data', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadOpsData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-950 dark:text-white tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-rose-500 dark:text-rose-400" />
            Security Operations & Anomaly Detection
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Real-time multi-centre threat surveillance, risk heatmaps, and AI-assisted behavioral anomaly telemetry.
          </p>
        </div>
      </div>

      {/* AI Anomaly Detection Overview Card (Section 28) */}
      <Card className="p-5 border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-50 via-white to-indigo-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/30 shadow-xs">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">AI Behavioral Anomaly Detection Engine</h3>
            <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">Deterministic Heuristic Baseline Model</span>
          </div>
        </div>

        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          The anomaly detection layer evaluates real-time access velocities, terminal device fingerprints, and off-hours custody requests. All outputs are explicitly classified as{' '}
          <strong className="text-brand-600 dark:text-brand-400">Risk indications</strong> rather than definitive proof of malicious behaviour.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 block">Baseline Model Status:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Active & Monitoring
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Velocity Threshold:</span>
            <span className="font-mono text-slate-800 dark:text-slate-200">5 req / 60s max</span>
          </div>
          <div>
            <span className="text-slate-500 block">Hardware Validation:</span>
            <span className="font-mono text-slate-800 dark:text-slate-200">SHA-256 TPM Fingerprint</span>
          </div>
          <div>
            <span className="text-slate-500 block">Evaluation Protocol:</span>
            <span className="text-brand-600 dark:text-brand-400 font-mono">Consensus-Linked</span>
          </div>
        </div>
      </Card>

      {/* Centre Security Heatmap */}
      <Card className="p-5 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            Centre Security Risk Heatmap ({heatmap.length} Centres)
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">Aggregated incidents & blocked access scores</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {heatmap.map((item) => {
            const isHigh = item.risk_level === 'HIGH';
            const isMed = item.risk_level === 'MEDIUM';

            return (
              <div
                key={item.centre_id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isHigh
                    ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-300 dark:border-rose-500/40 text-rose-800 dark:text-rose-300'
                    : isMed
                    ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-300 dark:border-amber-500/30 text-amber-800 dark:text-amber-300'
                    : 'bg-slate-50 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">{item.centre_id}</span>
                  <StatusBadge status={item.risk_level} showIcon={false} />
                </div>
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">{item.centre_name}</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{item.city}</p>

                <div className="flex justify-between items-center text-[11px] pt-2 mt-2 border-t border-slate-200 dark:border-slate-800/80">
                  <span className="text-slate-500">Risk Index:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{item.risk_score}/100</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Real-time Threat Stream */}
      <Card className="p-5 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            Consortium Real-Time Threat Stream
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">Live feed</span>
        </div>

        <div className="space-y-2.5">
          {threatFeed.map((item) => (
            <div key={item.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <StatusBadge status={item.severity} />
                  <span className="font-mono text-slate-800 dark:text-slate-300 font-bold">{item.type}</span>
                  <span className="text-slate-500">• {item.centre}</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 font-medium">{item.description}</p>
              </div>

              <div className="flex sm:flex-col items-end gap-1 flex-shrink-0">
                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </span>
                <HashViewer hash={item.tx_hash} truncate={true} prefixLen={6} suffixLen={4} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
