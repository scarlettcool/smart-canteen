
import React from 'react';
import * as Icons from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Placeholder: React.FC = () => {
  const location = useLocation();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white rounded-2xl border-2 border-dashed border-slate-200">
      <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
        <Icons.Construction className="w-10 h-10 text-indigo-500" />
      </div>
      <h3 className="text-2xl font-bold text-slate-800">模块开发中 / 待验收</h3>
      <p className="text-slate-400 max-w-md mt-4">
        当前路径 <code className="bg-slate-100 px-2 py-1 rounded text-indigo-600 font-mono text-sm">{location.pathname}</code> 正处于框架对接阶段。
      </p>
      <p className="text-slate-400 text-sm mt-2">
        已对齐 54 项功能矩阵合约，闭环逻辑正在逐个模块按 [列表-详情-操作-日志] 模式注入。
      </p>
      <div className="mt-10 flex space-x-4">
         <button onClick={() => window.history.back()} className="px-6 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-all">
           返回上页
         </button>
         <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
           查看验收文档
         </button>
      </div>
    </div>
  );
};

export default Placeholder;
