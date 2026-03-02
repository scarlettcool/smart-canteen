
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Info, Heart, ShieldAlert, Ticket, ShoppingBag, Loader2 } from 'lucide-react';
import { MOCK_DISHES } from '../constants';

export const DishDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dish = MOCK_DISHES.find(d => d.id === id) || MOCK_DISHES[0];
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleOrder = () => {
    setIsProcessing(true);
    // 模拟跳转到该食堂菜单并自动选中
    setTimeout(() => {
      setIsProcessing(false);
      navigate(`/canteen/1/menu`);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white page-transition">
      {/* 沉浸式顶部图 */}
      <div className="relative h-80 shrink-0">
        <img src={dish.imageUrl} className="w-full h-full object-cover" alt={dish.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10"></div>
        
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-12 left-4 p-3 bg-white/20 text-white rounded-2xl backdrop-blur-md active:scale-90 transition-transform z-10"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <button 
          onClick={() => setIsLiked(!isLiked)}
          className={`absolute top-12 right-4 p-3 rounded-2xl backdrop-blur-md active:scale-90 transition-transform z-10 ${
            isLiked ? 'bg-red-500 text-white' : 'bg-white/20 text-white'
          }`}
        >
          <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* 内容区域 */}
      <div className="px-6 py-8 pb-32 relative -mt-8 bg-white rounded-t-[3rem] shadow-2xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">{dish.name}</h2>
            <div className="flex items-center gap-2 mt-2">
               <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-black uppercase rounded-md tracking-widest">{dish.tag}</span>
               <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">{dish.category}</span>
            </div>
          </div>
          <p className="text-blue-600 text-3xl font-black tracking-tighter">¥{dish.price.toFixed(1)}</p>
        </div>
        
        <div className="h-[1px] bg-slate-50 my-6"></div>

        <div className="space-y-8">
          <div>
            <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3">菜品简介</h4>
            <p className="text-sm text-slate-500 leading-relaxed font-bold">{dish.description}</p>
          </div>

          {/* 营养面板优化 */}
          <div className="bg-slate-50/50 p-6 rounded-[2.5rem] border border-slate-100">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-blue-400" /> 营养能量看板
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-xl font-black text-slate-800">450</p>
                <p className="text-[9px] text-slate-400 font-black uppercase mt-1">卡路里 (kcal)</p>
              </div>
              <div className="text-center border-x border-slate-100">
                <p className="text-xl font-black text-slate-800">25</p>
                <p className="text-[9px] text-slate-400 font-black uppercase mt-1">蛋白质 (g)</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-black text-slate-800">18</p>
                <p className="text-[9px] text-slate-400 font-black uppercase mt-1">碳水 (g)</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
              <ShieldAlert className="w-4 h-4 text-orange-500 shrink-0" />
              <p className="text-[10px] text-orange-700 font-black leading-tight">过敏原：含有麸质的谷物、大豆、花生制品。</p>
            </div>
            <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
              <Ticket className="w-4 h-4 text-blue-500 shrink-0" />
              <p className="text-[10px] text-blue-700 font-black leading-tight">优惠提示：支持员工“午餐满减”或“新人券”抵扣。</p>
            </div>
          </div>
        </div>
      </div>

      {/* 底部操作栏 - 与 CanteenMenu 保持一致 */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/95 backdrop-blur-md border-t border-slate-100 flex gap-4 z-50 h-28 items-center">
        <button 
          onClick={() => { alert('已收藏至心愿单'); setIsLiked(true); }} 
          className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center active:scale-95 transition-all shadow-sm"
        >
          <Heart className={`w-6 h-6 ${isLiked ? 'text-red-500 fill-current' : ''}`} />
        </button>
        <button 
          onClick={handleOrder}
          disabled={isProcessing}
          className="flex-1 h-16 btn-primary rounded-[1.8rem] font-black text-sm shadow-xl shadow-blue-200 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {isProcessing ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <ShoppingBag className="w-5 h-5" />
              立即前往订餐
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export const NoticeDetail: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white p-6 page-transition">
      <button onClick={() => navigate(-1)} className="mb-10 p-3 bg-slate-50 rounded-2xl text-slate-400 active:scale-90 transition-transform"><ChevronLeft className="w-6 h-6" /></button>
      <h1 className="text-2xl font-black text-slate-800 mb-4 leading-tight tracking-tight">关于近期餐厅供应时段调整通知</h1>
      <p className="text-[10px] text-blue-600 font-black mb-10 uppercase tracking-[0.2em] bg-blue-50 px-3 py-1 rounded-lg inline-block">后勤保障部 · 2023-10-24</p>
      
      <div className="text-base text-slate-600 font-bold leading-[1.8] space-y-6">
        <p>各位员工：</p>
        <p>为进一步优化用餐体验，提高保障效率。经后勤部研究决定，自下周一起对第一餐厅、第二餐厅的供应时段进行如下优化：</p>
        <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4 font-black text-sm text-slate-800">
          <p className="flex gap-2"><span className="text-blue-600">1.</span> 午餐高峰时段：调整为 11:30 - 13:30，增加预约专属窗口。</p>
          <p className="flex gap-2"><span className="text-blue-600">2.</span> 晚餐时段：行政楼餐厅延长至 19:30 闭餐。</p>
          <p className="flex gap-2"><span className="text-blue-600">3.</span> 宵夜窗口：仅限研发中心餐厅开放（20:00 - 22:00）。</p>
        </div>
        <p>请各位合理安排用餐时间，建议通过本应用提前预约，避开高峰拥堵。</p>
        <p className="pt-8 text-right opacity-30 text-xs font-black uppercase tracking-widest">智慧食堂运营中心</p>
      </div>
    </div>
  );
};
