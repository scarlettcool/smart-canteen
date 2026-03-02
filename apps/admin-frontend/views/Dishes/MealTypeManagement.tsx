
import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import DataTable from '../../components/Common/DataTable';

const MealTypeManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const mealTypes = [
    { id: '1', name: '早餐', timeRange: '07:00 - 09:00', price: '固定 ¥5.00', status: 'enabled' },
    { id: '2', name: '午餐', timeRange: '11:30 - 13:30', price: '称重计费', status: 'enabled' },
    { id: '3', name: '晚餐', timeRange: '17:30 - 19:30', price: '自由点餐', status: 'enabled' },
  ];

  return (
    <div className="space-y-6" data-testid="page-meal-types">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">餐别时段管理</h2>
          <p className="text-sm text-slate-500 mt-1">定义食堂营业时段及计费模式</p>
        </div>
        <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg" data-testid="btn-add-meal-type">
          + 新增餐别
        </button>
      </div>

      <DataTable 
        columns={[
          { header: '餐别名称', key: 'name' },
          { header: '供餐时间段', key: 'timeRange' },
          { header: '默认计费模式', key: 'price' },
          { 
            header: '状态', 
            key: 'status',
            render: (v) => <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[10px] font-bold">运行中</span>
          }
        ]}
        data={mealTypes}
        actions={() => (
          <button className="text-slate-400 hover:text-indigo-600"><Icons.Settings className="w-4 h-4" /></button>
        )}
      />
    </div>
  );
};

export default MealTypeManagement;
