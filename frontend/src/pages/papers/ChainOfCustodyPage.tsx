import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GitCommit,
  Boxes,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Building2,
  UserCheck,
  Cpu,
  Calendar,
  KeyRound,
  ShieldAlert
} from 'lucide-react';
import { paperApi } from '../../services/apiClient';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { HashViewer } from '../../components/ui/HashViewer';

export const ChainOfCustodyPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialPaperId = searchParams.get('paperId') || '';

  const [papers, setPapers] = useState<any[]>([]);
  const [selectedPaperId, setSelectedPaperId] = useState(initialPaperId);
  const [custodyData, setCustodyData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadList = async () => {
      try {
        const res = await paperApi.list();
        setPapers(res.data);
        if (res.data.length > 0 && !selectedPaperId) {
          setSelectedPaperId(res.data[0].id);
        }
      } catch (err) {
        console.error('Error loading papers', err);
      }
    };
    loadList();
  }, []);

  useEffect(() => {
    const fetchCustody = async () => {
      if (!selectedPaperId) return;
      setIsLoading(true);
      try {
        const res = await paperApi.getChainOfCustody(selectedPaperId);
        setCustodyData(res.data);
      } catch (err) {
        console.error('Error fetching custody chain', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustody();
  }, [selectedPaperId]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'PAPER_CREATED':
      case 'PAPER_APPROVED':
        return KeyRound;
      case 'PAPER_ASSIGNED':
      case 'CENTRE_AUTHORIZED':
        return Building2;
      case 'ACCESS_GRANTED':
      case 'PAPER_RELEASED':
        return CheckCircle2;
      case 'ACCESS_DENIED':
      case 'INCIDENT_CREATED':
        return ShieldAlert;
      default:
        return Boxes;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center justify-center gap-2">
          <GitCommit className="w-6 h-6 text-brand-400" />
          Blockchain-Backed Chain of Custody
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Every document lifecycle state, authority signature, centre assignment, and access attempt is immutably sequenced on the ledger.
        </p>
      </div>

      {/* Selector */}
      <Card className="p-4 border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-auto flex-1">
          <label className="block text-xs font-semibold text-slate-400 mb-1">Select Examination Paper</label>
          <select
            value={selectedPaperId}
            onChange={(e) => setSelectedPaperId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-medium"
          >
            {papers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.paper_id} — {p.title}
              </option>
            ))}
          </select>
        </div>

        {custodyData && (
          <div className="flex items-center gap-4 text-xs">
            <div>
              <span className="text-slate-500 block">Total Events:</span>
              <span className="font-mono font-bold text-slate-200">{custodyData.total_custody_events}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Status:</span>
              <StatusBadge status={custodyData.current_status} />
            </div>
          </div>
        )}
      </Card>

      {/* Vertical Interactive Timeline */}
      {isLoading ? (
        <div className="p-8 text-center text-slate-500 text-xs">Loading ledger event chain...</div>
      ) : (
        <div className="relative border-l-2 border-slate-800 ml-4 md:ml-8 space-y-6 py-2">
          {custodyData?.events?.map((evt: any, idx: number) => {
            const Icon = getEventIcon(evt.event_type);
            const isDenied = evt.event_type.includes('DENIED') || evt.event_type.includes('INCIDENT');

            return (
              <motion.div
                key={evt.event_id || idx}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="relative pl-6 md:pl-8 group"
              >
                {/* Node marker icon */}
                <div className={`absolute -left-[17px] top-1.5 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  isDenied
                    ? 'bg-rose-950 border-rose-500 text-rose-400'
                    : 'bg-slate-900 border-brand-500 text-brand-400'
                } shadow-lg transition-transform group-hover:scale-110`}>
                  <Icon className="w-4 h-4" />
                </div>

                {/* Event Card */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 group-hover:border-slate-700 transition-all space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-xs font-bold ${isDenied ? 'text-rose-400' : 'text-brand-400'}`}>
                        {evt.event_type}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                        Block #{evt.block_number}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {new Date(evt.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1 text-slate-400">
                    <div>
                      <span className="text-slate-500">Actor:</span>{' '}
                      <span className="text-slate-200 font-medium">{evt.actor}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Centre:</span>{' '}
                      <span className="text-slate-200 font-medium">{evt.centre}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Device:</span>{' '}
                      <span className="font-mono text-slate-300">{evt.device}</span>
                    </div>
                  </div>

                  {/* Cryptographic Transaction Hash */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Transaction ID:</span>
                    <HashViewer hash={evt.tx_hash} truncate={true} prefixLen={12} suffixLen={8} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
