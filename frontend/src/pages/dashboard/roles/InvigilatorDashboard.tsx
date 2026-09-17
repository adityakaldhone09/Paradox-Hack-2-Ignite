import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCheck,
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Send,
  RefreshCw,
  KeyRound,
  FileText,
  AlertOctagon,
  Loader2,
  Check,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { examApi, paperApi, incidentApi } from '../../../services/apiClient';
import { useAuth } from '../../../store/AuthContext';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Modal } from '../../../components/ui/Modal';
import { Skeleton } from '../../../components/ui/Skeleton';
import { toast } from 'sonner';

interface VerificationState {
  status: 'idle' | 'verifying' | 'verified' | 'failed';
  lastVerified?: string;
  errorMessage?: string;
}

export const InvigilatorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState<any[]>([]);
  const [papers, setPapers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Per-paper verification state tracking
  const [verificationMap, setVerificationMap] = useState<Record<string, VerificationState>>({});

  // Quick Incident Report Modal
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [incidentType, setIncidentType] = useState('UNAUTHORIZED_ACCESS');
  const [description, setDescription] = useState('');
  const [selectedPaperId, setSelectedPaperId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const [examsRes, papersRes] = await Promise.all([
        examApi.list(),
        paperApi.list(),
      ]);
      setExams(examsRes.data);
      setPapers(papersRes.data);
      if (papersRes.data.length > 0 && !selectedPaperId) {
        setSelectedPaperId(papersRes.data[0].id);
      }
    } catch (err) {
      console.error('Error fetching invigilator data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Section 46–48: Genuine Backend Paper Verification with proper button states
  const handleVerifyPaper = async (paperId: string) => {
    setVerificationMap((prev) => ({
      ...prev,
      [paperId]: { status: 'verifying' },
    }));

    try {
      await new Promise((r) => setTimeout(r, 400));
      const res = await paperApi.verify(paperId, { simulate_tamper: false });
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      if (res.data?.verified) {
        setVerificationMap((prev) => ({
          ...prev,
          [paperId]: {
            status: 'verified',
            lastVerified: now,
          },
        }));

        setPapers((prev) =>
          prev.map((p) => (p.id === paperId ? { ...p, status: 'VERIFIED' } : p))
        );

        toast.success('Paper integrity confirmed: SHA-256 matches blockchain proof');
      } else {
        const errorMsg = 'Integrity verification failed. The registered and current document hashes do not match.';
        setVerificationMap((prev) => ({
          ...prev,
          [paperId]: {
            status: 'failed',
            lastVerified: now,
            errorMessage: errorMsg,
          },
        }));
        toast.error(errorMsg);
      }
    } catch (err: any) {
      let friendlyError = 'Unable to verify the paper. Please try again.';
      if (err.response?.status === 401 || err.response?.status === 403) {
        friendlyError = 'You are not authorized to verify this paper.';
      }

      setVerificationMap((prev) => ({
        ...prev,
        [paperId]: {
          status: 'failed',
          errorMessage: friendlyError,
        },
      }));
      toast.error(friendlyError);
    }
  };

  const handleReportIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await incidentApi.create({
        type: incidentType,
        severity: 'HIGH',
        paper_id: selectedPaperId,
        description: `Invigilator Room Alert: ${description}`,
      });
      toast.error('Security incident dispatched and recorded to ledger');
      setIsReportOpen(false);
      setDescription('');
    } catch (err: any) {
      toast.error('Failed to submit incident. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeExam = exams[0];

  return (
    <div className="space-y-8 max-w-4xl mx-auto text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-neutral-200/80 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">
              Examination Proctor Console
            </h1>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
              {user?.name ? `${user.name} • HALL PROCTOR` : 'PROCTOR TERMINAL'}
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Operational verification terminal for active examination sessions and immediate incident alerting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadData} isLoading={isLoading}>
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Refresh
          </Button>
          <Button variant="danger" size="sm" onClick={() => setIsReportOpen(true)}>
            <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
            Report Incident
          </Button>
        </div>
      </div>

      {/* ────────────────────────────────────────── */}
      {/* SECTION 44 & 50: TODAY'S ACTIVE EXAMINATION */}
      {/* ────────────────────────────────────────── */}
      {isLoading ? (
        <Card className="p-8 bg-white dark:bg-[#111113] border border-neutral-200/80 dark:border-neutral-800 space-y-4">
          <Skeleton className="w-48 h-4" />
          <Skeleton className="w-3/4 h-7" />
          <Skeleton className="w-1/2 h-4" />
          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-between">
            <Skeleton className="w-32 h-4" />
            <Skeleton className="w-28 h-8 rounded-lg" />
          </div>
        </Card>
      ) : !activeExam ? (
        /* Section 50: Empty State */
        <Card className="p-8 bg-white dark:bg-[#111113] border border-dashed border-neutral-200 dark:border-neutral-800 text-center space-y-2">
          <Clock className="w-8 h-8 mx-auto text-neutral-300 dark:text-neutral-600" />
          <h2 className="text-base font-bold text-neutral-950 dark:text-white">
            No active examination
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
            Assigned examination papers will appear here when available.
          </p>
        </Card>
      ) : (
        <Card className="p-8 bg-white dark:bg-[#111113] border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-medium text-neutral-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              Active Examination Session Today
            </span>
            <StatusBadge status={activeExam?.status || 'SCHEDULED'} />
          </div>

          <h2 className="text-xl font-bold text-neutral-950 dark:text-white">
            {activeExam?.name || 'CSE Semester Examination — Database Management Systems'}
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Code: <span className="font-mono text-neutral-800 dark:text-neutral-200">{activeExam?.exam_id || 'EXAM-CS301'}</span> • Department: {activeExam?.department || 'Computer Science'} • Session Window: {activeExam?.start_time || '10:00:00'} - {activeExam?.end_time || '13:00:00'}
          </p>

          <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-neutral-500">
              Assigned Room Terminal: <strong className="text-neutral-800 dark:text-neutral-200 font-mono">DEV-C101-01</strong>
            </div>

            {/* Quick Verification Trigger for Main Paper */}
            {papers[0] && (
              <div className="flex items-center gap-2">
                {(() => {
                  const pId = papers[0].id;
                  const vState = verificationMap[pId] || { status: papers[0].status === 'VERIFIED' ? 'verified' : 'idle' };

                  if (vState.status === 'verifying') {
                    return (
                      <Button variant="outline" size="sm" disabled className="text-xs px-3">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600 mr-1.5" />
                        Verifying Paper...
                      </Button>
                    );
                  }
                  if (vState.status === 'verified') {
                    return (
                      <Button variant="outline" size="sm" onClick={() => handleVerifyPaper(pId)} className="text-xs px-3 border-emerald-200 dark:border-emerald-800 bg-emerald-50/40 text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
                        Paper Verified
                      </Button>
                    );
                  }
                  if (vState.status === 'failed') {
                    return (
                      <Button variant="danger" size="sm" onClick={() => handleVerifyPaper(pId)} className="text-xs px-3">
                        <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                        Retry Verification
                      </Button>
                    );
                  }
                  return (
                    <Button variant="primary" size="sm" onClick={() => handleVerifyPaper(pId)} className="text-xs px-3">
                      <KeyRound className="w-3.5 h-3.5 mr-1.5" />
                      Verify Question Paper
                    </Button>
                  );
                })()}

                <Link to={`/verify?paperId=${encodeURIComponent(papers[0].id)}`}>
                  <Button variant="outline" size="sm" className="text-xs px-2.5">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* ────────────────────────────────────────── */}
      {/* ASSIGNED PAPERS FOR THIS HALL */}
      {/* ────────────────────────────────────────── */}
      <Card className="p-6 bg-white dark:bg-[#111113] border border-neutral-200/80 dark:border-neutral-800">
        <h3 className="text-sm font-bold text-neutral-950 dark:text-white mb-4 flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-neutral-500" />
          Examination Papers Assigned to This Session
        </h3>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 flex justify-between items-center">
                <div className="space-y-1.5">
                  <Skeleton className="w-44 h-4" />
                  <Skeleton className="w-28 h-3" />
                </div>
                <Skeleton className="w-20 h-7 rounded-lg" />
              </div>
            ))}
          </div>
        ) : papers.length === 0 ? (
          <div className="p-6 text-center text-xs text-neutral-400">
            No papers currently assigned to this proctor terminal.
          </div>
        ) : (
          <div className="space-y-3">
            {papers.slice(0, 3).map((p) => {
              const vState = verificationMap[p.id] || { status: p.status === 'VERIFIED' ? 'verified' : 'idle' };
              return (
                <div
                  key={p.id}
                  className="p-4 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/30 border border-neutral-100 dark:border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-neutral-950 dark:text-white text-sm">{p.title}</div>
                    <div className="text-neutral-400 font-mono text-[11px] mt-0.5">
                      Code: {p.paper_id} • Status: <span className="font-medium text-neutral-800 dark:text-neutral-200">{p.status}</span>
                    </div>
                    {vState.lastVerified && (
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-1 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Verified at {vState.lastVerified}
                      </div>
                    )}
                    {vState.status === 'failed' && (
                      <div className="text-[10px] text-red-600 dark:text-red-400 font-medium mt-1 flex items-center gap-1">
                        <AlertOctagon className="w-3 h-3" /> {vState.errorMessage}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {vState.status === 'verifying' ? (
                      <Button variant="outline" size="sm" disabled className="text-xs px-2.5">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600 mr-1" />
                        Verifying...
                      </Button>
                    ) : vState.status === 'verified' ? (
                      <Button variant="outline" size="sm" onClick={() => handleVerifyPaper(p.id)} className="text-xs px-2.5 border-emerald-200 text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Verified
                      </Button>
                    ) : vState.status === 'failed' ? (
                      <Button variant="danger" size="sm" onClick={() => handleVerifyPaper(p.id)} className="text-xs px-2.5">
                        <RotateCcw className="w-3.5 h-3.5 mr-1" />
                        Retry
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => handleVerifyPaper(p.id)} className="text-xs px-2.5">
                        <FileCheck2 className="w-3.5 h-3.5 mr-1" />
                        Verify
                      </Button>
                    )}

                    <Link to="/timelock">
                      <Button variant="primary" size="sm" className="text-xs px-3">
                        Access Key
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Quick Incident Reporting Modal */}
      <Modal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        title="Report Examination Room Security Incident"
      >
        <form onSubmit={handleReportIncident} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Incident Category
            </label>
            <select
              value={incidentType}
              onChange={(e) => setIncidentType(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18181B] text-neutral-900 dark:text-white outline-none"
            >
              <option value="UNAUTHORIZED_ACCESS">Unauthorized Person in Examination Enclosure</option>
              <option value="DEVICE_MISMATCH">Suspected Unapproved Device / Hardware Anomaly</option>
              <option value="EARLY_ACCESS">Premature Question Paper Distribution Attempt</option>
              <option value="HASH_MISMATCH">Suspected Question Tampering / Physical Seal Breach</option>
              <option value="SUSPICIOUS_ACTIVITY">General Examination Irregularity</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Relevant Question Paper
            </label>
            <select
              value={selectedPaperId}
              onChange={(e) => setSelectedPaperId(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18181B] text-neutral-900 dark:text-white outline-none"
            >
              {papers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.paper_id} - {p.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Detailed Observation / Incident Notes
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Describe what occurred, room number, candidate details if applicable..."
              className="w-full text-xs p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18181B] text-neutral-900 dark:text-white outline-none"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-600 dark:text-neutral-400">
            This incident will be instantly recorded into the immutable blockchain audit log and immediately alerted to the Super Admin and Security Operations command center.
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsReportOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="danger" size="sm" isLoading={isSubmitting}>
              <Send className="w-3.5 h-3.5 mr-1.5" />
              Dispatch Security Alert
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
