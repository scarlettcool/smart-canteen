
import React, { useState } from 'react';
import * as Icons from 'lucide-react';

interface Props {
  type: 'attr' | 'dict' | 'id-rule';
}

const PeopleOptions: React.FC<Props> = ({ type }) => {
  const [loading, setLoading] = useState(false);
  const [previewId, setPreviewId] = useState('STAFF-2024-001');

  const renderContent = () => {
    switch (type) {
      case 'attr':
        return (
          <div className="space-y-6">
             <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl text-amber-700 text-xs flex items-start">
                <Icons.AlertCircle className="w-4 h-4 mr-3 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">高危提示：修改已启用的自定义属性名称可能导致历史导出数据字段对照失效。</p>
                  <p className="mt-1 opacity-80 text-[10px]">系统会自动为所有属性分配唯一 Key，修改标签不影响数据库存储，但会影响 UI 渲染顺序。</p>
                </div>
             </div>
             <div className="bg-white rounded-2xl border overflow-hidden shadow-sm">
               <table className="w-full">
                  <thead className="bg-slate-50 border-b">
                     <tr className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <th className="px-6 py-4">字段显示名称</th>
                        <th className="px-6 py-4">字段 Key</th>
                        <th className="px-6 py-4">类型</th>
                        <th className="px-6 py-4">必填</th>
                        <th className="px-6 py-4 text-right">状态</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y text-sm">
                     <tr className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-bold">餐补等级</td>
                        <td className="px-6 py-4 font-mono text-xs text-indigo-500">custom_meal_level</td>
                        <td className="px-6 py-4">下拉列表</td>
                        <td className="px-6 py-4"><Icons.Check className="w-4 h-4 text-emerald-500" /></td>
                        <td className="px-6 py-4 text-right">
                           <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[10px] font-bold">启用中</span>
                        </td>
                     </tr>
                  </tbody>
               </table>
             </div>
             <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 hover:text-indigo-600 hover:border-indigo-300 transition-all font-bold">+ 新增自定义字段 (最多 20 个)</button>
          </div>
        );
      case 'id-rule':
        return (
          <div className="max-w-3xl space-y-8">
             <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-8">
                <div className="space-y-4">
                   <h3 className="text-lg font-bold">规则配置</h3>
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-slate-400">前缀 (Prefix)</label>
                         <input type="text" defaultValue="STAFF" className="w-full border rounded-xl px-4 py-2.5 text-sm font-mono" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-slate-400">时间占位符</label>
                         <select className="w-full border rounded-xl px-4 py-2.5 text-sm">
                            <option>YYYY (4位年份)</option>
                            <option>YYYYMM (年月)</option>
                            <option>None (无时间)</option>
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-slate-400">流水号位数</label>
                         <input type="number" defaultValue={4} className="w-full border rounded-xl px-4 py-2.5 text-sm font-mono" />
                      </div>
                      <div className="space-y-2 flex flex-col justify-end pb-1">
                         <div className="flex items-center space-x-2">
                            <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-indigo-600" />
                            <span className="text-sm text-slate-600">离职后自动释放编号并回收到池</span>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="p-6 bg-slate-900 rounded-2xl flex items-center justify-between border border-slate-800">
                   <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">实时预览预览 (Next ID Preview)</p>
                      <h4 className="text-2xl font-mono font-bold text-emerald-400 mt-2 tracking-wider">STAFF-2024-001</h4>
                   </div>
                   <Icons.RefreshCw className="text-slate-700 w-8 h-8" />
                </div>

                <div className="flex gap-4">
                   <button className="flex-1 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100">保存并生效</button>
                   <button className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200">恢复出厂配置</button>
                </div>
             </div>

             <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
                <h4 className="flex items-center text-sm font-bold text-amber-800 mb-2">
                   <Icons.ShieldAlert className="w-4 h-4 mr-2" /> 并发唯一性说明
                </h4>
                <p className="text-xs text-amber-700 leading-relaxed opacity-80">
                  人员编号由后端计数器原子操作生成。预览编号仅供参考，实际入库时系统将通过 [SELECT FOR UPDATE] 锁定规则表，确保在多管理员并行导入时工号不产生冲突。
                </p>
             </div>
          </div>
        );
      case 'dict':
        return (
          <div className="grid grid-cols-12 gap-8">
             <div className="col-span-4 space-y-2">
                {['政治面貌', '教育程度', '餐补类型', '婚姻状况'].map((d, idx) => (
                  <div key={idx} className={`p-4 rounded-2xl border transition-all cursor-pointer ${idx === 2 ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-white text-slate-600 hover:border-indigo-300'}`}>
                    <div className="flex justify-between items-center">
                       <span className="text-sm font-bold">{d}</span>
                       <Icons.ChevronRight className="w-4 h-4 opacity-40" />
                    </div>
                  </div>
                ))}
                <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold text-xs mt-4">+ 新增字典</button>
             </div>
             <div className="col-span-8 bg-white rounded-3xl border shadow-sm p-8 space-y-6">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold text-slate-800">字典项配置：餐补类型</h3>
                   <button className="bg-slate-900 text-white px-4 py-1.5 rounded-lg text-xs font-bold">+ 添加项</button>
                </div>
                <div className="space-y-2">
                   {['A级补助 (全额)', 'B级补助 (80%)', '外来人员 (无)'].map((item, idx) => (
                     <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group">
                        <div className="flex items-center space-x-4">
                           <Icons.GripVertical className="w-4 h-4 text-slate-300 cursor-move" />
                           <span className="text-sm font-medium text-slate-700">{item}</span>
                        </div>
                        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button className="p-1.5 text-slate-400 hover:text-indigo-600"><Icons.Edit3 className="w-4 h-4" /></button>
                           <button className="p-1.5 text-slate-400 hover:text-red-600"><Icons.Trash2 className="w-4 h-4" /></button>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
           {type === 'attr' && '自定义属性'}
           {type === 'dict' && '数据字典'}
           {type === 'id-rule' && '编号规则'}
        </h2>
        <p className="text-sm text-slate-500 mt-1">全局基础数据配置，请审慎变更</p>
      </div>
      {renderContent()}
    </div>
  );
};

export default PeopleOptions;
