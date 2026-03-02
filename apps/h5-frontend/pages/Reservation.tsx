
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Info, Lock, MapPin, ChevronDown, Loader2, AlertCircle } from 'lucide-react';
import { MOCK_RESERVATION_DATES, MOCK_CANTEENS } from '../constants';
import { ReservationStatus } from '../types';
import { ApiService } from '../api/service';

const Reservation: React.FC = () => {
  const navigate = useNavigate();
  const [type, setType] = useState<'single' | 'batch'>('single');
  const [meal, setMeal] = useState<'breakfast' | 'lunch' | 'dinner'>('lunch');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const toggleDay = (dateStr: string, resStatus: ReservationStatus) => {
    if (resStatus !== 'available' || status === 'submitting') {
      if (resStatus === 'full') alert('【名额已满】该日期暂无名额，请选择其他日期。');
      if (resStatus === 'expired') alert('【已截止】该日期预约已关闭。');
      return;
    }
    
    if (type === 'single') {
      setSelectedDays([dateStr]);
    } else {
      setSelectedDays(prev => 
        prev.includes(dateStr) ? prev.filter(d => d !== dateStr) : [...prev, dateStr]
      );
    }
  };

  const handleSubmit = async () => {
    if (selectedDays.length === 0) return;
    setStatus('submitting');
    setErrorMsg('');
    
    // Fix: Updated property names 'mealType' and 'dates' to match ApiService.submitReservation interface
    const res = await ApiService.submitReservation({ mealType: meal, dates: selectedDays });
    
    if (res.success) {
      alert(`【预约成功】已为您成功锁定 ${selectedDays.length} 个就餐名额。`);
      navigate('/orders');
    } else {
      setStatus('error');
      setErrorMsg(res.message || '提交失败，请重试');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 page-transition pb-10">
      <div className="bg-white px-4 h-14 flex items-center border-b border-slate-100 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} disabled={status === 'submitting'}><ChevronLeft className="w-6 h-6" /></button>
        <h1 className="flex-1 text-center font-bold text-slate-800 pr-6">就餐预约</h1>
      </div>
      
      <div className="p-4">
        <div className="flex bg-slate-200/50 p-1 rounded-xl mb-6">
          {(['single', 'batch'] as const).map(t => (
            <button 
              key={t}
              disabled={status === 'submitting'}
              onClick={() => { setType(t); setSelectedDays([]); }} 
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${type === t ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
            >
              {t === 'single' ? '单次预约' : '批量预约'}
            </button>
          ))}
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 space-y-8">
          <div className="grid grid-cols-4 gap-2">
            {MOCK_RESERVATION_DATES.map(item => {
              const isSelected = selectedDays.includes(item.date);
              const isDisabled = item.status !== 'available';
              return (
                <button 
                  key={item.date} 
                  disabled={status === 'submitting'}
                  onClick={() => toggleDay(item.date, item.status)}
                  className={`h-16 rounded-2xl flex flex-col items-center justify-center border transition-all relative ${
                    isSelected ? 'bg-blue-600 text-white border-blue-600' : 
                    item.status === 'available' ? 'bg-white text-slate-700 border-slate-100 active:scale-95' : 
                    'bg-slate-50 text-slate-300 border-transparent cursor-not-allowed'
                  }`}
                >
                  <span className="text-xs font-black">{item.date}</span>
                  <span className="text-[8px] font-bold opacity-60 uppercase">{item.day}</span>
                  {!isDisabled && !isSelected && (
                     <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  )}
                  {item.status === 'full' && (
                    <span className="absolute -bottom-1 px-1 bg-red-100 text-red-500 text-[6px] font-black rounded-sm scale-90">满</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="space-y-4">
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-1">选择餐次</p>
             <div className="flex gap-2">
                {(['breakfast', 'lunch', 'dinner'] as const).map(m => (
                  <button 
                    key={m} 
                    onClick={() => setMeal(m)}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black border transition-all ${meal === m ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400'}`}
                  >
                    {m === 'breakfast' ? '早餐' : m === 'lunch' ? '午餐' : '晚餐'}
                  </button>
                ))}
             </div>
          </div>

          {status === 'error' && (
            <div className="flex items-center gap-3 p-4 bg-red-50 text-red-500 rounded-2xl animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-4 h-4" />
              <p className="text-[10px] font-black">{errorMsg}</p>
            </div>
          )}
        </div>

        <button 
          onClick={handleSubmit} 
          disabled={selectedDays.length === 0 || status === 'submitting'}
          className="mt-8 w-full py-5 btn-primary rounded-[2rem] font-black shadow-xl shadow-blue-100 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-3"
        >
          {status === 'submitting' ? <Loader2 className="w-5 h-5 animate-spin" /> : `确认预约 (${selectedDays.length})`}
        </button>
      </div>
    </div>
  );
};

export default Reservation;
