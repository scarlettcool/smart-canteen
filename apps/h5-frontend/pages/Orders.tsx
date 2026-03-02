
import React, { useState, useEffect } from 'react';
import { MOCK_ORDERS } from '../constants';
import Badge from '../components/Badge';
import StateLayout from '../components/StateLayout';
import { ClipboardList, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [pageState, setPageState] = useState<'loading' | 'empty' | 'error' | 'content'>('loading');

  useEffect(() => {
    // 模拟数据加载过程
    const timer = setTimeout(() => {
      setPageState(MOCK_ORDERS.length > 0 ? 'content' : 'empty');
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const filteredOrders = MOCK_ORDERS.filter(o => 
    filter === 'all' || 
    (filter === 'pending' && o.status === 'pending') ||
    (filter === 'completed' && o.status === 'completed')
  );

  return (
    <div className="pb-24 pt-4 page-transition min-h-full">
      <div className="px-6 mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">消费记录</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">记录中心 (Sync)</p>
        </div>
        <div className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-300">
           <Filter className="w-4 h-4" />
        </div>
      </div>

      <div className="px-4 mb-8">
        <div className="flex p-1 bg-slate-200/50 rounded-2xl">
          {(['all', 'pending', 'completed'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                filter === t ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              {t === 'all' ? '全部' : t === 'pending' ? '进行中' : '已完成'}
            </button>
          ))}
        </div>
      </div>

      <StateLayout state={pageState} emptyText="暂无交易记录">
        <div className="px-4 space-y-4">
          {filteredOrders.map((order) => (
            <div 
              key={order.id} 
              onClick={() => order.type === 'reservation' && navigate(`/reservation/${order.id}`)}
              className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex justify-between items-center active:bg-slate-50 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${order.type === 'dine-in' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                  <ClipboardList className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-slate-800 text-sm">{order.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-1 font-bold">{order.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-black text-sm mb-1 ${order.amount > 0 ? 'text-slate-800' : 'text-slate-300'}`}>
                  {order.amount > 0 ? `-¥${order.amount.toFixed(2)}` : '预约免单'}
                </p>
                <Badge status={order.status} />
              </div>
            </div>
          ))}
        </div>
      </StateLayout>
    </div>
  );
};

export default Orders;
