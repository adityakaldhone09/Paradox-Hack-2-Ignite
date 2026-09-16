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
  ArrowRight,
  RefreshCw,
  Activity,
  Cpu
} from 'lucide-react';
import { securityApi, examApi, blockchainApi } from '../../services/apiClient';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { HashViewer } from '../../components/ui/HashViewer';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [exams, setExams] = useState<any[]>([]);
  const [threatFeed, setThreatFeed] = useState<any[]>([]);
  const [blockchainStatus, setBlockchainStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const kpis = [
    { label: 'Active Examinations', value: summary?.active_examinations ?? 5, icon: GraduationCap, color: 'text-blue-400', link: '/examinations' },
    { label: 'Secured Papers', value: summary?.secured_papers ?? 10, icon: FileCheck, color: 'text-brand-400', link: '/papers' },
    { label: 'Authorized Centres', value: summary?.authorized_centres ?? 10, icon: Building2, color: 'text-purple-400', link: '/centres' },
    { label: 'Successful Accesses', value: summary?.successful_accesses ?? 284, icon: CheckCircle2, color: 'text-emerald-400', link: '/custody' },
    { label: 'Blocked Attempts', value: summary?.blocked_attempts ?? 4, icon: Lock, color: 'text-amber-400', link: '/incidents' },
    { label: 'Security Alerts', value: summary?.security_alerts ?? 2, icon: AlertTriangle, color: 'text-amber-500', link: '/incidents' },
    { label: 'Integrity Violations', value: summary?.integrity_violations ?? 0, icon: ShieldAlert, color: 'text-rose-400', link: '/security' },
    { label: 'Ledger Transactions', value: summary?.blockchain_transactions ?? 28, icon: Boxes, color: 'text-indigo-400', link: '/blockchain' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Title & Quick Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            Security Command Center
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
              summary?.threat_level === 'CRITICAL'
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}>
              {summary?.threat_level || 'NORMAL'} POSTURE
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time examination paper lifecycle monitoring, cryptographic verification, and time-lock telemetry.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={loadDashboardData}>
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Live
          </Button>
          <Link to="/papers">
            <Button size="sm">
              Upload Paper
            </Button>
          </Link>
        </div>
      </div>

      {/* 8 KPI Cards (Staggered Entrance) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <Link key={kpi.label} to={kpi.link}>
              <Card hoverable className="p-4 border-slate-800 hover:border-brand-500/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">{kpi.label}</span>
                  <Icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
                <div className="text-2xl font-black text-white mt-2 font-mono tracking-tight">
                  {kpi.value}
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Access Series Analytics & Blockchain Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Security Access Analytics (Recharts AreaChart) */}
        <Card className="lg:col-span-2 p-5 border-slate-800 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-brand-400" />
                Examination Access Telemetry
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Hourly ratio of authorized releases vs blocked unauthorized/early attempts
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Authorized
              </span>
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Blocked
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={summary?.access_series || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="label" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="successful" stroke="#10b981" fillOpacity={1} fill="url(#colorSuccess)" />
                <Area type="monotone" dataKey="blocked" stroke="#ef4444" fillOpacity={1} fill="url(#colorBlocked)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Blockchain Health Monitor */}
        <Card className="p-5 border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Boxes className="w-4 h-4 text-indigo-400" />
                Ledger Health
              </h3>
              <StatusBadge status="ACTIVE" showIcon={false} />
            </div>

            <div className="space-y-3 mt-4">
              <div>
                <span className="text-xs text-slate-400">Consortium Network</span>
                <p className="text-sm font-semibold text-slate-100">{blockchainStatus?.network || 'VeriQ-Proof-Ledger'}</p>
              </div>

              <div className="flex justify-between items-center py-2 border-y border-slate-800/60">
                <div>
                  <span className="text-xs text-slate-400">Mined Block Height</span>
                  <p className="text-lg font-mono font-bold text-brand-400">
                    #{blockchainStatus?.block_height ?? 1}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">Total Anchors</span>
                  <p className="text-lg font-mono font-bold text-indigo-400">
                    {blockchainStatus?.total_transactions ?? 28}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400">Latest Mined Block Hash</span>
                <div className="mt-1">
                  <HashViewer hash={blockchainStatus?.latest_block_hash || '0x498e821fa0c'} truncate={true} />
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400">Consensus Engine</span>
                <p className="text-xs text-slate-300 font-mono mt-0.5">Proof-of-Authority (PoA) / SHA-256 Merkle Chain</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 mt-4">
            <Link to="/blockchain">
              <Button variant="outline" size="sm" className="w-full justify-between">
                Open Blockchain Explorer <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Examination Overview & Live Threat Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Examination Overview Table */}
        <Card className="lg:col-span-2 p-5 border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-brand-400" />
              Examination Overview
            </h3>
            <Link to="/examinations" className="text-xs text-brand-400 hover:underline">
              View All ({exams.length})
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold">
                  <th className="pb-2.5">Code</th>
                  <th className="pb-2.5">Name</th>
                  <th className="pb-2.5">Date & Time</th>
                  <th className="pb-2.5">Sec Level</th>
                  <th className="pb-2.5">Centres</th>
                  <th className="pb-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {exams.slice(0, 5).map((ex) => (
                  <tr key={ex.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3 font-mono font-semibold text-brand-400">{ex.exam_id}</td>
                    <td className="py-3 font-medium text-slate-200">{ex.name}</td>
                    <td className="py-3 text-slate-400">{ex.exam_date} {ex.start_time.slice(0, 5)}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {ex.security_level}
                      </span>
                    </td>
                    <td className="py-3 text-slate-300">{ex.assigned_centres_count} Centres</td>
                    <td className="py-3">
                      <StatusBadge status={ex.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Live Threat Feed */}
        <Card className="p-5 border-slate-800 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Live Threat Feed
            </h3>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-72 custom-scrollbar">
            {threatFeed.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No security violations recorded.</p>
            ) : (
              threatFeed.map((item) => (
                <div key={item.id} className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/80 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <StatusBadge status={item.severity} />
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-slate-300 font-medium leading-relaxed">{item.description}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>{item.centre}</span>
                    <HashViewer hash={item.tx_hash} truncate={true} prefixLen={6} suffixLen={4} />
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
