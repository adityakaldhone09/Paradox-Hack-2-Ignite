import React from 'react';
import { Link } from 'react-router-dom';
import { VeriQLogo } from '../ui/VeriQLogo';
import { CollapseButton } from './CollapseButton';

interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggle: () => void;
  inMobile?: boolean;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isCollapsed,
  onToggle,
  inMobile = false,
}) => {
  return (
    <div
      className={`border-b border-neutral-200 dark:border-neutral-800 transition-all duration-300 shrink-0 ${
        isCollapsed && !inMobile
          ? 'h-[80px] flex flex-col items-center justify-center gap-1.5 py-2 px-2'
          : 'h-[76px] flex items-center justify-between px-3.5'
      }`}
    >
      {/* Brand Logo */}
      <Link
        to="/"
        className={`flex items-center group transition-all duration-200 ${
          isCollapsed && !inMobile ? 'justify-center w-full' : ''
        }`}
        title="VeriQ — Secure every question paper. Verify every action."
      >
        <VeriQLogo size="md" compact={isCollapsed && !inMobile} />
      </Link>

      {/* Collapse Button */}
      {!inMobile && (
        <div className={`flex items-center justify-center ${isCollapsed ? 'w-full' : ''}`}>
          <CollapseButton
            isCollapsed={isCollapsed}
            onToggle={onToggle}
            className={isCollapsed ? 'w-8 h-8 rounded-lg' : 'w-10 h-10'}
          />
        </div>
      )}
    </div>
  );
};
