
import React, { useState } from 'react';
import * as Icons from 'lucide-react';

interface Column<T> {
  header: string;
  key: keyof T | string;
  render?: (value: any, record: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  actions?: (record: T) => React.ReactNode;
  onRefresh?: () => void;
  title?: string;
}

const DataTable = <T,>({ 
  columns, 
  data, 
  loading = false, 
  actions, 
  onRefresh,
  title 
}: DataTableProps<T>) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Table Header / Toolbar */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-4">
        <div>
          {title && <h3 className="text-lg font-bold text-slate-800">{title}</h3>}
          <p className="text-xs text-slate-400 mt-1">共计 {data.length} 条数据</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={onRefresh}
            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
            title="刷新数据"
          >
            <Icons.RotateCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <div className="relative">
            <Icons.Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="快速搜索..." 
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
            />
          </div>
        </div>
      </div>

      {/* Actual Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              {columns.map((col, idx) => (
                <th 
                  key={idx} 
                  className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100"
                  style={{ width: col.width }}
                >
                  {col.header}
                </th>
              ))}
              {actions && (
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 text-right">
                  操作
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((_, j) => (
                    <td key={j} className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-full"></div></td>
                  ))}
                  {actions && <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-full"></div></td>}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-20 text-center">
                   <div className="flex flex-col items-center">
                     <Icons.Inbox className="w-12 h-12 text-slate-200 mb-2" />
                     <p className="text-slate-400">暂无数据内容</p>
                   </div>
                </td>
              </tr>
            ) : (
              data.map((record, idx) => (
                <tr key={idx} className="hover:bg-indigo-50/30 transition-colors group">
                  {columns.map((col, j) => (
                    <td key={j} className="px-6 py-4 text-sm text-slate-600">
                      {col.render ? col.render((record as any)[col.key], record) : (record as any)[col.key]}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4 text-sm text-right">
                      <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {actions(record)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Placeholder */}
      <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
         <span className="text-xs text-slate-500">显示第 1 到 {data.length} 条数据</span>
         <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-slate-200 rounded text-xs text-slate-400 cursor-not-allowed">上一页</button>
            <button className="px-3 py-1 bg-indigo-600 text-white rounded text-xs shadow-sm">1</button>
            <button className="px-3 py-1 border border-slate-200 rounded text-xs hover:bg-slate-50">下一页</button>
         </div>
      </div>
    </div>
  );
};

export default DataTable;
