
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Wallet as WalletIcon, CheckCircle2, CreditCard, AlertCircle, Loader2 } from 'lucide-react';
import { ApiService } from '../api/service';

const Wallet: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'main' | 'recharge' | 'result'>('main');
  const [balance, setBalance] = useState<number>(ApiService.getBalance());
  const [rechargeAmount, setRechargeAmount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [lastTxnId, setLastTxnId] = useState('');

  useEffect(() => {
    const sync = () => setBalance(ApiService.getBalance());
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const handleRecharge = async () => {
    if (rechargeAmount <= 0 || isProcessing) return;
    setIsProcessing(true);
    setErrorMsg('');
    
    const result = await ApiService.recharge(rechargeAmount);
    
    setIsProcessing(false);
    if (result.success) {
      setLastTxnId(result.data!);
      setView('result');
    } else {
      setErrorMsg(result.message || '充值服务暂时不可用');
    }
  };

  if (view === 'result') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10 text-center animate-in zoom-in duration-300" data-testid="page-wallet-result">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-8">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">充值成功</h2>
        <div className="p-6 bg-slate-50 rounded-[2rem] w-full mb-10 text-left space-y-2 border border-slate-100">
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">流水凭证 (Evidence)</p>
           <p className="text-xs font-black text-slate-800" data-testid="txn-id">ID: {lastTxnId}</p>
           <p className="text-xs font-black text-blue-600">Amount: ¥{rechargeAmount.toFixed(2)}</p>
        </div>
        <button 
          onClick={() => navigate('/')} 
          data-testid="btn-back-home"
          className="w-full py-5 btn-primary rounded-[2rem] font-black shadow-xl shadow-blue-100"
        >返回首页</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 page-transition" data-testid="page-wallet-main">
      <div className="bg-white px-4 h-14 flex items-center border-b border-slate-100">
        <button onClick={() => view === 'main' ? navigate(-1) : setView('main')} disabled={isProcessing} data-testid="btn-back">
          <ChevronLeft className="w-6 h-6 text-slate-400" />
        </button>
        <h1 className="flex-1 text-center font-bold text-slate-800 pr-6">{view === 'main' ? '我的钱包' : '账户充值'}</h1>
      </div>

      <div className="p-4">
        {view === 'main' ? (
          <>
            <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 text-center mb-8 shadow-sm">
              <p className="text-slate-300 text-[10px] font-black uppercase tracking-widest">当前可用余额 (SOT)</p>
              <h2 className="text-6xl font-black mt-3 text-slate-800 tracking-tighter" data-testid="wallet-balance">¥{balance.toFixed(2)}</h2>
              <button 
                onClick={() => setView('recharge')} 
                data-testid="btn-go-recharge"
                className="mt-10 w-full py-5 btn-primary rounded-[2rem] font-black shadow-xl shadow-blue-100 active:scale-95 transition-all"
              >立即充值</button>
            </div>
          </>
        ) : (
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100" data-testid="page-wallet-recharge">
            <h3 className="text-[10px] text-slate-300 font-black mb-8 uppercase tracking-widest">选择充值金额</h3>
            <div className="grid grid-cols-3 gap-3 mb-10">
              {[50, 100, 300].map(val => (
                <button 
                  key={val} 
                  data-testid={`btn-amount-${val}`}
                  onClick={() => setRechargeAmount(val)}
                  disabled={isProcessing}
                  className={`py-5 rounded-2xl border-2 font-black transition-all ${rechargeAmount === val ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-50 bg-slate-50 text-slate-400'}`}
                >
                  {val}
                </button>
              ))}
            </div>
            
            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 text-red-500 rounded-2xl flex items-center gap-2 text-[10px] font-black" data-testid="error-recharge">
                <AlertCircle className="w-4 h-4" /> {errorMsg}
              </div>
            )}

            <button 
              onClick={handleRecharge}
              data-testid="btn-recharge-submit"
              disabled={rechargeAmount <= 0 || isProcessing}
              className="w-full py-5 btn-primary rounded-[2rem] font-black flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
            >
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : `支付 ¥${rechargeAmount}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;
