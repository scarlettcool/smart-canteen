
import React from 'react';
import * as Icons from 'lucide-react';
import DataTable from '../../components/Common/DataTable';

const FieldMapping: React.FC = () => {
  const mappings = [
    { id: 'F01', localField: 'staff_id', externalField: 'EMP_NO', system: 'HRM_SYNC', status: 'mapped' },
    { id: 'F02', localField: 'dept_name', externalField: 'ORG_UNIT', system: 'HRM_SYNC', status: 'mapped' },
    { id: 'F03', localField: 'phone', externalField: 'MOBILE_PHONE', system: 'SMS_GATEWAY', status: 'pending' },
  ];

  return (
    <div className="space-y-6" data-testid="page-field-map">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">字段对照管理</h2>
        <p className="text-sm text-slate-500 mt-1">配置本地系统字段与三方系统字段的映射契约</p>
      </div>

      <DataTable 
        columns={[
          { header: '本地字段 (SOT)', key: 'localField', render: (v) => <span className="font-mono font-bold text-indigo-600">{v}</span> },
          { header: '对接系统字段', key: 'externalField', render: (v) => <span className="font-mono text-slate-600">{v}</span> },
          { header: '所属系统', key: 'system' },
          { 
            header: '状态', 
            key: 'status',
            render: (v) => v === 'mapped' ? 
              <span className="text-emerald-600 font-bold">已绑定</span> : 
              <span className="text-amber-600 font-bold italic underline">待对齐</span>
          }
        ]}
        data={mappings}
        actions={() => (
          <button className="text-xs font-bold text-slate-400 hover:text-indigo-600">编辑映射规则</button>
        )}
      />
    </div>
  );
};

export default FieldMapping;
