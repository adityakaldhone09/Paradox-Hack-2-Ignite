import React from 'react';
import { motion, HTMLMotionProps, useReducedMotion } from 'framer-motion';
import { Spotlight } from './Spotlight';
import { BorderBeam } from './BorderBeam';

interface CardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  hoverable?: boolean;
  bordered?: boolean;
  spotlight?: boolean;
  borderBeam?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  bordered = true,
  spotlight = false,
  borderBeam = false,
  className = '',
  ...props
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={
        hoverable && !shouldReduceMotion
          ? { y: -2, scale: 1.01, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } }
          : undefined
      }
      className={`relative overflow-hidden rounded-2xl bg-white dark:bg-[#111113] text-neutral-900 dark:text-neutral-100 ${
        bordered ? 'border border-neutral-200/80 dark:border-neutral-800/80' : ''
      } ${
        hoverable
          ? 'hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700/80 transition-all duration-200'
          : 'shadow-xs'
      } p-6 ${className}`}
      {...props}
    >
      {spotlight && <Spotlight size={240} />}
      {borderBeam && <BorderBeam size={160} duration={9} />}
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
};
