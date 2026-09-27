import React from 'react';
import { cn } from '../../lib/utils';

export interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular' | 'card' | 'tableRow';
  width?: string | number;
  height?: string | number;
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
  count = 1,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'text':
        return 'h-4 w-full rounded-md';
      case 'circular':
        return 'rounded-full aspect-square';
      case 'card':
        return 'h-40 w-full rounded-2xl';
      case 'tableRow':
        return 'h-12 w-full rounded-xl';
      case 'rectangular':
      default:
        return 'rounded-xl';
    }
  };

  const renderSingle = (key: number) => (
    <div
      key={key}
      className={cn(
        'relative overflow-hidden bg-neutral-200/70 dark:bg-neutral-800/60',
        getVariantStyles(),
        className
      )}
      style={{
        width: width !== undefined ? width : undefined,
        height: height !== undefined ? height : undefined,
      }}
    >
      {/* Subtle shimmer sheen */}
      <div
        className="animate-shimmer absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent"
        aria-hidden="true"
      />
    </div>
  );

  if (count > 1) {
    return (
      <div className="space-y-2.5 w-full">
        {Array.from({ length: count }, (_, i) => renderSingle(i))}
      </div>
    );
  }

  return renderSingle(0);
};
