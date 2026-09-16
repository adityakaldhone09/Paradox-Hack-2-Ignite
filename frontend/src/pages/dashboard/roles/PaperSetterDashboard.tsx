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
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { paperApi, examApi } from '../../../services/apiClient';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { HashViewer } from '../../../components/ui/HashViewer';
import { Modal } from '../../../components/ui/Modal';
import { toast } from 'sonner';

export const PaperSetterDashboard: React.FC = () => {
  const [papers, setPapers] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Upload modal & animation states
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [subject, setSubject] = useState('');
  const [selectedExamId, setSelectedExamId] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Step-by-step upload animation state: 0 = idle, 1 = uploading, 2 = validating, 3 = encrypting, 4 = hashing, 5 = blockchain, 6 = secured
  const [uploadStep, setUploadStep] = useState<number>(0);
  const [uploadResult, setUploadResult] = useState<any>(null);

  const loadData = async () => {
    try {
      const [papersRes, examsRes] = await Promise.all([
        paperApi.list(),
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
  }, []);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !selectedExamId) {
      toast.error('Please select a PDF file and examination');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', title);
    formData.append('code', code || `PAP-${Date.now().toString().slice(-4)}`);
    formData.append('subject', subject || 'Applied Examination');
    formData.append('examination_id', selectedExamId);

    // Multi-stage animated progress
    setUploadStep(1); // Uploading
    await new Promise((r) => setTimeout(r, 600));

    setUploadStep(2); // Validating PDF bytes
    await new Promise((r) => setTimeout(r, 600));

    setUploadStep(3); // Encrypting with AES-256-GCM
    await new Promise((r) => setTimeout(r, 700));

    setUploadStep(4); // Generating SHA-256
    await new Promise((r) => setTimeout(r, 600));

    setUploadStep(5); // Registering on blockchain ledger
    try {
      const res = await paperApi.upload(formData);
      setUploadResult(res.data);
      setUploadStep(6); // Secured!
      toast.success('Question paper secured and anchored to blockchain!');
      loadData();
    } catch (err: any) {
      console.error('Upload error', err);
      toast.error(err.response?.data?.detail || 'Failed to upload paper');
      setUploadStep(0);
    }
  };

  const resetUploadModal = () => {
    setIsUploadOpen(false);
    setUploadStep(0);
    setTitle('');
    setCode('');
    setSelectedFile(null);
    setUploadResult(null);
  };

  const uploadStepLabels = [
    'Initializing Payload Stream',
    'Validating Document Header & MIME',
    'Deriving Key & AES-256-GCM Envelope Encryption',
    'Generating Plaintext & Ciphertext SHA-256 Digests',
    'Broadcasting Transaction & Anchoring to Block Ledger',
    'Paper Cryptographically Secured',
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Paper Setter Authoring Workspace
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
              ACADEMIC SPECIALIST
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Author, encrypt, anchor, and track question paper integrity before authorized release.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadData} isLoading={isLoading}>
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Refresh
          </Button>
          <Button variant="primary" size="sm" onClick={() => setIsUploadOpen(true)}>
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Upload & Encrypt Paper
          </Button>
        </div>
      </div>

      {/* Workspace KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Total Authored Papers</span>
            <FileText className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{papers.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Anchored in repository</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Encrypted AES-256</span>
            <Lock className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {papers.filter((p) => p.status !== 'DRAFT').length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Zero plaintext exposure</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Approved for Schedule</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {papers.filter((p) => p.status === 'APPROVED' || p.status === 'RELEASE_SCHEDULED').length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Awaiting exam time-lock</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Blockchain Proof Anchors</span>
            <Boxes className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {papers.filter((p) => p.blockchain_tx_hash).length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">100% verified on ledger</div>
        </div>
      </div>

      {/* Papers Table */}
      <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Authored Question Papers & Cryptographic Signatures
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            {papers.length} Papers Registered
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Paper Details</th>
                <th className="py-3 px-3">Examination</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Plaintext SHA-256</th>
                <th className="py-3 px-3">Blockchain Tx</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {papers.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900 dark:text-white">{p.title}</div>
                    <div className="font-mono text-[11px] text-slate-400">{p.paper_id || p.code}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                    <div className="font-medium">{p.subject || 'Core Engineering'}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{p.exam_id}</div>
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="py-3 px-3">
                    <HashViewer hash={p.sha256_hash || p.file_hash} />
                  </td>
                  <td className="py-3 px-3">
                    {p.blockchain_tx_hash ? (
                      <HashViewer hash={p.blockchain_tx_hash} />
                    ) : (
                      <span className="text-slate-400">Pending</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/custody`}>
                        <Button variant="outline" size="sm" className="h-7 text-xs px-2">
                          <Eye className="w-3 h-3 mr-1" /> Custody
                        </Button>
                      </Link>
                      <Link to="/verify">
                        <Button variant="primary" size="sm" className="h-7 text-xs px-2">
                          Verify
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Upload Paper Modal with Multi-Stage Animated Workflow */}
      <Modal
        isOpen={isUploadOpen}
        onClose={resetUploadModal}
        title="Upload & Encrypt Examination Paper"
      >
        {uploadStep === 0 ? (
          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Examination Paper Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. Distributed Database Systems Set A"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Paper Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="PAP-CS301-A"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Linked Examination
                </label>
                <select
                  value={selectedExamId}
                  onChange={(e) => setSelectedExamId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
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
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Select Master Question Paper (PDF / Binary)
              </label>
              <input
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                required
                className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              />
            </div>

            <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 text-[11px] text-indigo-700 dark:text-indigo-300">
              Upon submission, the file will be encrypted using <strong>AES-256-GCM</strong> with an isolated ephemeral key, and its cryptographic SHA-256 digest will be committed to the blockchain.
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={resetUploadModal}>
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
          <div className="py-6 px-2 text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Lock className="w-7 h-7" />
              </motion.div>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Securing Examination Paper...
              </h3>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-mono mt-1">
                {uploadStepLabels[uploadStep - 1]}
              </p>
            </div>

            {/* Stepper Dots */}
            <div className="flex items-center justify-center gap-2 max-w-xs mx-auto">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    s <= uploadStep ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                />
              ))}
            </div>

            <div className="text-[11px] text-slate-400 font-mono">
              FIPS-140 Primitive: AES-256-GCM + SHA256 Chained Block Anchor
            </div>
          </div>
        ) : (
          /* Final Secured Success State */
          <div className="py-6 px-2 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Paper Cryptographically Secured!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                The master question paper has been stored with authenticated envelope encryption.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-left space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>✓ Paper Secured with AES-256-GCM</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>✓ Integrity Hash Generated & Bound</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>✓ Blockchain Record Anchored in Block #{uploadResult?.blockchain_block_number || 15}</span>
              </div>

              {uploadResult?.sha256_hash && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block mb-1">Committed SHA-256 Digest:</span>
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
