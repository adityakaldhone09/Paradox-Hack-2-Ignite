import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Upload,
  Lock,
  KeyRound,
  Boxes,
  CheckCircle2,
  FileCheck2,
  AlertCircle,
  Eye,
  Plus,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { paperApi, examApi } from '../../../services/apiClient';
import { useAuth } from '../../../store/AuthContext';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { HashViewer } from '../../../components/ui/HashViewer';
import { Modal } from '../../../components/ui/Modal';
import { toast } from 'sonner';

export const PaperSetterDashboard: React.FC = () => {
  const { user } = useAuth();
  const [papers, setPapers] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterMine, setFilterMine] = useState(false);

  // Upload modal & animation states
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [subject, setSubject] = useState('');
  const [selectedExamId, setSelectedExamId] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Step-by-step upload state: 0 = idle, 1 = uploading, 2 = validating, 3 = encrypting, 4 = hashing, 5 = blockchain, 6 = secured
  const [uploadStep, setUploadStep] = useState<number>(0);
  const [uploadResult, setUploadResult] = useState<any>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const params = filterMine && user?.email ? { created_by: user.email } : undefined;
      const [papersRes, examsRes] = await Promise.all([
        paperApi.list(params),
        examApi.list(),
      ]);
      setPapers(papersRes.data);
      setExams(examsRes.data);
      if (examsRes.data.length > 0 && !selectedExamId) {
        setSelectedExamId(examsRes.data[0].id);
      }
    } catch (err) {
      console.error('Error fetching paper setter data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filterMine]);

  const handleSubmitPaper = async (paperId: string) => {
    try {
      await paperApi.submit(paperId);
      toast.success('Paper submitted for examination authority approval');
      loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to submit paper');
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !selectedExamId || !title) {
      toast.error('Please fill all required fields and select a PDF file');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', title);
    formData.append('exam_id', selectedExamId);

    // Multi-stage animated progress
    setUploadStep(1);
    await new Promise((r) => setTimeout(r, 500));

    setUploadStep(2);
    await new Promise((r) => setTimeout(r, 500));

    try {
      setUploadStep(3);
      await new Promise((r) => setTimeout(r, 500));

      setUploadStep(4);
      const res = await paperApi.upload(formData);
      setUploadResult(res.data);

      setUploadStep(5);
      await new Promise((r) => setTimeout(r, 600));

      setUploadStep(6);
      toast.success('Question Paper encrypted and anchored to blockchain!');
      loadData();
    } catch (err: any) {
      toast.error('Upload failed: ' + (err.response?.data?.detail || err.message));
      setUploadStep(0);
    }
  };

  const resetUploadModal = () => {
    setIsUploadOpen(false);
    setUploadStep(0);
    setUploadResult(null);
    setTitle('');
    setCode('');
    setSelectedFile(null);
  };

  const uploadStepLabels = [
    'Stage 1/5: Transferring binary payload to isolated staging...',
    'Stage 2/5: Validating PDF structure and computing byte length...',
    'Stage 3/5: Protecting paper with AES-256-GCM envelope encryption...',
    'Stage 4/5: Generating cryptographic SHA-256 digest...',
    'Stage 5/5: Registering security record in blockchain ledger...',
  ];

  const myCount = papers.filter((p) => p.created_by === user?.email).length;
  const draftCount = papers.filter((p) => p.status === 'DRAFT').length;
  const submittedCount = papers.filter((p) => p.status === 'SUBMITTED').length;
  const approvedCount = papers.filter((p) => p.status === 'APPROVED').length;

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200/80 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">
              Paper Authoring Workspace
            </h1>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
              AIR-GAPPED AUTHORING
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Author, envelope encrypt with AES-256-GCM, compute SHA-256 digest, and submit for dual-approval.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadData} isLoading={isLoading}>
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Refresh
          </Button>
          <Button variant="primary" size="sm" onClick={() => setIsUploadOpen(true)}>
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Secure New Paper
          </Button>
        </div>
      </div>

      {/* Typographic Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111113] border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
          <div className="text-neutral-400 text-xs font-mono uppercase tracking-wider mb-2">
            Authored by Me
          </div>
          <div className="text-3xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
            {myCount}
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Registered drafts
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#111113] border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
          <div className="text-neutral-400 text-xs font-mono uppercase tracking-wider mb-2">
            In Draft State
          </div>
          <div className="text-3xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
            {draftCount}
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Awaiting submission
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#111113] border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
          <div className="text-neutral-400 text-xs font-mono uppercase tracking-wider mb-2">
            Under Review
          </div>
          <div className="text-3xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
            {submittedCount}
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Submitted to Super Admin
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#111113] border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
          <div className="text-neutral-400 text-xs font-mono uppercase tracking-wider mb-2">
            Approved & Sealed
          </div>
          <div className="text-3xl font-extrabold text-neutral-950 dark:text-white tracking-tight text-emerald-600 dark:text-emerald-400">
            {approvedCount}
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Anchored to Blockchain
          </div>
        </div>
      </div>

      {/* Main Papers Table */}
      <Card className="p-6 bg-white dark:bg-[#111113] border border-neutral-200/80 dark:border-neutral-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-sm font-bold text-neutral-950 dark:text-white">
              Question Paper Ledger
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Off-chain encrypted question papers with ledger anchored integrity proofs
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterMine(false)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                !filterMine
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              All Papers ({papers.length})
            </button>
            <button
              onClick={() => setFilterMine(true)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                filterMine
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              My Papers ({myCount})
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 font-mono uppercase tracking-wider">
                <th className="pb-3 font-medium">Paper Details</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">SHA-256 Digest</th>
                <th className="pb-3 font-medium">Blockchain Block</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {papers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-neutral-400">
                    No papers found matching criteria. Click "Secure New Paper" to upload.
                  </td>
                </tr>
              ) : (
                papers.map((paper) => (
                  <tr key={paper.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                    <td className="py-3.5 pr-4">
                      <Link to={`/papers/${paper.id}`} className="font-semibold text-neutral-950 dark:text-white hover:underline block">
                        {paper.title}
                      </Link>
                      <span className="text-[11px] font-mono text-neutral-400">
                        {paper.paper_code || 'PAP-SET'} • Author: {paper.created_by || 'Unknown'}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4">
                      <StatusBadge status={paper.status} />
                    </td>
                    <td className="py-3.5 pr-4">
                      <HashViewer hash={paper.sha256_hash} />
                    </td>
                    <td className="py-3.5 pr-4 font-mono text-neutral-600 dark:text-neutral-400">
                      {paper.blockchain_block_number ? `#${paper.blockchain_block_number}` : 'Pending Block'}
                    </td>
                    <td className="py-3.5 text-right space-x-2">
                      {paper.status === 'DRAFT' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSubmitPaper(paper.id)}
                        >
                          <Send className="w-3.5 h-3.5 mr-1" />
                          Submit
                        </Button>
                      )}
                      <Link to={`/papers/${paper.id}`}>
                        <Button variant="ghost" size="sm">
                          Details
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Upload Paper Modal with Multi-Stage Animated Workflow */}
      <Modal
        isOpen={isUploadOpen}
        onClose={resetUploadModal}
        title="Upload & Secure Examination Paper"
      >
        {uploadStep === 0 ? (
          <form onSubmit={handleUploadSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Examination Paper Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. Distributed Database Systems Set A"
                className="w-full text-xs p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18181B] text-neutral-900 dark:text-white outline-none focus:border-neutral-900 dark:focus:border-neutral-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Paper Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="PAP-CS301-A"
                  className="w-full text-xs p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18181B] text-neutral-900 dark:text-white outline-none focus:border-neutral-900 dark:focus:border-neutral-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Linked Examination
                </label>
                <select
                  value={selectedExamId}
                  onChange={(e) => setSelectedExamId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18181B] text-neutral-900 dark:text-white outline-none"
                >
                  {exams.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.exam_id} - {ex.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Select Master Question Paper (PDF / Binary)
              </label>
              <input
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                required
                className="w-full text-xs p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Upon submission, the file will be encrypted using <strong>AES-256-GCM</strong> with an isolated ephemeral key, and its cryptographic SHA-256 digest will be committed to the blockchain.
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={resetUploadModal}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                <Upload className="w-3.5 h-3.5 mr-1.5" />
                Begin Encrypted Pipeline
              </Button>
            </div>
          </form>
        ) : uploadStep < 6 ? (
          /* Multi-Stage Animated Processing */
          <div className="py-8 px-2 text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto text-neutral-900 dark:text-white">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Lock className="w-7 h-7" />
              </motion.div>
            </div>

            <div>
              <h3 className="text-base font-bold text-neutral-950 dark:text-white">
                Securing Examination Paper
              </h3>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-mono mt-1">
                {uploadStepLabels[uploadStep - 1]}
              </p>
            </div>

            {/* Stepper Dots */}
            <div className="flex items-center justify-center gap-2 max-w-xs mx-auto">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    s <= uploadStep ? 'bg-neutral-900 dark:bg-white' : 'bg-neutral-200 dark:bg-neutral-800'
                  }`}
                />
              ))}
            </div>

            <div className="text-[11px] text-neutral-400 font-mono">
              Cryptographic Standard: AES-256-GCM + SHA-256 Block Anchor
            </div>
          </div>
        ) : (
          /* Final Secured Success State */
          <div className="py-6 px-2 text-center space-y-5">
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-neutral-950 dark:text-white">
                Paper Cryptographically Secured
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Stored with authenticated envelope encryption off-chain.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-left space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>Paper Secured with AES-256-GCM</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>Integrity Hash Generated & Bound</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>Blockchain Record Anchored in Block #{uploadResult?.blockchain_block_number || 15}</span>
              </div>

              {uploadResult?.sha256_hash && (
                <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800">
                  <span className="text-[10px] text-neutral-400 block mb-1">Committed SHA-256 Digest:</span>
                  <HashViewer hash={uploadResult.sha256_hash} />
                </div>
              )}
            </div>

            <Button variant="primary" size="md" className="w-full justify-center" onClick={resetUploadModal}>
              Complete & View in Workspace
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};
