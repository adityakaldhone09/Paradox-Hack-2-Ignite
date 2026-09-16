import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  glow?: boolean;
  hoverable?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  glow = false,
  hoverable = true,
  className = '',
  ...props
}) => {
  return (
    <motion.div
      whileHover={hoverable ? { y: -2, transition: { duration: 0.2 } } : {}}
      className={`rounded-xl transition-all duration-200 ${
        glow ? 'glass-panel-glow' : 'glass-panel'
      } p-5 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
