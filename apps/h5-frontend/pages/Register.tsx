
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ShieldAlert, 
  User, 
  Smartphone, 
  CreditCard, 
  Building2,
  AlertCircle,
  RefreshCcw,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { ApiService } from '../api/service';

interface RegisterProps {
  mode?: 'register' | 'edit' | 'password';
}

type RegistrationStatus = 'none' | 'pending' | 'success' | 'rejected';

const Register: React.FC<RegisterProps> = ({ mode = 'register' }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'form' | 'status'>(mode === 'register' ? 'form' : 'form');
  const [status, setStatus] = useState<RegistrationStatus>('none');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    staffId: '',
    department: '行政办公处'
  });

  const getTitle = () => {
    if (mode === 'edit') return '基本资料修改';
    if (mode === 'password') return '登录密码修改';
    return '员工注册申请';
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;
    setIsProcessing(true);
    
    // 调用 API 契约：POST /auth/register
    const res = await ApiService.submitRegistration({
      name: formData.name,
      phone: formData.phone,
      staffId: formData.staffId,
      department: formData.department
    });
    
    setIsProcessing(false);
    if (res.success) {
      if (mode === 'register') {
        setStep('status');
        setStatus('pending');
        localStorage.setItem('reg_status', 'pending');
      } else {
        alert('修改已成功保存');
        navigate('/profile');
      }
    } else {
      alert(res.message || '申请提交失败，请重试');
    }
  };

  const simulateAuditResult = (result: 'success' | 'rejected') => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStatus(result);
      localStorage.setItem('reg_status', result);
    }, 800);
  };

  useEffect(() => {
    if (mode === 'register') {
      const savedStatus = localStorage.getItem('reg_status') as RegistrationStatus;
      if (savedStatus && savedStatus !== 'none') {
        setStatus(savedStatus);
        setStep('status');
      }
    }
  }, [mode]);

  if (step === 'status') {
    return (
      <div className="min-h-screen bg-white page-transition flex flex-col" data-testid="page-register-status">
        <div className="bg-white px-4 h-14 flex items-center border-b border-slate-50 shrink-0">
          <button onClick={() => navigate('/')} data-testid="btn-back"><ChevronLeft className="w-6 h-6 text-slate-400" /></button>
          <h1 className="flex-1 text-center font-bold text-slate-800 pr-6">申请进度查询</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pt-12 pb-20">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-10 w-24 h-24 flex items-center justify-center">
              <div className={`absolute inset-0 rounded-full scale-[1.6] opacity-10 animate-pulse ${
                status === 'pending' ? 'bg-orange-500' : 
                status === 'success' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              
              {status === 'pending' && <Clock className="w-20 h-20 text-orange-500 relative z-10" />}
              {status === 'success' && <CheckCircle2 className="w-20 h-20 text-green-500 relative z-10" />}
              {status === 'rejected' && <XCircle className="w-20 h-20 text-red-500 relative z-10" />}
            </div>
            
            <h2 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">
              {status === 'pending' && '申请审核中'}
              {status === 'success' && '审核已通过'}
              {status === 'rejected' && '申请被驳回'}
            </h2>
            
            <p className="text-sm text-slate-400 leading-relaxed px-4 font-medium">
              {status === 'pending' && '资料已提交至后勤保障部，预计在24小时内完成身份信息校验。'}
              {status === 'success' && '身份核验成功！您现在可以正常使用餐厅预约、点餐以及钱包充值功能。'}
              {status === 'rejected' && '很抱歉，您的员工身份核验未能通过，请查看下方原因并修正资料。'}
            </p>

            {status === 'rejected' && (
              <div className="mt-8 w-full bg-red-50 p-5 rounded-3xl border border-red-100 flex gap-4 text-left">
                <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-black text-red-600 uppercase tracking-widest mb-1">驳回原因详情</p>
                  <p className="text-xs text-red-500/80 leading-relaxed font-bold">
                    [资料不符] 填写的姓名与工号不匹配，请核对后重试。
                  </p>
                </div>
              </div>
            )}

            <div className="mt-10 w-full bg-slate-50 border border-slate-100 rounded-[2.5rem] p-6 space-y-4">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-300">
                <span>提交信息记录</span>
                <span>ID: REQ-08221</span>
              </div>
              <div className="space-y-3 px-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-bold">姓名</span>
                  <span className="text-slate-800 font-black" data-testid="status-name">{formData.name || '张晓明'}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-bold">部门</span>
                  <span className="text-slate-800 font-black">{formData.department}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 space-y-4">
            {status === 'pending' && (
              <div className="flex gap-3">
                <button 
                  onClick={() => simulateAuditResult('success')} 
                  data-testid="btn-mock-pass"
                  className="flex-1 py-4 bg-green-500 text-white rounded-2xl font-black text-xs shadow-lg active:scale-95 transition-all"
                >模拟通过</button>
                <button 
                  onClick={() => simulateAuditResult('rejected')} 
                  data-testid="btn-mock-fail"
                  className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black text-xs shadow-lg active:scale-95 transition-all"
                >模拟驳回</button>
              </div>
            )}

            {status === 'success' && (
              <button 
                onClick={() => navigate('/')} 
                data-testid="btn-enter-app"
                className="w-full py-5 btn-primary rounded-[2rem] font-black text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                进入系统 <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {status === 'rejected' && (
              <button 
                onClick={() => setStep('form')} 
                data-testid="btn-retry-register"
                className="w-full py-5 bg-white text-slate-800 border border-slate-100 rounded-[2rem] font-black text-sm active:bg-slate-50 flex items-center justify-center gap-3 transition-all"
              >
                <RefreshCcw className="w-4 h-4 text-blue-600" /> 修改资料重新提交
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 page-transition flex flex-col" data-testid="page-register-form">
      <div className="bg-white px-4 h-14 flex items-center border-b border-slate-100 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} data-testid="btn-back"><ChevronLeft className="w-6 h-6 text-slate-400" /></button>
        <h1 className="flex-1 text-center font-bold text-slate-800 pr-6">{getTitle()}</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="flex-1 p-4 space-y-6 overflow-y-auto pb-10">
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <div className="px-1">
            <h3 className="text-sm font-black text-slate-800 mb-1">员工实名核验</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">身份资料需经由后勤管理系统离线比对</p>
          </div>

          <div className="space-y-5">
            <div className="group">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2 px-1">
                <User className="w-3 h-3" /> 真实姓名
              </label>
              <input 
                required 
                data-testid="input-name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="请输入中文姓名" 
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-100 outline-none transition-all" 
              />
            </div>
            <div className="group">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2 px-1">
                <Smartphone className="w-3 h-3" /> 联系电话
              </label>
              <input 
                required 
                data-testid="input-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="请输入手机号" 
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-100 outline-none transition-all" 
              />
            </div>
            <div className="group">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2 px-1">
                <CreditCard className="w-3 h-3" /> 员工编号
              </label>
              <input 
                required 
                data-testid="input-staffid"
                value={formData.staffId}
                onChange={(e) => handleInputChange('staffId', e.target.value)}
                placeholder="8位数字编号" 
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-100 outline-none transition-all" 
              />
            </div>
          </div>
        </div>

        <div className="pt-4 px-2">
          <button 
            type="submit" 
            data-testid="btn-register-submit"
            disabled={isProcessing}
            className="w-full py-5 btn-primary rounded-[2rem] font-black text-sm shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : (mode === 'register' ? '立即提交注册申请' : '确认保存修改')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
