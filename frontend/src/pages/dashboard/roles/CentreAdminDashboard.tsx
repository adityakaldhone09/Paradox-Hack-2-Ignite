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
  FileText
} from 'lucide-react';
import { examApi, paperApi, deviceApi, incidentApi } from '../../../services/apiClient';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { CountdownTimer } from '../../../components/ui/CountdownTimer';

export const CentreAdminDashboard: React.FC = () => {
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
        deviceApi.list(),
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
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Centre Operations Portal
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              CENTRE C101 (MUMBAI)
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Superintendent control center: assigned paper rosters, physical hardware whitelists, and time-lock countdowns.
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
              Time-Lock Release Portal
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Assigned Examinations</span>
            <Building2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{exams.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Scheduled at this facility</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Secured Paper Bundles</span>
            <FileCheck2 className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{papers.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Pre-staged AES-256 encrypted</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Whitelisted Terminals</span>
            <Laptop className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{devices.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Approved hardware fingerprints</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Centre Security Alerts</span>
            <ShieldAlert className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{incidents.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Zero unhandled breaches</div>
        </div>
      </div>

      {/* Release Countdown Showcase */}
      <Card className="p-6 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              <Clock className="w-3.5 h-3.5" />
              Next Scheduled Decryption Window
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              CSE Semester Examination — Database Management Systems (Set A)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Hardware Terminals Bound: <span className="font-mono text-slate-700 dark:text-slate-300">DEV-C101-01</span> • Verified Subnet: <span className="font-mono text-slate-700 dark:text-slate-300">192.168.1.0/24</span>
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
        <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Assigned Question Papers
            </h2>
            <Link to="/papers" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {papers.slice(0, 4).map((p) => (
              <div
                key={p.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{p.title}</div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">{p.paper_id}</div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={p.status} />
                  <Link to="/verify">
                    <Button variant="outline" size="sm" className="h-7 text-xs px-2">
                      Verify
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Authorized Devices */}
        <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Laptop className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Whitelisted Physical Terminals
            </h2>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
              {devices.length} Devices Online
            </span>
          </div>

          <div className="space-y-3">
            {devices.slice(0, 4).map((dev) => (
              <div
                key={dev.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    {dev.device_name || 'Authorized Terminal'}
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    Fingerprint: {dev.device_fingerprint?.slice(0, 16)}...
                  </div>
                </div>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
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
