import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface HashViewerProps {
  hash: string;
  label?: string;
  truncate?: boolean;
  prefixLen?: number;
  suffixLen?: number;
  className?: string;
}

export const HashViewer: React.FC<HashViewerProps> = ({
  hash,
  label,
  truncate = true,
  prefixLen = 10,
  suffixLen = 8,
  className = ''
}) => {
  const [copied, setCopied] = useState(false);

  if (!hash) return <span className="text-slate-500 font-mono text-xs">N/A</span>;

  const displayHash = truncate && hash.length > (prefixLen + suffixLen)
    ? `${hash.slice(0, prefixLen)}...${hash.slice(-suffixLen)}`
    : hash;

  const copyToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hash);
    setCopied(true);
    toast.success('Cryptographic hash copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`inline-flex items-center gap-2 group ${className}`}>
      {label && <span className="text-xs text-slate-400 font-medium">{label}:</span>}
      <code className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800/80 text-brand-400 border border-brand-500/20 tracking-wider">
        {displayHash}
      </code>
      <button
        onClick={copyToClipboard}
        className="text-slate-400 hover:text-brand-400 p-1 rounded hover:bg-slate-800 transition-colors"
        title="Copy full cryptographic hash"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
};
