
import React from 'react';
import * as Icons from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
  { name: '07:00', value: 400 },
  { name: '08:00', value: 1200 },
  { name: '09:00', value: 800 },
  { name: '10:00', value: 200 },
  { name: '11:00', value: 3200 },
  { name: '12:00', value: 4500 },
  { name: '13:00', value: 2100 },
];

const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <h4 className="text-2xl font-bold text-slate-900 mt-2">{value}</h4>
        <div className={`flex items-center mt-2 text-xs ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
          {change.startsWith('+') ? <Icons.TrendingUp className="w-3 h-3 mr-1" /> : <Icons.TrendingDown className="w-3 h-3 mr-1" />}
          {change} 相比昨日
        </div>
      </div>
      <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">数据概览 (实时)</h2>
        <div className="flex items-center space-x-2">
           <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
           <span className="text-xs text-slate-500 font-mono uppercase tracking-widest">Live Sync Enabled</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="今日流水" value="¥ 45,280.50" change="+12.5%" icon={Icons.CreditCard} color="bg-indigo-500" />
        <StatCard title="预约人数" value="2,840 人" change="+5.2%" icon={Icons.CalendarCheck} color="bg-orange-500" />
        <StatCard title="新增注册" value="48 名" change="+24.1%" icon={Icons.UserPlus} color="bg-emerald-500" />
        <StatCard title="待办投诉" value="12 件" change="-2.4%" icon={Icons.MessageCircle} color="bg-rose-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">就餐流量趋势 (各时段)</h3>
            <select className="text-xs bg-slate-50 border-none rounded px-2 py-1 outline-none text-slate-500">
              <option>今日</option>
              <option>昨日</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-6">实时监控看板</h3>
          <div className="flex-1 space-y-6 overflow-y-auto pr-2">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <Icons.UserCheck className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700">张立伟 (100023) 刚刚通过实名审核</p>
                <p className="text-xs text-slate-400 mt-0.5">2分钟前 · 系统审核</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                <Icons.AlertTriangle className="w-4 h-4 text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700">第一食堂 03 号充值终端异常断连</p>
                <p className="text-xs text-slate-400 mt-0.5">5分钟前 · 硬件报警</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                <Icons.LogOut className="w-4 h-4 text-rose-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700">王海峰 发起一笔异常退款申请 (¥25.00)</p>
                <p className="text-xs text-slate-400 mt-0.5">12分钟前 · 交易审计</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 opacity-60">
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                <Icons.Settings className="w-4 h-4 text-slate-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700">管理员 修改了“午餐预约截止时间”</p>
                <p className="text-xs text-slate-400 mt-0.5">1小时前 · 策略变更</p>
              </div>
            </div>
          </div>
          <button className="w-full mt-6 py-2 bg-slate-50 text-slate-500 text-sm font-medium rounded-lg hover:bg-slate-100 transition-colors">
            查看更多系统动态
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
