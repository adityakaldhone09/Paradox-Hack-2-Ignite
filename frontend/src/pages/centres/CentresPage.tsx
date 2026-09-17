import React, { useState, useEffect } from 'react';
import {
  Building2,
  Cpu,
  ShieldCheck,
  ShieldAlert,
  Search,
  CheckCircle2,
  XCircle,
  Laptop
} from 'lucide-react';
import { centreApi, deviceApi, getCachedApiResponse } from '../../services/apiClient';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { HashViewer } from '../../components/ui/HashViewer';
import { toast } from 'sonner';

export const CentresPage: React.FC = () => {
  const [centres, setCentres] = useState<any[]>(() => getCachedApiResponse('/centres') || []);
  const [devices, setDevices] = useState<any[]>(() => getCachedApiResponse('/devices') || []);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isLoading, setIsLoading] = useState(() => !getCachedApiResponse('/centres'));

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const loadData = async () => {
    try {
      const [cRes, dRes] = await Promise.all([
        centreApi.list({ search: debouncedSearch || undefined }),
        deviceApi.list(),
      ]);
      setCentres(cRes.data);
      setDevices(dRes.data);
    } catch (err) {
      console.error('Error loading centres', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [debouncedSearch]);

  const toggleCentreAuth = async (id: string, isCurrentlyAuth: boolean) => {
    try {
      if (isCurrentlyAuth) {
        await centreApi.revoke(id);
        toast.error('Centre authorization revoked');
      } else {
        await centreApi.authorize(id);
        toast.success('Centre authorized successfully');
      }
      loadData();
    } catch (err: any) {
      toast.error('Action failed: ' + (err.response?.data?.detail || err.message));
    }
  };

  const toggleDeviceAuth = async (id: string, isCurrentlyAuth: boolean) => {
    try {
      if (isCurrentlyAuth) {
        await deviceApi.revoke(id);
        toast.error('Terminal device revoked');
      } else {
        await deviceApi.authorize(id);
        toast.success('Terminal device authorized');
      }
      loadData();
    } catch (err: any) {
      toast.error('Action failed: ' + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-950 dark:text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            Centres & Authorized Devices
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Manage authorized examination centres and whitelist trusted hardware terminal fingerprints.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4 bg-white dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search centres by name, code, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {/* Centres Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {centres.map((c) => {
          const centreDevices = devices.filter((d) => d.centre_id === c.id);
          return (
            <Card key={c.id} className="p-5 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
                    {c.centre_id}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">[{c.code}]</span>
                </div>
                <StatusBadge status={c.status} />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{c.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{c.city}, {c.state}</p>
              </div>

              {/* Devices Section */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Laptop className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                  Whitelisted Hardware Terminals ({centreDevices.length})
                </span>

                <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                  {centreDevices.map((d) => (
                    <div key={d.id} className="p-2 rounded bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-medium text-slate-900 dark:text-slate-200 block">{d.device_name}</span>
                        <HashViewer hash={d.device_fingerprint} label="Fingerprint" truncate={true} prefixLen={6} suffixLen={4} />
                      </div>
                      <button
                        onClick={() => toggleDeviceAuth(d.id, d.status === 'AUTHORIZED')}
                        className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${
                          d.status === 'AUTHORIZED'
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 border border-rose-500/30'
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30'
                        }`}
                      >
                        {d.status === 'AUTHORIZED' ? 'Revoke' : 'Authorize'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                <Button
                  variant={c.is_authorized ? 'outline' : 'primary'}
                  size="sm"
                  onClick={() => toggleCentreAuth(c.id, c.is_authorized)}
                >
                  {c.is_authorized ? 'Revoke Centre Authorization' : 'Authorize Centre'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
