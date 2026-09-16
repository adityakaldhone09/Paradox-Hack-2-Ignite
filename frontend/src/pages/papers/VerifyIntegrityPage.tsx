import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  AlertOctagon,
  ShieldCheck,
  Search,
  RefreshCw,
  Binary,
  Boxes,
  Zap,
  ArrowRight
} from 'lucide-react';
import { paperApi } from '../../services/apiClient';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { HashViewer } from '../../components/ui/HashViewer';
import { toast } from 'sonner';

export const VerifyIntegrityPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialPaperId = searchParams.get('paperId') || '';

  const [papers, setPapers] = useState<any[]>([]);
  const [selectedPaperId, setSelectedPaperId] = useState(initialPaperId);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const loadList = async () => {
      try {
        const res = await paperApi.list();
        setPapers(res.data);
        if (res.data.length > 0 && !selectedPaperId) {
          setSelectedPaperId(res.data[0].id);
        }
      } catch (err) {
        console.error('Error fetching papers', err);
      }
    };
    loadList();
  }, []);

  const runVerification = async (simulateTamper = false) => {
    if (!selectedPaperId) return;
    setIsVerifying(true);
    setVerificationResult(null);

    try {
      // Small pause for realistic cryptographic hashing effect
      await new Promise((r) => setTimeout(r, 600));
      const res = await paperApi.verify(selectedPaperId, { simulate_tamper: simulateTamper });
      setVerificationResult(res.data);

      if (res.data.verified) {
        toast.success('Document integrity confirmed! SHA-256 matches blockchain proof.');
      } else {
        toast.error('CRITICAL: Hash mismatch! Document tampering detected.');
      }
    } catch (err: any) {
      toast.error('Verification failed: ' + (err.response?.data?.detail || err.message));
    } finally {
      setIsVerifying(false);
    }
  };

  const selectedPaper = papers.find((p) => p.id === selectedPaperId || p.paper_id === selectedPaperId);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center justify-center gap-2">
          <ShieldCheck className="w-7 h-7 text-brand-400" />
          Cryptographic Integrity & Tamper Verification
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Verify recovered off-chain document bytes against the immutable SHA-256 anchor registered on the blockchain proof ledger.
        </p>
      </div>

      {/* Select Paper Card */}
      <Card className="p-5 border-slate-800 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Select Examination Paper to Verify *
          </label>
          <select
            value={selectedPaperId}
            onChange={(e) => {
              setSelectedPaperId(e.target.value);
              setVerificationResult(null);
            }}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-medium"
          >
            {papers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.paper_id} — {p.title} ({p.status})
              </option>
            ))}
          </select>
        </div>

        {selectedPaper && (
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs space-y-1">
            <div className="flex justify-between items-center text-slate-400">
              <span>Blockchain Proof Anchor:</span>
              <HashViewer hash={selectedPaper.sha256_hash} truncate={true} prefixLen={10} suffixLen={8} />
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Encryption Status:</span>
              <span className="text-emerald-400 font-mono font-semibold">AES-256-GCM Authenticated</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 pt-2">
          <Button
            onClick={() => runVerification(false)}
            isLoading={isVerifying}
            className="flex-1 shadow-lg shadow-brand-500/20"
          >
            <ShieldCheck className="w-4 h-4" /> Run Standard Verification
          </Button>
          <Button
            variant="outline"
            onClick={() => runVerification(true)}
            disabled={isVerifying}
            className="border-rose-500/40 text-rose-400 hover:bg-rose-500/10"
            title="Simulates byte modification to demonstrate tamper detection alert"
          >
            <Zap className="w-4 h-4 text-rose-400" /> Simulate Tampering Failure
          </Button>
        </div>
      </Card>

      {/* Verification Result Display */}
      {verificationResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-6 rounded-2xl border ${
            verificationResult.verified
              ? 'bg-emerald-500/5 border-emerald-500/30'
              : 'bg-rose-500/5 border-rose-500/40 animate-pulse-subtle'
          } space-y-6 shadow-2xl`}
        >
          {/* Status Banner */}
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
              verificationResult.verified ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
            }`}>
              {verificationResult.verified ? (
                <CheckCircle2 className="w-8 h-8" />
              ) : (
                <AlertOctagon className="w-8 h-8" />
              )}
            </div>
            <div>
              <h2 className={`text-xl font-extrabold tracking-tight ${
                verificationResult.verified ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {verificationResult.verified ? '✅ DOCUMENT VERIFIED' : '🚨 DOCUMENT INTEGRITY FAILURE'}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">{verificationResult.message}</p>
            </div>
          </div>

          {/* Hash Comparison Table */}
          <div className="space-y-3 bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block mb-1">Blockchain Anchored Digest (Ground Truth Proof):</span>
              <code className="font-mono text-xs px-2.5 py-1 rounded bg-slate-900 text-brand-400 border border-brand-500/30 block break-all">
                {verificationResult.blockchain_anchored_hash}
              </code>
            </div>

            <div>
              <span className="text-slate-400 block mb-1">Current Calculated Digest (Recovered Plaintext):</span>
              <code className={`font-mono text-xs px-2.5 py-1 rounded bg-slate-900 border block break-all ${
                verificationResult.verified
                  ? 'text-emerald-400 border-emerald-500/30'
                  : 'text-rose-400 border-rose-500/40 bg-rose-950/30'
              }`}>
                {verificationResult.current_document_hash}
              </code>
            </div>

            <div className="flex justify-between items-center text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              <span>Ledger Transaction Anchor:</span>
              <HashViewer hash={verificationResult.tx_hash} truncate={true} prefixLen={8} suffixLen={6} />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
