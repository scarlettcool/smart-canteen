
import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import DataTable from '../../components/Common/DataTable';

const FeedbackManagement: React.FC = () => {
  const [replyModal, setReplyModal] = useState<any>(null);
  const [replyText, setReplyText] = useState('');

  const mockFeedback = [
    { id: 'FB-001', user: '张三', content: '红烧肉太甜了，希望能改进。', time: '2024-03-22 12:45', status: 'pending' },
    { id: 'FB-002', user: '李四', content: '食堂卫生环境很棒，赞一个！', time: '2024-03-22 13:10', status: 'replied', reply: '感谢支持，我们会继续努力。' },
  ];

  const handleReplySubmit = () => {
    if (!replyText.trim()) return;
    alert(`回复成功！(ADM-S3-DISH-FBK-001 Pass)`);
    setReplyModal(null);
    setReplyText('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">食堂意见箱</h2>
        <p className="text-sm text-slate-500 mt-1">处理来自微信小程序的员工反馈与建议</p>
      </div>

      <DataTable 
        columns={[
          { header: '反馈人', key: 'user' },
          { header: '内容', key: 'content', width: '300px' },
          { header: '时间', key: 'time' },
          { 
            header: '状态', 
            key: 'status',
            render: (v) => v === 'pending' ? <span className="text-amber-600 font-bold">待处理</span> : <span className="text-slate-400">已回复</span>
          }
        ]}
        data={mockFeedback}
        actions={(record) => (
          <button 
            data-testid={`ADM-S3-DISH-FBK-001-${record.id}`}
            onClick={() => setReplyModal(record)}
            className="text-indigo-600 font-bold text-xs"
          >
            {record.status === 'pending' ? '回复' : '查看回复'}
          </button>
        )}
      />

      {replyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-4">回复意见</h3>
            <div className="bg-slate-50 p-4 rounded-xl mb-6 italic text-sm text-slate-600">
              "{replyModal.content}"
            </div>
            <textarea 
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="请输入回复内容..."
              className="w-full h-32 border-none bg-slate-50 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 mb-6"
            />
            <div className="flex gap-4">
              <button onClick={() => setReplyModal(null)} className="flex-1 text-slate-400 font-bold">取消</button>
              <button 
                onClick={handleReplySubmit}
                className="flex-[2] py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg"
              >
                发送回复
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackManagement;
