import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import DataTable from '../../components/Common/DataTable';
import { RefundApplication } from '../../types';

const RefundAudit: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [loading, setLoading] = useState(false);
  const [rejectModal, setRejectModal] = useState<RefundApplication | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // 模拟退款申请数据
  const [refunds, setRefunds] = useState<RefundApplication[]>([
    { id: 'REF-001', tradeId: 'TX-1001', applicant: '张晓明', amount: 25.50, reason: '设备故障重复扣款', status: 'pending', applyTime: '2024-03-20 12:00' },
    { id: 'REF-002', tradeId: 'TX-1005', applicant: '李明', amount: 15.00, reason: '菜品有异物', status: 'pending', applyTime: '2024-03-20 13:30' },
    { id: 'REF-003', tradeId: 'TX-0988', applicant: '王芳', amount: 8.00, reason: '测试退款', status: 'approved', applyTime: '2024-03-19 09:00', auditTime: '2024-03-19 10:00', auditor: 'Admin' },
  ]);

  const pendingList = refunds.filter(r => r.status === 'pending');
  const historyList = refunds.filter(r => r.status !== 'pending');

  const handleApprove = (record: RefundApplication) => {
    if (!window.confirm(`确定通过申请 [${record.id}]？资金将原路返回用户账户。`)) return;
    
    setLoading(true); // S2-C15-06: 防重复点击
    setTimeout(() => {
      setRefunds(prev => prev.map(r => r.id === record.id ? { ...r, status: 'approved', auditTime: new Date().toLocaleString(), auditor: 'Admin' } : r));
      setLoading(false);
      alert("退款审批已通过，正在调起支付网关...");
    }, 1000);
  };

  const handleRejectSubmit = () => {
    // S2-C15-05: 驳回原因必填校验
    if (!rejectReason.trim()) {
      alert("请填写驳回原因，以便告知用户");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setRefunds(prev => prev.map(r => r.id === rejectModal?.id ? { ...r, status: 'rejected', auditTime: new Date().toLocaleString(), auditor: 'Admin' } : r));
      setLoading(false);
      setRejectModal(null);
      setRejectReason('');
      alert("申请已驳回");
    }, 800);
  };

  return (
    <div className="space-y-6" data-testid="page-refund-audit">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">退款审核</h2>
          <p className="text-sm text-slate-500 mt-1">处理用户发起的异常消费退款申请</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl border shadow-sm">
           <button 
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'pending' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400'}`}
           >
            待审核 ({pendingList.length})
           </button>
           <button 
            onClick={() => setActiveTab('history')}
            className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'history' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400'}`}
           >
            已处理
           </button>
        </div>
      </div>

      <DataTable 
        columns={[
          { header: '单号', key: 'id' },
          { header: '关联交易', key: 'tradeId' },
          { header: '申请人', key: 'applicant' },
          { 
            header: '退款金额', 
            key: 'amount', 
            render: (v) => <span className="font-mono font-bold text-rose-500">¥{v.toFixed(2)}</span> 
          },
          { header: '申请时间', key: 'applyTime' },
          { 
            header: '状态', 
            key: 'status',
            render: (v) => {
               const styles: any = {
                 pending: 'bg-amber-50 text-amber-600 border-amber-100',
                 approved: 'bg-emerald-50 text-emerald-600 border-emerald-100',
                 rejected: 'bg-rose-50 text-rose-600 border-rose-100'
               };
               const labels: any = { pending: '待审核', approved: '已通过', rejected: '已驳回' };
               return <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${styles[v]}`}>{labels[v]}</span>;
            }
          }
        ]}
        data={activeTab === 'pending' ? pendingList : historyList}
        actions={(record: RefundApplication) => (
          <div className="flex space-x-2">
            <button 
              data-testid={`btn-detail-${record.id}`}
              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
              onClick={() => alert(`单据详情: ${record.reason}`)}
            >
              <Icons.FileText className="w-4 h-4" />
            </button>
            {record.status === 'pending' && (
              <>
                <button 
                  data-testid={`btn-reject-${record.id}`}
                  onClick={() => setRejectModal(record)}
                  className="px-3 py-1 text-rose-600 text-xs font-bold border border-rose-100 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  驳回
                </button>
                <button 
                  data-testid={`btn-approve-${record.id}`}
                  disabled={loading}
                  onClick={() => handleApprove(record)}
                  className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 shadow-sm transition-colors disabled:opacity-50"
                >
                  通过
                </button>
              </>
            )}
          </div>
        )}
      />

      {/* 驳回原因弹窗 */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl w-full max-w-sm shadow-2xl animate-scaleIn">
            <h3 className="text-xl font-bold mb-4">驳回申请: {rejectModal.id}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">驳回原因 (S2-C15-05)</label>
                <textarea 
                  data-testid="input-reject-reason"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="请输入驳回理由，告知用户..."
                  className="w-full mt-1 bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm h-32 resize-none outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={() => setRejectModal(null)} className="flex-1 text-slate-400 font-bold">取消</button>
              <button 
                data-testid="btn-confirm-action"
                disabled={loading}
                onClick={handleRejectSubmit}
                className="flex-1 py-3 bg-rose-600 text-white rounded-2xl font-bold shadow-lg shadow-rose-100 hover:bg-rose-700 disabled:opacity-50"
              >
                {loading ? <Icons.Loader2 className="w-4 h-4 animate-spin mx-auto" /> : '确认驳回'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RefundAudit;