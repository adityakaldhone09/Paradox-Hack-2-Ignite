import React from 'react';
import { motion, HTMLMotionProps, useReducedMotion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { motionTokens } from '../../lib/motion';

interface ShimmerButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  variant?: 'primary' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Tactile CTA button with a subtle diagonal light sheen sweep on hover.
 */
export const ShimmerButton: React.FC<ShimmerButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  ...props
}) => {
  const shouldReduceMotion = useReducedMotion();

  const sizeStyles = {
    sm: 'text-xs px-4 py-2 h-9 gap-1.5',
    md: 'text-sm px-5 py-2.5 h-11 gap-2',
    lg: 'text-base px-7 py-3.5 h-12 gap-2.5',
  }[size];

  const variantStyles = {
    primary:
      'bg-[#0A66FF] hover:bg-blue-600 text-white shadow-sm hover:shadow-md dark:bg-blue-600 dark:hover:bg-blue-500 border border-blue-500/40',
    dark:
      'bg-neutral-950 hover:bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 shadow-sm hover:shadow-md border border-neutral-800 dark:border-neutral-200',
  }[variant];

  return (
    <motion.button
      whileHover={
        disabled || shouldReduceMotion
          ? undefined
          : { y: -1, transition: motionTokens.fast }
      }
      whileTap={
        disabled || shouldReduceMotion
          ? undefined
          : { scale: 0.98, transition: motionTokens.fast }
      }
      disabled={disabled}
      className={cn(
        'group relative inline-flex items-center justify-center overflow-hidden rounded-xl font-medium select-none',
        'transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeStyles,
        variantStyles,
        className
      )}
      {...props}
    >
      {/* Diagonal light sheen sweep */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full dark:via-white/20"
      />
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};

export default ShimmerButton;
