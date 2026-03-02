
import React from 'react';
import * as Icons from 'lucide-react';
import DataTable from '../../components/Common/DataTable';

const AdminManagement: React.FC = () => {
  const mockAdmins = [
    { id: 'A001', name: '系统管理员', role: 'SUPER_ADMIN', lastLogin: '2024-03-24 18:30' },
    { id: 'A002', name: '张会计', role: 'FINANCE_MGR', lastLogin: '2024-03-24 14:15' },
    { id: 'A003', name: '李处长', role: 'OPERATOR', lastLogin: '2024-03-23 09:00' },
  ];

  const handleResetPwd = (name: string) => {
    if (window.confirm(`确定重置 [${name}] 的登录密码吗？重置后密码将还原为初始密码。`)) {
      alert(`重置成功！初始密码为: SmartCanteen888 (ADM-S4-SYS-ADMIN-001 Pass)`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">管理员配置</h2>
          <p className="text-sm text-slate-500 mt-1">维护后台管理人员、账号状态及初始密码重置</p>
        </div>
        <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg">
          + 添加管理员
        </button>
      </div>

      <DataTable 
        columns={[
          { header: '姓名', key: 'name' },
          { header: '角色', key: 'role', render: (v) => <span className="bg-slate-100 px-2 py-1 rounded text-[10px] font-bold">{v}</span> },
          { header: '最近登录', key: 'lastLogin' }
        ]}
        data={mockAdmins}
        actions={(record) => (
          <div className="flex space-x-2">
            <button 
              data-testid={`ADM-S4-SYS-ADMIN-001-${record.id}`}
              onClick={() => handleResetPwd(record.name)}
              className="text-xs text-rose-600 hover:underline font-bold"
            >
              重置密码
            </button>
            <button className="text-slate-400 hover:text-indigo-600"><Icons.Edit3 className="w-4 h-4" /></button>
          </div>
        )}
      />
    </div>
  );
};

export default AdminManagement;
