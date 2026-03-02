
import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import DataTable from '../../components/Common/DataTable';

interface Transaction {
  id: string;
  name: string;
  staffId: string;
  amount: number;
  type: 'consumption' | 'recharge' | 'refund';
  canteen: string;
  timestamp: string;
  status: 'success' | 'fail' | 'processing';
}

const mockTransactions: Transaction[] = [
  { id: 'TX9901', name: '李明', staffId: '100001', amount: -25.50, type: 'consumption', canteen: '第一食堂', timestamp: '2024-03-20 12:35:12', status: 'success' },
  { id: 'TX9902', name: '王丽华', staffId: '100002', amount: 200.00, type: 'recharge', canteen: '线上充值', timestamp: '2024-03-20 12:40:05', status: 'success' },
  { id: 'TX9903', name: '陈强', staffId: '100003', amount: -15.00, type: 'consumption', canteen: '第二食堂', timestamp: '2024-03-20 12:42:33', status: 'success' },
  { id: 'TX9904', name: '张三', staffId: '100123', amount: 15.00, type: 'refund', canteen: '第二食堂', timestamp: '2024-03-20 12:55:00', status: 'processing' },
];

const TransactionHistory: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const columns = [
    { header: '交易单号', key: 'id', width: '120px' },
    { 
      header: '交易主体', 
      key: 'name',
      render: (val: string, record: Transaction) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-800">{val}</span>
          <span className="text-[10px] text-slate-400">工号: {record.staffId}</span>
        </div>
      )
    },
    { 
      header: '交易金额', 
      key: 'amount',
      render: (val: number) => (
        <span className={`font-mono font-bold ${val < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
          {val > 0 ? `+${val.toFixed(2)}` : val.toFixed(2)}
        </span>
      )
    },
    { 
      header: '业务类型', 
      key: 'type',
      render: (val: string) => {
        const labels = { consumption: '扫码消费', recharge: '余额充值', refund: '退款冲正' };
        return <span className="text-xs text-slate-600">{(labels as any)[val]}</span>;
      }
    },
    { header: '就餐/支付渠道', key: 'canteen' },
    { header: '交易时间', key: 'timestamp', width: '180px' },
    { 
      header: '状态', 
      key: 'status',
      render: (val: string) => {
        const styles = { success: 'text-emerald-600 bg-emerald-50', fail: 'text-rose-600 bg-rose-50', processing: 'text-blue-600 bg-blue-50' };
        const labels = { success: '已完成', fail: '交易失败', processing: '处理中' };
        return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${(styles as any)[val]}`}>{(labels as any)[val]}</span>;
      }
    }
  ];

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">交易流水中心</h2>
          <p className="text-sm text-slate-500 mt-1">记录系统内所有资金变动轨迹，支持审计溯源与冲正处理</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 shadow-sm transition-all">
          <Icons.FileSpreadsheet className="w-4 h-4 mr-2 text-emerald-600" />
          导出对账报表
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-indigo-600 p-6 rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-between">
            <div className="text-white">
              <p className="text-xs opacity-70 font-bold uppercase tracking-wider">今日累计消费</p>
              <h4 className="text-3xl font-bold mt-1">¥ 12,450.80</h4>
            </div>
            <div className="p-3 bg-white/10 rounded-xl">
              <Icons.ShoppingBag className="text-white w-6 h-6" />
            </div>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">待对账充值额</p>
              <h4 className="text-3xl font-bold text-slate-800 mt-1">¥ 5,800.00</h4>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl">
              <Icons.ArrowUpCircle className="text-emerald-600 w-6 h-6" />
            </div>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">退款处理中</p>
              <h4 className="text-3xl font-bold text-slate-800 mt-1">12 <span className="text-sm font-normal text-slate-400">笔</span></h4>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl">
              <Icons.Clock className="text-amber-600 w-6 h-6" />
            </div>
         </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap gap-4 items-center shadow-sm">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-400 uppercase">时间段:</span>
          <input type="date" className="bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 outline-none" />
          <span className="text-slate-300">-</span>
          <input type="date" className="bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-400 uppercase">交易类型:</span>
          <select className="bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 outline-none">
            <option>全部</option>
            <option>扫码消费</option>
            <option>余额充值</option>
            <option>退款冲正</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-400 uppercase">食堂:</span>
          <select className="bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 outline-none">
            <option>所有点位</option>
            <option>第一食堂</option>
            <option>第二食堂</option>
            <option>线上渠道</option>
          </select>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={mockTransactions} 
        loading={loading}
        onRefresh={() => {
          setLoading(true);
          setTimeout(() => setLoading(false), 500);
        }}
        actions={(record) => (
          <div className="flex space-x-1">
             <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded" title="凭证详情">
                <Icons.FileText className="w-4 h-4" />
             </button>
             {record.type === 'consumption' && (
               <button 
                onClick={() => alert(`已对单号 ${record.id} 发起冲正指令，请在[退款审核]页面查看详情。`)}
                className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded" title="发起冲正"
               >
                  <Icons.Undo2 className="w-4 h-4" />
               </button>
             )}
          </div>
        )}
      />
    </div>
  );
};

export default TransactionHistory;
