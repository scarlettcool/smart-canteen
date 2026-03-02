
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ShieldCheck, Check } from 'lucide-react';

const Permissions: React.FC = () => {
  const navigate = useNavigate();
  const perms = [
    { title: '一餐就餐权限', status: true },
    { title: '二餐就餐权限', status: true },
    { title: '清真窗口权限', status: false },
    { title: '行政理发预约', status: true },
    { title: '会议茶歇订购', status: false }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white px-4 h-14 flex items-center border-b border-slate-100">
        <button onClick={() => navigate(-1)}><ChevronLeft className="w-6 h-6" /></button>
        <h1 className="flex-1 text-center font-bold text-slate-800 pr-6">权限查看</h1>
      </div>
      <div className="p-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 mb-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold">当前权限级别</h3>
              <p className="text-xs text-slate-400">正式员工账户</p>
            </div>
          </div>
          <div className="space-y-4">
            {perms.map((p, i) => (
              <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-slate-50">
                <span className="text-sm font-medium text-slate-700">{p.title}</span>
                {p.status ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <span className="text-[10px] bg-slate-200 text-slate-400 px-2 py-0.5 rounded-full font-bold">未开通</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Permissions;
