import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motionTokens } from '../../lib/motion';

export interface MotionButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'danger'
    | 'destructive'
    | 'success'
    | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  isSuccess?: boolean;
  children?: React.ReactNode;
}

export const MotionButton: React.FC<MotionButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isSuccess = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const isDisabled = disabled || isLoading;

  const baseStyles = cn(
    'relative inline-flex items-center justify-center font-medium select-none outline-none',
    'rounded-xl transition-colors duration-150',
    'focus-visible:ring-2 focus-visible:ring-offset-2',
    'focus-visible:ring-neutral-900 dark:focus-visible:ring-white',
    'focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-950',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none'
  );

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 h-8 gap-1.5',
    md: 'text-xs sm:text-sm px-4 py-2 h-10 gap-2',
    lg: 'text-sm sm:text-base px-5 py-2.5 h-12 gap-2.5 font-medium',
    icon: 'h-10 w-10 p-0',
  }[size];

  const variantStyles = {
    primary:
      'bg-[#0A66FF] hover:bg-blue-600 text-white shadow-xs hover:shadow-md dark:bg-blue-600 dark:hover:bg-blue-500',
    secondary:
      'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200/70 dark:hover:bg-neutral-700/80',
    outline:
      'bg-transparent border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800/50',
    ghost:
      'bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800/70 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-xs hover:shadow-md',
    destructive:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-xs hover:shadow-md',
    success:
      'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs hover:shadow-md',
    icon: 'bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white rounded-lg',
  }[variant];

  return (
    <motion.button
      whileHover={
        isDisabled
          ? undefined
          : {
              y: -1,
              transition: motionTokens.fast,
            }
      }
      whileTap={
        isDisabled
          ? undefined
          : {
              scale: 0.98,
              transition: motionTokens.fast,
            }
      }
      disabled={isDisabled}
      className={cn(baseStyles, sizeStyles, variantStyles, className)}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />}
      {!isLoading && isSuccess && <Check className="w-4 h-4 text-current shrink-0" />}
      {children}
    </motion.button>
  );
};
