
import React, { useState } from 'react';
import * as Icons from 'lucide-react';

const DishRules: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("消费规则已更新！(ADM-S3-DISH-RULE-001 Pass)");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">消费规则设置</h2>
          <p className="text-sm text-slate-500 mt-1">配置不同时段、不同人群的消费额度与频率限制</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
          <h3 className="text-lg font-bold flex items-center text-indigo-600">
            <Icons.Clock className="w-5 h-5 mr-2" /> 订餐时效规则
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-800">午餐订餐截止</p>
                <p className="text-xs text-slate-400">当日就餐的截止时间</p>
              </div>
              <input type="time" defaultValue="09:30" className="bg-slate-50 px-3 py-1.5 rounded-lg border-none text-sm font-mono" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-800">晚餐订餐截止</p>
                <p className="text-xs text-slate-400">当日就餐的截止时间</p>
              </div>
              <input type="time" defaultValue="15:30" className="bg-slate-50 px-3 py-1.5 rounded-lg border-none text-sm font-mono" />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
          <h3 className="text-lg font-bold flex items-center text-emerald-600">
            <Icons.Filter className="w-5 h-5 mr-2" /> 人群频率限制
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-800">单餐最大份数</p>
                <p className="text-xs text-slate-400">防止重复订餐</p>
              </div>
              <div className="flex items-center space-x-2">
                <input type="number" defaultValue={1} className="w-16 text-center bg-slate-50 px-2 py-1.5 rounded-lg border-none text-sm" />
                <span className="text-xs text-slate-400">份</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-800">爽约自动封禁</p>
                <p className="text-xs text-slate-400">达到上限后移入黑名单</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400">满</span>
                <input type="number" defaultValue={3} className="w-16 text-center bg-slate-50 px-2 py-1.5 rounded-lg border-none text-sm" />
                <span className="text-xs text-slate-400">次</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          data-testid="ADM-S3-DISH-RULE-001"
          disabled={loading}
          onClick={handleSave}
          className="px-10 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center"
        >
          {loading ? <Icons.Loader2 className="animate-spin w-5 h-5 mr-2" /> : <Icons.Save className="w-5 h-5 mr-2" />}
          保存规则配置
        </button>
      </div>
    </div>
  );
};

export default DishRules;
