
import React from 'react';
import * as Icons from 'lucide-react';
import DataTable from '../../components/Common/DataTable';

const ReportConfig: React.FC = () => {
  const reports = [
    { id: 'RPT_01', name: '消费明细表', metrics: '单价, 实付, 余额', cacheTime: '10 min', status: 'online' },
    { id: 'RPT_02', name: '个人汇总表', metrics: '累计消费, 充值总额', cacheTime: '30 min', status: 'online' },
    { id: 'RPT_03', name: '经营趋势表', metrics: '同比, 环比, 客单价', cacheTime: '1 hour', status: 'maintenance' },
  ];

  return (
    <div className="space-y-6" data-testid="page-report-config">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">报表管理设置</h2>
          <p className="text-sm text-slate-500 mt-1">配置 13+ 类财务报表的统计口径、缓存策略与可见性</p>
        </div>
        <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg">
          + 配置新报表
        </button>
      </div>

      <DataTable 
        columns={[
          { header: '报表名称', key: 'name' },
          { header: '核心指标 (Metrics)', key: 'metrics', width: '300px' },
          { header: '刷新频率', key: 'cacheTime' },
          { 
            header: '状态', 
            key: 'status',
            render: (v) => v === 'online' ? 
              <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[10px] font-bold">正常运行</span> : 
              <span className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded text-[10px] font-bold">逻辑维护中</span>
          }
        ]}
        data={reports}
        actions={() => (
           <button className="text-indigo-600 font-bold text-xs">指标定义</button>
        )}
      />
    </div>
  );
};

export default ReportConfig;
