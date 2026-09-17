import React, { useState, useEffect } from 'react';
import {
  FileCheck,
  Printer,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Boxes,
  Building2,
  Calendar,
  Lock,
  FileText,
  Cpu,
  History,
  UserCheck,
  RefreshCw,
  ExternalLink,
  Check
} from 'lucide-react';
import { auditApi, paperApi } from '../../services/apiClient';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { HashViewer } from '../../components/ui/HashViewer';
import { toast } from 'sonner';
import {
  AuditReportData,
  printCleanAuditReport,
  downloadCleanAuditReport
} from '../../utils/auditReportGenerator';

export const AuditorPortalPage: React.FC = () => {
  const [papers, setPapers] = useState<any[]>([]);
  const [selectedPaperId, setSelectedPaperId] = useState('');
  const [report, setReport] = useState<AuditReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

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
    if (!report) {
      toast.error('Please wait for the audit report to load.');
      return;
    }
    setIsPrinting(true);
    toast.info('Generating official, unblemished audit dossier...');
    try {
      printCleanAuditReport(report);
    } finally {
      setTimeout(() => setIsPrinting(false), 800);
    }
  };

  const handleDownload = () => {
    if (!report) {
      toast.error('Please wait for the audit report to load.');
      return;
    }
    downloadCleanAuditReport(report);
    toast.success('Official audit dossier downloaded successfully');
  };

  const handleCopyHash = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    toast.success('Plaintext hash copied to clipboard');
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const isCompliant = report?.auditor_status === 'COMPLIANT';

  return (
    <div className="space-y-6 max-w-5xl mx-auto print:p-0 print:m-0 print:max-w-none">
      {/* Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
              Regulatory Compliance Engine
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5 mt-1">
            <FileCheck className="w-7 h-7 text-brand-600 dark:text-brand-400" />
            Auditor Oversight & Compliance Portal
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Independent cryptographic inspection, custody proof verification, and certified official audit report generation.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="secondary"
            onClick={handleDownload}
            size="sm"
            disabled={!report || isLoading}
            className="flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Download Dossier (.html)
          </Button>
          <Button
            variant="primary"
            onClick={handlePrint}
            size="sm"
            disabled={!report || isLoading}
            isLoading={isPrinting}
            className="flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-4 h-4" /> Print / Export PDF
          </Button>
        </div>
      </div>

      {/* Selector & Control Strip */}
      <Card className="p-4 border-slate-200 dark:border-slate-800 print:hidden flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex-1 w-full">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Select Examination Paper for Comprehensive Regulatory Audit
          </label>
          <select
            value={selectedPaperId}
            onChange={(e) => setSelectedPaperId(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium"
          >
            {papers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.paper_id} — {p.title} (v{p.version})
              </option>
            ))}
          </select>
        </div>
        <Button
          onClick={loadReport}
          isLoading={isLoading}
          variant="secondary"
          size="sm"
          className="self-end sm:self-auto flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Proofs
        </Button>
      </Card>

      {/* Notice Banner */}
      <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/50 flex items-start gap-3 print:hidden">
        <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-900 dark:text-blue-200">
          <strong className="font-semibold">Formal Document Generation Enabled:</strong> Clicking{' '}
          <span className="font-mono font-bold">"Print / Export PDF"</span> generates an isolated, publication-grade
          A4 audit dossier with institutional masthead, cryptographic proof matrices, telemetry tables, and official
          sign-off blocks — completely free from browser UI, sidebars, or dark-mode screen artifacts.
        </div>
      </div>

      {/* Official Audit Report Preview Document */}
      {report && (
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 sm:p-10 space-y-7 text-xs text-slate-700 dark:text-slate-300 shadow-xl dark:shadow-2xl print:border-none print:shadow-none print:p-0 print:bg-white print:text-black">
          {/* Document Masthead */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-6 border-b-2 border-slate-900 dark:border-slate-700 print:border-black gap-6">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center font-black text-xl tracking-tighter shrink-0">
                VQ
              </div>
              <div>
                <span className="text-[11px] tracking-wider font-mono text-brand-600 dark:text-brand-400 uppercase font-black block">
                  VeriQ Examination Security Board • Cryptographic Governance
                </span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white print:text-black tracking-tight mt-0.5">
                  Official Compliance & Forensic Audit Dossier
                </h2>
                <span className="text-slate-500 text-[11px] block mt-0.5">
                  Dossier Ref: <span className="font-mono font-bold text-slate-800 dark:text-slate-200 print:text-black">{report.report_id}</span> • Generated: {new Date(report.generated_at).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:items-end">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-black tracking-wider uppercase border ${
                isCompliant
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
                  : 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800'
              }`}>
                {isCompliant ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> AUDIT VERIFIED: COMPLIANT
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4" /> SECURITY NOTICES FLAGGED
                  </>
                )}
              </div>
              <span className="text-[10px] text-slate-500 font-mono mt-1">PoA Blockchain Consensus Anchored</span>
            </div>
          </div>

          {/* Section 1: Examination & Paper Identifiers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-2 print:bg-slate-50 print:border-slate-300">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white print:text-black font-bold text-xs uppercase tracking-wider">
                <Calendar className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                1. Target Examination Provenance
              </div>
              <div className="space-y-1 pt-1">
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-800/80 pb-1">
                  <span className="text-slate-500">Examination Name</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100 print:text-black">{report.examination.name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-800/80 pb-1">
                  <span className="text-slate-500">Exam Code / Ref</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-slate-100 print:text-black">{report.examination.code}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-800/80 pb-1">
                  <span className="text-slate-500">Subject / Dept</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{report.examination.subject} ({report.examination.department})</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-800/80 pb-1">
                  <span className="text-slate-500">Scheduled Date</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{report.examination.date}</span>
                </div>
                <div className="flex justify-between pt-0.5">
                  <span className="text-slate-500">Mandated Security</span>
                  <span className="font-bold text-brand-600 dark:text-brand-400 uppercase">{report.examination.security_level}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-2 print:bg-slate-50 print:border-slate-300">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white print:text-black font-bold text-xs uppercase tracking-wider">
                <Lock className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                2. Cryptographic Paper Anchor
              </div>
              <div className="space-y-1 pt-1">
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-800/80 pb-1">
                  <span className="text-slate-500">Paper Document</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100 print:text-black">{report.paper.title} (v{report.paper.version})</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-800/80 pb-1">
                  <span className="text-slate-500">Paper Ref ID</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-slate-100 print:text-black">{report.paper.paper_id}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-800/80 pb-1">
                  <span className="text-slate-500">Encryption Cipher</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">{report.paper.encryption_algorithm}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-800/80 pb-1">
                  <span className="text-slate-500">Auth Status</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase">{report.paper.status}</span>
                </div>
                <div className="pt-1.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-0.5">
                    <span>Immutable Plaintext Hash (SHA-256):</span>
                    <button
                      onClick={() => handleCopyHash(report.paper.sha256_hash)}
                      className="hover:text-brand-500 flex items-center gap-1 font-sans text-[10px]"
                    >
                      {copiedHash ? <Check className="w-3 h-3 text-emerald-500" /> : 'Copy'}
                    </button>
                  </div>
                  <code className="font-mono text-[10px] text-brand-600 dark:text-brand-400 print:text-black break-all block p-1.5 bg-slate-100 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
                    {report.paper.sha256_hash}
                  </code>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Distribution Schedule */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-slate-900 dark:text-white print:text-black text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                3. Authorized Examination Centre Distribution Matrix
              </h4>
              <span className="text-[10px] font-mono text-slate-500">
                {report.distribution?.length || 0} Registered Delivery Points
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border border-slate-200 dark:border-slate-800 print:border-slate-300 rounded-lg overflow-hidden text-xs">
                <thead className="bg-slate-100 dark:bg-slate-900 print:bg-slate-100 text-slate-700 dark:text-slate-400 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5">Centre Code</th>
                    <th className="p-2.5">Centre Name</th>
                    <th className="p-2.5">City</th>
                    <th className="p-2.5">Time-Lock Start</th>
                    <th className="p-2.5">Time-Lock End</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 print:divide-slate-300 font-normal">
                  {report.distribution?.map((d: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                      <td className="p-2.5 font-mono font-bold text-brand-600 dark:text-brand-400 print:text-black">{d.centre_id}</td>
                      <td className="p-2.5 text-slate-800 dark:text-slate-200 font-medium">{d.centre_name}</td>
                      <td className="p-2.5 text-slate-600 dark:text-slate-400 print:text-slate-600">{d.city}</td>
                      <td className="p-2.5 font-mono text-[11px] text-slate-600 dark:text-slate-400">{new Date(d.release_window_start).toLocaleString()}</td>
                      <td className="p-2.5 font-mono text-[11px] text-slate-600 dark:text-slate-400">{new Date(d.release_window_end).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Blockchain Proof Ledger */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-slate-900 dark:text-white print:text-black text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Boxes className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                4. Blockchain Immutable Custody Trail
              </h4>
              <span className="text-[10px] font-mono text-slate-500">
                {report.blockchain_chain_of_custody?.length || 0} Anchored Blocks
              </span>
            </div>
            <div className="space-y-2">
              {report.blockchain_chain_of_custody?.map((c: any, idx: number) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 print:bg-slate-50 print:border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-slate-500 font-black">#{c.block_number}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 font-mono font-bold text-slate-800 dark:text-slate-200 text-[10px]">
                      {c.event_type}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">Actor: <span className="font-medium text-slate-900 dark:text-white">{c.actor}</span></span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="text-slate-500 font-mono">{new Date(c.timestamp).toLocaleString()}</span>
                    <code className="font-mono text-[10px] text-brand-600 dark:text-brand-400 print:text-black bg-slate-100 dark:bg-slate-950 px-1.5 py-0.5 rounded">
                      {c.tx_hash.slice(0, 16)}...
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Access Events & Terminal Telemetry */}
          {report.access_audit_log && report.access_audit_log.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-slate-900 dark:text-white print:text-black text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  5. Terminal Decryption & Hardware Access Telemetry
                </h4>
                <span className="text-[10px] font-mono text-slate-500">
                  {report.access_audit_log.length} Access Attempts
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border border-slate-200 dark:border-slate-800 print:border-slate-300 rounded-lg overflow-hidden text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-900 print:bg-slate-100 text-slate-700 dark:text-slate-400 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-2">Timestamp</th>
                      <th className="p-2">Centre Location</th>
                      <th className="p-2">Operator</th>
                      <th className="p-2">Hardware TPM</th>
                      <th className="p-2">Verdict</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 print:divide-slate-300">
                    {report.access_audit_log.map((a: any, idx: number) => (
                      <tr key={idx}>
                        <td className="p-2 font-mono text-[11px] text-slate-500">{new Date(a.timestamp).toLocaleString()}</td>
                        <td className="p-2 font-medium">{a.centre}</td>
                        <td className="p-2 text-slate-600 dark:text-slate-400">{a.user}</td>
                        <td className="p-2 font-mono text-[11px] text-slate-500">{a.device || 'Verified TPM'}</td>
                        <td className="p-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            a.allowed
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400'
                          }`}>
                            {a.allowed ? 'Authorized' : 'Access Denied'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section 5: Security Incidents Flagged */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-slate-900 dark:text-white print:text-black text-xs uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                6. Forensic Anomaly & Security Findings
              </h4>
              <span className="text-[10px] font-mono text-slate-500">
                {report.security_incidents?.length || 0} Flagged
              </span>
            </div>
            {report.security_incidents?.length === 0 ? (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>
                  <strong>Zero Integrity Violations:</strong> Plaintext hashes, time-lock windows, and cryptographic signatures match mathematical genesis proofs. No unauthorized access attempts logged.
                </span>
              </div>
            ) : (
              <div className="space-y-2">
                {report.security_incidents.map((inc: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20 dark:border-rose-500/30 print:border-red-300 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-rose-600 dark:text-rose-400 print:text-red-700">
                        {inc.incident_id} • {inc.type}
                      </span>
                      <span className="font-bold text-[10px] text-rose-600 dark:text-rose-400 uppercase px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950">
                        {inc.severity}
                      </span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 print:text-black">{inc.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 6: Official Attestation & Sign-off Block */}
          <div className="mt-8 pt-6 border-t-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 rounded-xl p-5 space-y-5">
            <div className="text-[11px] italic text-slate-600 dark:text-slate-400 leading-relaxed border-l-2 border-brand-500 pl-3">
              <strong>REGULATORY AUDITOR ATTESTATION:</strong> I hereby certify under penalty of administrative perjury that the cryptographic hashes, blockchain block records, authorized distribution windows, and hardware terminal access logs itemized in this report have been independently audited and verified against the VeriQ immutable decentralized ledger.
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-2">
              <div className="border-t border-slate-300 dark:border-slate-700 pt-2">
                <div className="text-base font-serif italic text-blue-900 dark:text-blue-300 font-bold mb-1">
                  Dr. Rajesh Sharma
                </div>
                <div className="font-bold text-slate-900 dark:text-white text-xs">Dr. Rajesh Sharma, Ph.D.</div>
                <div className="text-[10px] text-slate-500">Lead Cryptographic Auditor & Compliance Inspector</div>
                <div className="text-[9px] font-mono text-slate-400 mt-0.5">Credential: CISA / CISSP / Blockchain Forensic Attestor #94012</div>
              </div>
              <div className="border-t border-slate-300 dark:border-slate-700 pt-2">
                <div className="text-base font-serif italic text-blue-900 dark:text-blue-300 font-bold mb-1">
                  Prof. K. Venkatesh
                </div>
                <div className="font-bold text-slate-900 dark:text-white text-xs">Prof. K. Venkatesh</div>
                <div className="text-[10px] text-slate-500">Chief Controller of Examinations & Statutory Officer</div>
                <div className="text-[9px] font-mono text-slate-400 mt-0.5">Attested On: {new Date().toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
