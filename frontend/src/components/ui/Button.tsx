import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2, Check } from 'lucide-react';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  isSuccess?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isSuccess = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 select-none outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-950 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 h-8 gap-1.5',
    md: 'text-xs sm:text-sm px-4 py-2 h-10 gap-2',
    lg: 'text-sm sm:text-base px-5 py-2.5 h-12 gap-2.5 font-medium',
  }[size];

  const variantStyles = {
    // Charcoal primary with pure white text
    primary: 'bg-[#111111] text-white hover:bg-[#222222] dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 shadow-xs hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]',
    accent: 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]',
    secondary: 'bg-[#F7F7F5] dark:bg-neutral-800/80 text-neutral-800 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700/80 hover:bg-neutral-200/70 dark:hover:bg-neutral-700 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]',
    outline: 'bg-transparent border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 text-neutral-800 dark:text-neutral-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]',
    ghost: 'bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-xs hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]',
  }[variant];

  const isDisabled = disabled || isLoading;

  return (
    <motion.button
      whileTap={isDisabled ? {} : { scale: 0.99 }}
      disabled={isDisabled}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />}
      {!isLoading && isSuccess && <Check className="w-4 h-4 text-current shrink-0" />}
      {children}
    </motion.button>
  );
};
