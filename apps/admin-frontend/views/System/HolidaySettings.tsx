
import React, { useState } from 'react';
import * as Icons from 'lucide-react';

const HolidaySettings: React.FC = () => {
  const [holidays, setHolidays] = useState(['2024-04-04', '2024-04-05', '2024-04-06', '2024-05-01']);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">节假日设置</h2>
          <p className="text-sm text-slate-500 mt-1">配置非法定工作日，用于自动排除订餐限制与补助发放</p>
        </div>
        <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg">
          + 录入调休日期
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border shadow-sm">
           <h3 className="text-lg font-bold mb-6 flex items-center">
             <Icons.Calendar className="w-5 h-5 mr-2 text-indigo-500" />
             2024年 节假日看板
           </h3>
           <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-slate-400 mb-4">
             {['一', '二', '三', '四', '五', '六', '日'].map(d => <div key={d}>{d}</div>)}
           </div>
           <div className="grid grid-cols-7 gap-2">
             {Array.from({ length: 31 }).map((_, i) => (
               <div key={i} className={`p-2 rounded-lg text-xs font-bold transition-all cursor-pointer border ${holidays.includes(`2024-04-${String(i+1).padStart(2, '0')}`) ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-slate-50 border-transparent text-slate-400'}`}>
                 {i + 1}
               </div>
             ))}
           </div>
        </div>

        <div className="space-y-4">
          <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex items-start space-x-3 text-amber-800">
             <Icons.Info className="w-5 h-5 mt-1 shrink-0" />
             <div className="text-xs leading-relaxed">
               <p className="font-bold">系统逻辑提示：</p>
               <p className="mt-1">在此标记为“非工作日”的日期，系统将自动：</p>
               <ul className="list-disc ml-4 mt-1 space-y-1">
                 <li>暂停自动餐补发放任务</li>
                 <li>忽略订餐爽约统计</li>
                 <li>关闭自助取餐机定时自检</li>
               </ul>
             </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border shadow-sm">
             <h4 className="font-bold text-slate-800 mb-4">当前已生效日期</h4>
             <div className="flex flex-wrap gap-2">
               {holidays.map(d => (
                 <span key={d} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-mono font-bold flex items-center">
                   {d} <Icons.X className="w-3 h-3 ml-2 cursor-pointer hover:text-rose-500" />
                 </span>
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolidaySettings;
