import React from 'react';

interface VeriQLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  compact?: boolean;
  showTagline?: boolean;
  variant?: 'standard' | 'full';
}

export const VeriQLogo: React.FC<VeriQLogoProps> = ({
  className = '',
  size = 'md',
  compact = false,
  showTagline = false,
  variant = 'standard',
}) => {
  // Calibrated size mappings for standard heights
  const sizeMap = {
    sm: { icon: 28, text: 'text-base', tagline: 'text-[9px]', fullH: 'h-16' },
    md: { icon: 36, text: 'text-lg', tagline: 'text-[10px]', fullH: 'h-20' },
    lg: { icon: 46, text: 'text-2xl', tagline: 'text-[11px]', fullH: 'h-28' },
  };

  const currentSize = sizeMap[size];

  // If full stacked logo variant is explicitly requested
  if (variant === 'full') {
    return (
      <div className={`inline-flex flex-col items-center select-none ${className}`}>
        <img
          src="/assets/veriq-logo-full.png"
          alt="VeriQ Logo"
          className={`${currentSize.fullH} w-auto object-contain dark:hidden group-hover:scale-[1.02] transition-transform duration-200`}
          loading="eager"
        />
        <img
          src="/assets/veriq-logo-full-dark.png"
          alt="VeriQ Logo"
          className={`${currentSize.fullH} w-auto object-contain hidden dark:block group-hover:scale-[1.02] transition-transform duration-200`}
          loading="eager"
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Official VeriQ Shield Emblem */}
      <div
        className="relative flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200"
        style={{ width: currentSize.icon, height: currentSize.icon }}
      >
        <img
          src="/assets/veriq-mark.png"
          alt="VeriQ Shield"
          className="w-full h-full object-contain select-none filter drop-shadow-xs"
          loading="eager"
        />
      </div>

      {/* Brand Wordmark & Tagline */}
      {!compact && (
        <div className="flex flex-col text-left leading-none justify-center">
          <div className="flex items-center tracking-wide font-black">
            <span className={`${currentSize.text} font-black text-[#022754] dark:text-white tracking-wider`}>
              VERI
            </span>
            <span className={`${currentSize.text} font-black text-[#0085F4] dark:text-[#38BDF8] tracking-wider`}>
              Q
            </span>
          </div>
          {showTagline && (
            <span
              className={`${currentSize.tagline} text-neutral-500 dark:text-neutral-400 tracking-tight mt-1 font-normal whitespace-nowrap`}
            >
              Secure every question paper. Verify every action.
            </span>
          )}
        </div>
      )}
    </div>
  );
};

