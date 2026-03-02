
import React from 'react';
import * as Icons from 'lucide-react';
import DataTable from '../../components/Common/DataTable';

const OpenApiManagement: React.FC = () => {
  const apis = [
    { id: 'KEY_001', name: '微信小程序 H5 调用', key: 'ak_f2...9k2', status: 'active', callCount: '1.2k' },
    { id: 'KEY_002', name: '自助机端对接', key: 'ak_r4...0x1', status: 'active', callCount: '45.8k' },
    { id: 'KEY_003', name: '政务数据同步', key: 'ak_p9...e3', status: 'disabled', callCount: '0' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">开放平台与接口</h2>
          <p className="text-sm text-slate-500 mt-1">管理系统调用凭证 AppKey、IP 白名单及外部插件集成</p>
        </div>
        <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg">
          + 申请新凭证
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
           <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Icons.ShieldCheck className="w-6 h-6 text-slate-300" />
           </div>
           <h4 className="font-bold text-slate-400">数据域隔离插件</h4>
           <button className="mt-4 px-4 py-1.5 text-xs text-indigo-600 font-bold border rounded-lg">启用</button>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
           <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
              <Icons.Zap className="w-6 h-6 text-indigo-600" />
           </div>
           <h4 className="font-bold text-slate-800">ERP 同步插件</h4>
           <button className="mt-4 px-4 py-1.5 text-xs text-slate-400 font-bold border rounded-lg">配置</button>
        </div>
      </div>

      <DataTable 
        title="API Access Keys"
        columns={[
          { header: '应用名称', key: 'name' },
          { header: 'Access Key', key: 'key', render: (v) => <code className="text-xs text-slate-400">{v}</code> },
          { header: '累计调用', key: 'callCount' },
          { 
            header: '状态', 
            key: 'status',
            render: (v) => v === 'active' ? <span className="text-emerald-500 font-bold text-xs">活跃</span> : <span className="text-slate-300 font-bold text-xs">禁用</span>
          }
        ]}
        data={apis}
        actions={() => <button className="text-rose-600 font-bold text-xs">禁用</button>}
      />
    </div>
  );
};

export default OpenApiManagement;
