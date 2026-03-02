
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronRight, LogOut, ShieldCheck, User, Settings, Clock, MessageSquare, Camera, Palette, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { ThemeKey, THEMES } from '../theme/tokens';
import { ApiService } from '../api/service';

interface ProfileProps {
  currentTheme: ThemeKey;
  onThemeChange: (key: ThemeKey) => void;
}

const Profile: React.FC<ProfileProps> = ({ currentTheme, onThemeChange }) => {
  const navigate = useNavigate();
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [regStatus, setRegStatus] = useState(localStorage.getItem('reg_status') || 'none');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setRegStatus(localStorage.getItem('reg_status') || 'none');
  }, []);

  const handleLogout = async () => {
    if (!window.confirm('确定要退出当前登录并清除所有本地数据吗？')) return;
    
    setIsLoggingOut(true);
    const res = await ApiService.logout();
    
    if (res.success) {
      setTimeout(() => {
        window.location.href = '#/'; 
        window.location.reload(); 
      }, 500);
    } else {
      setIsLoggingOut(false);
      alert('退出失败，请重试');
    }
  };

  const handleAvatarAction = (type: string) => {
    setShowActionSheet(false);
    alert(`【模拟成功】已向微信容器申请${type === 'camera' ? '相机' : '相册'}权限。`);
  };

  const menu = [
    { id: 'auth', label: '权限查看', icon: <ShieldCheck />, path: '/permissions' },
    { id: 'settings', label: '修改资料', icon: <User />, path: '/profile/edit' },
    { id: 'password', label: '修改密码', icon: <Clock />, path: '/profile/password' },
    { id: 'feedback', label: '投诉建议', icon: <MessageSquare />, path: '/feedback' },
  ];

  return (
    <div className="pb-24 page-transition min-h-full bg-[var(--bg)] relative">
      {isLoggingOut && (
        <div className="fixed inset-0 z-[200] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
           <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
           <p className="text-xs font-black text-slate-400 uppercase tracking-widest">正在安全退出...</p>
        </div>
      )}

      <div className="bg-white px-6 pt-16 pb-10 rounded-b-[3.5rem] border-b border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--secondary)] rounded-full -mr-16 -mt-16 opacity-50"></div>
        <div className="flex items-center gap-6 relative z-10">
          <div className="relative">
            <div className="w-20 h-20 rounded-[2rem] bg-slate-100 overflow-hidden border-4 border-[var(--secondary)] shadow-inner">
              <img src="https://picsum.photos/200/200?random=1" className="w-full h-full object-cover" alt="avatar" />
            </div>
            <button 
              onClick={() => setShowActionSheet(true)}
              className="absolute -bottom-1 -right-1 bg-[var(--primary)] text-white p-2 rounded-xl shadow-lg border-2 border-white active:scale-90 transition-transform"
            >
              <Camera className="w-3 h-3" />
            </button>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 leading-tight">张晓明</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">NO. 2023089 · 行政处</p>
            <div className="mt-3">
              <span className={`px-3 py-1 text-[10px] font-black rounded-lg ${regStatus === 'success' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                {regStatus === 'success' ? '认证员工' : '未认证'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 mt-8">
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 mb-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-slate-800">
            <Palette className="w-4 h-4 text-[var(--primary)]" />
            <h3 className="text-sm font-black uppercase tracking-widest">UI 主题定制</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {(Object.keys(THEMES) as ThemeKey[]).map((key) => (
              <button
                key={key}
                onClick={() => onThemeChange(key)}
                className={`py-3 rounded-2xl text-[10px] font-black border-2 transition-all ${
                  currentTheme === key 
                  ? 'border-[var(--primary)] bg-[var(--secondary)] text-[var(--primary)] shadow-sm' 
                  : 'border-slate-50 bg-slate-50 text-slate-400'
                }`}
              >
                {THEMES[key].name}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm">
          {menu.map((item, i) => (
            <Link key={item.id} to={item.path} className={`flex items-center justify-between p-6 active:bg-slate-50 transition-colors ${i !== menu.length - 1 ? 'border-b border-slate-50' : ''}`}>
              <div className="flex items-center gap-4 text-slate-600">
                <div className="text-[var(--primary)] w-5 h-5">{item.icon}</div>
                <span className="text-sm font-bold">{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </Link>
          ))}
        </div>

        <button 
          onClick={handleLogout} 
          disabled={isLoggingOut}
          className="w-full mt-8 py-5 bg-white text-red-500 font-black text-sm rounded-3xl border border-red-50 flex items-center justify-center gap-3 active:bg-red-50 transition-all shadow-sm disabled:opacity-50"
        >
          <LogOut className="w-5 h-5" /> 退出当前登录
        </button>
      </div>
      
      <p className="text-center mt-12 text-[10px] text-slate-300 font-black uppercase tracking-[0.3em] pb-10">Smart Canteen Infrastructure v3.1</p>

      {showActionSheet && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-8">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowActionSheet(false)}></div>
          <div className="relative w-full max-w-sm bg-white rounded-[2.5rem] overflow-hidden animate-in slide-in-from-bottom-10 duration-300 shadow-2xl">
            <div className="p-4 border-b border-slate-50 flex justify-between items-center">
              <span className="text-xs font-black text-slate-300 uppercase tracking-widest px-4">更换头像</span>
              <button onClick={() => setShowActionSheet(false)} className="p-2 text-slate-300"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 space-y-2">
              <button className="w-full py-5 rounded-2xl flex items-center justify-center gap-3 font-bold text-slate-700 active:bg-slate-50" onClick={() => handleAvatarAction('camera')}>
                <Camera className="w-5 h-5 text-blue-600" /> 拍照上传
              </button>
              <button className="w-full py-5 rounded-2xl flex items-center justify-center gap-3 font-bold text-slate-700 active:bg-slate-50" onClick={() => handleAvatarAction('album')}>
                <ImageIcon className="w-5 h-5 text-blue-600" /> 从相册选择
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
