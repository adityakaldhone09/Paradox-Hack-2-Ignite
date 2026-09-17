import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, Check, FileText, Clock, AlertCircle } from 'lucide-react';
import { Button } from './Button';

export interface PaperItem {
  id: string;
  paper_id?: string;
  title: string;
  subject?: string;
  status: string;
  release_time?: string;
  exam_name?: string;
  exam_code?: string;
  sha256_hash?: string;
}

interface PaperSelectorProps {
  papers: PaperItem[];
  selectedPaperId: string;
  onSelect: (paperId: string) => void;
  isLoading?: boolean;
  onContinue?: () => void;
  continueLabel?: string;
  continueLoading?: boolean;
  className?: string;
}

export const PaperSelector: React.FC<PaperSelectorProps> = ({
  papers,
  selectedPaperId,
  onSelect,
  isLoading = false,
  onContinue,
  continueLabel = 'Continue',
  continueLoading = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedPaper = papers.find((p) => p.id === selectedPaperId || p.paper_id === selectedPaperId);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const filteredPapers = papers.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (p.title && p.title.toLowerCase().includes(q)) ||
      (p.paper_id && p.paper_id.toLowerCase().includes(q)) ||
      (p.subject && p.subject.toLowerCase().includes(q)) ||
      (p.exam_code && p.exam_code.toLowerCase().includes(q))
    );
  });

  const getStatusDot = (status: string) => {
    const normalized = (status || '').toUpperCase();
    if (normalized.includes('VERIFIED') || normalized.includes('APPROVED') || normalized.includes('ACTIVE')) {
      return { dot: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-400', label: 'Verified' };
    }
    if (normalized.includes('RELEASED')) {
      return { dot: 'bg-blue-500', text: 'text-blue-700 dark:text-blue-400', label: 'Released' };
    }
    if (normalized.includes('REVOKED') || normalized.includes('CRITICAL') || normalized.includes('FAIL')) {
      return { dot: 'bg-red-500', text: 'text-red-700 dark:text-red-400', label: 'Revoked' };
    }
    return { dot: 'bg-amber-500', text: 'text-amber-700 dark:text-amber-400', label: status || 'Scheduled' };
  };

  const formatReleaseTime = (timeStr?: string) => {
    if (!timeStr) return '10:00 AM';
    try {
      const d = new Date(timeStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '10:00 AM';
    }
  };

  return (
    <div ref={containerRef} className={`w-full max-w-xl mx-auto space-y-4 text-left ${className}`}>
      {/* Header */}
      <div>
        <h3 className="text-base font-bold text-neutral-950 dark:text-white">
          Select examination paper
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Choose an assigned paper to continue.
        </p>
      </div>

      {/* Dropdown Container */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full h-12 rounded-xl border bg-white dark:bg-[#111113] px-4 flex items-center justify-between text-xs sm:text-sm transition-all outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white ${
            isOpen
              ? 'border-neutral-900 dark:border-white ring-1 ring-neutral-900/10'
              : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
          }`}
        >
          <span className={selectedPaper ? 'text-neutral-900 dark:text-white font-medium truncate' : 'text-neutral-400'}>
            {selectedPaper ? `${selectedPaper.paper_id || 'PAP'} — ${selectedPaper.title}` : 'Search examination papers...'}
          </span>
          <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${isOpen ? 'rotate-180 text-neutral-900 dark:text-white' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.99 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 right-0 top-full mt-2 z-40 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111113] shadow-lg overflow-hidden"
            >
              {/* Search Bar inside dropdown */}
              <div className="p-2 border-b border-neutral-100 dark:border-neutral-800">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search by code or subject..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-9 rounded-lg bg-neutral-50 dark:bg-neutral-800/80 pl-9 pr-3 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 outline-none"
                  />
                </div>
              </div>

              {/* Options List */}
              <div className="max-h-60 overflow-y-auto p-1.5 space-y-1">
                {isLoading ? (
                  <div className="py-6 text-center text-xs text-neutral-400">Loading assigned papers...</div>
                ) : filteredPapers.length === 0 ? (
                  <div className="py-6 px-4 text-center text-xs text-neutral-500">
                    <p className="font-medium">No examination papers found.</p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">Check assignment or contact the administrator.</p>
                  </div>
                ) : (
                  filteredPapers.map((paper) => {
                    const isSelected = selectedPaper?.id === paper.id;
                    const statusInfo = getStatusDot(paper.status);
                    return (
                      <button
                        key={paper.id}
                        type="button"
                        onClick={() => {
                          onSelect(paper.id);
                          setIsOpen(false);
                          setSearchQuery('');
                        }}
                        className={`w-full text-left p-2.5 rounded-xl transition-colors flex items-center justify-between gap-3 text-xs ${
                          isSelected
                            ? 'bg-[#F7F7F5] dark:bg-neutral-800 text-neutral-950 dark:text-white font-medium'
                            : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50 text-neutral-700 dark:text-neutral-300'
                        }`}
                      >
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-semibold text-neutral-950 dark:text-white">
                              {paper.paper_id || 'PAP'}
                            </span>
                            <span className="truncate text-neutral-800 dark:text-neutral-200">
                              {paper.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                            <span>Release: {formatReleaseTime(paper.release_time)}</span>
                            <span className="flex items-center gap-1">
                              <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                              <span className={statusInfo.text}>{statusInfo.label}</span>
                            </span>
                          </div>
                        </div>

                        {isSelected && <Check className="w-4 h-4 text-neutral-900 dark:text-white shrink-0" />}
                      </button>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Selected Paper Summary Card (Compact & Actionable) */}
      <AnimatePresence>
        {selectedPaper ? (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
            className="p-4 sm:p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#111113] shadow-xs space-y-4"
          >
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block mb-0.5">
                  Selected Paper
                </span>
                <h4 className="text-sm font-bold text-neutral-950 dark:text-white">
                  {selectedPaper.paper_id || 'PAP'} — {selectedPaper.title}
                </h4>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {selectedPaper.exam_name || 'Assigned Session'}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block mb-0.5">
                  Status
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium">
                  <span className={`w-2 h-2 rounded-full ${getStatusDot(selectedPaper.status).dot}`} />
                  <span className={getStatusDot(selectedPaper.status).text}>
                    {getStatusDot(selectedPaper.status).label}
                  </span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-neutral-400 text-[11px] block">Scheduled Release</span>
                <span className="font-mono text-neutral-800 dark:text-neutral-200 font-medium">
                  {formatReleaseTime(selectedPaper.release_time)}
                </span>
              </div>
              <div>
                <span className="text-neutral-400 text-[11px] block">Assigned Centre</span>
                <span className="font-medium text-neutral-800 dark:text-neutral-200">
                  Centre C101 (Terminal Active)
                </span>
              </div>
            </div>

            {onContinue && (
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={onContinue}
                  isLoading={continueLoading}
                  className="w-full h-10 text-xs font-medium"
                >
                  {continueLabel}
                </Button>
              </div>
            )}
          </motion.div>
        ) : (
          /* Empty / Unselected Guidance */
          <div className="p-4 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 text-center text-xs text-neutral-400">
            Select an examination paper above to view verification status and continue.
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
