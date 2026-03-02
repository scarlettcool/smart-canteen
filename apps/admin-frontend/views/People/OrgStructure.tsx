
import React, { useState } from 'react';
import * as Icons from 'lucide-react';

interface DeptNode {
  id: string;
  name: string;
  manager?: string;
  memberCount: number;
  children?: DeptNode[];
}

const mockOrgData: DeptNode[] = [
  {
    id: 'root',
    name: '智慧食堂总局',
    memberCount: 245,
    children: [
      {
        id: '1',
        name: '行政办公中心',
        manager: '刘建国',
        memberCount: 32,
        children: [
          { id: '1-1', name: '秘书处', manager: '王芳', memberCount: 8 },
          { id: '1-2', name: '后勤部', manager: '张大勇', memberCount: 24 },
        ]
      },
      {
        id: '2',
        name: '技术开发中心',
        manager: '陈明',
        memberCount: 120,
        children: [
          { id: '2-1', name: '研发一站', manager: '李四', memberCount: 60 },
          { id: '2-2', name: '研发二站', manager: '王五', memberCount: 60 },
        ]
      },
    ]
  }
];

const OrgStructure: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState<DeptNode>(mockOrgData[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const OrgNode: React.FC<{ node: DeptNode; level: number }> = ({ node, level }) => {
    const [expanded, setExpanded] = useState(true);
    const hasChildren = node.children && node.children.length > 0;
    const isActive = selectedDept.id === node.id;

    return (
      <div className="select-none">
        <div 
          onClick={() => setSelectedDept(node)}
          className={`flex items-center py-2 px-3 rounded-lg cursor-pointer transition-colors group mb-0.5 ${isActive ? 'bg-indigo-50 text-indigo-700 font-bold' : 'hover:bg-slate-100 text-slate-700'}`}
          style={{ paddingLeft: `${level * 1.25 + 0.5}rem` }}
        >
          <button 
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            className={`mr-2 p-0.5 rounded transition-transform ${!hasChildren && 'invisible'}`}
          >
            <Icons.ChevronRight className={`w-3 h-3 transition-transform ${expanded ? 'rotate-90' : ''}`} />
          </button>
          {level === 0 ? <Icons.Building2 className="w-4 h-4 mr-2 text-indigo-500" /> : <Icons.Folder className="w-4 h-4 mr-2 text-slate-400" />}
          <span className="truncate flex-1 text-sm">{node.name}</span>
          <span className="text-[10px] text-slate-400 bg-white/50 px-1.5 py-0.5 rounded-full border border-slate-100">{node.memberCount}</span>
        </div>
        {expanded && hasChildren && (
          <div>{node.children?.map(child => <OrgNode key={child.id} node={child} level={level + 1} />)}</div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">组织架构管理</h2>
          <p className="text-sm text-slate-500 mt-1">维护层级关系、负责人及人员归属</p>
        </div>
        <div className="flex space-x-2">
           <button 
             onClick={() => setShowHistory(true)}
             className="px-4 py-2 border rounded-lg text-sm flex items-center hover:bg-slate-50"
           >
             <Icons.History className="w-4 h-4 mr-2" /> 变更历史
           </button>
           <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-100">
             + 新增部门
           </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl border p-4 shadow-sm min-h-[600px] flex flex-col">
           <div className="relative mb-4">
             <Icons.Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <input type="text" placeholder="搜索名称..." className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border-none rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500" />
           </div>
           <div className="flex-1 overflow-y-auto">
             {mockOrgData.map(root => <OrgNode key={root.id} node={root} level={0} />)}
           </div>
        </div>

        <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col">
           <div className="p-6 border-b flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center space-x-4">
                 <div className="w-10 h-10 bg-white border rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                    <Icons.Briefcase className="w-5 h-5" />
                 </div>
                 <div>
                    <h3 className="font-bold text-slate-800">{selectedDept.name}</h3>
                    <p className="text-xs text-slate-400">组织 ID: {selectedDept.id}</p>
                 </div>
              </div>
              <div className="flex items-center space-x-2">
                {!isEditing ? (
                  <button onClick={() => setIsEditing(true)} className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-lg hover:bg-indigo-100">编辑</button>
                ) : (
                  <div className="flex space-x-1">
                    <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 text-xs text-slate-400 font-bold">取消</button>
                    <button onClick={() => {alert('保存成功'); setIsEditing(false);}} className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg">保存</button>
                  </div>
                )}
                <button className="p-1.5 text-slate-300 hover:text-red-500 rounded-lg"><Icons.Trash2 className="w-5 h-5" /></button>
              </div>
           </div>

           <div className="p-8 space-y-8 flex-1">
              <div className="grid grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">部门名称</label>
                    <input disabled={!isEditing} type="text" defaultValue={selectedDept.name} className="w-full bg-slate-50 border-none rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">部门主管 (负责人)</label>
                    <div className="flex space-x-2">
                       <input disabled={!isEditing} type="text" defaultValue={selectedDept.manager || '未设置'} className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60" />
                       {isEditing && <button className="px-3 border rounded-xl hover:bg-slate-50"><Icons.UserCheck className="w-4 h-4 text-slate-400" /></button>}
                    </div>
                 </div>
              </div>

              <section>
                 <h4 className="text-xs font-bold text-slate-800 border-l-4 border-indigo-600 pl-3 mb-4">成员概况</h4>
                 <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between border border-dashed border-slate-200">
                    <div className="flex -space-x-2">
                       {[1,2,3,4].map(i => <img key={i} src={`https://picsum.photos/100/100?random=${i}`} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" alt="m" />)}
                       <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] text-slate-500">+{selectedDept.memberCount-4}</div>
                    </div>
                    <button className="text-xs font-bold text-indigo-600 hover:underline">查看所有成员档案</button>
                 </div>
              </section>

              <section>
                 <h4 className="text-xs font-bold text-slate-800 border-l-4 border-indigo-600 pl-3 mb-4">直属子部门</h4>
                 <div className="grid grid-cols-2 gap-4">
                    {selectedDept.children?.map(child => (
                      <div key={child.id} className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-indigo-200 transition-colors flex items-center justify-between group">
                         <div className="flex items-center space-x-3">
                            <Icons.Folder className="w-4 h-4 text-slate-300 group-hover:text-indigo-500" />
                            <span className="text-sm font-medium">{child.name}</span>
                         </div>
                         <span className="text-[10px] text-slate-400">{child.memberCount} 人</span>
                      </div>
                    ))}
                    <button className="p-3 border-2 border-dashed border-slate-100 rounded-xl text-xs text-slate-400 hover:bg-slate-50 transition-all">+ 新增子部门</button>
                 </div>
              </section>
           </div>
        </div>
      </div>

      {/* 历史记录侧滑 */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md h-full shadow-2xl animate-slideInRight flex flex-col p-8">
             <div className="flex justify-between items-center mb-8">
               <h3 className="text-xl font-bold">变更历史</h3>
               <button onClick={() => setShowHistory(false)}><Icons.X className="text-slate-400" /></button>
             </div>
             <div className="space-y-6 overflow-y-auto pr-2">
                {[1,2,3].map(i => (
                  <div key={i} className="flex space-x-4">
                     <div className="w-px bg-slate-100 h-full relative">
                        <div className="absolute top-1 -left-1 w-2 h-2 rounded-full bg-indigo-500"></div>
                     </div>
                     <div className="pb-6">
                        <p className="text-sm font-bold text-slate-800">调整部门负责人</p>
                        <p className="text-xs text-slate-500 mt-1">由 [刘建国] 变更为 [张大勇]</p>
                        <div className="mt-2 flex items-center text-[10px] text-slate-400">
                           <Icons.Clock className="w-3 h-3 mr-1" /> 2024-03-20 14:20 · 管理员 (Admin)
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrgStructure;
