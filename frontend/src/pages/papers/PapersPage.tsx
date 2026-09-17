import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Lock,
  Boxes,
  Eye,
  ShieldCheck,
  Search,
  Building2,
  FileCheck2,
  Loader2,
  Plus,
} from 'lucide-react';
import { paperApi, examApi, getCachedApiResponse } from '../../services/apiClient';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { HashViewer } from '../../components/ui/HashViewer';
import { toast } from 'sonner';

export const PapersPage: React.FC = () => {
  const [papers, setPapers] = useState<any[]>(() => getCachedApiResponse('/papers') || []);
  const [exams, setExams] = useState<any[]>(() => getCachedApiResponse('/exams') || []);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(() => !getCachedApiResponse('/papers'));

  // Upload Modal & Pipeline Animation state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [paperTitle, setPaperTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStep, setUploadStep] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);

  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const loadPapers = async () => {
    try {
      const promises: [Promise<any>, Promise<any>?] = [
        paperApi.list({ search: debouncedSearch || undefined, status: statusFilter || undefined }),
      ];
      if (exams.length === 0) {
        promises.push(examApi.list());
      }
      const [pRes, eRes] = await Promise.all(promises);
      setPapers(pRes.data);
      if (eRes) {
        setExams(eRes.data);
        if (eRes.data.length > 0 && !selectedExamId) {
          setSelectedExamId(eRes.data[0].id);
        }
      }
    } catch (err) {
      console.error('Error loading papers', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPapers();
  }, [debouncedSearch, statusFilter]);

  const stages = [
    { label: 'Uploading', desc: 'Secure multipart transfer', icon: UploadCloud },
    { label: 'Validating', desc: 'Structure and MIME checks', icon: FileCheck2 },
    { label: 'Encrypting', desc: 'Off-chain AES-256-GCM', icon: Lock },
    { label: 'Hashing', desc: 'SHA-256 digest creation', icon: ShieldCheck },
    { label: 'Registering', desc: 'Anchoring in ledger', icon: Boxes },
    { label: 'Secured', desc: 'Cryptographically locked', icon: CheckCircle2 },
  ];

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !selectedExamId || !paperTitle) {
      toast.error('Please complete all required fields and choose a PDF file.');
      return;
    }

    setIsUploading(true);
    setUploadStep(1);

    try {
      setUploadStep(1);

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('exam_id', selectedExamId);
      formData.append('title', paperTitle);

      setUploadStep(3);
      await paperApi.upload(formData);
      setUploadStep(6);

      toast.success('Question paper secured and anchored to blockchain.');
      setIsUploadOpen(false);
      setUploadStep(0);
      setPaperTitle('');
      setSelectedFile(null);
      loadPapers();
    } catch (err: any) {
      toast.error('Upload failed: ' + (err.response?.data?.detail || err.message));
      setUploadStep(0);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8 text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200/80 dark:border-neutral-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-950 dark:text-white flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-neutral-900 dark:text-white" />
            Question Papers
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Off-chain AES-256-GCM encrypted document vault with immutable SHA-256 blockchain anchors.
          </p>
        </div>
        <Button variant="primary" size="md" onClick={() => setIsUploadOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" /> Upload & Encrypt Paper
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white dark:bg-[#111113] p-3 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search papers by title or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 bg-neutral-50 dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 rounded-xl pl-9 pr-4 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 outline-none"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 bg-neutral-50 dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 text-xs text-neutral-900 dark:text-neutral-300 outline-none w-full sm:w-auto font-medium"
          >
            <option value="">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="APPROVED">Approved</option>
            <option value="RELEASE_SCHEDULED">Release Scheduled</option>
            <option value="RELEASED">Released</option>
            <option value="REVOKED">Revoked</option>
          </select>
        </div>
      </div>

      {/* Paper Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {papers.map((p) => (
          <Card key={p.id} hoverable className="p-5 border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#111113] flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                  {p.paper_id}
                </span>
                <StatusBadge status={p.status} />
              </div>

              <h3 className="text-sm font-bold text-neutral-950 dark:text-white mt-2.5 truncate">{p.title}</h3>
              <p className="text-xs text-neutral-500 mt-0.5">{p.exam_name || 'Assigned Examination'}</p>

              <div className="space-y-2 mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs">
                <div>
                  <span className="text-neutral-400 block text-[11px]">SHA-256 Anchor:</span>
                  <div className="mt-0.5">
                    <HashViewer hash={p.sha256_hash} truncate={true} prefixLen={8} suffixLen={6} />
                  </div>
                </div>

                <div className="flex justify-between items-center text-neutral-500 text-[11px]">
                  <span>Encryption:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium">AES-256-GCM</span>
                </div>

                <div className="flex justify-between items-center text-neutral-500 text-[11px]">
                  <span>Assigned Centres:</span>
                  <span className="text-neutral-800 dark:text-neutral-200 font-medium">{p.assigned_centres?.length || 0} Centres</span>
                </div>

                <div className="flex justify-between items-center text-neutral-500 text-[11px]">
                  <span>Version:</span>
                  <span className="font-mono text-neutral-700 dark:text-neutral-300">v{p.version}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-2">
              <Link to={`/papers/${p.id}`} className="flex-1">
                <Button variant="secondary" size="sm" className="w-full h-8 text-xs">
                  <Eye className="w-3.5 h-3.5 mr-1" /> Details
                </Button>
              </Link>
              <Link to={`/verify?paperId=${p.id}`}>
                <Button variant="outline" size="sm" className="h-8 px-2.5" title="Verify Integrity">
                  <ShieldCheck className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-300" />
                </Button>
              </Link>
              <Link to={`/custody?paperId=${p.id}`}>
                <Button variant="outline" size="sm" className="h-8 px-2.5" title="Inspect Custody">
                  <Boxes className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-300" />
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {/* 6-Stage Animated Upload Modal */}
      <Modal isOpen={isUploadOpen} onClose={() => !isUploading && setIsUploadOpen(false)} title="Secure Paper Cryptographic Upload" maxWidth="max-w-2xl">
        {isUploading ? (
          <div className="py-6 space-y-6 text-center">
            <div className="space-y-1.5">
              <h4 className="text-base font-bold text-neutral-950 dark:text-white">Cryptographic Pipeline Active</h4>
              <p className="text-xs text-neutral-500">Processing document through envelope encryption and ledger anchoring</p>
            </div>

            {/* Stages visualization */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {stages.map((stage, idx) => {
                const Icon = stage.icon;
                const isPassed = uploadStep > idx + 1;
                const isCurrent = uploadStep === idx + 1;

                return (
                  <div
                    key={stage.label}
                    className={`p-3 rounded-xl border transition-all text-center flex flex-col items-center ${
                      isPassed
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
                        : isCurrent
                        ? 'bg-[#F7F7F5] dark:bg-neutral-800 border-neutral-900 dark:border-white text-neutral-950 dark:text-white shadow-xs'
                        : 'bg-neutral-50 dark:bg-neutral-900/40 border-neutral-200 dark:border-neutral-800 text-neutral-400 opacity-60'
                    }`}
                  >
                    <Icon className="w-4 h-4 mb-1" />
                    <span className="text-xs font-bold">{stage.label}</span>
                    <span className="text-[10px] mt-0.5 leading-snug">{stage.desc}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center pt-2">
              <Loader2 className="w-5 h-5 animate-spin text-neutral-700 dark:text-neutral-300" />
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpload} className="space-y-4 text-left text-xs">
            <div>
              <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Target Examination</label>
              <select
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                required
                className="w-full bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2.5 text-neutral-900 dark:text-white outline-none"
              >
                {exams.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.exam_id} — {ex.name} ({ex.subject})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Paper Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Distributed Databases Final Examination 2026"
                value={paperTitle}
                onChange={(e) => setPaperTitle(e.target.value)}
                className="w-full bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2.5 text-neutral-900 dark:text-white outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Select Question Paper (PDF)</label>
              <div className="border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-neutral-500 rounded-xl p-6 text-center cursor-pointer transition-colors bg-neutral-50/50 dark:bg-neutral-900/30">
                <input
                  type="file"
                  accept=".pdf"
                  required
                  id="paper-file-input"
                  onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                  className="hidden"
                />
                <label htmlFor="paper-file-input" className="cursor-pointer flex flex-col items-center">
                  <UploadCloud className="w-6 h-6 text-neutral-500 mb-1.5" />
                  <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                    {selectedFile ? selectedFile.name : 'Click to select PDF question paper'}
                  </span>
                  <span className="text-[10px] text-neutral-400 mt-1">
                    Handled strictly via off-chain AES-256-GCM envelope encryption.
                  </span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
              <Button variant="ghost" type="button" onClick={() => setIsUploadOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Begin Cryptographic Registration
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
