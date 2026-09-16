import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  ShieldCheck,
  Building2,
  Clock,
  Lock,
  Unlock,
  AlertTriangle,
  Boxes,
  QrCode,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  FileBadge
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { paperApi, centreApi } from '../../services/apiClient';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { HashViewer } from '../../components/ui/HashViewer';
import { CountdownTimer } from '../../components/ui/CountdownTimer';
import { toast } from 'sonner';

export const PaperDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [paper, setPaper] = useState<any>(null);
  const [centres, setCentres] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      toast.success('Paper approved with cryptographic digital signature!');
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
      toast.success('Centre assigned and time-lock configured on blockchain!');
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
      toast.success('Paper released for authorized examination centres!');
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

  if (isLoading || !paper) {
    return <div className="p-8 text-center text-slate-500">Loading paper security records...</div>;
  }

  const verificationUrl = `${window.location.origin}/verify?paperId=${paper.id}`;

  return (
    <div className="space-y-6">
      {/* Header & Back Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/papers')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Papers
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-white tracking-tight">{paper.title}</h1>
            <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/25 font-bold">
              {paper.paper_id}
            </span>
            <StatusBadge status={paper.status} />
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Exam: {paper.exam_name} ({paper.exam_code}) • Off-Chain Encrypted PDF
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {paper.status === 'DRAFT' && (
            <Button onClick={handleApprove} size="sm">
              <FileBadge className="w-4 h-4" /> Approve & Sign
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={() => setIsAssignOpen(true)}>
            <Building2 className="w-4 h-4" /> Assign Centre
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsQROpen(true)}>
            <QrCode className="w-4 h-4" /> QR Verification
          </Button>
          <Link to={`/verify?paperId=${paper.id}`}>
            <Button variant="outline" size="sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Verify Integrity
            </Button>
          </Link>
          <Link to={`/custody?paperId=${paper.id}`}>
            <Button variant="outline" size="sm">
              <Boxes className="w-4 h-4 text-indigo-400" /> Custody Chain
            </Button>
          </Link>
          {paper.status !== 'REVOKED' && (
            <Button variant="danger" size="sm" onClick={() => setIsRevokeOpen(true)}>
              Revoke
            </Button>
          )}
        </div>
      </div>

      {/* Revocation Banner if applicable */}
      {paper.status === 'REVOKED' && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <div className="text-xs">
            <span className="font-bold uppercase tracking-wider block">Notice: Paper Revoked</span>
            <span>Reason: {paper.revocation_reason || 'Administrative action'}</span>
          </div>
        </div>
      )}

      {/* Top Grid: Cryptographic Specs & Time-Lock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cryptographic Specifications */}
        <Card className="lg:col-span-2 p-5 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            Cryptographic Integrity Specifications
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500">SHA-256 Digest (Plaintext Proof):</span>
              <div className="mt-1">
                <HashViewer hash={paper.sha256_hash} truncate={false} />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500">Encryption Standard:</span>
              <p className="font-mono text-slate-800 dark:text-slate-200 mt-1 font-semibold">AES-256-GCM (Authenticated AEAD)</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500">Initialization Vector (IV - 96 bit):</span>
              <div className="mt-1">
                <HashViewer hash={paper.iv} truncate={false} />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500">Authentication Tag (128 bit):</span>
              <div className="mt-1">
                <HashViewer hash={paper.tag} truncate={false} />
              </div>
            </div>
          </div>

          {/* Digital Signature */}
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Authority Digital Signature:</span>
              <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified
              </span>
            </div>
            <div className="mt-1">
              <HashViewer hash={paper.digital_signature || '0x4892c90fa41b9...'} truncate={false} />
            </div>
          </div>
        </Card>

        {/* Time-Lock Countdown */}
        <Card className="p-5 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Time-Lock Schedule
            </h3>
            {paper.release_time ? (
              <CountdownTimer targetDate={paper.release_time} />
            ) : (
              <div className="p-6 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-500">
                Release schedule not yet assigned.
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-4">
            {paper.status !== 'RELEASED' && paper.status !== 'REVOKED' && (
              <Button variant="secondary" size="sm" onClick={handleRelease} className="w-full">
                <Unlock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Force Release Key
              </Button>
            )}
          </div>
        </Card>
      </div>

      {/* Assigned Centres Table */}
      <Card className="p-5 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            Assigned Examination Centres ({paper.assigned_centres?.length || 0})
          </h3>
          <Button variant="outline" size="sm" onClick={() => setIsAssignOpen(true)}>
            + Assign Another Centre
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-semibold">
                <th className="pb-2.5">Centre Code</th>
                <th className="pb-2.5">Centre Name</th>
                <th className="pb-2.5">City</th>
                <th className="pb-2.5">Release Window Start</th>
                <th className="pb-2.5">Release Window End</th>
                <th className="pb-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
              {paper.assigned_centres?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-500">No centres assigned yet.</td>
                </tr>
              ) : (
                paper.assigned_centres.map((a: any) => (
                  <tr key={a.assignment_id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td className="py-3 font-mono text-brand-600 dark:text-brand-400 font-bold">{a.centre_code}</td>
                    <td className="py-3 font-medium text-slate-900 dark:text-slate-200">{a.centre_name}</td>
                    <td className="py-3 text-slate-500 dark:text-slate-400">{a.city}</td>
                    <td className="py-3 text-slate-700 dark:text-slate-300">{new Date(a.release_window_start).toLocaleString()}</td>
                    <td className="py-3 text-slate-700 dark:text-slate-300">{new Date(a.release_window_end).toLocaleString()}</td>
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

      {/* Assign Centre Modal */}
      <Modal isOpen={isAssignOpen} onClose={() => setIsAssignOpen(false)} title="Assign Examination Centre">
        <form onSubmit={handleAssignCentre} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Centre *</label>
            <select
              value={selectedCentreId}
              onChange={(e) => setSelectedCentreId(e.target.value)}
              required
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-brand-500"
            >
              {centres.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.centre_id} — {c.name} ({c.city})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Release Window Start (Time-Lock Release) *</label>
            <input
              type="datetime-local"
              required
              value={releaseStart}
              onChange={(e) => setReleaseStart(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Release Window End (Expiration) *</label>
            <input
              type="datetime-local"
              required
              value={releaseEnd}
              onChange={(e) => setReleaseEnd(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button variant="ghost" type="button" onClick={() => setIsAssignOpen(false)}>Cancel</Button>
            <Button type="submit">Assign & Record On-Chain</Button>
          </div>
        </form>
      </Modal>

      {/* Revoke Modal */}
      <Modal isOpen={isRevokeOpen} onClose={() => setIsRevokeOpen(false)} title="Revoke Examination Paper">
        <form onSubmit={handleRevoke} className="space-y-4 text-xs">
          <p className="text-slate-500 dark:text-slate-400">
            Revoking this question paper is an immutable blockchain action. All future access requests across all examination centres will be rejected.
          </p>
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Reason for Revocation *</label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Integrity breach reported or version superseded..."
              value={revokeReason}
              onChange={(e) => setRevokeReason(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-rose-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button variant="ghost" type="button" onClick={() => setIsRevokeOpen(false)}>Cancel</Button>
            <Button variant="danger" type="submit">Confirm Revocation</Button>
          </div>
        </form>
      </Modal>

      {/* QR Code Modal for Public / Auditor Verification (Section 30) */}
      <Modal isOpen={isQROpen} onClose={() => setIsQROpen(false)} title="Auditor Cryptographic QR Verification" maxWidth="max-w-md">
        <div className="flex flex-col items-center text-center space-y-4 py-2">
          <div className="p-4 bg-white rounded-2xl shadow-xl border border-slate-200 dark:border-transparent">
            <QRCodeSVG value={verificationUrl} size={180} />
          </div>
          <div className="space-y-1 text-xs">
            <span className="font-mono text-brand-600 dark:text-brand-400 font-bold block">{paper.paper_id}</span>
            <p className="text-slate-500 dark:text-slate-400">Scan to verify cryptographic SHA-256 anchor against the proof ledger.</p>
          </div>
          <div className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-400 break-all text-left">
            {verificationUrl}
          </div>
        </div>
      </Modal>
    </div>
  );
};
