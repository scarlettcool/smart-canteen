
import React from 'react';
import * as Icons from 'lucide-react';
import DataTable from '../../components/Common/DataTable';

const DeviceManagement: React.FC = () => {
  const mockDevices = [
    { id: 'POS-001', name: '刷脸机-A', ip: '192.168.1.10', status: 'online', canteen: '一食堂', lastSeen: '2024-03-20 13:45' },
    { id: 'POS-002', name: '刷脸机-B', ip: '192.168.1.11', status: 'offline', canteen: '一食堂', lastSeen: '2023-03-19' },
  ];

  const handleReboot = (device: any) => {
    if (device.status === 'offline') {
      alert(`无法重启离线设备 [${device.id}]`);
      return;
    }
    alert(`已向 [${device.id}] 下发重启指令`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">消费终端设备</h2>
          <p className="text-sm text-slate-500 mt-1">监控 POS 状态</p>
        </div>
        <button data-testid="btn-add-device" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-100 flex items-center">
           <Icons.Plus className="w-4 h-4 mr-2" /> 绑定新设备
        </button>
      </div>

      <DataTable 
        columns={[
          { header: '设备编号', key: 'id', render: (v) => <span data-testid="device-id">{v}</span> },
          { header: '设备名称', key: 'name' },
          { 
            header: '状态', 
            key: 'status', 
            render: (v) => (
              <div className="flex items-center">
                 <span data-testid={`status-dot-${v}`} className={`w-2 h-2 rounded-full mr-2 ${v === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
                 <span className={`text-xs ${v === 'online' ? 'text-emerald-700' : 'text-slate-400'}`}>{v === 'online' ? '在线' : '离线'}</span>
              </div>
            )
          }
        ]}
        data={mockDevices}
        actions={(record) => (
          <div className="flex space-x-2">
             <button 
              data-testid={`btn-reboot-${record.id}`}
              onClick={() => handleReboot(record)} 
              className="text-indigo-600 hover:bg-indigo-50 p-1.5 rounded transition-colors"
             >
              <Icons.RefreshCw className="w-4 h-4" />
             </button>
             <button data-testid={`btn-config-${record.id}`} className="text-slate-400 hover:bg-slate-50 p-1.5 rounded transition-colors">
              <Icons.Settings className="w-4 h-4" />
             </button>
          </div>
        )}
      />
    </div>
  );
};

export default DeviceManagement;
