
import React from 'react';
import * as Icons from 'lucide-react';
import DataTable from '../../components/Common/DataTable';

interface Props {
  type: 'resigned' | 'birthday' | 'retired';
}

const PeopleReports: React.FC<Props> = ({ type }) => {
  const titles = {
    resigned: { main: '离职人员名录', sub: '展示所有状态为“已离职”的人员及其注销记录', icon: Icons.UserX },
    birthday: { main: '近期生日关怀', sub: '筛选未来30天内过生日的员工，支持批量导出提醒', icon: Icons.Cake },
    retired: { main: '退休人员档案', sub: '管理达到法定退休年龄或已办理退休的人员', icon: Icons.UserMinus },
  };

  const config = titles[type];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm text-indigo-600">
             <config.icon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{config.main}</h2>
            <p className="text-sm text-slate-500 mt-1">{config.sub}</p>
          </div>
        </div>
        <button className="flex items-center px-6 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
           <Icons.Download className="w-4 h-4 mr-2" />
           导出本表 (Excel)
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
         <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">所属部门</label>
              <select className="w-full bg-slate-50 border-none rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                 <option>全量部门</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">时间范围</label>
              <input type="month" className="w-full bg-slate-50 border-none rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            {type === 'birthday' && (
              <div className="col-span-2 flex items-end">
                <div className="p-4 bg-indigo-50 text-indigo-700 text-xs rounded-xl flex-1 border border-indigo-100 flex items-center">
                  <Icons.Bell className="w-4 h-4 mr-2 shrink-0" />
                  提示：可在“系统设置-提醒配置”中开启微信端自动生日祝福，开启后系统将在每日 09:00 准时下发。
                </div>
              </div>
            )}
         </div>

         <DataTable 
           columns={[
             { header: '工号', key: 'id' },
             { header: '姓名', key: 'name' },
             { header: '部门', key: 'dept' },
             { header: '变动/记录日期', key: 'date' },
             { header: '相关备注', key: 'memo' },
           ]}
           data={[]} // Empty data triggers placeholder
         />
      </div>
    </div>
  );
};

export default PeopleReports;
