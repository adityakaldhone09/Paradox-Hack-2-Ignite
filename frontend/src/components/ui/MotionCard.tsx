import React from 'react';
import { motion, HTMLMotionProps, useReducedMotion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { motionTokens } from '../../lib/motion';

export interface MotionCardProps extends HTMLMotionProps<'div'> {
  hoverable?: boolean;
  bordered?: boolean;
  elevation?: 'flat' | 'raised' | 'elevated';
  children: React.ReactNode;
}

export const MotionCard: React.FC<MotionCardProps> = ({
  children,
  hoverable = true,
  bordered = true,
  elevation = 'raised',
  className = '',
  ...props
}) => {
  const shouldReduceMotion = useReducedMotion();

  const elevationStyles = {
    flat: '',
    raised: 'shadow-xs hover:shadow-md',
    elevated: 'shadow-sm hover:shadow-lg',
  }[elevation];

  return (
    <motion.div
      whileHover={
        hoverable && !shouldReduceMotion
          ? {
              y: -2,
              scale: 1.01,
              transition: motionTokens.normal,
            }
          : undefined
      }
      className={cn(
        'rounded-2xl bg-white dark:bg-[#111113] text-neutral-900 dark:text-neutral-100 p-6',
        'transition-colors duration-200',
        bordered && 'border border-neutral-200/80 dark:border-neutral-800/80',
        hoverable && 'hover:border-neutral-300 dark:hover:border-neutral-700/80',
        elevationStyles,
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
