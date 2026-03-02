
import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import DataTable from '../../components/Common/DataTable';

const PreRecordedData: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const mockData = [
    { id: 'PR001', name: '王五', phone: '13811112222', dept: '临时组', source: 'Excel批量', status: 'ready' },
    { id: 'PR002', name: '赵六', phone: '13933334444', dept: '行政部', source: '外部API', status: 'duplicate' },
  ];

  const handleConvert = (id: string) => {
    if (window.confirm("确定将该预录资料转为正式档案？系统将自动核验手机号唯一性。")) {
      alert("转正成功！已移动至正式档案列表。");
    }
  };

  const columns = [
    { header: '姓名', key: 'name' },
    { header: '手机号', key: 'phone' },
    { header: '预设部门', key: 'dept' },
    { header: '来源', key: 'source' },
    { 
      header: '状态', 
      key: 'status',
      render: (v: string) => v === 'ready' ? 
        <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs">可转正</span> : 
        <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-xs font-bold underline">冲突 (档案已存在)</span>
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">预录资料管理</h2>
          <p className="text-sm text-slate-500 mt-1">处理尚未入职或等待批量同步的临时人员数据</p>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 border rounded-lg text-sm hover:bg-slate-50">字段映射设置</button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-100">+ 批量导入预录</button>
        </div>
      </div>
      <DataTable 
        columns={columns} 
        data={mockData} 
        actions={(record: any) => (
          <button 
            disabled={record.status === 'duplicate'}
            onClick={() => handleConvert(record.id)}
            className="text-indigo-600 hover:text-indigo-800 text-xs font-bold disabled:opacity-30"
          >
            转为正式档案
          </button>
        )}
      />
    </div>
  );
};

export default PreRecordedData;
