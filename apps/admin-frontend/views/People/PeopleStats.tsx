
import React from 'react';
import * as Icons from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const PeopleStats: React.FC = () => {
  const deptData = [
    { name: '研发', value: 45 },
    { name: '财务', value: 12 },
    { name: '行政', value: 25 },
    { name: '外协', value: 18 },
  ];
  const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#f43f5e'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">人员统计分析</h2>
          <p className="text-sm text-slate-500 mt-1">实时监控人员分布、活跃度及账户健康状况</p>
        </div>
        <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-all flex items-center">
           <Icons.RefreshCw className="w-4 h-4 mr-2" />
           刷新统计
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
         <div className="col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
               <Icons.Users className="w-5 h-5 mr-2 text-indigo-500" />
               人员分布概况 (按部门)
            </h3>
            <div className="h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={deptData}>
                   <XAxis dataKey="name" axisLine={false} tickLine={false} />
                   <YAxis axisLine={false} tickLine={false} />
                   <Tooltip cursor={{fill: '#f8fafc'}} />
                   <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                 </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
               <Icons.PieChart className="w-5 h-5 mr-2 text-orange-500" />
               状态分布
            </h3>
            <div className="flex-1">
               <ResponsiveContainer width="100%" height="200">
                 <PieChart>
                   <Pie data={deptData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                     {deptData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                   </Pie>
                   <Tooltip />
                 </PieChart>
               </ResponsiveContainer>
               <div className="mt-4 space-y-2">
                  {deptData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                       <div className="flex items-center">
                          <span className="w-2 h-2 rounded-full mr-2" style={{backgroundColor: COLORS[idx % COLORS.length]}}></span>
                          <span className="text-slate-500">{item.name}</span>
                       </div>
                       <span className="font-bold text-slate-800">{item.value}%</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default PeopleStats;
