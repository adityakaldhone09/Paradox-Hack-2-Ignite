import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CollapseButtonProps {
  isCollapsed: boolean;
  onToggle: () => void;
  className?: string;
}

export const CollapseButton: React.FC<CollapseButtonProps> = ({
  isCollapsed,
  onToggle,
  className = '',
}) => {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      className={`w-10 h-10 rounded-xl flex items-center justify-center text-neutral-500 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400 bg-neutral-50 dark:bg-neutral-900/80 hover:bg-blue-50 dark:hover:bg-blue-950/30 border border-neutral-200 dark:border-neutral-800 hover:border-blue-200 dark:hover:border-blue-800/60 shadow-2xs transition-colors duration-200 shrink-0 ${className}`}
    >
      <motion.div
        animate={{ rotate: isCollapsed ? 180 : 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="flex items-center justify-center"
      >
        <ChevronLeft className="w-4 h-4 transition-colors" />
      </motion.div>
    </motion.button>
  );
};
