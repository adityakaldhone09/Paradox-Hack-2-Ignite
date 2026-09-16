import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  FileCheck,
  Building2,
  CheckCircle2,
  ShieldAlert,
  AlertTriangle,
  Boxes,
  Lock,
  ArrowUpRight,
  RefreshCw,
  Activity,
  Cpu,
  ShieldCheck,
  Sparkles,
  Layers,
  FileCode
} from 'lucide-react';
import { securityApi, examApi, blockchainApi, demoApi } from '../../../services/apiClient';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { HashViewer } from '../../../components/ui/HashViewer';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { toast } from 'sonner';
import { useTheme } from '../../../store/ThemeContext';

export const SuperAdminDashboard: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [summary, setSummary] = useState<any>(null);
  const [exams, setExams] = useState<any[]>([]);
  const [threatFeed, setThreatFeed] = useState<any[]>([]);
  const [blockchainStatus, setBlockchainStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);

  const loadDashboardData = async () => {
    try {
      const [sumRes, examsRes, feedRes, bcRes] = await Promise.all([
        securityApi.getSummary(),
        examApi.list(),
        securityApi.getThreatFeed(),
        blockchainApi.getStatus(),
      ]);
      setSummary(sumRes.data);
      setExams(examsRes.data);
      setThreatFeed(feedRes.data);
      setBlockchainStatus(bcRes.data);
    } catch (err) {
      console.error('Error fetching dashboard metrics', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    const handleRefresh = () => loadDashboardData();
    window.addEventListener('veriQ_refresh_data', handleRefresh);
    const interval = setInterval(loadDashboardData, 10000);
    return () => {
      window.removeEventListener('veriQ_refresh_data', handleRefresh);
      clearInterval(interval);
      window.removeEventListener('veriQ_refresh_data', handleRefresh);
    };
  }, []);

  const runSimulation = async (type: string, label: string) => {
    setIsSimulating(true);
    try {
      const res = await demoApi.simulateEvent(type);
      toast.error(`🚨 Security Event Triggered: ${label}`, {
        description: res.data?.description || `Recorded in Block #${res.data?.block_number}`,
      });
      loadDashboardData();
    } catch (err: any) {
      toast.error(`Simulation failed: ${err.message}`);
    } finally {
      setIsSimulating(false);
    }
  };

  const kpis = [
    { label: 'Active Examinations', value: summary?.active_examinations ?? 5, icon: GraduationCap, color: 'text-blue-600 dark:text-blue-400', link: '/examinations' },
    { label: 'Secured Papers', value: summary?.secured_papers ?? 10, icon: FileCheck, color: 'text-indigo-600 dark:text-indigo-400', link: '/papers' },
    { label: 'Authorized Centres', value: summary?.authorized_centres ?? 10, icon: Building2, color: 'text-purple-600 dark:text-purple-400', link: '/centres' },
    { label: 'Successful Accesses', value: summary?.successful_accesses ?? 284, icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400', link: '/custody' },
    { label: 'Blocked Attempts', value: summary?.blocked_attempts ?? 4, icon: Lock, color: 'text-amber-600 dark:text-amber-400', link: '/incidents' },
    { label: 'Security Alerts', value: summary?.security_alerts ?? 2, icon: AlertTriangle, color: 'text-amber-500', link: '/incidents' },
    { label: 'Integrity Violations', value: summary?.integrity_violations ?? 0, icon: ShieldAlert, color: 'text-rose-600 dark:text-rose-400', link: '/security-ops' },
    { label: 'Ledger Transactions', value: summary?.blockchain_transactions ?? 28, icon: Boxes, color: 'text-indigo-600 dark:text-indigo-400', link: '/blockchain' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Super Admin Command Center
            </h1>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                summary?.threat_level === 'CRITICAL'
                  ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 animate-pulse'
                  : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
              }`}
            >
              {summary?.threat_level || 'NORMAL'} POSTURE
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Institutional examination security governance, blockchain anchoring, and threat mitigation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadDashboardData} isLoading={isLoading}>
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Refresh Telemetry
          </Button>
          <Link to="/papers">
            <Button variant="primary" size="sm">
              <FileCheck className="w-3.5 h-3.5 mr-1.5" />
              Manage Papers
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Simulation Banner */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="font-semibold">Hackathon Stress Tests:</span>
          <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">
            Trigger real cryptographic events to verify instant blockchain logging & alerts
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            className="text-xs h-7 px-2.5 border-amber-300 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-950/40"
            onClick={() => runSimulation('EARLY_ACCESS', 'Early Access Blocked')}
            disabled={isSimulating}
          >
            Early Access
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-xs h-7 px-2.5 border-rose-300 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-950/40"
            onClick={() => runSimulation('DOCUMENT_TAMPERING', 'Document Tampering Alert')}
            disabled={isSimulating}
          >
            Tamper Document
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-xs h-7 px-2.5 border-purple-300 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/40"
            onClick={() => runSimulation('DEVICE_MISMATCH', 'Rogue Device Fingerprint')}
            disabled={isSimulating}
          >
            Rogue Device
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Link key={kpi.label} to={kpi.link} className="block group">
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-4 h-4 ${kpi.color}`} />
                  <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
                </div>
                <div className="text-xl font-bold text-slate-900 dark:text-white">
                  {kpi.value}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5 truncate">
                  {kpi.label}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main Charts & Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Access Graph */}
        <Card className="lg:col-span-2 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Paper Access & Release Evaluation Telemetry
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Synchronized 24-hour verification request throughput and policy enforcement
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              Live Stream
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={summary?.access_series || [
                { label: '06:00', successful: 12, blocked: 0 },
                { label: '08:00', successful: 45, blocked: 1 },
                { label: '10:00', successful: 120, blocked: 3 },
                { label: '12:00', successful: 85, blocked: 0 },
                { label: '14:00', successful: 60, blocked: 2 },
                { label: '16:00', successful: 30, blocked: 0 },
              ]}>
                <defs>
                  <linearGradient id="gradSuccess" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#E2E8F0'} opacity={0.8} />
                <XAxis dataKey="label" stroke={isDark ? '#94A3B8' : '#64748B'} fontSize={11} tick={{ fill: isDark ? '#94A3B8' : '#64748B' }} />
                <YAxis stroke={isDark ? '#94A3B8' : '#64748B'} fontSize={11} tick={{ fill: isDark ? '#94A3B8' : '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
                    borderColor: isDark ? '#334155' : '#CBD5E1',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: isDark ? '#FFFFFF' : '#0F172A',
                    boxShadow: isDark ? '0 10px 15px -3px rgba(0, 0, 0, 0.5)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  }}
                  itemStyle={{ color: isDark ? '#E2E8F0' : '#1E293B' }}
                  labelStyle={{ color: isDark ? '#94A3B8' : '#64748B', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="successful" stroke="#4F46E5" fillOpacity={1} fill="url(#gradSuccess)" name="Authorized Access" />
                <Area type="monotone" dataKey="blocked" stroke="#F43F5E" fillOpacity={0} name="Blocked Attempt" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Blockchain Ledger State */}
        <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Boxes className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                VeriQ Proof Ledger
              </h2>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                {blockchainStatus?.status || 'CONNECTED'}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
                  Network Specification
                </div>
                <div className="font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                  {blockchainStatus?.network || 'VeriQ-Proof-Ledger-Local'}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Consensus: Proof-of-Authority (PoA) Consortium
                </div>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Block Height:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  #{blockchainStatus?.block_height ?? 14}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Total Anchored Txs:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {blockchainStatus?.total_transactions ?? 28}
                </span>
              </div>

              <div className="py-2">
                <div className="text-slate-500 mb-1">Latest Mined Block Hash:</div>
                <HashViewer hash={blockchainStatus?.latest_block_hash || '0x7df489c1...'} />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <Link to="/blockchain">
              <Button variant="outline" size="sm" className="w-full justify-between">
                <span>Inspect Blockchain Explorer</span>
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Examinations Overview & Incident Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Examinations */}
        <Card className="lg:col-span-2 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Scheduled Examination Rosters
            </h2>
            <Link to="/examinations" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
              View All ({exams.length})
            </Link>
          </div>

          <div className="space-y-3">
            {exams.slice(0, 4).map((ex) => (
              <div
                key={ex.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {ex.exam_id}
                    </span>
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      {ex.name}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {ex.subject} • {ex.exam_date} ({ex.start_time} - {ex.end_time})
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {ex.assigned_centres_count || 10} Centres
                  </span>
                  <StatusBadge status={ex.status || 'SCHEDULED'} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Live Incident & Threat Feed */}
        <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              Live Threat Log
            </h2>
            <Link to="/incidents" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
              View Log
            </Link>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {threatFeed.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No active threats detected. All perimeter gates secure.
              </div>
            ) : (
              threatFeed.slice(0, 5).map((inc) => (
                <div
                  key={inc.id}
                  className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-bold text-[10px] uppercase px-1.5 py-0.5 rounded ${
                      inc.severity === 'CRITICAL'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {inc.severity}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(inc.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="font-medium text-slate-800 dark:text-slate-200 line-clamp-2">
                    {inc.description}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
