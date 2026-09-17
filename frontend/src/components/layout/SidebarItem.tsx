import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

export interface NavItemConfig {
  label: string;
  path: string;
  icon: LucideIcon;
  semanticColor?: string; // CSS color string or hex
  accentClass?: string;   // Tailored Tailwind hover/active color class
}

interface SidebarItemProps {
  item: NavItemConfig;
  isCollapsed: boolean;
  onClick?: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  isCollapsed,
  onClick,
}) => {
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  const Icon = item.icon;

  const isActive =
    location.pathname === item.path ||
    (item.path !== '/dashboard' && location.pathname.startsWith(item.path));

  // Semantic color for active/hover states
  const semanticColor = item.semanticColor || '#2563EB';

  return (
    <div
      className="relative flex justify-center w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        to={item.path}
        onClick={onClick}
        className={`group relative flex items-center h-11 rounded-xl font-medium transition-all duration-200 select-none ${
          isCollapsed
            ? 'w-11 justify-center'
            : 'w-full px-2 gap-3 mx-2.5'
        } ${
          isActive
            ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold shadow-xs'
            : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/70 hover:translate-x-0.5'
        }`}
      >
        {/* Active Left Indicator Bar (Expanded mode) */}
        {isActive && !isCollapsed && (
          <motion.div
            layoutId="sidebarActivePill"
            className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full"
            style={{ backgroundColor: semanticColor }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          />
        )}

        {/* Fixed 40px × 40px Icon Container with Center Alignment */}
        <div
          className="w-10 h-10 shrink-0 grid place-items-center transition-all duration-200"
          style={{
            color: isActive
              ? isCollapsed ? undefined : 'currentColor'
              : isHovered
              ? semanticColor
              : undefined,
          }}
        >
          <Icon
            className={`w-[20px] h-[20px] transition-all duration-200 ${
              isActive
                ? 'text-current scale-105'
                : 'text-neutral-500 dark:text-neutral-400 group-hover:scale-110'
            }`}
            style={{
              color: !isActive && isHovered ? semanticColor : undefined,
            }}
          />
        </div>

        {/* Navigation Label (Hidden when Collapsed) */}
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.2 }}
            className="text-[13px] font-medium tracking-normal truncate flex-1 text-left"
          >
            {item.label}
          </motion.span>
        )}
      </Link>

      {/* ────────────────────────────────────────── */}
      {/* SECTION 39 & 40: TOOLTIP FOR COLLAPSED SIDEBAR */}
      {/* ────────────────────────────────────────── */}
      <AnimatePresence>
        {isCollapsed && isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 8, scale: 0.96 }}
            animate={{ opacity: 1, x: 14, scale: 1 }}
            exit={{ opacity: 0, x: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="fixed z-50 pointer-events-none px-3 py-1.5 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-semibold shadow-xl whitespace-nowrap border border-neutral-700/50 dark:border-neutral-200"
            style={{
              left: '76px',
            }}
          >
            <div className="flex items-center gap-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: semanticColor }}
              />
              <span>{item.label}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
