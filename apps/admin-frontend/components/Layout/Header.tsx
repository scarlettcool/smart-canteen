
import React from 'react';
import * as Icons from 'lucide-react';

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10">
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuToggle}
          className="p-2 hover:bg-slate-100 rounded-md transition-colors"
        >
          <Icons.Menu className="w-5 h-5 text-slate-600" />
        </button>

        <nav className="hidden md:flex items-center text-sm text-slate-500 space-x-2">
          <Icons.Home className="w-4 h-4" />
          <Icons.ChevronRight className="w-3 h-3" />
          <span>工作台</span>
          <Icons.ChevronRight className="w-3 h-3" />
          <span className="text-slate-900 font-medium">当前页面</span>
        </nav>
      </div>

      <div className="flex items-center space-x-6">
        <div className="relative group hidden sm:block">
          <Icons.Bell className="w-5 h-5 text-slate-500 cursor-pointer group-hover:text-indigo-600" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">
            3
          </span>
        </div>

        <div className="h-8 w-px bg-slate-200"></div>

        <div className="flex items-center space-x-3 cursor-pointer group" data-testid="user-menu">
          <div className="flex flex-col items-end">
            <span className="text-sm font-semibold text-slate-700 leading-none">系统管理员</span>
            <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">Super Admin</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white group-hover:border-indigo-100 transition-all">
            <img src="https://picsum.photos/100/100" alt="Avatar" />
          </div>
          <Icons.Settings className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
        </div>
      </div>
    </header>
  );
};

export default Header;
