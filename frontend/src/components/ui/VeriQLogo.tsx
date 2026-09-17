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
    sm: { icon: 30, text: 'text-base', markBox: 'w-7 h-7' },
    md: { icon: 36, text: 'text-lg', markBox: 'w-9 h-9' },
    lg: { icon: 42, text: 'text-xl', markBox: 'w-10 h-10' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Official VeriQ Mark: Black geometric V/Q mark with vibrant blue verification stroke */}
      <div
        className={`relative flex items-center justify-center shrink-0 rounded-xl bg-[#0A0A0B] dark:bg-white text-white dark:text-[#0A0A0B] shadow-xs group-hover:scale-105 transition-transform duration-200 overflow-hidden`}
        style={{ width: currentSize.icon, height: currentSize.icon }}
      >
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1"
        >
          {/* Geometric V Outer Contour */}
          <path
            d="M10 11L18.5 27.5C19.2 28.9 20.8 28.9 21.5 27.5L30 11H25L20 22L15 11H10Z"
            className="fill-white dark:fill-[#0A0A0B]"
          />
          {/* Q Base Counter Segment */}
          <path
            d="M14 19.5C14 16.5 16.5 14 20 14C23.5 14 26 16.5 26 19.5C26 22.5 23.5 25 20 25C18.2 25 16.6 24.3 15.5 23.1"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Iconic Blue Verification Stroke */}
          <path
            d="M17 21L21 25L29 14"
            className="stroke-[#2563EB] dark:stroke-[#3B82F6]"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Brand Wordmark (Never displays WB-03) */}
      {!compact && (
        <div className="flex flex-col text-left leading-none">
          <div className="flex items-center tracking-tight font-extrabold text-[#0A0A0B] dark:text-white">
            <span className={`${currentSize.text}`}>Veri</span>
            <span className={`${currentSize.text} text-[#2563EB] dark:text-[#3B82F6]`}>Q</span>
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
