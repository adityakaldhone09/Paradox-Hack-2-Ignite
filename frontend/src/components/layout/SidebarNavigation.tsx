import React from 'react';
import { UserRole } from '../../types/roles';
import { getNavigationForRole } from '../../config/navigationConfig';
import { SidebarItem } from './SidebarItem';

interface SidebarNavigationProps {
  role?: UserRole;
  isCollapsed: boolean;
  onItemClick?: () => void;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  role,
  isCollapsed,
  onItemClick,
}) => {
  const navItems = getNavigationForRole(role);

  return (
    <nav className="flex-1 py-3 space-y-1.5 overflow-y-auto custom-scrollbar flex flex-col items-center w-full">
      {navItems.map((item) => (
        <SidebarItem
          key={item.path + item.label}
          item={item}
          isCollapsed={isCollapsed}
          onClick={onItemClick}
        />
      ))}
    </nav>
  );
};

