
import React, { useState } from 'react';
import * as Icons from 'lucide-react';

const WeChatConfig: React.FC = () => {
  const [testing, setTesting] = useState(false);

  const handleTest = () => {
    setTesting(true);
    setTimeout(() => {
      setTesting(false);
      alert("微信网关连接测试成功！(ADM-S4-SYS-WXP-001 Pass)");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">微信通道配置</h2>
        <p className="text-sm text-slate-500 mt-1">配置小程序 AppID、支付商户号及模版消息参数</p>
      </div>

      <div className="bg-white p-10 rounded-3xl border shadow-sm max-w-3xl space-y-8">
        <div className="grid grid-cols-2 gap-8">
           <div className="space-y-2">
             <label className="text-xs font-bold text-slate-400 uppercase">AppID (小程序)</label>
             <input type="text" defaultValue="wx8888888888888888" className="w-full border rounded-xl px-4 py-2.5 text-sm font-mono" />
           </div>
           <div className="space-y-2">
             <label className="text-xs font-bold text-slate-400 uppercase">AppSecret</label>
             <input type="password" defaultValue="********************************" className="w-full border rounded-xl px-4 py-2.5 text-sm font-mono" />
           </div>
           <div className="space-y-2">
             <label className="text-xs font-bold text-slate-400 uppercase">商户号 (MCH_ID)</label>
             <input type="text" defaultValue="1500000001" className="w-full border rounded-xl px-4 py-2.5 text-sm font-mono" />
           </div>
           <div className="space-y-2">
             <label className="text-xs font-bold text-slate-400 uppercase">支付密钥 (V3 Key)</label>
             <input type="password" defaultValue="********************************" className="w-full border rounded-xl px-4 py-2.5 text-sm font-mono" />
           </div>
        </div>

        <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex items-center justify-between">
           <div>
              <p className="text-sm font-bold text-slate-800">连接状态</p>
              <p className="text-xs text-emerald-600 font-medium">当前已连接微信开放平台</p>
           </div>
           <button 
             data-testid="ADM-S4-SYS-WXP-001"
             disabled={testing}
             onClick={handleTest}
             className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-100 disabled:opacity-50"
           >
             {testing ? '测试中...' : '测试网关连接'}
           </button>
        </div>

        <div className="flex justify-end">
           <button className="px-10 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all">保存配置</button>
        </div>
      </div>
    </div>
  );
};

export default WeChatConfig;
