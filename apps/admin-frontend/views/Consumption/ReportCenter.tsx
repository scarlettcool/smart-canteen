
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import * as Icons from 'lucide-react';
import DataTable from '../../components/Common/DataTable';

const ReportCenter: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const [showMetrics, setShowMetrics] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const reportConfigs: Record<string, any> = {
    'detail': { title: '消费明细报表', icon: Icons.List, desc: '最细粒度的单笔消费轨迹' },
    'user-summary': { title: '个人汇总报表', icon: Icons.UserCircle, desc: '按人员统计' },
  };

  const config = reportConfigs[type || 'detail'] || reportConfigs['detail'];

  const handleExport = () => {
    setExporting(true);
    // Simulate async export job
    setTimeout(() => {
      setExporting(false);
      alert('报表导出任务已创建');
    }, 1500);
  };

  const handleQuery = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
           <div className="p-4 bg-indigo-600 text-white rounded-3xl shadow-xl shadow-indigo-100 rotate-3">
              <config.icon className="w-6 h-6 -rotate-3" />
           </div>
           <div>
              <h2 className="text-2xl font-bold text-slate-900">{config.title}</h2>
              <p className="text-sm text-slate-400 mt-1">{config.desc}</p>
           </div>
        </div>
        <div className="flex space-x-2">
           <button 
            data-testid="btn-metrics"
            onClick={() => setShowMetrics(true)} 
            className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 flex items-center transition-all"
           >
             <Icons.BookOpen className="w-4 h-4 mr-2 text-indigo-500" /> 口径定义
           </button>
           <button 
             data-testid="btn-export-async"
             disabled={exporting}
             onClick={handleExport} 
             className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold flex items-center shadow-lg shadow-emerald-50 hover:bg-emerald-700 transition-all disabled:opacity-50"
           >
             {exporting ? <Icons.Loader2 data-testid="loader-export" className="animate-spin w-4 h-4 mr-2" /> : <Icons.Download className="w-4 h-4 mr-2" />}
             导出异步报表
           </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border shadow-sm grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">分析食堂</label>
            <select data-testid="select-canteen" className="w-full bg-slate-50 border-none px-3 py-2.5 rounded-xl text-sm outline-none cursor-pointer focus:ring-2 focus:ring-indigo-500">
               <option value="all">全量食堂数据</option>
               <option value="c1">第一食堂</option>
            </select>
         </div>
         <div className="flex items-end">
            <button 
              data-testid="btn-sync-analysis"
              onClick={handleQuery} 
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-black shadow-lg shadow-slate-200 transition-all"
            >
              同步执行分析
            </button>
         </div>
      </div>

      <DataTable 
        title="报表预览"
        columns={[
          { header: '统计维度', key: 'dim' },
          { header: '单数', key: 'count' },
          { header: '净额', key: 'net', render: (v) => <span className="font-mono font-bold text-emerald-600">¥{v?.toFixed(2) || '0.00'}</span> }
        ]}
        data={[]}
        loading={loading}
      />
    </div>
  );
};

export default ReportCenter;
