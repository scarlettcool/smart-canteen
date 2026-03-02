
import React from 'react';
import * as Icons from 'lucide-react';

const ConsumptionConfig: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">消费业务配置</h2>
        <p className="text-sm text-slate-500 mt-1">配置全局限额、餐补比例及自动扣费逻辑</p>
      </div>

      <div className="grid grid-cols-2 gap-8">
         <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
            <h3 className="text-lg font-bold flex items-center"><Icons.Lock className="w-5 h-5 mr-2 text-indigo-500" /> 安全限额</h3>
            <div className="space-y-4">
               <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">单次消费限额</label>
                  <div className="flex mt-1">
                     <span className="bg-slate-100 px-4 py-2 rounded-l-xl text-slate-400 font-mono">¥</span>
                     <input type="number" defaultValue={100} className="flex-1 border px-4 py-2 rounded-r-xl outline-none" />
                  </div>
               </div>
               <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">单日累计限额</label>
                  <div className="flex mt-1">
                     <span className="bg-slate-100 px-4 py-2 rounded-l-xl text-slate-400 font-mono">¥</span>
                     <input type="number" defaultValue={300} className="flex-1 border px-4 py-2 rounded-r-xl outline-none" />
                  </div>
               </div>
            </div>
         </div>

         <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
            <h3 className="text-lg font-bold flex items-center"><Icons.Gift className="w-5 h-5 mr-2 text-emerald-500" /> 餐补策略</h3>
            <div className="space-y-4">
               <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div>
                    <p className="font-bold text-slate-700">优先扣除餐补</p>
                    <p className="text-xs text-slate-400">余额不足时自动扣除现金账户</p>
                  </div>
                  <button className="w-10 h-5 bg-indigo-600 rounded-full relative"><div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5"></div></button>
               </div>
               <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div>
                    <p className="font-bold text-slate-700">餐补有效期限制</p>
                    <p className="text-xs text-slate-400">自然月底自动清零餐补余额</p>
                  </div>
                  <button className="w-10 h-5 bg-slate-200 rounded-full relative"><div className="w-4 h-4 bg-white rounded-full absolute left-0.5 top-0.5"></div></button>
               </div>
            </div>
         </div>
      </div>
      <div className="flex justify-end pt-4">
         <button className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100">保存全局配置</button>
      </div>
    </div>
  );
};

export default ConsumptionConfig;
