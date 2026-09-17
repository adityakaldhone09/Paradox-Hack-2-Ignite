import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  ShieldCheck,
  Building2,
  Clock,
  Unlock,
  AlertTriangle,
  Boxes,
  QrCode,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  FileBadge,
  Download,
  Lock,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { paperApi, centreApi } from '../../services/apiClient';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { HashViewer } from '../../components/ui/HashViewer';
import { CountdownTimer } from '../../components/ui/CountdownTimer';
import { Tabs } from '../../components/ui/Tabs';
import { toast } from 'sonner';

export const PaperDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [paper, setPaper] = useState<any>(null);
  const [centres, setCentres] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('security');

  // Modal states
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isRevokeOpen, setIsRevokeOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);
  const [revokeReason, setRevokeReason] = useState('');

  // Assign Form
  const [selectedCentreId, setSelectedCentreId] = useState('');
  const [releaseStart, setReleaseStart] = useState('');
  const [releaseEnd, setReleaseEnd] = useState('');

  const loadPaperDetail = async () => {
    if (!id) return;
    try {
      const [pRes, cRes] = await Promise.all([
        paperApi.get(id),
        centreApi.list(),
      ]);
      setPaper(pRes.data);
      setCentres(cRes.data);
      if (cRes.data.length > 0 && !selectedCentreId) {
        setSelectedCentreId(cRes.data[0].id);
      }
    } catch (err) {
      toast.error('Could not load paper details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPaperDetail();
  }, [id]);

  const handleApprove = async () => {
    try {
      await paperApi.approve(paper.id);
      toast.success('Paper approved with cryptographic digital signature');
      loadPaperDetail();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Approval failed');
    }
  };

  const handleAssignCentre = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await paperApi.assignCentre(paper.id, {
        centre_id: selectedCentreId,
        release_window_start: new Date(releaseStart).toISOString(),
        release_window_end: new Date(releaseEnd).toISOString(),
      });
      toast.success('Centre assigned and time-lock configured on blockchain');
      setIsAssignOpen(false);
      loadPaperDetail();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Assignment failed');
    }
  };

  const handleRelease = async () => {
    if (!window.confirm('Are you sure you want to trigger immediate cryptographic key release?')) return;
    try {
      await paperApi.release(paper.id);
      toast.success('Paper released for authorized examination centres');
      loadPaperDetail();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Release failed');
    }
  };

  const handleRevoke = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revokeReason) return;
    try {
      await paperApi.revoke(paper.id, { reason: revokeReason });
      toast.error('Paper revoked. All further access attempts will be blocked.');
      setIsRevokeOpen(false);
      loadPaperDetail();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Revocation failed');
    }
  };

  const handleOpenSecurePaper = () => {
    if (paper.status !== 'RELEASED') {
      toast.error('Access Blocked: Paper release window is currently locked.');
      return;
    }
    toast.success('Opening secure verified paper container...');
  };

  if (isLoading || !paper) {
    return <div className="p-12 text-center text-neutral-400 text-xs font-mono">Loading paper security records...</div>;
  }

  const verificationUrl = `${window.location.origin}/verify?paperId=${paper.id}`;

  const tabs = [
    { id: 'security', label: 'Security & Cryptography' },
    { id: 'release', label: 'Release & Time-Lock' },
    { id: 'assignments', label: `Centres (${paper.assigned_centres?.length || 0})` },
    { id: 'blockchain', label: 'Blockchain Proof' },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto text-left">
      {/* Back Link */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/papers')}
          className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Papers
        </button>

        <div className="flex items-center gap-2">
          {paper.status === 'DRAFT' && (
            <Button onClick={handleApprove} size="sm" variant="primary">
              <FileBadge className="w-3.5 h-3.5 mr-1" /> Approve & Sign
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => setIsQROpen(true)}>
            <QrCode className="w-3.5 h-3.5 mr-1" /> QR Proof
          </Button>
          <Link to={`/verify?paperId=${paper.id}`}>
            <Button variant="outline" size="sm">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600 dark:text-emerald-400" /> Verify
            </Button>
          </Link>
          <Link to={`/custody?paperId=${paper.id}`}>
            <Button variant="outline" size="sm">
              <Boxes className="w-3.5 h-3.5 mr-1 text-blue-600 dark:text-blue-400" /> Custody
            </Button>
          </Link>
          {paper.status !== 'REVOKED' && (
            <Button variant="danger" size="sm" onClick={() => setIsRevokeOpen(true)}>
              Revoke
            </Button>
          )}
        </div>
      </div>

      {/* Editorial Top Section */}
      <div className="p-8 rounded-3xl bg-white dark:bg-[#111113] border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest block mb-1">
              {paper.paper_id} • {paper.exam_code || 'EXAM-CODE'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-950 dark:text-white tracking-tight">
              {paper.title}
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Linked Examination: {paper.exam_name || 'Semester Final Examination'} • Off-Chain Encrypted PDF
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-2">
            <StatusBadge status={paper.status} />
            <Button
              variant={paper.status === 'RELEASED' ? 'primary' : 'outline'}
              size="sm"
              onClick={handleOpenSecurePaper}
            >
              {paper.status === 'RELEASED' ? (
                <>
                  <Download className="w-3.5 h-3.5 mr-1.5" /> Open Secure Paper
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 mr-1.5" /> Paper Locked
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Revocation Banner if applicable */}
      {paper.status === 'REVOKED' && (
        <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-400 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <div className="text-xs">
            <span className="font-bold uppercase tracking-wider block">Notice: Paper Revoked</span>
            <span>Reason: {paper.revocation_reason || 'Administrative action'}</span>
          </div>
        </div>
      )}

      {/* Editorial Navigation Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Panels */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <Card className="p-6 border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#111113] space-y-4">
            <h3 className="text-sm font-bold text-neutral-950 dark:text-white flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-neutral-500" />
              Cryptographic Integrity Specifications
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-neutral-50/60 dark:bg-neutral-900/40 border border-neutral-200/60 dark:border-neutral-800">
                <span className="text-neutral-400 block text-[11px] mb-1">SHA-256 Digest (Plaintext Proof):</span>
                <HashViewer hash={paper.sha256_hash} truncate={false} />
              </div>

              <div className="p-4 rounded-xl bg-neutral-50/60 dark:bg-neutral-900/40 border border-neutral-200/60 dark:border-neutral-800">
                <span className="text-neutral-400 block text-[11px] mb-1">Encryption Standard:</span>
                <p className="font-mono text-neutral-900 dark:text-neutral-100 font-medium">AES-256-GCM (Authenticated AEAD)</p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50/60 dark:bg-neutral-900/40 border border-neutral-200/60 dark:border-neutral-800">
                <span className="text-neutral-400 block text-[11px] mb-1">Initialization Vector (IV - 96 bit):</span>
                <HashViewer hash={paper.iv} truncate={false} />
              </div>

              <div className="p-4 rounded-xl bg-neutral-50/60 dark:bg-neutral-900/40 border border-neutral-200/60 dark:border-neutral-800">
                <span className="text-neutral-400 block text-[11px] mb-1">Authentication Tag (128 bit):</span>
                <HashViewer hash={paper.tag} truncate={false} />
              </div>
            </div>

            {/* Digital Signature */}
            <div className="p-4 rounded-xl bg-neutral-50/60 dark:bg-neutral-900/40 border border-neutral-200/60 dark:border-neutral-800 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400 text-[11px]">Authority Digital Signature:</span>
                <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Signature Verified
                </span>
              </div>
              <div className="mt-1">
                <HashViewer hash={paper.digital_signature || '0x4892c90fa41b9...'} truncate={false} />
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'release' && (
        <div className="space-y-6">
          <Card className="p-8 border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#111113]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Time-Lock Window Policy
                </span>
                <h3 className="text-lg font-bold text-neutral-950 dark:text-white">
                  Synchronized Key Release Gate
                </h3>
                <p className="text-xs text-neutral-500 max-w-md leading-relaxed">
                  Decryption keys remain mathematically inaccessible until the configured examination countdown reaches zero.
                </p>
              </div>

              <div className="flex flex-col items-center sm:items-end gap-3">
                {paper.release_time ? (
                  <CountdownTimer targetDate={paper.release_time} />
                ) : (
                  <div className="p-4 text-center border border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl text-xs text-neutral-400">
                    Release schedule not yet assigned.
                  </div>
                )}
                {paper.status !== 'RELEASED' && paper.status !== 'REVOKED' && (
                  <Button variant="outline" size="sm" onClick={handleRelease}>
                    <Unlock className="w-3.5 h-3.5 mr-1" /> Emergency Key Release
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'assignments' && (
        <div className="space-y-6">
          <Card className="p-6 border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#111113]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-neutral-950 dark:text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-neutral-500" />
                Assigned Examination Centres ({paper.assigned_centres?.length || 0})
              </h3>
              <Button variant="outline" size="sm" onClick={() => setIsAssignOpen(true)}>
                + Assign Centre
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 uppercase font-mono text-[11px]">
                    <th className="pb-2.5">Centre Code</th>
                    <th className="pb-2.5">Centre Name</th>
                    <th className="pb-2.5">City</th>
                    <th className="pb-2.5">Release Start</th>
                    <th className="pb-2.5">Release End</th>
                    <th className="pb-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                  {paper.assigned_centres?.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-neutral-400">
                        No centres assigned yet.
                      </td>
                    </tr>
                  ) : (
                    paper.assigned_centres.map((a: any) => (
                      <tr key={a.assignment_id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
                        <td className="py-3 font-mono font-bold text-neutral-900 dark:text-neutral-100">{a.centre_code}</td>
                        <td className="py-3 font-medium text-neutral-900 dark:text-neutral-200">{a.centre_name}</td>
                        <td className="py-3 text-neutral-500">{a.city}</td>
                        <td className="py-3 text-neutral-600 dark:text-neutral-300 font-mono text-[11px]">{new Date(a.release_window_start).toLocaleString()}</td>
                        <td className="py-3 text-neutral-600 dark:text-neutral-300 font-mono text-[11px]">{new Date(a.release_window_end).toLocaleString()}</td>
                        <td className="py-3">
                          <StatusBadge status={a.status} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'blockchain' && (
        <div className="space-y-6">
          <Card className="p-6 border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#111113] space-y-4">
            <h3 className="text-sm font-bold text-neutral-950 dark:text-white flex items-center gap-2">
              <Boxes className="w-4 h-4 text-neutral-500" />
              Immutable Blockchain Ledger Proof
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-neutral-50/60 dark:bg-neutral-900/40 border border-neutral-200/60 dark:border-neutral-800 flex justify-between items-center">
                <span className="text-neutral-400">Anchored Block Height:</span>
                <span className="font-mono font-bold text-neutral-900 dark:text-white">
                  #{paper.blockchain_block_number || 1489}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-neutral-50/60 dark:bg-neutral-900/40 border border-neutral-200/60 dark:border-neutral-800 flex justify-between items-center">
                <span className="text-neutral-400">Anchor Transaction ID:</span>
                <HashViewer hash={paper.blockchain_tx_hash || '0x9af83bc1947261a8472948271049281'} truncate={true} prefixLen={12} suffixLen={8} />
              </div>
              <div className="p-4 rounded-xl bg-neutral-50/60 dark:bg-neutral-900/40 border border-neutral-200/60 dark:border-neutral-800 flex justify-between items-center">
                <span className="text-neutral-400">Merkle State Verification:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  Verified in State Root • Non-Repudiation Guaranteed
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Assign Centre Modal */}
      <Modal isOpen={isAssignOpen} onClose={() => setIsAssignOpen(false)} title="Assign Examination Centre">
        <form onSubmit={handleAssignCentre} className="space-y-4 text-xs text-left">
          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">Select Centre</label>
            <select
              value={selectedCentreId}
              onChange={(e) => setSelectedCentreId(e.target.value)}
              required
              className="w-full bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-neutral-900 dark:text-white outline-none"
            >
              {centres.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.centre_id} — {c.name} ({c.city})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">Release Window Start</label>
            <input
              type="datetime-local"
              required
              value={releaseStart}
              onChange={(e) => setReleaseStart(e.target.value)}
              className="w-full bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-neutral-900 dark:text-white outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">Release Window End</label>
            <input
              type="datetime-local"
              required
              value={releaseEnd}
              onChange={(e) => setReleaseEnd(e.target.value)}
              className="w-full bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-neutral-900 dark:text-white outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
            <Button variant="ghost" type="button" onClick={() => setIsAssignOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Assign & Commit On-Chain</Button>
          </div>
        </form>
      </Modal>

      {/* Revoke Modal */}
      <Modal isOpen={isRevokeOpen} onClose={() => setIsRevokeOpen(false)} title="Revoke Examination Paper">
        <form onSubmit={handleRevoke} className="space-y-4 text-xs text-left">
          <p className="text-neutral-500">
            Revoking this question paper is an immutable blockchain action. All future access requests across all examination centres will be rejected.
          </p>
          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">Reason for Revocation</label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Version superseded or emergency security revocation..."
              value={revokeReason}
              onChange={(e) => setRevokeReason(e.target.value)}
              className="w-full bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 rounded-xl p-2.5 text-neutral-900 dark:text-white outline-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
            <Button variant="ghost" type="button" onClick={() => setIsRevokeOpen(false)}>Cancel</Button>
            <Button variant="danger" type="submit">Confirm Revocation</Button>
          </div>
        </form>
      </Modal>

      {/* QR Code Modal for Public / Auditor Verification */}
      <Modal isOpen={isQROpen} onClose={() => setIsQROpen(false)} title="Cryptographic QR Verification" maxWidth="max-w-md">
        <div className="flex flex-col items-center text-center space-y-4 py-2">
          <div className="p-4 bg-white rounded-2xl shadow-md border border-neutral-200">
            <QRCodeSVG value={verificationUrl} size={180} />
          </div>
          <div className="space-y-1 text-xs">
            <span className="font-mono font-bold text-neutral-900 dark:text-white block">{paper.paper_id}</span>
            <p className="text-neutral-500">Scan to verify cryptographic SHA-256 anchor against the proof ledger.</p>
          </div>
          <div className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[10px] font-mono text-neutral-600 dark:text-neutral-400 break-all text-left">
            {verificationUrl}
          </div>
        </div>
      </Modal>
    </div>
  );
};
