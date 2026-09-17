import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Plus,
  Search,
  Building2,
  FileText,
  Calendar,
  Clock,
  Shield,
  Eye
} from 'lucide-react';
import { examApi, getCachedApiResponse } from '../../services/apiClient';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useAuth } from '../../store/AuthContext';
import { toast } from 'sonner';

export const ExaminationsPage: React.FC = () => {
  const { user } = useAuth();
  const canCreateExaminations = user?.role !== 'INVIGILATOR';
  const [exams, setExams] = useState<any[]>(() => getCachedApiResponse('/exams') || []);
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [examName, setExamName] = useState('');
  const [examId, setExamId] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [subject, setSubject] = useState('');
  const [examDate, setExamDate] = useState('');
  const [startTime, setStartTime] = useState('10:00:00');
  const [endTime, setEndTime] = useState('13:00:00');
  const [securityLevel, setSecurityLevel] = useState('HIGH');

  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const loadExams = async () => {
    try {
      const res = await examApi.list({ search: debouncedSearch || undefined });
      setExams(res.data);
    } catch (err) {
      console.error('Error loading examinations', err);
    }
  };

  useEffect(() => {
    loadExams();
  }, [debouncedSearch]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await examApi.create({
        name: examName,
        exam_id: examId,
        department,
        subject,
        exam_type: 'FINAL',
        exam_date: examDate,
        start_time: startTime,
        end_time: endTime,
        security_level: securityLevel,
      });
      toast.success('Examination created successfully');
      setIsCreateOpen(false);
      loadExams();
    } catch (err: any) {
      toast.error('Failed to create examination: ' + (err.response?.data?.detail || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-950 dark:text-white tracking-tight flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            Examination Management
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Configure examination schedules, security classification levels, and assigned question papers.
          </p>
        </div>
        {canCreateExaminations && (
          <Button onClick={() => setIsCreateOpen(true)} className="shadow-lg shadow-brand-500/20">
            <Plus className="w-4 h-4" /> Create Examination
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="flex items-center gap-4 bg-white dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search by exam name, code, or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {/* Examinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {exams.map((ex) => (
          <Card key={ex.id} hoverable className="p-5 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
                  {ex.exam_id}
                </span>
                <StatusBadge status={ex.status} />
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-2">{ex.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{ex.department} • {ex.subject}</p>

              <div className="space-y-2 mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Date:</span>
                  <span>{ex.exam_date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Time:</span>
                  <span>{ex.start_time.slice(0, 5)} - {ex.end_time.slice(0, 5)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> Security:</span>
                  <span className="font-bold text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 border border-slate-200 dark:border-slate-700">
                    {ex.security_level}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Distribution:</span>
                  <span>{ex.assigned_centres_count} Centres • {ex.total_papers} Papers</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create New Examination">
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Examination Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. CSE Semester Examination 2026"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Exam Code / ID *</label>
              <input
                type="text"
                required
                placeholder="e.g. EXAM-CS401"
                value={examId}
                onChange={(e) => setExamId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Security Level *</label>
              <select
                value={securityLevel}
                onChange={(e) => setSecurityLevel(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value="STANDARD">STANDARD</option>
                <option value="HIGH">HIGH</option>
                <option value="MAXIMUM_TOP_SECRET">MAXIMUM_TOP_SECRET</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Department *</label>
              <input
                type="text"
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject *</label>
              <input
                type="text"
                required
                placeholder="e.g. Cryptography"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Exam Date *</label>
              <input
                type="date"
                required
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Start Time *</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">End Time *</label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button variant="ghost" type="button" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={isSubmitting}>Register Examination</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
