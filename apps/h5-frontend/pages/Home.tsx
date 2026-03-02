
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scan, ChevronRight, Calendar, UtensilsCrossed, ListOrdered, Wallet as WalletIcon, QrCode, X, ShieldAlert, Lock } from 'lucide-react';
import { MOCK_SPECIALS } from '../constants';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [showQR, setShowQR] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [balance, setBalance] = useState('0.00');
  const [regStatus, setRegStatus] = useState(localStorage.getItem('reg_status') || 'none');

  useEffect(() => {
    const update = () => {
      setBalance(localStorage.getItem('user_balance') || '245.50');
      setRegStatus(localStorage.getItem('reg_status') || 'none');
    };
    update();
    window.addEventListener('storage', update);
    return () => window.removeEventListener('storage', update);
  }, []);

  // 动作预检：支付相关功能必须实名
  const checkAuth = (action: () => void) => {
    if (regStatus !== 'success') {
      alert('【实名拦截】当前功能仅限已认证员工使用。');
      navigate('/register');
      return;
    }
    action();
  };

  const handleScan = () => {
    checkAuth(() => {
      setIsScanning(true);
      setTimeout(() => {
        setIsScanning(false);
        alert('【识别成功】已对接消费终端，请在设备屏幕确认支付金额。');
      }, 2000);
    });
  };

  const actions = [
    { id: 'res', label: '就餐预约', icon: <Calendar />, path: '/reservation', color: 'bg-blue-50 text-blue-600', auth: false },
    { id: 'dine', label: '堂食点餐', icon: <UtensilsCrossed />, path: '/canteen/select', color: 'bg-orange-50 text-orange-600', auth: true },
    { id: 'queue', label: '排号取号', icon: <ListOrdered />, path: '/queue', color: 'bg-indigo-50 text-indigo-600', auth: false },
    { id: 'wallet', label: '我的钱包', icon: <WalletIcon />, path: '/wallet', color: 'bg-emerald-50 text-emerald-600', auth: true },
  ];

  return (
    <div className="pb-28 page-transition min-h-full bg-[var(--bg)] flex flex-col relative">
      {/* 顶部钱包卡片 */}
      <div className="px-4 pt-6 pb-4 shrink-0">
        <div className="bg-[var(--primary)] rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-900/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 transition-transform group-hover:scale-110 duration-700"></div>

          <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
              <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">账户可用余额 (CNY)</p>
              <h2 className="text-5xl font-black mt-2 tracking-tighter">
                {regStatus === 'success' ? balance : '****'}
              </h2>
            </div>
            <button onClick={handleScan} className="bg-white/10 hover:bg-white/20 p-4 rounded-3xl backdrop-blur-md transition-all active:scale-90 shadow-lg">
              <Scan className="w-7 h-7" />
            </button>
          </div>

          <div className="flex gap-4 relative z-10">
            <button
              onClick={() => checkAuth(() => setShowQR(true))}
              className="flex-1 bg-white text-[var(--primary)] font-black py-4 rounded-2xl text-center text-xs shadow-sm active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              <QrCode className="w-4 h-4" /> 付款码
            </button>
            <button
              onClick={() => checkAuth(() => navigate('/wallet'))}
              className="flex-1 bg-white/20 text-white font-black py-4 rounded-2xl text-center border border-white/20 text-xs active:scale-95 transition-transform"
            >
              快捷充值
            </button>
          </div>

          {regStatus !== 'success' && (
            <div onClick={() => navigate('/register')} className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between text-[10px] font-bold text-white/60 cursor-pointer">
              <span className="flex items-center gap-2"><ShieldAlert className="w-3 h-3 text-orange-400" /> 未认证员工账号，部分功能锁定</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          )}
        </div>
      </div>

      {/* 金刚区 */}
      <div className="px-4 py-8 grid grid-cols-4 gap-6 shrink-0">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => action.auth ? checkAuth(() => navigate(action.path)) : navigate(action.path)}
            className="flex flex-col items-center group relative"
          >
            <div className={`${action.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-sm group-active:scale-90 transition-all`}>
              {/* Added <any> to React.ReactElement to resolve type error when cloning with className */}
              {React.cloneElement(action.icon as React.ReactElement<any>, { className: 'w-6 h-6' })}
            </div>
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider">{action.label}</span>
            {action.auth && regStatus !== 'success' && (
              <div className="absolute top-0 right-1 w-5 h-5 bg-slate-800 text-white rounded-full flex items-center justify-center scale-75 border-2 border-white">
                <Lock className="w-2.5 h-2.5" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* 祈福Banner */}
      <div className="px-4 mt-2 shrink-0">
        <button
          onClick={() => navigate('/prayer')}
          className="w-full rounded-[2rem] overflow-hidden relative flex items-center gap-5 p-5 active:scale-98 transition-transform"
          style={{ background: 'linear-gradient(135deg, #1a0a00 0%, #3d1a02 50%, #2d1200 100%)' }}
        >
          {/* Glow effects */}
          <div className="absolute inset-0 opacity-40" style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(212,160,23,0.3) 0%, transparent 60%)' }} />
          <div className="absolute top-1 right-4 text-2xl opacity-60">🏮</div>
          <div className="absolute bottom-1 right-12 text-xl opacity-40">🌸</div>
          {/* Icon */}
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 relative"
            style={{ background: 'rgba(212,160,23,0.15)', border: '1px solid rgba(212,160,23,0.3)' }}
          >
            <span className="text-2xl">🙏</span>
          </div>
          {/* Text */}
          <div className="flex-1 text-left">
            <p className="text-amber-300 font-black text-sm tracking-wide">祈福拜神 · 掷杯问卦</p>
            <p className="text-amber-300/40 text-[10px] font-bold mt-0.5">点燃心香，许愿祈福，求取签文</p>
          </div>
          <ChevronRight className="w-4 h-4 text-amber-500/60 flex-shrink-0" />
        </button>
      </div>

      {/* 公告栏 */}
      <div className="px-4 shrink-0">
        <Link to="/notice/1" className="px-6 py-5 bg-white border border-slate-100 rounded-[2rem] flex items-center gap-4 active:bg-slate-50 transition-colors shadow-sm">
          <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-[10px] font-black rounded-md">公告</span>
          <p className="text-xs text-slate-600 truncate flex-1 font-bold">关于理餐系统升级及余额结转的通知</p>
          <ChevronRight className="w-4 h-4 text-slate-300" />
        </Link>
      </div>

      {/* 今日推荐 */}
      <div className="px-4 mt-10 flex-1">
        <div className="flex justify-between items-end mb-6 px-2">
          <h3 className="text-xl font-black text-slate-800 tracking-tight">今日推荐</h3>
          <button onClick={() => checkAuth(() => navigate('/canteen/select'))} className="text-[10px] text-[var(--primary)] font-black uppercase tracking-widest">
            全部菜单 <ChevronRight className="w-3 h-3 inline-block -mt-1" />
          </button>
        </div>
        <div className="space-y-4">
          {MOCK_SPECIALS.map((dish) => (
            <div key={dish.id} onClick={() => checkAuth(() => navigate(`/dish/${dish.id}`))} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 flex h-36 active:bg-slate-50 transition-all shadow-sm cursor-pointer">
              <img src={dish.imageUrl} alt={dish.name} className="w-36 h-full object-cover" />
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <h4 className="font-black text-slate-800 text-lg leading-none">{dish.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-2 line-clamp-2 leading-relaxed font-bold">{dish.description}</p>
                </div>
                <div className="flex justify-between items-end">
                  <p className="text-[var(--primary)] font-black text-xl leading-none">¥{dish.price.toFixed(1)}</p>
                  <span className="text-[10px] px-4 py-1.5 bg-[var(--secondary)] text-[var(--primary)] rounded-full font-black uppercase tracking-widest">详情</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 全屏扫描蒙层 */}
      {isScanning && (
        <div className="fixed inset-0 z-[110] bg-black flex flex-col items-center justify-center p-10 animate-in fade-in duration-500">
          <div className="w-full max-w-xs aspect-square border-2 border-blue-500 rounded-[2.5rem] relative overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.3)]">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,1)] animate-scan"></div>
            <div className="absolute inset-0 bg-blue-500/5 backdrop-blur-[2px]"></div>
            {/* 四角装饰 */}
            <div className="absolute top-6 left-6 w-8 h-8 border-t-4 border-l-4 border-blue-500"></div>
            <div className="absolute top-6 right-6 w-8 h-8 border-t-4 border-r-4 border-blue-500"></div>
            <div className="absolute bottom-6 left-6 w-8 h-8 border-b-4 border-l-4 border-blue-500"></div>
            <div className="absolute bottom-6 right-6 w-8 h-8 border-b-4 border-r-4 border-blue-500"></div>
          </div>
          <p className="mt-12 text-white font-black text-sm tracking-[0.4em] uppercase animate-pulse">正在对准消费终端扫描窗</p>
          <button onClick={() => setIsScanning(false)} className="mt-20 px-10 py-4 bg-white/10 border border-white/20 rounded-full text-white text-xs font-black uppercase tracking-widest active:scale-95 transition-transform">
            取消扫描
          </button>
        </div>
      )}

      {/* 付款码弹窗 */}
      {showQR && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setShowQR(false)}></div>
          <div className="relative w-full max-w-sm bg-white rounded-[3.5rem] p-10 animate-in zoom-in-95 duration-300 text-center shadow-2xl">
            <button onClick={() => setShowQR(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-800 transition-colors"><X /></button>
            <h3 className="text-xl font-black text-slate-800 mb-2">员工付款码</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-8">NO. 2023089 · 动态更新</p>
            <div className="bg-slate-50 p-8 rounded-[3rem] aspect-square flex items-center justify-center mb-8 border border-slate-100">
              <QrCode className="w-full h-full text-slate-800 opacity-90 p-4" strokeWidth={1.5} />
            </div>
            <div className="bg-blue-50 p-4 rounded-2xl flex items-center justify-center gap-3 mb-4">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">该码仅供食堂窗口扣款使用</p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan {
          position: absolute;
          animation: scan 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

// 补全缺少的图标
const ShieldCheck = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></svg>
);

export default Home;
