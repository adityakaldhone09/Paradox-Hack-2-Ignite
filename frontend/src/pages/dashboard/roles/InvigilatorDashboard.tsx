import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UserCheck,
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Send,
  RefreshCw,
  KeyRound,
} from 'lucide-react';
import { examApi, paperApi, incidentApi } from '../../../services/apiClient';
import { useAuth } from '../../../store/AuthContext';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Modal } from '../../../components/ui/Modal';
import { toast } from 'sonner';

export const InvigilatorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState<any[]>([]);
  const [papers, setPapers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      toast.error(`Failed to submit incident: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeExam = exams[0];

  return (
    <div className="space-y-8 max-w-4xl mx-auto text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200/80 dark:border-neutral-800">
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

      {/* Active Examination Card */}
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
          <div className="flex items-center gap-2">
            <Link to="/verify">
              <Button variant="primary" size="sm">
                <KeyRound className="w-3.5 h-3.5 mr-1.5" />
                Verify Question Paper Digest
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Assigned Papers for This Hall */}
      <Card className="p-6 bg-white dark:bg-[#111113] border border-neutral-200/80 dark:border-neutral-800">
        <h3 className="text-sm font-bold text-neutral-950 dark:text-white mb-4 flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-neutral-500" />
          Examination Papers Assigned to This Session
        </h3>

        <div className="space-y-3">
          {papers.slice(0, 3).map((p) => (
            <div
              key={p.id}
              className="p-4 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/30 border border-neutral-100 dark:border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="font-semibold text-neutral-950 dark:text-white text-sm">{p.title}</div>
                <div className="text-neutral-400 font-mono text-[11px] mt-0.5">
                  Code: {p.paper_id} • Status: <span className="font-medium text-neutral-800 dark:text-neutral-200">{p.status}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link to="/verify">
                  <Button variant="outline" size="sm" className="text-xs">
                    Run Integrity Test
                  </Button>
                </Link>
                <Link to="/timelock">
                  <Button variant="primary" size="sm" className="text-xs">
                    Access Paper
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
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
