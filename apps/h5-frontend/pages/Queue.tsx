
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Scissors, Users, Timer } from 'lucide-react';

const Queue: React.FC = () => {
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<{ num: string; wait: number } | null>(null);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white px-4 h-14 flex items-center border-b border-slate-100">
        <button onClick={() => navigate(-1)}><ChevronLeft className="w-6 h-6" /></button>
        <h1 className="flex-1 text-center font-bold text-slate-800 pr-6">理发取号</h1>
      </div>

      <div className="p-4">
        {!ticket ? (
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 text-center">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Scissors className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">当前排队情况</h2>
            <div className="flex justify-center gap-8 my-8">
              <div>
                <p className="text-2xl font-black text-indigo-600">12</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">当前号码</p>
              </div>
              <div className="w-[1px] bg-slate-100"></div>
              <div>
                <p className="text-2xl font-black text-indigo-600">4</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">正在等待</p>
              </div>
            </div>
            <button onClick={() => setTicket({ num: 'A18', wait: 25 })} className="w-full py-4 btn-primary rounded-2xl font-bold">立即取号</button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white p-10 rounded-[2.5rem] border-2 border-dashed border-blue-200 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Scissors className="w-32 h-32 rotate-12" />
              </div>
              <p className="text-xs font-black text-slate-300 uppercase tracking-[0.2em] mb-4">您的号码</p>
              <h2 className="text-6xl font-black text-blue-600 mb-8">{ticket.num}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <p className="text-lg font-bold text-slate-800">{ticket.wait}</p>
                  <p className="text-[10px] text-slate-400 font-bold flex items-center justify-center gap-1">
                    <Timer className="w-3 h-3" /> 预计等待(分)
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <p className="text-lg font-bold text-slate-800">5</p>
                  <p className="text-[10px] text-slate-400 font-bold flex items-center justify-center gap-1">
                    <Users className="w-3 h-3" /> 前面人数
                  </p>
                </div>
              </div>
            </div>
            <button onClick={() => setTicket(null)} className="w-full py-4 bg-white text-red-500 rounded-2xl font-bold border border-red-50 active:bg-red-50">取消取号</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Queue;
