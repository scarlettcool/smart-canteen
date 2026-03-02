
import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import DataTable from '../../components/Common/DataTable';

interface BlacklistRecord {
  id: string;
  name: string;
  staffId: string;
  reason: string;
  deadline: string;
  operator: string;
  type: 'permanent' | 'temporary';
}

interface HitRecord {
  id: string;
  name: string;
  time: string;
  action: string;
  result: string;
}

const mockBlacklist: BlacklistRecord[] = [
  { id: 'BL001', name: '李大壮', staffId: '100201', reason: '连续3次恶意订餐不取餐', deadline: '2024-06-01', operator: 'Admin', type: 'temporary' },
  { id: 'BL002', name: '王老五', staffId: '100555', reason: '破坏公共就餐设施', deadline: '永久', operator: 'SafetyMgr', type: 'permanent' },
];

const mockHits: HitRecord[] = [
  { id: 'H001', name: '李大壮', time: '2024-03-20 12:05', action: '扫码就餐', result: '拦截成功' },
  { id: 'H002', name: '王老五', time: '2024-03-20 09:30', action: '微信充值', result: '禁止进入' },
];

const Blacklist: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'records' | 'hits' | 'rules'>('records');

  const handleLift = (record: BlacklistRecord) => {
    if (window.confirm(`确认解除 [${record.name}] 的黑名单限制？解除后该用户将恢复订餐与消费权限。`)) {
      alert("限制已解除，权限实时下发微信端。");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">黑名单管控中心</h2>
          <p className="text-sm text-slate-500 mt-1">全链路拦截命中人员，权限秒级下发微信端</p>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
           {['records', 'hits', 'rules'].map(tab => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab as any)}
               className={`px-5 py-2 text-xs font-bold rounded-xl transition-all ${activeTab === tab ? 'bg-white shadow-lg text-indigo-600 scale-105' : 'text-slate-500 hover:text-slate-800'}`}
             >
               {tab === 'records' && '受限名单'}
               {tab === 'hits' && '命中记录'}
               {tab === 'rules' && '自动规则'}
             </button>
           ))}
        </div>
      </div>

      {activeTab === 'records' && (
        <div className="space-y-4">
           <div className="bg-rose-50 border border-rose-100 p-5 rounded-3xl flex items-center space-x-4">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-rose-600">
                 <Icons.ShieldAlert className="w-6 h-6" />
              </div>
              <p className="text-xs text-rose-700 font-medium leading-relaxed">
                安全预警：当前系统名录下共有 2 名受限人员。黑名单拦截优于所有订餐计划、充值规则及节日特权。
              </p>
           </div>
           
           <DataTable 
             columns={[
               { header: '工号', key: 'staffId', width: '100px' },
               { header: '姓名', key: 'name', width: '120px' },
               { header: '拉黑原因', key: 'reason' },
               { 
                 header: '受限类型', 
                 key: 'type',
                 render: (val: string) => (
                   <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${val === 'permanent' ? 'bg-slate-900 text-white' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
                     {val === 'permanent' ? '永久拉黑' : '限时禁入'}
                   </span>
                 )
               },
               { header: '有效期至', key: 'deadline' },
               { header: '操作人', key: 'operator' },
             ]} 
             data={mockBlacklist} 
             actions={(record) => (
               <button 
                 onClick={() => handleLift(record)}
                 className="px-3 py-1.5 border border-slate-200 text-slate-600 hover:border-indigo-500 hover:text-indigo-600 rounded-lg text-xs font-bold transition-all"
               >
                 解除限制
               </button>
             )}
           />
        </div>
      )}

      {activeTab === 'hits' && (
        <div className="space-y-4">
           <DataTable 
             columns={[
               { header: '触发人员', key: 'name' },
               { header: '拦截时间', key: 'time' },
               { header: '触发行为', key: 'action' },
               { 
                 header: '处理结果', 
                 key: 'result',
                 render: (v: string) => <span className="text-xs font-bold text-rose-600">{v}</span>
               }
             ]}
             data={mockHits}
           />
           <p className="text-[10px] text-slate-400 text-center py-4">※ 命中记录留存期为 30 天，用于辅助申诉核验</p>
        </div>
      )}

      {activeTab === 'rules' && (
        <div className="grid grid-cols-2 gap-8">
          <div className="bg-white p-10 rounded-3xl border shadow-sm space-y-8">
             <div className="flex items-center space-x-3 text-indigo-600">
                <Icons.Zap className="w-6 h-6" />
                <h3 className="text-xl font-bold">爽约自动封禁策略</h3>
             </div>
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <div>
                      <p className="font-bold text-slate-800">月度爽约上限</p>
                      <p className="text-xs text-slate-400">单自然月内已预约未取餐次数</p>
                   </div>
                   <input type="number" defaultValue={3} className="w-20 text-center py-2 bg-slate-50 rounded-xl border-none font-mono" />
                </div>
                <div className="flex items-center justify-between">
                   <div>
                      <p className="font-bold text-slate-800">触发后自动禁食</p>
                      <p className="text-xs text-slate-400">达到上限后，自动移入黑名单的天数</p>
                   </div>
                   <input type="number" defaultValue={7} className="w-20 text-center py-2 bg-slate-50 rounded-xl border-none font-mono" />
                </div>
                <div className="pt-6 border-t flex justify-between items-center">
                   <span className="text-sm font-bold text-slate-600">启用该全局策略</span>
                   <button className="w-12 h-6 bg-indigo-600 rounded-full relative p-1"><div className="w-4 h-4 bg-white rounded-full absolute right-1"></div></button>
                </div>
             </div>
          </div>
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-12 text-center opacity-50 grayscale">
             <Icons.PlusCircle className="w-12 h-12 text-slate-300 mb-4" />
             <h4 className="font-bold text-slate-400">自定义关联规则</h4>
             <p className="text-xs text-slate-400 mt-2">例如：余额异常拉黑、连续投诉拉黑等扩展插件</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blacklist;
