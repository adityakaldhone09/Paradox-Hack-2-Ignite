import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2,
  Clock,
  Laptop,
  FileCheck2,
  ShieldAlert,
  CheckCircle2,
  Lock,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { examApi, paperApi, deviceApi, incidentApi } from '../../../services/apiClient';
import { useAuth } from '../../../store/AuthContext';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { CountdownTimer } from '../../../components/ui/CountdownTimer';

export const CentreAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState<any[]>([]);
  const [papers, setPapers] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      const [examsRes, papersRes, devicesRes, incRes] = await Promise.all([
        examApi.list(),
        paperApi.list(),
        deviceApi.list(user?.centre_id ? { centre_id: user.centre_id } : undefined),
        incidentApi.list(),
      ]);
      setExams(examsRes.data);
      setPapers(papersRes.data);
      setDevices(devicesRes.data);
      setIncidents(incRes.data);
    } catch (err) {
      console.error('Error fetching centre admin data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.centre_id]);

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200/80 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">
              Centre Operations Portal
            </h1>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
              {user?.name ? `${user.name} (CENTRE C101)` : 'CENTRE C101'}
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Superintendent terminal control: assigned paper rosters, physical terminal fingerprints, and release windows.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadData} isLoading={isLoading}>
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Sync Telemetry
          </Button>
          <Link to="/timelock">
            <Button variant="primary" size="sm">
              <Clock className="w-3.5 h-3.5 mr-1.5" />
              Time-Lock Release
            </Button>
          </Link>
        </div>
      </div>

      {/* Typographic Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111113] border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
          <div className="text-neutral-400 text-xs font-mono uppercase tracking-wider mb-2">
            Assigned Exams
          </div>
          <div className="text-3xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
            {exams.length}
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Active sessions
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#111113] border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
          <div className="text-neutral-400 text-xs font-mono uppercase tracking-wider mb-2">
            Secured Papers
          </div>
          <div className="text-3xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
            {papers.length}
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Pre-staged off-chain
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#111113] border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
          <div className="text-neutral-400 text-xs font-mono uppercase tracking-wider mb-2">
            Terminals Bound
          </div>
          <div className="text-3xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
            {devices.length}
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Hardware fingerprints
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#111113] border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
          <div className="text-neutral-400 text-xs font-mono uppercase tracking-wider mb-2">
            Security Incidents
          </div>
          <div className="text-3xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
            {incidents.length}
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Local anomaly logs
          </div>
        </div>
      </div>

      {/* Release Countdown Showcase */}
      <Card className="p-8 bg-white dark:bg-[#111113] border border-neutral-200/80 dark:border-neutral-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
              <Clock className="w-3.5 h-3.5" />
              Next Scheduled Decryption Window
            </div>
            <h2 className="text-xl font-bold text-neutral-950 dark:text-white">
              CSE Semester Examination — Database Management Systems (Set A)
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Bound Hardware: <span className="font-mono text-neutral-800 dark:text-neutral-200">DEV-C101-01</span> • Authorized Subnet: <span className="font-mono text-neutral-800 dark:text-neutral-200">192.168.1.0/24</span>
            </p>
          </div>

          <div className="flex flex-col items-center sm:items-end gap-3">
            <CountdownTimer targetDate={new Date(Date.now() + 45 * 60 * 1000).toISOString()} />
            <Link to="/timelock">
              <Button variant="primary" size="sm">
                <span>View Time-Lock Evaluation Gate</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Split Grid: Assigned Papers & Hardware Devices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assigned Papers */}
        <Card className="p-6 bg-white dark:bg-[#111113] border border-neutral-200/80 dark:border-neutral-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-neutral-950 dark:text-white flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-neutral-500" />
              Assigned Question Papers
            </h2>
            <Link to="/papers" className="text-xs text-neutral-500 hover:text-neutral-950 dark:hover:text-white">
              View All
            </Link>
          </div>

          <div className="space-y-2.5">
            {papers.slice(0, 4).map((p) => (
              <div
                key={p.id}
                className="p-3.5 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/30 border border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-neutral-950 dark:text-white">{p.title}</div>
                  <div className="text-[11px] text-neutral-400 font-mono mt-0.5">{p.paper_id}</div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={p.status} />
                  <Link to="/verify">
                    <Button variant="outline" size="sm" className="h-7 text-xs px-2.5">
                      Verify
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Authorized Devices */}
        <Card className="p-6 bg-white dark:bg-[#111113] border border-neutral-200/80 dark:border-neutral-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-neutral-950 dark:text-white flex items-center gap-2">
              <Laptop className="w-4 h-4 text-neutral-500" />
              Whitelisted Physical Terminals
            </h2>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
              {devices.length} Online
            </span>
          </div>

          <div className="space-y-2.5">
            {devices.slice(0, 4).map((dev) => (
              <div
                key={dev.id}
                className="p-3.5 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/30 border border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-neutral-950 dark:text-white flex items-center gap-1.5">
                    {dev.device_name || 'Authorized Terminal'}
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                    Fingerprint: {dev.device_fingerprint?.slice(0, 16)}...
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                  {dev.status || 'ACTIVE'}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
