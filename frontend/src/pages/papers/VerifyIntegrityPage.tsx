import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  AlertOctagon,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { paperApi } from '../../services/apiClient';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { HashViewer } from '../../components/ui/HashViewer';
import { PaperSelector } from '../../components/ui/PaperSelector';
import { toast } from 'sonner';

export const VerifyIntegrityPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialPaperId = searchParams.get('paperId') || '';

  const [papers, setPapers] = useState<any[]>([]);
  const [selectedPaperId, setSelectedPaperId] = useState(initialPaperId);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoadingPapers, setIsLoadingPapers] = useState(true);

  useEffect(() => {
    const loadList = async () => {
      try {
        const res = await paperApi.list();
        setPapers(res.data);
        const resolvedPaperId = initialPaperId || (res.data[0]?.id ?? '');
        if (resolvedPaperId) {
          setSelectedPaperId(resolvedPaperId);
        }
      } catch (err) {
        console.error('Error fetching papers', err);
      } finally {
        setIsLoadingPapers(false);
      }
    };
    loadList();
  }, [initialPaperId]);

  useEffect(() => {
    if (!selectedPaperId || isLoadingPapers || isVerifying) return;
    const shouldAutoVerify = !!initialPaperId && !verificationResult;
    if (shouldAutoVerify) {
      runVerification(false);
    }
  }, [selectedPaperId, initialPaperId, isLoadingPapers, isVerifying]);

  const runVerification = async (simulateTamper = false) => {
    if (!selectedPaperId) return;
    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const res = await paperApi.verify(selectedPaperId, { simulate_tamper: simulateTamper });
      setVerificationResult(res.data);

      if (res.data.verified) {
        toast.success('Document integrity confirmed: SHA-256 matches blockchain proof');
      } else if (res.data.status === 'TAMPER_DETECTED') {
        toast.error('Simulation: 1-byte tamper detected! Digest mismatch confirmed');
      } else {
        toast.error('CRITICAL: Hash mismatch! Document tampering detected');
      }
    } catch (err: any) {
      toast.error('Verification failed: ' + (err.response?.data?.detail || err.message));
    } finally {
      setIsVerifying(false);
    }
  };

  const selectedPaper = papers.find((p) => p.id === selectedPaperId || p.paper_id === selectedPaperId);

  return (
    <div className="space-y-8 max-w-2xl mx-auto text-left">
      {/* Page Header */}
      <div className="text-center space-y-1.5 pb-3 border-b border-neutral-200/80 dark:border-neutral-800">
        <h1 className="text-2xl font-bold text-neutral-950 dark:text-white tracking-tight flex items-center justify-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-neutral-900 dark:text-white" />
          Cryptographic Integrity & Tamper Verification
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-lg mx-auto">
          Verify recovered off-chain document bytes against the immutable SHA-256 anchor registered on the blockchain proof ledger.
        </p>
      </div>

      {/* Modern Searchable Paper Selector */}
      <PaperSelector
        papers={papers}
        selectedPaperId={selectedPaperId}
        onSelect={(id) => {
          setSelectedPaperId(id);
          setVerificationResult(null);
        }}
        isLoading={isLoadingPapers}
        onContinue={() => runVerification(false)}
        continueLabel="Run Cryptographic Verification"
        continueLoading={isVerifying}
      />

      {/* Tamper Simulation Test Trigger */}
      {selectedPaper && (
        <div className="flex justify-center pt-1">
          <button
            type="button"
            onClick={() => runVerification(true)}
            disabled={isVerifying}
            className="text-xs font-medium text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Simulate 1-Byte Tamper Failure</span>
          </button>
        </div>
      )}

      {/* Verification Result Display */}
      {verificationResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`p-6 rounded-2xl border ${
            verificationResult.verified
              ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-800/60'
              : 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200/80 dark:border-rose-800/60'
          } space-y-5 shadow-xs`}
        >
          {/* Status Banner */}
          <div className="flex items-center gap-3.5">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
              verificationResult.verified
                ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400'
            }`}>
              {verificationResult.verified ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <AlertOctagon className="w-5 h-5" />
              )}
            </div>
            <div>
              <h2 className={`text-base font-bold tracking-tight ${
                verificationResult.verified ? 'text-emerald-800 dark:text-emerald-300' : 'text-rose-800 dark:text-rose-300'
              }`}>
                {verificationResult.verified ? 'DOCUMENT VERIFIED' : 'DOCUMENT INTEGRITY FAILURE'}
              </h2>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">{verificationResult.message}</p>
            </div>
          </div>

          {/* Hash Comparison Table */}
          <div className="space-y-3 bg-white dark:bg-[#111113] p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs shadow-2xs">
            <div>
              <span className="text-neutral-400 block mb-1 text-[11px]">Blockchain Anchored Digest (Ground Truth):</span>
              <code className="font-mono text-xs px-2.5 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/80 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700 block break-all">
                {verificationResult.blockchain_anchored_hash}
              </code>
            </div>

            <div>
              <span className="text-neutral-400 block mb-1 text-[11px]">Current Calculated Digest (Recovered Plaintext):</span>
              <code className={`font-mono text-xs px-2.5 py-1.5 rounded-lg border block break-all ${
                verificationResult.verified
                  ? 'bg-neutral-50 dark:bg-neutral-800/80 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60'
                  : 'text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/60 bg-rose-50/50 dark:bg-rose-950/30'
              }`}>
                {verificationResult.current_document_hash}
              </code>
            </div>

            <div className="flex justify-between items-center text-[11px] text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <span>Ledger Transaction Anchor:</span>
              <HashViewer hash={verificationResult.tx_hash} truncate={true} prefixLen={8} suffixLen={6} />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
