import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
}) => {
  const variantStyles = {
    text: 'h-4 rounded-md',
    rectangular: 'rounded-xl',
    circular: 'rounded-full',
  }[variant];

  return (
    <div
      className={`animate-pulse bg-neutral-200/80 dark:bg-neutral-800 ${variantStyles} ${className}`}
      style={{
        width: width !== undefined ? width : undefined,
        height: height !== undefined ? height : undefined,
      }}
    />
  );
};
