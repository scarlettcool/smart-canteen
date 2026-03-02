
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { MENU_TREE, SYSTEM_NAME } from '../../constants';
import { MenuItem } from '../../types';
import { usePermissions } from '../../hooks/usePermissions';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const SidebarItem: React.FC<{ item: MenuItem; depth?: number }> = ({ item, depth = 0 }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { hasPermission, user } = usePermissions();
  const location = useLocation();
  
  // Permission check for the menu item
  const perms = item.permissions || [];
  const isAllowed = perms.length === 0 || perms.some(p => hasPermission(p)) || user.role === 'SUPER_ADMIN';

  if (!isAllowed) return null;

  const hasChildren = item.children && item.children.length > 0;
  const IconComponent = (Icons as any)[item.icon || 'Circle'];
  const isActive = location.pathname.startsWith(item.path);

  return (
    <div className="w-full">
      {hasChildren ? (
        <>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`w-full flex items-center px-4 py-2.5 text-sm font-medium transition-colors hover:bg-slate-800 hover:text-white group
              ${depth === 0 ? 'text-slate-300' : 'text-slate-400'}
              ${isActive ? 'bg-slate-800 text-white' : ''}`}
          >
            {item.icon && <IconComponent className="w-4 h-4 mr-3 shrink-0" />}
            <span className="flex-1 text-left truncate">{item.label}</span>
            <Icons.ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isCollapsed ? '-rotate-90' : ''}`} />
          </button>
          {!isCollapsed && (
            <div className={`overflow-hidden transition-all duration-300 ${depth === 0 ? 'bg-slate-950/30' : ''}`}>
              {item.children?.map(child => (
                <SidebarItem key={child.id} item={child} depth={depth + 1} />
              ))}
            </div>
          )}
        </>
      ) : (
        <NavLink
          to={item.path}
          className={({ isActive }) => `
            flex items-center px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-800 hover:text-white
            ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-400'}
            ${depth > 0 ? 'pl-11' : ''}
          `}
        >
          {item.icon && depth === 0 && <IconComponent className="w-4 h-4 mr-3 shrink-0" />}
          <span className="truncate">{item.label}</span>
        </NavLink>
      )}
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  return (
    <aside className={`
      bg-slate-900 h-full overflow-y-auto transition-all duration-300 flex-col flex shrink-0
      ${isOpen ? 'w-64' : 'w-0 sm:w-20'}
    `}>
      <div className="h-16 flex items-center px-6 border-b border-slate-800 shrink-0">
        <div className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center shrink-0">
          <Icons.Soup className="text-white w-5 h-5" />
        </div>
        <span className={`ml-3 font-bold text-white transition-opacity duration-200 truncate ${!isOpen && 'hidden'}`}>
          {SYSTEM_NAME}
        </span>
      </div>

      <nav className="flex-1 py-4 overflow-x-hidden">
        {MENU_TREE.map(item => (
          <SidebarItem key={item.id} item={item} />
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          className="flex items-center text-slate-400 hover:text-white text-sm transition-colors w-full px-2"
          onClick={() => alert("AI 辅助功能已就绪 (国产化合规审核中)")}
        >
          <Icons.Bot className="w-4 h-4 mr-3" />
          <span className={!isOpen ? 'hidden' : ''}>智慧助手 (Beta)</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
