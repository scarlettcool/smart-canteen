
import React from 'react';
import * as Icons from 'lucide-react';

const PermissionManagement: React.FC = () => {
  const permGroups = [
    {
      module: '人员管理',
      points: [
        { code: 'PEOPLE_ARCHIVE_READ', desc: '档案查看' },
        { code: 'PEOPLE_ARCHIVE_WRITE', desc: '档案编辑/删除' },
        { code: 'PEOPLE_AUDIT_OPERATE', desc: '审批流执行' }
      ]
    },
    {
      module: '财务管理',
      points: [
        { code: 'CONSUME_ACCOUNT_ADJUST', desc: '资金调账' },
        { code: 'CONSUME_REFUND_AUDIT', desc: '退款审批' }
      ]
    }
  ];

  return (
    <div className="space-y-6" data-testid="page-system-perms">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">权限定义中心</h2>
        <p className="text-sm text-slate-500 mt-1">维护系统全量原子权限点 (Permissions SOT)</p>
      </div>

      <div className="space-y-4">
        {permGroups.map(group => (
          <div key={group.module} className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="px-6 py-3 bg-slate-50 border-b font-bold text-slate-700 flex items-center">
              <Icons.Shield className="w-4 h-4 mr-2 text-indigo-500" />
              {group.module}
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {group.points.map(p => (
                <div key={p.code} className="p-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 hover:border-indigo-300 transition-all group">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-tighter mb-1">{p.code}</p>
                  <p className="text-sm font-bold text-slate-800">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PermissionManagement;
