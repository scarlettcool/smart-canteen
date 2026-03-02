import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import DataTable from '../../components/Common/DataTable';

interface RegRecord {
  id: string;
  name: string;
  phone: string;
  deptName: string;
  submitTime: string;
  status: 'pending' | 'passed' | 'rejected';
  reason?: string;
}

const mockRegs: RegRecord[] = [
  { id: 'R001', name: '周小波', phone: '13500001111', deptName: '技术研发部', submitTime: '2024-03-20 09:15', status: 'pending' },
  { id: 'R002', name: '林美玲', phone: '18822223333', deptName: '行政部', submitTime: '2024-03-20 10:45', status: 'pending' },
];

const RegApproval: React.FC = () => {
  const [selectedRecord, setSelectedRecord] = useState<RegRecord | null>(null);
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handlePass = (id: string | string[]) => {
    const count = Array.isArray(id) ? id.length : 1;
    if (window.confirm(`确认通过这 ${count} 项申请？`)) {
      alert(`审批通过 (ADM-S1-PEO-AUD-001/003 Pass)`);
      setSelectedIds([]);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="space-y-6" data-testid="page-reg-approval">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">注册审批中心</h2>
          <p className="text-sm text-slate-500 mt-1">处理微信端自助注册请求</p>
        </div>
        <div className="flex items-center space-x-4">
           {selectedIds.length > 0 && (
             <button 
               data-testid="ADM-S1-PEO-AUD-001"
               onClick={() => handlePass(selectedIds)}
               className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg"
             >
               批量通过 ({selectedIds.length})
             </button>
           )}
        </div>
      </div>

      <DataTable 
        columns={[
          { 
            header: '选择', 
            key: 'checkbox',
            render: (_, record: RegRecord) => (
              <input 
                type="checkbox" 
                data-testid={`checkbox-${record.id}`}
                checked={selectedIds.includes(record.id)} 
                onChange={() => toggleSelect(record.id)}
              />
            )
          },
          { header: '申请人', key: 'name' },
          { header: '手机号', key: 'phone' },
          { header: '状态', key: 'status' }
        ]} 
        data={mockRegs} 
        actions={(record: RegRecord) => (
          <div className="flex space-x-2">
            <button 
              data-testid={`ADM-S1-PEO-AUD-004-${record.id}`}
              onClick={() => setSelectedRecord(record)}
              className="text-xs font-bold text-indigo-600"
            >
              资料
            </button>
            <button 
              data-testid={`ADM-S1-PEO-AUD-003-${record.id}`}
              onClick={() => handlePass(record.id)}
              className="text-xs font-bold text-emerald-600"
            >
              通过
            </button>
            <button 
              data-testid={`btn-reject-trigger-${record.id}`}
              onClick={() => { setSelectedRecord(record); setRejectModal(true); }}
              className="text-xs font-bold text-rose-600"
            >
              驳回
            </button>
          </div>
        )}
      />

      {rejectModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm" data-testid="modal-reject">
          <div className="bg-white p-8 rounded-3xl w-full max-w-sm animate-scaleIn">
            <h3 className="text-xl font-bold mb-2">驳回申请</h3>
            <textarea 
              data-testid="ADM-S1-PEO-AUD-002-input"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="请说明驳回原因 (T05 校验)"
              className="w-full h-24 border rounded-xl p-3"
            />
            <div className="flex gap-3 mt-6">
              <button onClick={() => setRejectModal(false)}>取消</button>
              <button 
                data-testid="ADM-S1-PEO-AUD-002"
                onClick={() => {
                  if(!rejectReason.trim()) {
                    alert("原因必填 (ADM-S1-PEO-AUD-002 Fail-State)");
                    return;
                  }
                  alert(`驳回成功 (ADM-S1-PEO-AUD-002 Pass)`);
                  setRejectModal(false);
                }}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg font-bold"
              >
                确认驳回
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegApproval;