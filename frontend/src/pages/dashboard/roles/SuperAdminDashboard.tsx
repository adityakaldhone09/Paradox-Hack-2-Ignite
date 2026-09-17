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
  Zap,
} from 'lucide-react';
import { securityApi, examApi, blockchainApi, demoApi, getCachedApiResponse } from '../../../services/apiClient';
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
  CartesianGrid,
} from 'recharts';
import { toast } from 'sonner';
import { useTheme } from '../../../store/ThemeContext';

export const SuperAdminDashboard: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [summary, setSummary] = useState<any>(() => getCachedApiResponse('/security/summary'));
  const [exams, setExams] = useState<any[]>(() => getCachedApiResponse('/exams') || []);
  const [threatFeed, setThreatFeed] = useState<any[]>(() => getCachedApiResponse('/security/threat-feed') || []);
  const [blockchainStatus, setBlockchainStatus] = useState<any>(() => getCachedApiResponse('/blockchain/status'));
  const [isLoading, setIsLoading] = useState(() => !getCachedApiResponse('/security/summary'));
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
    };
  }, []);

  const runSimulation = async (type: string, label: string) => {
    setIsSimulating(true);
    try {
      const res = await demoApi.simulateEvent(type);
      toast.error(`Security Event: ${label}`, {
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
    { label: 'Active Examinations', value: summary?.active_examinations ?? 5, sub: 'Scheduled cycles', link: '/examinations' },
    { label: 'Secured Papers', value: summary?.secured_papers ?? 10, sub: 'AES-256 sealed', link: '/papers' },
    { label: 'Authorized Centres', value: summary?.authorized_centres ?? 10, sub: 'Hardware whitelisted', link: '/centres' },
    { label: 'Successful Accesses', value: summary?.successful_accesses ?? 284, sub: 'Verified downloads', link: '/custody' },
    { label: 'Blocked Attempts', value: summary?.blocked_attempts ?? 4, sub: 'Early/rogue blocked', link: '/incidents' },
    { label: 'Security Alerts', value: summary?.security_alerts ?? 2, sub: 'Open incidents', link: '/incidents' },
    { label: 'Integrity Violations', value: summary?.integrity_violations ?? 0, sub: 'Zero tampering', link: '/security-ops' },
    { label: 'Ledger Transactions', value: summary?.blockchain_transactions ?? 28, sub: 'Anchored blocks', link: '/blockchain' },
  ];

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200/80 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">
              Super Admin Command Center
            </h1>
            <span
              className={`text-[11px] px-2.5 py-0.5 rounded-full font-mono font-medium ${
                summary?.threat_level === 'CRITICAL'
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
              }`}
            >
              {summary?.threat_level || 'NORMAL'} POSTURE
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            System security posture, blockchain ledger verification, and institutional governance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadDashboardData} isLoading={isLoading}>
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Sync Telemetry
          </Button>
          <Link to="/papers">
            <Button variant="primary" size="sm">
              <FileCheck className="w-3.5 h-3.5 mr-1.5" />
              Manage Papers
            </Button>
          </Link>
        </div>
      </div>

      {/* Typographic Metric Grid (Restrained, Apple/Linear style) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Link key={kpi.label} to={kpi.link} className="block group">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#111113] border border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 shadow-xs hover:shadow-sm transition-all duration-200">
              <div className="flex items-center justify-between text-neutral-400 text-xs font-mono uppercase tracking-wider mb-2">
                <span>{kpi.label}</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-3xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
                {kpi.value}
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                {kpi.sub}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Charts & Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Access Graph */}
        <Card className="lg:col-span-2 p-6 bg-white dark:bg-[#111113] border border-neutral-200/80 dark:border-neutral-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-bold text-neutral-950 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-neutral-500" />
                Paper Access & Release Evaluation
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                24-hour verification request throughput and policy enforcement
              </p>
            </div>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              LIVE STREAM
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
                    <stop offset="5%" stopColor={isDark ? '#3B82F6' : '#2563EB'} stopOpacity={0.25}/>
                    <stop offset="95%" stopColor={isDark ? '#3B82F6' : '#2563EB'} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 2" stroke={isDark ? '#27272A' : '#F3F4F6'} vertical={false} />
                <XAxis dataKey="label" stroke={isDark ? '#71717A' : '#9CA3AF'} fontSize={11} tickLine={false} />
                <YAxis stroke={isDark ? '#71717A' : '#9CA3AF'} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#18181B' : '#FFFFFF',
                    borderColor: isDark ? '#27272A' : '#E5E7EB',
                    borderRadius: '12px',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                />
                <Area type="monotone" dataKey="successful" stroke={isDark ? '#3B82F6' : '#2563EB'} strokeWidth={2} fillOpacity={1} fill="url(#gradSuccess)" name="Successful Releases" />
                <Area type="monotone" dataKey="blocked" stroke="#EF4444" strokeWidth={1.5} fillOpacity={0} name="Blocked Attempts" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Blockchain Network Telemetry Card */}
        <Card className="p-6 bg-white dark:bg-[#111113] border border-neutral-200/80 dark:border-neutral-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
              <h2 className="text-sm font-bold text-neutral-950 dark:text-white flex items-center gap-2">
                <Boxes className="w-4 h-4 text-neutral-500" />
                Blockchain Ledger
              </h2>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                CONNECTED
              </span>
            </div>

            <div className="space-y-4 pt-4 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Ledger Block Height:</span>
                <span className="font-mono font-bold text-neutral-950 dark:text-white">
                  #{blockchainStatus?.block_height ?? 1489}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Chain State:</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  {blockchainStatus?.chain_valid ? 'Cryptographically Valid' : 'Validating'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Consensus Engine:</span>
                <span className="font-mono text-neutral-700 dark:text-neutral-300">
                  SHA-256 Proof-of-Authority
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Total Anchored Events:</span>
                <span className="font-mono font-bold text-neutral-950 dark:text-white">
                  {blockchainStatus?.total_events ?? 28}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <Link to="/blockchain">
              <Button variant="outline" size="sm" className="w-full">
                Open Ledger Explorer <ArrowUpRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Threat Feed & Active Examinations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Examinations */}
        <Card className="p-6 bg-white dark:bg-[#111113] border border-neutral-200/80 dark:border-neutral-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-neutral-950 dark:text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-neutral-500" />
              Active Examination Schedules
            </h2>
            <Link to="/examinations" className="text-xs text-neutral-500 hover:text-neutral-950 dark:hover:text-white">
              View All
            </Link>
          </div>

          <div className="space-y-2.5">
            {exams.slice(0, 4).map((exam) => (
              <div
                key={exam.id}
                className="p-3.5 rounded-xl border border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/30 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-semibold text-neutral-950 dark:text-white">{exam.title}</p>
                  <p className="text-[11px] font-mono text-neutral-400">{exam.code} • {exam.duration_minutes} Minutes</p>
                </div>
                <StatusBadge status={exam.status} />
              </div>
            ))}
          </div>
        </Card>

        {/* Threat & Security Incident Feed */}
        <Card className="p-6 bg-white dark:bg-[#111113] border border-neutral-200/80 dark:border-neutral-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-neutral-950 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-neutral-500" />
              Recent Security & Incident Logs
            </h2>
            <Link to="/incidents" className="text-xs text-neutral-500 hover:text-neutral-950 dark:hover:text-white">
              Incident Console
            </Link>
          </div>

          <div className="space-y-2.5">
            {threatFeed.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/30 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-medium text-neutral-900 dark:text-neutral-200">{item.description}</p>
                  <p className="text-[10px] font-mono text-neutral-400 mt-0.5">
                    {new Date(item.timestamp).toLocaleTimeString()} • Centre {item.centre_id || 'Global'}
                  </p>
                </div>
                <StatusBadge status={item.severity || 'INFO'} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
