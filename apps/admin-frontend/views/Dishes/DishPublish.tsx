
import React, { useState } from 'react';
import * as Icons from 'lucide-react';

const DishPublish: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handlePublish = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("菜品发布成功！(ADM-S3-DISH-PUB-001 Pass)");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">菜品发布 (Sprint 3)</h2>
          <p className="text-sm text-slate-500 mt-1">安排并发布各餐厅的每日菜单</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border shadow-sm space-y-6">
          <div className="flex items-center space-x-4 pb-4 border-b">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase">发布日期</label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
                className="block w-full border-none bg-slate-50 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500" 
              />
            </div>
            <div className="space-y-1 flex-1">
              <label className="text-[10px] font-black text-slate-400 uppercase">选择餐厅</label>
              <select className="block w-full border-none bg-slate-50 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500">
                <option>第一食堂 (主校区)</option>
                <option>第二食堂 (北校区)</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-700 flex items-center">
              <Icons.Utensils className="w-4 h-4 mr-2" /> 午餐菜单安排
            </h3>
            <div className="grid grid-cols-2 gap-4">
               {['红烧肉', '清蒸鱼', '酸辣土豆丝', '紫菜蛋花汤'].map((dish, i) => (
                 <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <span className="text-sm">{dish}</span>
                    <button className="text-rose-500 hover:bg-rose-50 p-1 rounded-lg"><Icons.X className="w-4 h-4" /></button>
                 </div>
               ))}
               <button className="p-3 border-2 border-dashed border-indigo-100 rounded-xl text-xs text-indigo-500 hover:bg-indigo-50 font-bold transition-all">
                 + 添加菜品
               </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-slate-700 mb-4">发布确认</h3>
          <div className="flex-1 space-y-4 text-xs text-slate-500">
             <div className="flex justify-between"><span>目标日期</span><span className="font-bold text-slate-900">{date}</span></div>
             <div className="flex justify-between"><span>餐次数量</span><span className="font-bold text-slate-900">3 (早/中/晚)</span></div>
             <div className="flex justify-between"><span>预计成本</span><span className="font-bold text-slate-900">¥ 4,500.00</span></div>
             <div className="pt-4 border-t text-amber-600">
                <Icons.AlertTriangle className="w-4 h-4 inline mr-1 mb-1" />
                发布后将实时更新在“智慧食堂”小程序，请确认菜单无误。
             </div>
          </div>
          <button 
            data-testid="ADM-S3-DISH-PUB-001"
            disabled={loading}
            onClick={handlePublish}
            className="w-full mt-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center"
          >
            {loading ? <Icons.Loader2 className="animate-spin w-5 h-5" /> : '确认发布菜单'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DishPublish;
