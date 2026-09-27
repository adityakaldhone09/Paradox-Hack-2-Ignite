import React from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface AnimatedArrowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'dark' | 'light' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export const AnimatedArrowButton: React.FC<AnimatedArrowButtonProps> = ({
  children,
  className,
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'md',
  type = 'button',
  ...props
}) => {
  const isDisabled = disabled || loading;

  const sizeConfigs = {
    sm: {
      height: 'h-10',
      width: 'w-44',
      circle: 'h-10 w-10',
      iconSize: 'h-4 w-4',
      textSize: 'text-xs',
      margin: 'ml-4',
      translate: 'group-hover:translate-x-2',
    },
    md: {
      height: 'h-12',
      width: 'w-52',
      circle: 'h-12 w-12',
      iconSize: 'h-5 w-5',
      textSize: 'text-sm',
      margin: 'ml-5',
      translate: 'group-hover:translate-x-3',
    },
    lg: {
      height: 'h-14',
      width: 'w-60',
      circle: 'h-14 w-14',
      iconSize: 'h-6 w-6',
      textSize: 'text-base',
      margin: 'ml-6',
      translate: 'group-hover:translate-x-4',
    },
  }[size];

  const variants = {
    primary: {
      circle: 'bg-[#0A66FF] shadow-xs',
      text: 'text-neutral-900 dark:text-white',
      border: 'border border-blue-500/20 dark:border-blue-500/30',
      arrow: 'text-white',
      hoverText: 'group-hover:text-white',
    },
    secondary: {
      circle: 'bg-neutral-800 dark:bg-neutral-700',
      text: 'text-neutral-900 dark:text-neutral-100',
      border: 'border border-neutral-300 dark:border-neutral-700',
      arrow: 'text-white',
      hoverText: 'group-hover:text-white',
    },
    dark: {
      circle: 'bg-neutral-950 dark:bg-black',
      text: 'text-neutral-900 dark:text-white',
      border: 'border border-neutral-300 dark:border-neutral-800',
      arrow: 'text-white',
      hoverText: 'group-hover:text-white',
    },
    light: {
      circle: 'bg-white border border-neutral-200 dark:border-neutral-700 shadow-xs',
      text: 'text-neutral-900 dark:text-neutral-200',
      border: 'border border-neutral-200 dark:border-neutral-800',
      arrow: 'text-neutral-900',
      hoverText: 'group-hover:text-neutral-900 dark:group-hover:text-neutral-900',
    },
  };

  const current = variants[variant];

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={cn(
        'group relative inline-flex items-center',
        sizeConfigs.height,
        sizeConfigs.width,
        'overflow-hidden rounded-full',
        'bg-neutral-100/70 dark:bg-neutral-900/60 backdrop-blur-sm',
        current.border,
        'p-0 outline-none select-none',
        'transition-all duration-200',
        'active:scale-[0.98]',
        'focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-950',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100',
        className
      )}
      {...props}
    >
      {/* Expanding circle container */}
      <span
        aria-hidden="true"
        className={cn(
          'absolute left-0 top-1/2 flex items-center justify-center',
          '-translate-y-1/2 rounded-full',
          sizeConfigs.circle,
          'transition-all duration-400',
          '[transition-timing-function:cubic-bezier(0.65,0,0.076,1)]',
          !isDisabled && 'group-hover:w-full',
          current.circle
        )}
      >
        {loading ? (
          <Loader2 className={cn(sizeConfigs.iconSize, 'animate-spin text-white')} />
        ) : (
          <ArrowRight
            className={cn(
              sizeConfigs.iconSize,
              current.arrow,
              'transition-transform duration-400',
              !isDisabled && sizeConfigs.translate
            )}
          />
        )}
      </span>

      {/* Button label text */}
      <span
        className={cn(
          'relative z-10 w-full',
          sizeConfigs.margin,
          sizeConfigs.textSize,
          'pr-4 text-center font-semibold tracking-tight',
          'transition-colors duration-300',
          !isDisabled && current.hoverText,
          current.text
        )}
      >
        {loading ? 'Processing...' : children}
      </span>
    </button>
  );
};
