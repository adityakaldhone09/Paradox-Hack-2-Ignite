import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Filter,
  Eye,
  Check,
  Search,
  Lock,
  Boxes
} from 'lucide-react';
import { incidentApi, getCachedApiResponse } from '../../services/apiClient';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { HashViewer } from '../../components/ui/HashViewer';
import { toast } from 'sonner';

export const IncidentsPage: React.FC = () => {
  const [incidents, setIncidents] = useState<any[]>(() => getCachedApiResponse('/incidents') || []);
  const [typeFilter, setTypeFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [isResolveOpen, setIsResolveOpen] = useState(false);
  const [resolveNotes, setResolveNotes] = useState('');

  const loadIncidents = async () => {
    try {
      const res = await incidentApi.list({
        type: typeFilter || undefined,
        severity: severityFilter || undefined,
      });
      setIncidents(res.data);
    } catch (err) {
      console.error('Error loading incidents', err);
    }
  };

  useEffect(() => {
    loadIncidents();
    const handleRefresh = () => loadIncidents();
    window.addEventListener('veriQ_refresh_data', handleRefresh);
    return () => window.removeEventListener('veriQ_refresh_data', handleRefresh);
  }, [typeFilter, severityFilter]);

  const handleAcknowledge = async (id: string) => {
    try {
      await incidentApi.acknowledge(id);
      toast.success('Incident acknowledged');
      loadIncidents();
    } catch (err) {
      toast.error('Failed to acknowledge');
    }
  };

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncident || !resolveNotes) return;
    try {
      await incidentApi.resolve(selectedIncident.id, { resolution_notes: resolveNotes });
      toast.success('Incident marked as resolved');
      setIsResolveOpen(false);
      setResolveNotes('');
      loadIncidents();
    } catch (err) {
      toast.error('Failed to resolve incident');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-500 dark:text-amber-400" />
            Security Incident Management
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Automated alerts triggered by early access attempts, device fingerprint mismatches, and SHA-256 integrity failures.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs shadow-sm dark:shadow-none">
        <span className="text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Filters:
        </span>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-brand-500"
        >
          <option value="">All Incident Types</option>
          <option value="EARLY_ACCESS">Early Access</option>
          <option value="DEVICE_MISMATCH">Device Mismatch</option>
          <option value="HASH_MISMATCH">Hash Mismatch</option>
          <option value="UNAUTHORIZED_ACCESS">Unauthorized Access</option>
          <option value="SUSPICIOUS_ACTIVITY">Suspicious Activity</option>
        </select>

        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-brand-500"
        >
          <option value="">All Severities</option>
          <option value="CRITICAL">CRITICAL</option>
          <option value="HIGH">HIGH</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="LOW">LOW</option>
        </select>
      </div>

      {/* Incidents Table */}
      <Card className="p-5 border-slate-200 dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-semibold">
                <th className="pb-2.5">Incident ID</th>
                <th className="pb-2.5">Severity</th>
                <th className="pb-2.5">Type</th>
                <th className="pb-2.5">Centre</th>
                <th className="pb-2.5">Description</th>
                <th className="pb-2.5">Timestamp</th>
                <th className="pb-2.5">Status</th>
                <th className="pb-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
              {incidents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">No active security incidents found.</td>
                </tr>
              ) : (
                incidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="py-3 font-mono text-brand-600 dark:text-brand-400 font-bold">{inc.incident_id}</td>
                    <td className="py-3">
                      <StatusBadge status={inc.severity} />
                    </td>
                    <td className="py-3 font-mono text-slate-700 dark:text-slate-300 font-medium">{inc.type}</td>
                    <td className="py-3 text-slate-800 dark:text-slate-200">{inc.centre_name || 'Central Platform'}</td>
                    <td className="py-3 text-slate-700 dark:text-slate-300 max-w-xs truncate">{inc.description}</td>
                    <td className="py-3 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                      {new Date(inc.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3">
                      <StatusBadge status={inc.status} />
                    </td>
                    <td className="py-3 text-right space-x-1.5">
                      {inc.status === 'OPEN' && (
                        <button
                          onClick={() => handleAcknowledge(inc.id)}
                          className="px-2 py-1 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 font-medium text-[11px]"
                        >
                          Acknowledge
                        </button>
                      )}
                      {inc.status !== 'RESOLVED' && (
                        <button
                          onClick={() => {
                            setSelectedIncident(inc);
                            setIsResolveOpen(true);
                          }}
                          className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 font-medium text-[11px]"
                        >
                          Resolve
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Resolve Modal */}
      <Modal isOpen={isResolveOpen} onClose={() => setIsResolveOpen(false)} title="Resolve Security Incident">
        <form onSubmit={handleResolve} className="space-y-4 text-xs">
          <p className="text-slate-700 dark:text-slate-300">
            Resolving Incident <span className="font-mono text-brand-600 dark:text-brand-400 font-bold">{selectedIncident?.incident_id}</span>
          </p>
          <div>
            <label className="block font-semibold text-slate-800 dark:text-slate-300 mb-1">Resolution Investigation Notes *</label>
            <textarea
              required
              rows={3}
              placeholder="Detail root cause and mitigation steps taken..."
              value={resolveNotes}
              onChange={(e) => setResolveNotes(e.target.value)}
              className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-brand-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button variant="ghost" type="button" onClick={() => setIsResolveOpen(false)}>Cancel</Button>
            <Button type="submit">Mark as Resolved</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
