
import React, { useState } from 'react';
import { ChevronLeft, Ticket, CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react';
import { MOCK_COUPONS } from '../constants';
import { Coupon } from '../types';
import { ApiService } from '../api/service';

const Coupons: React.FC = () => {
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [code, setCode] = useState('');
  const [isActivating, setIsActivating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const handleRedeem = async () => {
    if (!code) return;
    setIsActivating(true);
    setErrorMsg('');
    
    const result = await ApiService.activateCoupon(code);
    
    setIsActivating(false);
    if (result.success) {
      alert('【激活成功】礼券已发放至您的账户');
      setCode('');
      setShowCodeInput(false);
    } else {
      setErrorMsg(result.message || '码无效或已失效');
    }
  };

  return (
    <div className="pb-24 pt-4 page-transition min-h-screen bg-slate-50">
      <div className="px-6 mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">我的礼券</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">共有 {MOCK_COUPONS.length} 张可用券</p>
        </div>
        <button 
          onClick={() => setShowCodeInput(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-100 active:scale-95 transition-transform"
        >
          激活新券
        </button>
      </div>

      <div className="px-4 space-y-6">
        {MOCK_COUPONS.length > 0 ? (
          MOCK_COUPONS.map((coupon) => (
            <div 
              key={coupon.id} 
              onClick={() => setSelectedCoupon(coupon)}
              className="flex h-36 relative group overflow-hidden bg-white shadow-sm rounded-[2.5rem] border border-slate-100 active:scale-[0.98] transition-all"
            >
              <div className="w-1/3 bg-[var(--primary)] flex flex-col items-center justify-center text-white relative">
                <span className="text-4xl font-black tracking-tighter">{coupon.value}</span>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] mt-2 opacity-70">
                  {coupon.type === 'cash' ? 'CNY 优惠' : '折 扣 券'}
                </span>
                <div className="absolute top-0 right-0 w-4 h-4 bg-slate-50 rounded-full -mr-2 -mt-2"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-slate-50 rounded-full -mr-2 -mb-2"></div>
              </div>
              
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="font-black text-slate-800 text-lg leading-tight">{coupon.title}</h3>
                  <p className="text-[9px] text-slate-300 mt-2 font-bold uppercase tracking-widest flex items-center gap-2">
                    <ClockIcon className="w-2.5 h-2.5" /> 有效期至 {coupon.expiry}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] text-slate-300 font-black uppercase tracking-widest">点击查看详情</span>
                  <button className="bg-blue-50 text-blue-600 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-90 transition-all">
                    去使用
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-24 border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center text-slate-300">
            <Ticket className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-xs font-black uppercase tracking-[0.3em]">暂无可用礼券</p>
          </div>
        )}
      </div>

      {/* 兑换码弹窗 */}
      {showCodeInput && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !isActivating && setShowCodeInput(false)}></div>
          <div className="relative w-full max-w-sm bg-white rounded-[3.5rem] p-10 animate-in zoom-in-95 duration-300 shadow-2xl">
            <h3 className="text-xl font-black text-slate-800 mb-2">激活礼券</h3>
            <p className="text-xs text-slate-400 mb-10 font-bold">请输入您获取到的 8 位激活码</p>
            
            <div className="relative mb-8">
              <input 
                disabled={isActivating}
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="例如: VIP888"
                className={`w-full bg-slate-50 p-6 rounded-3xl border-none text-center text-xl font-black tracking-[0.4em] focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-200 ${errorMsg ? 'bg-red-50 text-red-500 ring-2 ring-red-100' : ''}`}
              />
              {errorMsg && (
                <p className="absolute -bottom-7 left-0 w-full text-center text-[10px] text-red-400 font-black uppercase tracking-widest animate-in fade-in slide-in-from-top-1">
                  {errorMsg}
                </p>
              )}
            </div>

            <button 
              disabled={!code || isActivating}
              onClick={handleRedeem}
              className="w-full py-5 btn-primary rounded-[2rem] font-black shadow-xl shadow-blue-100 active:scale-95 flex items-center justify-center gap-3 transition-all"
            >
              {isActivating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  验证中...
                </>
              ) : '立即激活'}
            </button>
          </div>
        </div>
      )}

      {/* 详情弹窗 */}
      {selectedCoupon && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-12">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedCoupon(null)}></div>
          <div className="relative w-full max-w-md bg-white rounded-[3.5rem] p-10 animate-in slide-in-from-bottom-20 duration-400 shadow-2xl">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">{selectedCoupon.title}</h3>
                <p className="text-[10px] text-slate-400 font-black mt-1 uppercase">Coupon ID: {selectedCoupon.id}</p>
              </div>
              <button onClick={() => setSelectedCoupon(null)} className="p-2 text-slate-200 hover:text-slate-800 transition-colors"><X className="w-6 h-6" /></button>
            </div>
            <div className="space-y-8">
              <div>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3">详细规则</p>
                <p className="text-sm text-slate-600 font-bold leading-relaxed">{selectedCoupon.rules}</p>
              </div>
              <div className="flex gap-4 p-5 bg-blue-50/50 rounded-[2rem] border border-blue-100">
                <AlertCircle className="w-5 h-5 text-blue-500 shrink-0" />
                <p className="text-[10px] text-blue-500 leading-normal font-black uppercase tracking-tight">该券在结算时自动匹配最优方案。一旦过期将无法找回，请注意有效期。</p>
              </div>
              <button className="w-full py-5 btn-primary rounded-[2rem] font-black shadow-xl shadow-blue-100 active:scale-95" onClick={() => setSelectedCoupon(null)}>我知道了</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

export default Coupons;
