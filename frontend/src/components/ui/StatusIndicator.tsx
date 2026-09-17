import React from 'react';

interface StatusIndicatorProps {
  status: 'verified' | 'warning' | 'critical' | 'active' | 'idle';
  label?: string;
  size?: 'sm' | 'md';
  pulse?: boolean;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  size = 'md',
  pulse = true,
  className = '',
}) => {
  const dotSizes = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
  }[size];

  const colorStyles = {
    verified: 'bg-emerald-500',
    warning: 'bg-amber-500',
    critical: 'bg-rose-500',
    active: 'bg-blue-500',
    idle: 'bg-neutral-400',
  }[status];

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span className="relative flex">
        {pulse && status !== 'idle' && (
          <span
            className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping-slow ${colorStyles}`}
          />
        )}
        <span className={`relative inline-flex rounded-full ${dotSizes} ${colorStyles}`} />
      </span>
      {label && (
        <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
          {label}
        </span>
      )}
    </div>
  );
};
