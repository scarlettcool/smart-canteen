
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ClipboardList, Ticket, User } from 'lucide-react';

const BottomNav: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  const tabs = [
    { id: 'home', label: '首页', icon: <Home />, path: '/' },
    { id: 'orders', label: '记录', icon: <ClipboardList />, path: '/orders' },
    { id: 'coupons', label: '礼券', icon: <Ticket />, path: '/coupons' },
    { id: 'profile', label: '我的', icon: <User />, path: '/profile' },
  ];

  const getIsActive = (itemPath: string) => {
    if (itemPath === '/') return path === '/';
    return path.startsWith(itemPath);
  };

  return (
    <nav className="bg-white border-t border-slate-100 safe-bottom h-20 flex items-center justify-around px-4 z-50">
      {tabs.map((tab) => {
        const isActive = getIsActive(tab.path);
        return (
          <Link
            key={tab.id}
            to={tab.path}
            className={`flex flex-col items-center justify-center transition-all ${
              isActive ? 'text-[var(--primary)] scale-110' : 'text-slate-300'
            }`}
          >
            {/* Added <any> to React.ReactElement to resolve type error when cloning with className */}
            {React.cloneElement(tab.icon as React.ReactElement<any>, { className: 'w-6 h-6 mb-1' })}
            <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
