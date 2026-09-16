import React, { useState, useEffect } from 'react';
import {
  FileCheck,
  Printer,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Boxes,
  Building2,
  Calendar,
  Lock
} from 'lucide-react';
import { auditApi, paperApi } from '../../services/apiClient';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { HashViewer } from '../../components/ui/HashViewer';
import { toast } from 'sonner';

export const AuditorPortalPage: React.FC = () => {
  const [papers, setPapers] = useState<any[]>([]);
  const [selectedPaperId, setSelectedPaperId] = useState('');
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadList = async () => {
      try {
        const res = await paperApi.list();
        setPapers(res.data);
        if (res.data.length > 0) {
          setSelectedPaperId(res.data[0].id);
        }
      } catch (err) {
        console.error('Error loading papers', err);
      }
    };
    loadList();
  }, []);

  const loadReport = async () => {
    if (!selectedPaperId) return;
    setIsLoading(true);
    try {
      const res = await auditApi.getReport(selectedPaperId);
      setReport(res.data);
    } catch (err) {
      toast.error('Failed to generate audit report');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedPaperId) loadReport();
  }, [selectedPaperId]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto print:p-0 print:m-0 print:max-w-none">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-brand-400" />
            Auditor Oversight & Compliance Portal
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Independent cryptographic inspection, custody proof verification, and certified audit report generation.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={handlePrint} size="sm">
            <Printer className="w-4 h-4" /> Print / Export PDF
          </Button>
        </div>
      </div>

      {/* Selector Card */}
      <Card className="p-4 border-slate-800 print:hidden flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1 w-full">
          <label className="block text-xs font-semibold text-slate-400 mb-1">Select Paper for Full Audit Inspection</label>
          <select
            value={selectedPaperId}
            onChange={(e) => setSelectedPaperId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-medium"
          >
            {papers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.paper_id} — {p.title}
              </option>
            ))}
          </select>
        </div>
        <Button onClick={loadReport} isLoading={isLoading} size="sm">
          Refresh Audit Proofs
        </Button>
      </Card>

      {/* Official Printable Audit Report Document (Section 29) */}
      {report && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 space-y-6 text-xs text-slate-300 shadow-2xl print:border-none print:shadow-none print:p-4 print:bg-white print:text-black">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 print:border-black gap-4">
            <div>
              <span className="text-[10px] tracking-widest font-mono text-brand-400 uppercase font-bold block">
                VeriQ Official Ledger Compliance Report
              </span>
              <h2 className="text-xl font-black text-white print:text-black mt-1">{report.report_id}</h2>
              <span className="text-slate-500 text-[11px]">Generated: {new Date(report.generated_at).toLocaleString()}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Compliance Status</span>
              <span className="text-sm font-black text-emerald-400 font-mono mt-0.5">
                {report.auditor_status}
              </span>
            </div>
          </div>

          {/* Section 1: Examination & Paper Identifiers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5 print:bg-slate-50 print:border-slate-300">
              <span className="font-bold text-slate-200 print:text-black uppercase text-[10px]">Examination Scope</span>
              <p className="font-semibold text-white print:text-black text-sm">{report.examination.name}</p>
              <p className="text-slate-400 print:text-slate-700">Code: {report.examination.code} • Subject: {report.examination.subject}</p>
              <p className="text-slate-400 print:text-slate-700">Date: {report.examination.date} • Security: {report.examination.security_level}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5 print:bg-slate-50 print:border-slate-300">
              <span className="font-bold text-slate-200 print:text-black uppercase text-[10px]">Paper Cryptographic State</span>
              <p className="font-semibold text-white print:text-black text-sm">{report.paper.title} (v{report.paper.version})</p>
              <p className="text-slate-400 print:text-slate-700">Status: {report.paper.status} • Cipher: {report.paper.encryption_algorithm}</p>
              <div className="pt-1">
                <span className="text-slate-500 block text-[10px]">SHA-256 Digest:</span>
                <code className="font-mono text-[10px] text-brand-400 print:text-black break-all">{report.paper.sha256_hash}</code>
              </div>
            </div>
          </div>

          {/* Section 2: Distribution Schedule */}
          <div>
            <h4 className="font-bold text-white print:text-black text-sm mb-2">Authorized Examination Distribution Schedule</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left border border-slate-800 print:border-slate-300 rounded-lg overflow-hidden">
                <thead className="bg-slate-900 print:bg-slate-100 text-slate-400 print:text-slate-700">
                  <tr>
                    <th className="p-2.5">Centre Code</th>
                    <th className="p-2.5">Centre Name</th>
                    <th className="p-2.5">City</th>
                    <th className="p-2.5">Release Start</th>
                    <th className="p-2.5">Release End</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 print:divide-slate-300">
                  {report.distribution.map((d: any, idx: number) => (
                    <tr key={idx}>
                      <td className="p-2.5 font-mono font-bold text-brand-400 print:text-black">{d.centre_id}</td>
                      <td className="p-2.5">{d.centre_name}</td>
                      <td className="p-2.5 text-slate-400 print:text-slate-600">{d.city}</td>
                      <td className="p-2.5 font-mono text-[11px]">{new Date(d.release_window_start).toLocaleString()}</td>
                      <td className="p-2.5 font-mono text-[11px]">{new Date(d.release_window_end).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Blockchain Proof Ledger */}
          <div>
            <h4 className="font-bold text-white print:text-black text-sm mb-2">Blockchain Anchored Custody Events ({report.blockchain_chain_of_custody?.length})</h4>
            <div className="space-y-2">
              {report.blockchain_chain_of_custody.map((c: any, idx: number) => (
                <div key={idx} className="p-2.5 rounded bg-slate-900/40 border border-slate-800 print:bg-slate-50 print:border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-400 font-bold">#{c.block_number}</span>
                    <span className="font-mono font-bold text-brand-400 print:text-black">{c.event_type}</span>
                    <span className="text-slate-500">by {c.actor}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="text-slate-500 font-mono">{new Date(c.timestamp).toLocaleString()}</span>
                    <code className="font-mono text-[10px] text-slate-400">{c.tx_hash.slice(0, 14)}...</code>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Security Incidents Flagged */}
          <div>
            <h4 className="font-bold text-white print:text-black text-sm mb-2">Security Incidents & Access Flagged ({report.security_incidents?.length})</h4>
            {report.security_incidents?.length === 0 ? (
              <p className="text-slate-500 text-xs italic">Zero integrity breaches or security incidents flagged for this paper.</p>
            ) : (
              <div className="space-y-2">
                {report.security_incidents.map((inc: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/30 print:border-red-300 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-rose-400 print:text-red-700">{inc.incident_id} • {inc.type}</span>
                      <span className="font-bold text-[10px] text-rose-400 uppercase">{inc.severity}</span>
                    </div>
                    <p className="text-slate-300 print:text-black">{inc.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
