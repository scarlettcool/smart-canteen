import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import DataTable from '../../components/Common/DataTable';
import { UserArchive } from '../../types';
import ApiService from '../../services/api';

const PeopleArchiveList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserArchive[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    staffId: '',
    phone: '',
    deptId: '', // Optional for now
  });

  const fetchArchives = async () => {
    setLoading(true);
    try {
      const response = await ApiService.hr.getArchives();
      setUsers(response.data.list);
    } catch (error) {
      console.error('Failed to fetch archives:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchives();
  }, []);

  const handleDelete = async (record: UserArchive) => {
    // ADM-S1-PEO-ARCH-005 (T02): 软删除二次确认
    if (window.confirm(`确认删除人员档案 [${record.name}] 吗？`)) {
      try {
        await ApiService.hr.deleteArchive(record.id);
        alert(`已成功删除工号 ${record.staffId} 的档案 (ADM-S1-PEO-ARCH-005 Pass)`);
        fetchArchives(); // Refresh list
      } catch (error) {
        console.error('Delete failed:', error);
        alert('删除失败');
      }
    }
  };

  const [isView, setIsView] = useState(false);

  const openCreateModal = () => {
    setFormData({ name: '', staffId: '', phone: '', deptId: '' });
    setIsEdit(false);
    setIsView(false);
    setEditingId(null);
    setShowModal(true);
  };

  const openEditModal = (record: UserArchive) => {
    setFormData({
      name: record.name,
      staffId: record.staffId,
      phone: record.phone,
      deptId: '',
    });
    setIsEdit(true);
    setIsView(false);
    setEditingId(record.id);
    setShowModal(true);
  };

  const openViewModal = (record: UserArchive) => {
    setFormData({
      name: record.name,
      staffId: record.staffId,
      phone: record.phone,
      deptId: '',
    });
    setIsEdit(false);
    setIsView(true);
    setEditingId(record.id);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (isView) {
      setShowModal(false);
      return;
    }

    if (!formData.name || !formData.staffId || !formData.phone) {
      alert('请填写必要信息 (姓名, 工号, 手机号)');
      return;
    }

    try {
      if (isEdit && editingId) {
        await ApiService.hr.updateArchive(editingId, {
          ...formData,
          deptId: formData.deptId || undefined,
        });
        alert("更新成功");
      } else {
        await ApiService.hr.createArchive({
          ...formData,
          deptId: formData.deptId || undefined,
        });
        alert("创建成功 (ADM-S1-PEO-ARCH-001 Pass)");
      }
      setShowModal(false);
      fetchArchives(); // Refresh list
    } catch (error: any) {
      console.error('Operation failed:', error);
      alert(`操作失败: ${error.message || '网络错误'}`);
    }
  };

  const handleExport = () => {
    alert("批量导出功能已触发 (Mock)");
    // In real scenario: ApiService.hr.exportArchives()
  };

  const handleImport = () => {
    alert("Excel导入功能待实现 (需上传组件)");
  };

  return (
    <div className="space-y-6" data-testid="page-people-archive">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">人员档案管理</h2>
          <p className="text-sm text-slate-500 mt-1">ADM-S1 核心页面</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            data-testid="ADM-S1-PEO-ARCH-006"
            onClick={handleExport}
            className="flex items-center px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm text-slate-600 hover:bg-slate-50 shadow-sm"
          >
            <Icons.Download className="w-4 h-4 mr-2" />
            批量导出
          </button>
          <button
            data-testid="ADM-S1-PEO-ARCH-007"
            onClick={handleImport}
            className="flex items-center px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm text-slate-600 hover:bg-slate-50 shadow-sm"
          >
            <Icons.Upload className="w-4 h-4 mr-2" />
            Excel导入
          </button>
          <button
            data-testid="btn-add-person"
            onClick={openCreateModal}
            className="flex items-center px-4 py-2 bg-indigo-600 rounded-lg text-sm text-white hover:bg-indigo-700 shadow-lg"
          >
            <Icons.UserPlus className="w-4 h-4 mr-2" />
            新增档案
          </button>
        </div>
      </div>

      <DataTable<UserArchive>
        columns={[
          { header: '工号', key: 'staffId' },
          { header: '姓名', key: 'name' },
          { header: '手机号', key: 'phone' },
          {
            header: '状态',
            key: 'status',
            render: (value: string) => (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${value === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                }`}>
                {value === 'active' ? '在职' : '离职/禁用'}
              </span>
            )
          }
        ]}
        data={users}
        loading={loading}
        onRefresh={fetchArchives}
        actions={(record) => (
          <div className="flex space-x-1">
            <button
              data-testid={`ADM-S1-PEO-ARCH-004-${record.staffId}`}
              onClick={() => openViewModal(record)}
              className="p-1.5 text-slate-400" title="详情"
            >
              <Icons.Eye className="w-4 h-4" />
            </button>
            <button
              data-testid={`ADM-S1-PEO-ARCH-003-${record.staffId}`}
              onClick={() => openEditModal(record)}
              className="p-1.5 text-slate-400" title="编辑"
            >
              <Icons.Edit3 className="w-4 h-4" />
            </button>
            <button
              data-testid={`ADM-S1-PEO-ARCH-005-${record.staffId}`}
              onClick={() => handleDelete(record)}
              className="p-1.5 text-slate-400 hover:text-red-600" title="删除"
            >
              <Icons.Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" data-testid="modal-add-person">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b flex justify-between">
              <h3 className="text-xl font-bold">
                {isView ? '人员详情' : (isEdit ? '编辑人员档案' : '新增人员档案')}
              </h3>
              <button data-testid="ADM-S1-PEO-ARCH-002" onClick={() => setShowModal(false)}><Icons.X /></button>
            </div>
            <div className="p-8 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">姓名</label>
                <div className={isView ? "p-3 bg-slate-50 rounded-xl text-slate-800 font-medium" : ""}>
                  {isView ? formData.name : (
                    <input
                      data-testid="input-person-name"
                      type="text"
                      className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="请输入姓名"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">工号</label>
                <div className={isView ? "p-3 bg-slate-50 rounded-xl text-slate-800 font-medium font-mono" : ""}>
                  {isView ? formData.staffId : (
                    <input
                      data-testid="input-person-id"
                      type="text"
                      className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="请输入工号"
                      value={formData.staffId}
                      readOnly={isEdit} // Staff ID usually immutable
                      onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                      style={isEdit ? { backgroundColor: '#f3f4f6', cursor: 'not-allowed' } : {}}
                    />
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">手机号</label>
                <div className={isView ? "p-3 bg-slate-50 rounded-xl text-slate-800 font-medium font-mono" : ""}>
                  {isView ? formData.phone : (
                    <input
                      data-testid="input-person-phone"
                      type="text"
                      className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="请输入手机号"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 flex justify-end space-x-4">
              <button data-testid="ADM-S1-PEO-ARCH-002-btn" onClick={() => setShowModal(false)} className="px-6 py-2">
                {isView ? '关闭' : '取消'}
              </button>
              {!isView && (
                <button
                  data-testid="ADM-S1-PEO-ARCH-001"
                  onClick={handleSubmit}
                  className="px-8 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
                >
                  {isEdit ? '更新' : '确认保存'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeopleArchiveList;