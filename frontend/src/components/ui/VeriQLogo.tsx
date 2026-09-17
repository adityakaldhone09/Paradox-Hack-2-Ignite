import React from 'react';

interface VeriQLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  compact?: boolean;
  showTagline?: boolean;
  layout?: 'vertical' | 'horizontal';
  variant?: 'standard' | 'full';
}

export const VeriQLogo: React.FC<VeriQLogoProps> = ({
  className = '',
  size = 'md',
  compact = false,
  showTagline = false,
  layout = 'vertical',
  variant = 'standard',
}) => {
  // Calibrated size mappings
  const sizeMap = {
    sm: { icon: 28, stackedH: 38, horizH: 26, tagline: 'text-[9px]', fullH: 'h-16' },
    md: { icon: 36, stackedH: 48, horizH: 34, tagline: 'text-[10px]', fullH: 'h-20' },
    lg: { icon: 48, stackedH: 64, horizH: 42, tagline: 'text-[11px]', fullH: 'h-28' },
  };

  const currentSize = sizeMap[size];

  // Full stacked version with all subtitles and bottom line
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

  // Compact mode (e.g. collapsed sidebar) - renders only the shield mark
  if (compact) {
    return (
      <div
        className={`relative flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200 select-none ${className}`}
        style={{ width: currentSize.icon, height: currentSize.icon }}
      >
        <img
          src="/assets/veriq-mark.png"
          alt="VeriQ Shield"
          className="w-full h-full object-contain select-none filter drop-shadow-xs"
          loading="eager"
        />
      </div>
    );
  }

  // Horizontal layout (if explicitly requested)
  if (layout === 'horizontal') {
    return (
      <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
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
        <div className="flex flex-col text-left leading-none justify-center">
          <div className="flex items-center tracking-wide font-black">
            <span className="text-lg font-black text-[#022754] dark:text-white tracking-wider">
              VERI
            </span>
            <span className="text-lg font-black text-[#0085F4] dark:text-[#38BDF8] tracking-wider">
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
      </div>
    );
  }

  // Default: Vertical Stacked Logo (Shield on top, VERIQ text directly below it)
  return (
    <div className={`inline-flex flex-col items-center justify-center text-center select-none ${className}`}>
      <img
        src="/assets/veriq-logo-stacked.png"
        alt="VeriQ"
        style={{ height: currentSize.stackedH, width: 'auto' }}
        className="dark:hidden object-contain shrink-0 group-hover:scale-105 transition-transform duration-200 filter drop-shadow-xs"
        loading="eager"
      />
      <img
        src="/assets/veriq-logo-stacked-dark.png"
        alt="VeriQ"
        style={{ height: currentSize.stackedH, width: 'auto' }}
        className="hidden dark:block object-contain shrink-0 group-hover:scale-105 transition-transform duration-200 filter drop-shadow-xs"
        loading="eager"
      />
      {showTagline && (
        <span
          className={`${currentSize.tagline} text-neutral-500 dark:text-neutral-400 tracking-tight mt-1 font-normal text-center whitespace-nowrap`}
        >
          Secure every question paper. Verify every action.
        </span>
      )}
    </div>
  );
};

