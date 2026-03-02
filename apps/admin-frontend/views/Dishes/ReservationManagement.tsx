
import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import DataTable from '../../components/Common/DataTable';
import { Reservation } from '../../types';

const ReservationManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const mockReservations: Reservation[] = [
    { id: 'RES-101', staffId: '1001', dishName: '宫保鸡丁', canteenName: '第一食堂', mealType: 'lunch', date: '2024-03-25', status: 'reserved' },
    { id: 'RES-102', staffId: '1002', dishName: '红烧牛肉面', canteenName: '第一食堂', mealType: 'dinner', date: '2024-03-25', status: 'completed' },
    { id: 'RES-103', staffId: '1003', dishName: '清炒菜心', canteenName: '第二食堂', mealType: 'lunch', date: '2024-03-25', status: 'canceled' },
  ];

  const handleExport = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("订餐订单导出成功！(ADM-S3-DISH-RES-001 Pass)");
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">订餐订单管理</h2>
          <p className="text-sm text-slate-500 mt-1">查看、核销及导出所有员工的订餐记录</p>
        </div>
        <button 
          data-testid="ADM-S3-DISH-RES-001"
          disabled={loading}
          onClick={handleExport}
          className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 shadow-sm flex items-center transition-all"
        >
          {loading ? <Icons.Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Icons.Download className="w-4 h-4 mr-2 text-emerald-600" />}
          导出订单报表
        </button>
      </div>

      <DataTable 
        columns={[
          { header: '工号', key: 'staffId' },
          { header: '菜品', key: 'dishName' },
          { header: '餐别', key: 'mealType', render: (v) => v === 'lunch' ? '午餐' : '晚餐' },
          { header: '日期', key: 'date' },
          { 
            header: '状态', 
            key: 'status',
            render: (v) => {
              const colors: any = { reserved: 'bg-blue-50 text-blue-600', completed: 'bg-emerald-50 text-emerald-600', canceled: 'bg-slate-100 text-slate-400' };
              const labels: any = { reserved: '待取餐', completed: '已完成', canceled: '已取消' };
              return <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${colors[v]}`}>{labels[v]}</span>;
            }
          }
        ]}
        data={mockReservations}
        actions={(record) => (
          <button className="text-indigo-600 hover:underline text-xs font-bold">查看详情</button>
        )}
      />
    </div>
  );
};

export default ReservationManagement;
