import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import DataTable from '../../components/Common/DataTable';
import PermissionGuard from '../../components/Auth/PermissionGuard';
import ApiService from '../../services/api';
import { UserArchive } from '../../types';

const AccountManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserArchive | null>(null);
  const [adjustModal, setAdjustModal] = useState(false);
  const [adjustType, setAdjustType] = useState<'recharge' | 'deduction'>('recharge');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [accounts, setAccounts] = useState<UserArchive[]>([]);

  const fetchAccounts = async (keyword = '') => {
    setLoading(true);
    try {
      const response = await ApiService.hr.getArchives({ keyword });
      setAccounts(response.data?.list || []);
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
      setAccounts([]); // Reset on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleSearch = () => {
    fetchAccounts(searchQuery);
  };

  const handleAdjustSubmit = async () => {
    const val = parseFloat(amount);

    if (!amount || isNaN(val) || val <= 0) {
      alert("请输入有效的大于 0 的金额");
      return;
    }

    if (reason.trim().length < 2) {
      alert("请填写简单的调账原因");
      return;
    }

    if (adjustType === 'deduction' && selectedUser && val > Number(selectedUser.balance || 0)) {
      alert(`余额不足！该账户当前余额为 ¥${Number(selectedUser.balance || 0).toFixed(2)}，无法扣款 ¥${val.toFixed(2)}`);
      return;
    }

    setProcessing(true);

    try {
      // Use ApiService.account.adjust
      const delta = adjustType === 'recharge' ? val : -val;
      await ApiService.account.adjust(selectedUser?.id || '', delta, reason);

      setAdjustModal(false);
      setAmount('');
      setReason('');
      alert("操作成功！审计流水已记录。");
      fetchAccounts(searchQuery); // Refresh list
    } catch (error: any) {
      alert(`操作失败: ${error.message || '未知错误'}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6" data-testid="page-account-management">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">账户余额管理</h2>
          <p className="text-sm text-slate-500 mt-1">资金流水对账与手动调账中心 (RBAC Protected)</p>
        </div>
        <div className="flex space-x-2">
          <div className="relative">
            <Icons.Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="搜索工号/姓名/手机..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm w-64 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <button onClick={handleSearch} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold">搜索</button>
        </div>
      </div>

      <DataTable<UserArchive>
        title="账户名录"
        columns={[
          { header: '工号', key: 'staffId' },
          { header: '姓名', key: 'name' },
          { header: '手机号', key: 'phone' },
          {
            header: '余额',
            key: 'balance',
            render: (v, record: UserArchive) => (
              <span data-testid={`cell-balance-${record.staffId}`} className="font-mono font-bold text-indigo-600">
                ¥{Number(record.balance || 0).toFixed(2)}
              </span>
            )
          },
          {
            header: '状态',
            key: 'status',
            render: (v) => v === 'active' ?
              <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[10px] font-bold">正常</span> :
              <span className="bg-rose-50 text-rose-600 px-2 py-0.5 rounded text-[10px] font-bold">异常/冻结</span>
          }
        ]}
        data={accounts}
        loading={loading}
        onRefresh={() => fetchAccounts(searchQuery)}
        actions={(record: UserArchive) => (
          <div className="flex space-x-2">
            <button
              data-testid={`btn-detail-${record.staffId}`}
              className="text-slate-400 hover:text-indigo-600"
              onClick={() => alert(`查看详情: ${record.name}\n余额: ${record.balance}`)}
            >
              <Icons.Eye className="w-4 h-4" />
            </button>

            {/* Permission Guard for sensitive Adjust action */}
            <PermissionGuard permission="CONSUME_ACCOUNT_WRITE">
              <button
                data-testid={`btn-adjust-${record.staffId}`}
                onClick={() => { setSelectedUser(record); setAdjustModal(true); }}
                className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors"
              >
                调账
              </button>
            </PermissionGuard>
          </div>
        )}
      />

      {adjustModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm" data-testid="modal-adjust-balance">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl animate-scaleIn">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold flex items-center">
                <Icons.ShieldCheck className="w-5 h-5 mr-2 text-indigo-600" />
                账户调账: {selectedUser.name}
              </h3>
              <button onClick={() => setAdjustModal(false)} className="text-slate-400 hover:text-slate-600">
                <Icons.X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              <div className="bg-slate-50 p-4 rounded-2xl flex justify-between items-center border border-slate-100">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">当前余额</span>
                <span className="text-lg font-mono font-bold text-slate-700">¥{Number(selectedUser.balance || 0).toFixed(2)}</span>
              </div>

              <div className="flex p-1 bg-slate-100 rounded-2xl">
                <button
                  data-testid="tab-recharge"
                  onClick={() => setAdjustType('recharge')}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${adjustType === 'recharge' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
                >手动充值</button>
                <button
                  data-testid="tab-deduction"
                  onClick={() => setAdjustType('deduction')}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${adjustType === 'deduction' ? 'bg-white shadow-sm text-rose-600' : 'text-slate-500'}`}
                >手动扣款</button>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">调整金额</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold group-focus-within:text-indigo-600 transition-colors">¥</span>
                  <input
                    data-testid="input-adjust-amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-50 border border-transparent rounded-2xl pl-10 pr-4 py-4 text-lg font-mono outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">原因说明 (审计记录)</label>
                <textarea
                  data-testid="input-adjust-reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="请输入详细的业务原因，此操作将被记录在审计日志中..."
                  className="w-full bg-slate-50 border border-transparent rounded-2xl px-4 py-3 text-sm h-28 resize-none outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-inner"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setAdjustModal(false)}
                className="flex-1 py-4 text-slate-400 font-bold text-sm hover:bg-slate-50 rounded-2xl transition-all"
              >取消</button>
              <button
                data-testid="btn-submit-adjust"
                disabled={processing}
                onClick={handleAdjustSubmit}
                className={`flex-[2] py-4 rounded-2xl font-bold text-white shadow-lg transition-all flex items-center justify-center ${adjustType === 'recharge' ? 'bg-indigo-600 shadow-indigo-100 hover:bg-indigo-700' : 'bg-rose-600 shadow-rose-100 hover:bg-rose-700'} disabled:opacity-50`}
              >
                {processing ? <Icons.Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Icons.CheckCircle2 className="w-5 h-5 mr-2" />}
                {processing ? '正在提交...' : '确认执行'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountManagement;
