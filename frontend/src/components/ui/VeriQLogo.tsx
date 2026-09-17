import React from 'react';

interface VeriQLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  compact?: boolean;
  showTagline?: boolean;
}

export const VeriQLogo: React.FC<VeriQLogoProps> = ({
  className = '',
  size = 'md',
  compact = false,
  showTagline = false,
}) => {
  // Dimensions calibrated for 32px – 40px visual height standard
  const sizeMap = {
    sm: { icon: 28, height: 'h-7', text: 'text-base' },
    md: { icon: 36, height: 'h-9', text: 'text-lg' },
    lg: { icon: 42, height: 'h-11', text: 'text-xl' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Minimal Academic & Security Icon Emblem */}
      <div
        className={`relative flex items-center justify-center shrink-0 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 shadow-xs group-hover:scale-105 transition-transform duration-200`}
        style={{ width: currentSize.icon, height: currentSize.icon }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 transition-colors"
        >
          {/* Academic Graduation Cap Top */}
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          {/* Security Shield / Academic Gown Lower Contour with Blue Accent */}
          <path d="M6 12v5c3 3 9 3 12 0v-5" className="text-blue-400 dark:text-blue-600" stroke="currentColor" />
          {/* Cryptographic Center Node */}
          <circle cx="12" cy="10" r="1" fill="currentColor" />
        </svg>
      </div>

      {/* Brand Typography (Never displays WB-03) */}
      {!compact && (
        <div className="flex flex-col text-left leading-none">
          <div className="flex items-center gap-1">
            <span className={`font-bold tracking-tight text-neutral-950 dark:text-white ${currentSize.text}`}>
              VeriQ
            </span>
          </div>
          {showTagline && (
            <span className="text-[10px] text-neutral-500 dark:text-neutral-400 tracking-normal mt-0.5 font-normal">
              Secure every question paper. Verify every action.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
