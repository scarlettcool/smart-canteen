
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Calendar, MapPin, Clock, AlertTriangle, XCircle, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { MOCK_CANTEENS } from '../constants';
import { ApiService } from '../api/service';

const ReservationDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [viewStatus, setViewStatus] = useState<'pending' | 'cancelled' | 'completed'>('pending');
  const [actionStatus, setActionStatus] = useState<'idle' | 'processing' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const canteen = MOCK_CANTEENS[0];

  const handleCancel = async () => {
    if (!window.confirm('确定要取消本次预约吗？取消后名额将释放，且无法撤回。')) return;
    
    setActionStatus('processing');
    setErrorMsg('');
    
    const res = await ApiService.cancelReservation(id || 'default');
    
    if (res.success) {
      setViewStatus('cancelled');
      setActionStatus('idle');
    } else {
      setActionStatus('error');
      setErrorMsg(res.message || '取消失败，请稍后重试');
    }
  };

  const getStatusIcon = () => {
    switch (viewStatus) {
      case 'pending': return <Clock className="w-12 h-12 text-orange-500" />;
      case 'cancelled': return <XCircle className="w-12 h-12 text-slate-300" />;
      case 'completed': return <CheckCircle2 className="w-12 h-12 text-green-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 page-transition">
      <div className="bg-white px-4 h-14 flex items-center border-b border-slate-100 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} disabled={actionStatus === 'processing'}><ChevronLeft className="w-6 h-6" /></button>
        <h1 className="flex-1 text-center font-bold text-slate-800 pr-6">预约详情</h1>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex flex-col items-center text-center shadow-sm">
          <div className="mb-4">{getStatusIcon()}</div>
          <h2 className="text-xl font-black text-slate-800">{viewStatus === 'pending' ? '待就餐' : viewStatus === 'cancelled' ? '已取消' : '已完成'}</h2>
          <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">预约单号: RES-{id || '2023102401'}</p>
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">就餐食堂</p>
              <p className="text-sm font-bold text-slate-800">{canteen.name}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{canteen.location}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">预约时间</p>
              <p className="text-sm font-bold text-slate-800">2023-10-26 (周四)</p>
              <p className="text-[10px] text-slate-400 mt-0.5">午餐时段 11:30 - 13:30</p>
            </div>
          </div>
        </div>

        {actionStatus === 'error' && (
          <div className="p-4 bg-red-50 rounded-2xl flex items-center gap-3 text-red-500 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p className="text-[10px] font-black">{errorMsg}</p>
          </div>
        )}

        {viewStatus === 'pending' && (
          <div className="bg-orange-50 p-4 rounded-2xl flex gap-3 text-orange-600">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p className="text-[11px] leading-relaxed font-medium">温馨提示：请准时到达。取消操作需在开餐前1小时完成，逾期失约可能影响信用分。</p>
          </div>
        )}

        <div className="pt-6">
          {viewStatus === 'pending' ? (
            <button 
              onClick={handleCancel}
              disabled={actionStatus === 'processing'}
              className="w-full py-5 bg-white text-red-500 border border-red-50 rounded-[2rem] font-black text-sm active:bg-red-50 transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {actionStatus === 'processing' ? <Loader2 className="w-5 h-5 animate-spin" /> : '取消预约'}
            </button>
          ) : (
            <button 
              onClick={() => navigate('/reservation')}
              className="w-full py-5 btn-primary rounded-[2rem] font-black text-sm shadow-xl shadow-blue-100 active:scale-95 transition-all"
            >
              再次预约
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationDetail;
