
import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import DataTable from '../../components/Common/DataTable';
import { Role } from '../../types';

const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([
    { id: '1', name: '系统管理员', code: 'SUPER_ADMIN', description: '拥有全量模块访问与修改权限', permissions: ['ALL'], memberCount: 2 },
    { id: '2', name: '财务主管', code: 'FINANCE_MGR', description: '负责对账、调账与退款审核', permissions: ['CONSUME_TRADE_READ', 'CONSUME_REFUND_AUDIT'], memberCount: 5 },
    { id: '3', name: '食堂经理', code: 'CANTEEN_MGR', description: '负责菜品发布与设备监控', permissions: ['DISH_PUBLISH_WRITE', 'CONSUME_DEVICE_MANAGE'], memberCount: 12 },
  ]);

  const handleDelete = (role: Role) => {
    if (role.code === 'SUPER_ADMIN') {
      alert("安全保护：超级管理员角色禁止删除");
      return;
    }
    if (window.confirm(`确认删除角色 [${role.name}] 吗？关联的用户将失去该角色的所有权限。`)) {
      setRoles(prev => prev.filter(r => r.id !== role.id));
      alert("角色已删除 (ADM-S4-SYS-ROLE-DEL Pass)");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">角色与权限 (Sprint 4)</h2>
          <p className="text-sm text-slate-500 mt-1">基于 RBAC 模型管理系统访问控制</p>
        </div>
        <button 
          data-testid="ADM-S4-SYS-ROLE-001"
          className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 flex items-center"
        >
          <Icons.ShieldPlus className="w-4 h-4 mr-2" /> 新增角色
        </button>
      </div>

      <DataTable 
        columns={[
          { header: '角色名称', key: 'name' },
          { header: '角色编码', key: 'code', render: (v) => <code className="bg-slate-100 px-2 py-1 rounded text-xs text-indigo-600">{v}</code> },
          { header: '描述', key: 'description' },
          { header: '成员数', key: 'memberCount', render: (v) => <span className="font-bold">{v} 人</span> },
        ]}
        data={roles}
        actions={(record) => (
          <div className="flex space-x-2">
            <button 
              data-testid={`ADM-S4-SYS-ROLE-002-${record.id}`}
              className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg" title="分配权限"
            >
              <Icons.Lock className="w-4 h-4" />
            </button>
            <button 
              className="p-1.5 text-slate-400 hover:bg-slate-50 rounded-lg" title="编辑"
            >
              <Icons.Edit3 className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleDelete(record)}
              className="p-1.5 text-rose-400 hover:bg-rose-50 rounded-lg" title="删除"
            >
              <Icons.Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      />
    </div>
  );
};

export default RoleManagement;
