
import React from 'react';
import { Loader2, Inbox, AlertCircle } from 'lucide-react';

interface StateLayoutProps {
  state: 'loading' | 'empty' | 'error' | 'content';
  children: React.ReactNode;
  emptyText?: string;
  errorText?: string;
}

const StateLayout: React.FC<StateLayoutProps> = ({ state, children, emptyText = "暂无数据", errorText = "加载出错" }) => {
  if (state === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p className="text-sm">加载中...</p>
      </div>
    );
  }

  if (state === 'empty') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-300">
        <Inbox className="w-16 h-16 mb-4" />
        <p className="text-sm font-medium">{emptyText}</p>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-red-300">
        <AlertCircle className="w-16 h-16 mb-4" />
        <p className="text-sm font-medium">{errorText}</p>
        <button className="mt-4 text-xs bg-red-50 text-red-500 px-4 py-2 rounded-full font-bold">重试</button>
      </div>
    );
  }

  return <div className="page-transition">{children}</div>;
};

export default StateLayout;
