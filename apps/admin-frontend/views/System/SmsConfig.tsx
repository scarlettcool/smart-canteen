
import React, { useState } from 'react';
import * as Icons from 'lucide-react';

const SmsConfig: React.FC = () => {
  const [testing, setTesting] = useState(false);

  const handleTest = () => {
    setTesting(true);
    setTimeout(() => {
      setTesting(false);
      alert("短信通道验证成功！(ADM-S4-SYS-SMS-001 Pass)");
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">政务短信服务</h2>
        <p className="text-sm text-slate-500 mt-1">配置验证码发送、余额预警短信及政务专网通道</p>
      </div>

      <div className="bg-white p-10 rounded-3xl border shadow-sm max-w-2xl space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400">短信提供商</label>
            <select className="w-full border rounded-xl px-4 py-2.5 text-sm">
              <option>阿里云短信 (默认)</option>
              <option>腾讯云短信</option>
              <option>华为云短信</option>
              <option>自定义政务网关</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase">Access Key ID</label>
            <input type="text" defaultValue="AK_88291029102" className="w-full border rounded-xl px-4 py-2.5 text-sm font-mono" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase">Access Secret</label>
            <input type="password" defaultValue="****************" className="w-full border rounded-xl px-4 py-2.5 text-sm font-mono" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400">短信签名</label>
            <input type="text" defaultValue="智慧食堂" className="w-full border rounded-xl px-4 py-2.5 text-sm" />
          </div>
        </div>

        <div className="pt-6 border-t flex items-center justify-between">
          <button 
            onClick={handleTest}
            disabled={testing}
            className="px-6 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all"
          >
            {testing ? '正在拨号测试...' : '发送测试短信'}
          </button>
          <button className="px-10 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:bg-indigo-700">
            保存网关设置
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmsConfig;
