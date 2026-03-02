
import React from 'react';
import * as Icons from 'lucide-react';
import DataTable from '../../components/Common/DataTable';

const AppealProcess: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">失约申诉处理</h2>
        <p className="text-sm text-slate-500 mt-1">处理因公事爽约、设备故障等导致的失约处罚申诉</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border shadow-sm">
         <DataTable 
           columns={[
             { header: '申诉人', key: 'name' },
             { header: '失约日期', key: 'date' },
             { header: '申诉理由', key: 'reason' },
             { header: '凭证', key: 'attachment', render: () => <Icons.Image className="text-indigo-400 cursor-pointer" /> },
             { header: '状态', key: 'status', render: () => <span className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded text-xs font-bold">处理中</span> }
           ]}
           data={[
             { name: '王五', date: '2024-03-18', reason: '临时紧急会议' }
           ]}
           actions={() => (
             <div className="flex space-x-2">
                <button className="text-indigo-600 font-bold text-xs">通过并解除限制</button>
                <button className="text-slate-400 font-bold text-xs">驳回</button>
             </div>
           )}
         />
      </div>
    </div>
  );
};

export default AppealProcess;
