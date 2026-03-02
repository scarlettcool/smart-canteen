
import React from 'react';
import * as Icons from 'lucide-react';
import DataTable from '../../components/Common/DataTable';
import { AuditLog } from '../../types';

const mockLogs: AuditLog[] = [
  { id: 'LOG-101', operator: 'admin', action: '修改账户余额', module: '账户管理', ip: '192.168.1.100', status: 'success', timestamp: '2024-03-20 14:30:12', details: '调整人员 1001 余额 +50.00' },
  { id: 'LOG-102', operator: 'finance_01', action: '执行退款审核', module: '交易管理', ip: '192.168.1.102', status: 'success', timestamp: '2024-03-20 15:10:05', details: '通过退款申请 REF-001' },
  { id: 'LOG-103', operator: 'admin', action: '登录系统', module: '安全网关', ip: '110.12.3.45', status: 'fail', timestamp: '2024-03-20 16:00:22', details: '密码连续输错 3 次' },
];

const OperationLogs: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">系统操作日志</h2>
          <p className="text-sm text-slate-500 mt-1">追溯所有管理员的操作轨迹与系统异常</p>
        </div>
        <button 
          data-testid="ADM-S4-SYS-LOG-001"
          className="px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm text-slate-600 hover:bg-slate-50 shadow-sm flex items-center"
        >
          <Icons.Download className="w-4 h-4 mr-2" /> 导出审计报告
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-wrap gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-400">操作人:</span>
          <input type="text" className="bg-slate-50 border-none rounded-lg px-3 py-1.5 text-sm outline-none w-32" placeholder="ID/姓名" />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-400">模块:</span>
          <select className="bg-slate-50 border-none rounded-lg px-3 py-1.5 text-sm outline-none">
            <option>全部模块</option>
            <option>账户管理</option>
            <option>人员档案</option>
          </select>
        </div>
      </div>

      <DataTable 
        columns={[
          { header: '时间', key: 'timestamp', width: '180px' },
          { header: '操作人', key: 'operator', render: (v) => <span className="font-bold text-indigo-600">{v}</span> },
          { header: '动作', key: 'action' },
          { header: '所属模块', key: 'module' },
          { 
            header: '状态', 
            key: 'status',
            render: (v) => (
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${v === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {v === 'success' ? '成功' : '失败'}
              </span>
            )
          },
          { header: 'IP 地址', key: 'ip' },
        ]}
        data={mockLogs}
        actions={(record) => (
          <button 
            className="p-1.5 text-slate-400 hover:text-indigo-600"
            onClick={() => alert(`操作详情: ${record.details}`)}
          >
            <Icons.Info className="w-4 h-4" />
          </button>
        )}
      />
    </div>
  );
};

export default OperationLogs;
