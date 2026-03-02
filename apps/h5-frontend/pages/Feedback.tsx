
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Send, History } from 'lucide-react';

const Feedback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAppeal = location.pathname === '/appeal';
  const [view, setView] = useState<'form' | 'list'>('form');

  const [mockFeedbacks] = useState([
    { id: '1', title: '食堂菜品口味建议', status: '已回复', date: '2023-10-20' },
    { id: '2', title: '关于理发室服务的投诉', status: '处理中', date: '2023-10-22' }
  ]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white px-4 h-14 flex items-center border-b border-slate-100">
        <button onClick={() => navigate(-1)}><ChevronLeft className="w-6 h-6" /></button>
        <h1 className="flex-1 text-center font-bold text-slate-800 pr-6">{isAppeal ? '失约申诉' : '投诉建议'}</h1>
      </div>

      <div className="p-4">
        <div className="flex bg-slate-200/50 p-1 rounded-xl mb-6">
          <button onClick={() => setView('form')} className={`flex-1 py-2 text-sm font-bold rounded-lg ${view === 'form' ? 'bg-white text-blue-600' : 'text-slate-500'}`}>
            {isAppeal ? '提交申诉' : '我要反馈'}
          </button>
          <button onClick={() => setView('list')} className={`flex-1 py-2 text-sm font-bold rounded-lg ${view === 'list' ? 'bg-white text-blue-600' : 'text-slate-500'}`}>
            {isAppeal ? '申诉记录' : '反馈记录'}
          </button>
        </div>

        {view === 'form' ? (
          <div className="space-y-6">
             <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-4">
               {isAppeal && (
                 <div>
                   <label className="block text-xs font-bold text-slate-400 mb-2">申诉记录</label>
                   <select className="w-full bg-slate-50 p-3 rounded-xl text-sm border-none outline-none">
                     <option>2023-10-24 午餐失约</option>
                     <option>2023-10-21 早餐失约</option>
                   </select>
                 </div>
               )}
               <div>
                 <label className="block text-xs font-bold text-slate-400 mb-2">{isAppeal ? '申诉理由' : '反馈内容'}</label>
                 <textarea rows={6} placeholder="请详细说明情况..." className="w-full bg-slate-50 p-4 rounded-xl text-sm border-none outline-none resize-none" />
               </div>
               <div>
                 <label className="block text-xs font-bold text-slate-400 mb-2">附件上传 (可选)</label>
                 <div className="w-20 h-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-300">
                   <Send className="w-6 h-6 rotate-45" />
                 </div>
               </div>
             </div>
             <button onClick={() => alert('提交成功')} className="w-full py-4 btn-primary rounded-2xl font-bold">提交</button>
          </div>
        ) : (
          <div className="space-y-3">
            {mockFeedbacks.map(f => (
              <div key={f.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{f.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-1">{f.date}</p>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${f.status === '已回复' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                  {f.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedback;
