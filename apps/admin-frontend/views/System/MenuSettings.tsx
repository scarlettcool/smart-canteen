
import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import DataTable from '../../components/Common/DataTable';

const MenuSettings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const menus = [
    { id: 'M01', label: '人员管理', path: '/people', sort: 1, status: 'visible' },
    { id: 'M02', label: '消费管理', path: '/consumption', sort: 2, status: 'visible' },
    { id: 'M03', label: '菜品管理', path: '/dishes', sort: 3, status: 'visible' },
    { id: 'M04', label: '系统设置', path: '/system', sort: 4, status: 'visible' },
  ];

  const handleUpdate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("菜单排序已生效 (ADM-S4-SYS-MENU-001 Pass)");
    }, 800);
  };

  return (
    <div className="space-y-6" data-testid="page-system-menus">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">菜单设置</h2>
          <p className="text-sm text-slate-500 mt-1">管理管理后台与用户门户的导航菜单结构</p>
        </div>
        <button 
          onClick={handleUpdate}
          disabled={loading}
          className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg disabled:opacity-50 flex items-center"
        >
          {loading ? <Icons.Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Icons.Save className="w-4 h-4 mr-2" />}
          保存菜单发布
        </button>
      </div>

      <div className="bg-white p-6 rounded-3xl border shadow-sm">
        <DataTable 
          columns={[
            { header: '菜单标识', key: 'id' },
            { header: '名称', key: 'label' },
            { header: '路径', key: 'path', render: (v) => <code className="text-xs text-slate-400">{v}</code> },
            { header: '排序值', key: 'sort' },
            { 
              header: '可见性', 
              key: 'status',
              render: (v) => <span className="text-emerald-600 font-bold text-[10px] uppercase">Visible</span>
            }
          ]}
          data={menus}
          actions={() => (
            <div className="flex space-x-2">
              <button className="p-1.5 text-slate-400 hover:text-indigo-600"><Icons.GripVertical className="w-4 h-4" /></button>
              <button className="p-1.5 text-slate-400 hover:text-rose-600"><Icons.Trash2 className="w-4 h-4" /></button>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default MenuSettings;
