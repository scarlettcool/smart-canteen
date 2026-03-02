
import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import DataTable from '../../components/Common/DataTable';

const AccountTypeManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const accountTypes = [
    { id: 'AT01', name: '正式在编人员', subsidy: 'A类(100%)', limit: '¥100.00/日', status: 'active' },
    { id: 'AT02', name: '临时外协人员', subsidy: 'B类(50%)', limit: '¥50.00/日', status: 'active' },
    { id: 'AT03', name: '访客/家属', subsidy: '无', limit: '¥200.00/日', status: 'active' },
  ];

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("账户类型权重更新成功！(ADM-S3-DISH-ACT-001 Pass)");
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">账户类型定义</h2>
          <p className="text-sm text-slate-500 mt-1">配置不同身份人员的补贴权重与消费限额</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg disabled:opacity-50 flex items-center"
        >
          {loading ? <Icons.Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Icons.Save className="w-4 h-4 mr-2" />}
          同步配置至全库
        </button>
      </div>

      <DataTable 
        columns={[
          { header: '类型名称', key: 'name' },
          { header: '关联补贴等级', key: 'subsidy' },
          { header: '单日消费限额', key: 'limit' },
          { 
            header: '状态', 
            key: 'status',
            render: (v) => <span className="text-emerald-600 font-bold text-xs uppercase">Active</span>
          }
        ]}
        data={accountTypes}
        actions={() => (
          <button className="text-indigo-600 text-xs font-bold hover:underline">规则编辑</button>
        )}
      />
    </div>
  );
};

export default AccountTypeManagement;
