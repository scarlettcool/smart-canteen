
import React from 'react';
import * as Icons from 'lucide-react';

const PortalCustomization: React.FC = () => {
  return (
    <div className="space-y-6" data-testid="page-portal-custom">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">门户定制中心</h2>
        <p className="text-sm text-slate-500 mt-1">配置微信小程序与自助机的视觉品牌、主题色及版权信息</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
           <h3 className="font-bold text-slate-800 border-l-4 border-indigo-600 pl-3">视觉样式</h3>
           <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">系统名称 (门户显示)</label>
                <input type="text" defaultValue="智慧食堂" className="w-full border rounded-xl px-4 py-2.5 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">主题色</label>
                <div className="flex items-center space-x-3">
                   <div className="w-10 h-10 bg-indigo-600 rounded-lg border-2 border-white shadow-sm"></div>
                   <input type="text" defaultValue="#4F46E5" className="flex-1 border rounded-xl px-4 py-2 text-sm font-mono" />
                </div>
              </div>
           </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6 flex flex-col items-center justify-center text-center">
           <div className="w-48 h-80 bg-slate-900 rounded-[3rem] border-[6px] border-slate-800 p-4 relative overflow-hidden shadow-2xl">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-slate-800 rounded-full"></div>
              <div className="mt-8 space-y-4">
                 <div className="h-6 w-2/3 bg-slate-800 rounded mx-auto"></div>
                 <div className="h-32 w-full bg-indigo-600 rounded-2xl flex items-center justify-center">
                    <Icons.Soup className="text-white w-8 h-8 opacity-20" />
                 </div>
                 <div className="grid grid-cols-2 gap-2">
                    <div className="h-10 bg-slate-800 rounded-xl"></div>
                    <div className="h-10 bg-slate-800 rounded-xl"></div>
                 </div>
              </div>
              <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-40">
                <p className="text-[6px] text-white">© 智慧食堂技术支持</p>
              </div>
           </div>
           <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-4">门户实时预览 (Simulator)</p>
        </div>
      </div>

      <div className="flex justify-end">
         <button className="px-10 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700">
           同步视觉配置
         </button>
      </div>
    </div>
  );
};

export default PortalCustomization;
