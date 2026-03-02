import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import DataTable from '../../components/Common/DataTable';
import ApiService from '../../services/api';
import { TradeRecord } from '../../types'; // Ensure this is imported

const TradeManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [trades, setTrades] = useState<TradeRecord[]>([]);

  const fetchTrades = async () => {
    setLoading(true);
    try {
      const response = await ApiService.trade.getTransactions();
      setTrades(response.data.list);
    } catch (error) {
      console.error('Failed to fetch trades', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  const handleCorrect = async (id: string) => {
    const reason = window.prompt("冲正原因:");
    if (!reason) return;

    try {
      await ApiService.trade.correct(id, reason);
      alert("冲正提交成功");
      fetchTrades();
    } catch (error) {
      console.error('Correct failed', error);
      alert("冲正失败");
    }
  };

  const handleExport = async () => {
    try {
      await ApiService.trade.export();
      alert("导出任务已提交，请在报表中心查看进度");
    } catch (error) {
      console.error('Export failed', error);
      alert("导出失败");
    }
  };

  return (
    <div className="space-y-6" data-testid="page-trade-list">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">交易明细</h2>
        <div className="flex space-x-2">
          <button data-testid="export-btn" onClick={handleExport} className="px-3 py-1 bg-slate-100 rounded">导出</button>
          <input data-testid="input-trade-filter" type="text" placeholder="筛选..." className="border p-2 rounded" />
          <button onClick={fetchTrades} className="px-3 py-1 bg-indigo-600 text-white rounded">查询</button>
        </div>
      </div>
      <DataTable<TradeRecord>
        columns={[
          { header: '单号', key: 'id' },
          { header: '姓名', key: 'name' },
          { header: '金额', key: 'amount' },
          { header: '时间', key: 'timestamp' },
          {
            header: '状态',
            key: 'status',
            render: (v) => <span data-testid={`status-${v}`} className={v === 'success' ? 'text-green-600' : 'text-slate-600'}>{v}</span>
          }
        ]}
        data={trades}
        loading={loading}
        onRefresh={fetchTrades}
        actions={(record) => (
          <div className="flex space-x-2">
            <button data-testid={`btn-trade-detail-${record.id}`} onClick={() => alert('详情')}>详情</button>
            <button
              data-testid={`btn-trade-correct-${record.id}`}
              disabled={record.status === 'corrected'}
              onClick={() => handleCorrect(record.id)}
              className={`text-orange-600 ${record.status === 'corrected' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >冲正</button>
          </div>
        )}
      />
    </div>
  );
};

export default TradeManagement;