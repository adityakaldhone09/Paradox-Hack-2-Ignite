import React, { useState, useEffect } from 'react';
import {
  Boxes,
  Activity,
  Layers,
  Search,
  CheckCircle2,
  ExternalLink,
  Copy,
  Clock,
  ShieldCheck,
  Eye
} from 'lucide-react';
import { blockchainApi, getCachedApiResponse } from '../../services/apiClient';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { HashViewer } from '../../components/ui/HashViewer';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';

export const BlockchainExplorerPage: React.FC = () => {
  const [status, setStatus] = useState<any>(() => getCachedApiResponse('/blockchain/status'));
  const [transactions, setTransactions] = useState<any[]>(() => getCachedApiResponse('/blockchain/transactions') || []);
  const [selectedTx, setSelectedTx] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(() => !getCachedApiResponse('/blockchain/status'));

  const loadData = async () => {
    try {
      const [statusRes, txRes] = await Promise.all([
        blockchainApi.getStatus(),
        blockchainApi.getTransactions(),
      ]);
      setStatus(statusRes.data);
      setTransactions(txRes.data);
    } catch (err) {
      console.error('Error fetching blockchain records', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 8000);
    return () => clearInterval(interval);
  }, []);

  const openTxDetail = async (txHash: string) => {
    try {
      const res = await blockchainApi.getTransaction(txHash);
      setSelectedTx(res.data);
      setIsModalOpen(true);
    } catch (err) {
      console.error('Error loading tx detail', err);
    }
  };

  const filteredTxs = transactions.filter((t) =>
    search ? (
      t.tx_hash.toLowerCase().includes(search.toLowerCase()) ||
      t.event_type.toLowerCase().includes(search.toLowerCase()) ||
      t.actor_id.toLowerCase().includes(search.toLowerCase())
    ) : true
  );

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Boxes className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
            Consortium Blockchain Explorer
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Real-time inspection of cryptographic block chaining, Merkle proofs, and examination ledger anchors.
          </p>
        </div>
      </div>

      {/* Network Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Consortium Network</span>
          <p className="text-sm font-bold text-slate-900 dark:text-white mt-1 truncate">{status?.network || 'VeriQ-Proof-Ledger'}</p>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" /> Connected
          </div>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Mined Block Height</span>
          <p className="text-2xl font-mono font-bold text-brand-600 dark:text-brand-400 mt-1">#{status?.block_height ?? 1}</p>
          <span className="text-[11px] text-slate-500">100% Validated</span>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Anchored Transactions</span>
          <p className="text-2xl font-mono font-bold text-indigo-600 dark:text-indigo-400 mt-1">{status?.total_transactions ?? 28}</p>
          <span className="text-[11px] text-slate-500">Zero Rollbacks</span>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Consensus Mechanism</span>
          <p className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 mt-1">PoA / SHA-256 Merkle</p>
          <span className="text-[11px] text-slate-500">Instant Finality</span>
        </Card>
      </div>

      {/* Transactions Table Card */}
      <Card className="p-5 border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-500 dark:text-brand-400" />
            Anchored Ledger Transactions ({filteredTxs.length})
          </h3>
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search by tx hash or event type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-semibold">
                <th className="pb-2.5">Tx Hash</th>
                <th className="pb-2.5">Block</th>
                <th className="pb-2.5">Event Type</th>
                <th className="pb-2.5">Actor</th>
                <th className="pb-2.5">Timestamp</th>
                <th className="pb-2.5">Status</th>
                <th className="pb-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
              {filteredTxs.map((tx) => (
                <tr key={tx.tx_hash} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="py-3">
                    <HashViewer hash={tx.tx_hash} truncate={true} prefixLen={8} suffixLen={6} />
                  </td>
                  <td className="py-3 font-mono font-bold text-slate-700 dark:text-slate-300">#{tx.block_number}</td>
                  <td className="py-3 font-mono text-brand-600 dark:text-brand-400 font-semibold">{tx.event_type}</td>
                  <td className="py-3 text-slate-700 dark:text-slate-300 truncate max-w-[150px]">{tx.actor_id}</td>
                  <td className="py-3 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                    {new Date(tx.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="py-3">
                    <StatusBadge status={tx.status} />
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => openTxDetail(tx.tx_hash)}
                      className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Inspect Transaction Proof"
                    >
                      <Eye className="w-4 h-4 text-brand-500 dark:text-brand-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Transaction Details Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Blockchain Transaction Verification" maxWidth="max-w-2xl">
        {selectedTx && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-slate-500 block">Event Type:</span>
                <span className="font-mono text-brand-600 dark:text-brand-400 font-bold">{selectedTx.event_type}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Block Number:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200 font-bold">#{selectedTx.block_number}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Actor:</span>
                <span className="text-slate-800 dark:text-slate-200 font-medium">{selectedTx.actor_id}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Status:</span>
                <StatusBadge status={selectedTx.status} />
              </div>
            </div>

            <div>
              <span className="text-slate-600 dark:text-slate-400 block mb-1 font-semibold">Transaction ID (Hash):</span>
              <HashViewer hash={selectedTx.tx_hash} truncate={false} />
            </div>

            <div>
              <span className="text-slate-600 dark:text-slate-400 block mb-1 font-semibold">Payload Merkle / Content Hash:</span>
              <HashViewer hash={selectedTx.payload_hash} truncate={false} />
            </div>

            <div>
              <span className="text-slate-600 dark:text-slate-400 block mb-1 font-semibold">Previous Block Cryptographic Link:</span>
              <HashViewer hash={selectedTx.previous_hash} truncate={false} />
            </div>

            <div>
              <span className="text-slate-600 dark:text-slate-400 block mb-1 font-semibold">Digital Authority Signature:</span>
              <HashViewer hash={selectedTx.signature} truncate={false} />
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Close Proof
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
