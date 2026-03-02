
import React from 'react';
import * as Icons from 'lucide-react';
import DataTable from '../../components/Common/DataTable';

const CanteenManagement: React.FC = () => {
  const canteens = [
    { id: 'C1', name: '第一食堂 (机关楼)', manager: '张大林', phone: '13812345678', capacity: 300, status: 'open' },
    { id: 'C2', name: '第二食堂 (政务大厅)', manager: '李小美', phone: '13988887777', capacity: 150, status: 'open' },
  ];

  return (
    <div className="space-y-6" data-testid="page-canteen-info">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">餐厅资料维护</h2>
        <p className="text-sm text-slate-500 mt-1">管理各就餐点位的基础信息与负责人</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {canteens.map(c => (
          <div key={c.id} className="bg-white p-6 rounded-3xl border shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                  <Icons.Store className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{c.name}</h4>
                  <p className="text-xs text-slate-400">ID: {c.id}</p>
                </div>
              </div>
              <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">营业中</span>
            </div>
            
            <div className="space-y-3 flex-1">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">负责人</span>
                <span className="font-medium">{c.manager}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">最大容纳</span>
                <span className="font-medium">{c.capacity} 人</span>
              </div>
            </div>

            <button className="w-full mt-6 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all border border-slate-200">
              编辑详情
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CanteenManagement;
