
import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import DataTable from '../../components/Common/DataTable';

const NoticeManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'notices' | 'announcements'>('announcements');
  const items = [
    { id: 'ANN-01', title: '关于清明节期间食堂暂停供应的通知', date: '2024-03-24', author: '后勤办', status: 'published' },
    { id: 'ANN-02', title: '新增称重计费模式操作指引', date: '2024-03-22', author: '技术中心', status: 'draft' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">通知与公告管理</h2>
          <p className="text-sm text-slate-500 mt-1">管理微信端弹窗公告与系统模版消息</p>
        </div>
        <button className="px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg flex items-center">
          <Icons.Megaphone className="w-4 h-4 mr-2" />
          发布新内容
        </button>
      </div>

      <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
        <button 
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'announcements' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}
        >门户公告</button>
        <button 
          onClick={() => setActiveTab('notices')}
          className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'notices' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}
        >模版消息 (SMS/WX)</button>
      </div>

      <DataTable 
        columns={[
          { header: '标题', key: 'title', width: '400px' },
          { header: '发布日期', key: 'date' },
          { header: '发布人', key: 'author' },
          { 
            header: '状态', 
            key: 'status',
            render: (v) => v === 'published' ? <span className="text-emerald-600 font-bold">已发布</span> : <span className="text-slate-400">草稿</span>
          }
        ]}
        data={items}
        actions={() => (
          <div className="flex space-x-2">
            <button className="text-slate-400 hover:text-indigo-600"><Icons.Edit3 className="w-4 h-4" /></button>
            <button className="text-slate-400 hover:text-rose-600"><Icons.Trash2 className="w-4 h-4" /></button>
          </div>
        )}
      />
    </div>
  );
};

export default NoticeManagement;
