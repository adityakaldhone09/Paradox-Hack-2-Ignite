import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitCommit,
  Boxes,
  CheckCircle2,
  Lock,
  Building2,
  KeyRound,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { paperApi, getCachedApiResponse } from '../../services/apiClient';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { HashViewer } from '../../components/ui/HashViewer';
import { PaperSelector } from '../../components/ui/PaperSelector';

export const ChainOfCustodyPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialPaperId = searchParams.get('paperId') || '';
  const cachedPapers = getCachedApiResponse<any[]>('/papers') || [];

  const [papers, setPapers] = useState<any[]>(() => cachedPapers);
  const [selectedPaperId, setSelectedPaperId] = useState(() => initialPaperId || cachedPapers[0]?.id || '');
  const [custodyData, setCustodyData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedEvents, setExpandedEvents] = useState<Record<string, boolean>>({});

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

  const toggleExpand = (id: string) => {
    setExpandedEvents((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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
    <div className="space-y-8 max-w-4xl mx-auto text-left">
      {/* Title */}
      <div className="text-center space-y-1.5 pb-3 border-b border-neutral-200/80 dark:border-neutral-800">
        <h1 className="text-2xl font-bold text-neutral-950 dark:text-white tracking-tight flex items-center justify-center gap-2.5">
          <GitCommit className="w-5 h-5 text-neutral-900 dark:text-white" />
          Blockchain-Backed Chain of Custody
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-lg mx-auto">
          Every document lifecycle state, authority signature, centre assignment, and access attempt is immutably sequenced on the ledger.
        </p>
      </div>

      {/* Modern Paper Selector */}
      <PaperSelector
        papers={papers}
        selectedPaperId={selectedPaperId}
        onSelect={setSelectedPaperId}
        isLoading={papers.length === 0 && isLoading}
      />

      {/* Vertical Interactive Timeline */}
      {isLoading ? (
        <div className="p-12 text-center text-neutral-400 text-xs font-mono">
          Loading immutable ledger event chain...
        </div>
      ) : (
        <div className="relative border-l border-neutral-200 dark:border-neutral-800 ml-4 md:ml-8 space-y-5 py-2">
          {custodyData?.events?.map((evt: any, idx: number) => {
            const Icon = getEventIcon(evt.event_type);
            const isDenied = evt.event_type.includes('DENIED') || evt.event_type.includes('INCIDENT');
            const eventKey = evt.event_id || `evt-${idx}`;
            const isExpanded = !!expandedEvents[eventKey];

            return (
              <motion.div
                key={eventKey}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.05 }}
                className="relative pl-6 md:pl-8 group"
              >
                {/* Node marker icon */}
                <div
                  className={`absolute -left-[14px] top-2 w-7 h-7 rounded-full flex items-center justify-center border transition-all ${
                    isDenied
                      ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-400 text-rose-600 dark:text-rose-400'
                      : 'bg-white dark:bg-[#111113] border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200'
                  } shadow-xs group-hover:scale-105`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>

                {/* Event Card */}
                <div
                  onClick={() => toggleExpand(eventKey)}
                  className="cursor-pointer p-5 rounded-2xl bg-white dark:bg-[#111113] border border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 shadow-xs transition-all space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-xs font-bold ${isDenied ? 'text-rose-600 dark:text-rose-400' : 'text-neutral-950 dark:text-white'}`}>
                        {evt.event_type}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-mono">
                        Block #{evt.block_number}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-neutral-400 font-mono">
                        {new Date(evt.timestamp).toLocaleString()}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5 text-neutral-400" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1 text-neutral-600 dark:text-neutral-400">
                    <div>
                      <span className="text-neutral-400">Actor:</span>{' '}
                      <span className="text-neutral-800 dark:text-neutral-200 font-medium">{evt.actor}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400">Centre:</span>{' '}
                      <span className="text-neutral-800 dark:text-neutral-200 font-medium">{evt.centre}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400">Terminal:</span>{' '}
                      <span className="font-mono text-neutral-700 dark:text-neutral-300">{evt.device}</span>
                    </div>
                  </div>

                  {/* Expandable Cryptographic Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.18 }}
                        className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-neutral-400">Transaction ID:</span>
                          <HashViewer hash={evt.tx_hash} truncate={true} prefixLen={12} suffixLen={8} />
                        </div>
                        {evt.payload_hash && (
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-neutral-400">Payload State Hash:</span>
                            <HashViewer hash={evt.payload_hash} truncate={true} prefixLen={12} suffixLen={8} />
                          </div>
                        )}
                        <div className="text-[11px] text-neutral-400 font-mono">
                          Anchored Status: Verified in Merkle Patricia Trie • Irreversible
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
