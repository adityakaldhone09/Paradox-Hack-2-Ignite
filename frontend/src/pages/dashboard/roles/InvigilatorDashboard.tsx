import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UserCheck,
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Send,
  RefreshCw,
  ArrowRight,
  KeyRound
} from 'lucide-react';
import { examApi, paperApi, incidentApi } from '../../../services/apiClient';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Modal } from '../../../components/ui/Modal';
import { toast } from 'sonner';

export const InvigilatorDashboard: React.FC = () => {
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
      toast.error('Security incident dispatched and anchored to blockchain log');
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
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Examination Proctor Console
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
              HALL PROCTOR
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
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
      <Card className="p-6 bg-gradient-to-br from-white via-indigo-50/20 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            Active Scheduled Examination Today
          </span>
          <StatusBadge status={activeExam?.status || 'SCHEDULED'} />
        </div>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          {activeExam?.name || 'CSE Semester Examination — Database Management Systems'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Code: <span className="font-mono text-slate-700 dark:text-slate-300">{activeExam?.exam_id || 'EXAM-CS301'}</span> • Department: {activeExam?.department || 'Computer Science'} • Window: {activeExam?.start_time || '10:00:00'} - {activeExam?.end_time || '13:00:00'}
        </p>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Assigned Room Terminal: <strong className="text-slate-700 dark:text-slate-300 font-mono">DEV-C101-01</strong>
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
      <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          Examination Papers Assigned to This Session
        </h3>

        <div className="space-y-3">
          {papers.slice(0, 3).map((p) => (
            <div
              key={p.id}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">{p.title}</div>
                <div className="text-slate-500 font-mono text-[11px] mt-0.5">
                  Code: {p.paper_id} • Status: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{p.status}</span>
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
        <form onSubmit={handleReportIncident} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Incident Category
            </label>
            <select
              value={incidentType}
              onChange={(e) => setIncidentType(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="UNAUTHORIZED_ACCESS">Unauthorized Person in Examination Enclosure</option>
              <option value="DEVICE_MISMATCH">Suspected Unapproved Device / Hardware Anomaly</option>
              <option value="EARLY_ACCESS">Premature Question Paper Distribution Attempt</option>
              <option value="HASH_MISMATCH">Suspected Question Tampering / Physical Seal Breach</option>
              <option value="SUSPICIOUS_ACTIVITY">General Examination Irregularity</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Relevant Question Paper
            </label>
            <select
              value={selectedPaperId}
              onChange={(e) => setSelectedPaperId(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              {papers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.paper_id} - {p.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Detailed Observation / Incident Notes
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Describe what occurred, room number, candidate details if applicable..."
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-[11px] text-amber-800 dark:text-amber-300">
            This incident will be instantly recorded into the immutable blockchain audit log and immediately alerted to the Super Admin and Security Operations command center.
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsReportOpen(false)}>
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
