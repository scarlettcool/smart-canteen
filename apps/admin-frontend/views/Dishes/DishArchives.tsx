
import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import DataTable from '../../components/Common/DataTable';
import { Dish } from '../../types';
import ApiService from '../../services/api';

const DishArchives: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<any[]>([]); // Need to fetch categories
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    name: string;
    category: string;
    price: string;
    calories: string;
    tags: string; // Comma separated for input
    image: string;
    status: 'available' | 'sold_out' | 'discontinued';
  }>({
    name: '',
    category: '',
    price: '',
    calories: '',
    tags: '',
    image: '',
    status: 'available',
  });

  const fetchDishes = async () => {
    setLoading(true);
    try {
      const response = await ApiService.dish.getDishes();
      setDishes(response.data?.list || []);
    } catch (error) {
      console.error('Failed to fetch dishes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await ApiService.dish.getCategories();
      // response.data should be an array based on API definition
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  useEffect(() => {
    fetchDishes();
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setFormData({
      name: '',
      category: categories.length > 0 ? categories[0].name : '',
      price: '',
      calories: '',
      tags: '',
      image: '',
      status: 'available',
    });
    setIsEdit(false);
    setEditingId(null);
    setShowModal(true);
  };

  const openEditModal = (record: Dish) => {
    setFormData({
      name: record.name,
      category: record.category,
      price: String(record.price),
      calories: String(record.calories),
      tags: record.tags ? record.tags.join(',') : '',
      image: record.image || '',
      status: record.status as any,
    });
    setIsEdit(true);
    setEditingId(record.id);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.price || !formData.category) {
      alert('请填写必要信息 (名称, 价格, 分类)');
      return;
    }

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      calories: parseInt(formData.calories || '0'),
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
    };

    try {
      if (isEdit && editingId) {
        await ApiService.dish.updateDish(editingId, payload);
        alert("更新成功");
      } else {
        await ApiService.dish.createDish(payload);
        alert("创建成功 (ADM-S3-DISH-ARCH-001 Pass)");
      }
      setShowModal(false);
      fetchDishes();
    } catch (error: any) {
      console.error('Operation failed:', error);
      alert(`操作失败: ${error.message || '网络错误'}`);
    }
  };

  const handleDelete = async (record: Dish) => {
    if (window.confirm(`确认删除菜品 [${record.name}] 吗？`)) {
      try {
        await ApiService.dish.deleteDish(record.id);
        alert('删除成功');
        fetchDishes();
      } catch (error: any) {
        alert(`删除失败: ${error.message}`);
      }
    }
  };

  const handleToggleStatus = async (record: Dish) => {
    const isAvailable = record.status === 'available';
    try {
      if (isAvailable) {
        await ApiService.dish.unpublish(record.id);
      } else {
        await ApiService.dish.publish(record.id);
      }
      // Optimistic delete or refresh
      fetchDishes();
    } catch (error: any) {
      alert(`状态更新失败: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6" data-testid="page-dish-archives">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">菜品资料库</h2>
          <p className="text-sm text-slate-500 mt-1">管理菜品信息、营养成分及价格</p>
        </div>
        <button
          data-testid="ADM-S3-DISH-ARCH-001"
          onClick={openCreateModal}
          className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-indigo-700 transition"
        >
          + 新增菜品
        </button>
      </div>

      <DataTable<Dish>
        columns={[
          { header: '菜品名称', key: 'name' },
          { header: '类别', key: 'category' },
          { header: '售价', key: 'price', render: (v) => <span className="font-mono font-bold text-slate-700">¥{Number(v).toFixed(2)}</span> },
          { header: '热量', key: 'calories', render: (v) => <span className="text-slate-500 text-xs">{v} kcal</span> },
          {
            header: '标签', key: 'tags', render: (tags: string[]) => (
              <div className="flex flex-wrap gap-1">
                {tags?.map((t, i) => <span key={i} className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[10px]">{t}</span>)}
              </div>
            )
          },
          {
            header: '状态',
            key: 'status',
            render: (v) => (
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${v === 'available' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                {v === 'available' ? '供应中' : '已下架'}
              </span>
            )
          },
        ]}
        data={dishes}
        loading={loading}
        onRefresh={fetchDishes}
        actions={(record) => (
          <div className="flex space-x-1">
            <button
              className="p-1.5 text-slate-400 hover:text-indigo-600 transition"
              onClick={() => openEditModal(record)}
              title="编辑"
            >
              <Icons.Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleToggleStatus(record)}
              className={`p-1.5 transition ${record.status === 'available' ? 'text-emerald-500 hover:text-emerald-700' : 'text-slate-400 hover:text-emerald-500'}`}
              title={record.status === 'available' ? '下架' : '上架'}
            >
              {record.status === 'available' ? <Icons.ToggleRight className="w-4 h-4" /> : <Icons.ToggleLeft className="w-4 h-4" />}
            </button>
            <button
              data-testid={`ADM-S3-DISH-ARCH-002-${record.id}`}
              className="p-1.5 text-slate-400 hover:text-rose-600 transition"
              onClick={() => handleDelete(record)}
              title="删除"
            >
              <Icons.Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scaleIn">
            <div className="p-6 border-b flex justify-between">
              <h3 className="text-xl font-bold">{isEdit ? '编辑菜品' : '新增菜品'}</h3>
              <button onClick={() => setShowModal(false)}><Icons.X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="p-8 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">菜品名称 *</label>
                <input
                  type="text"
                  className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="例如：宫保鸡丁"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">价格 (¥) *</label>
                  <input
                    type="number"
                    className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">热量 (kcal)</label>
                  <input
                    type="number"
                    className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="0"
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">分类 *</label>
                <select
                  className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="">请选择分类</option>
                  {categories.map((c: any) => (
                    <option key={c.id || c.name} value={c.name}>{c.name}</option>
                  ))}
                  {/* Fallback option if no categories loaded */}
                  {categories.length === 0 && <option value="默认">默认</option>}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">标签 (用逗号分隔)</label>
                <input
                  type="text"
                  className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="辣, 招牌, 推荐"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
              </div>
            </div>
            <div className="p-6 bg-slate-50 flex justify-end space-x-4">
              <button onClick={() => setShowModal(false)} className="px-6 py-2 text-slate-600 font-medium">取消</button>
              <button
                onClick={handleSubmit}
                className="px-8 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
              >
                {isEdit ? '更新' : '确认保存'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DishArchives;
