import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  hoverable?: boolean;
  bordered?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  bordered = true,
  className = '',
  ...props
}) => {
  return (
    <motion.div
      whileHover={hoverable ? { y: -2, transition: { duration: 0.18 } } : {}}
      className={`rounded-2xl bg-white dark:bg-[#111113] text-neutral-900 dark:text-neutral-100 ${
        bordered ? 'border border-neutral-200/80 dark:border-neutral-800/80' : ''
      } ${
        hoverable ? 'hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700/80 transition-all duration-200' : 'shadow-xs'
      } p-6 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
