/**
 * 智慧食堂 Admin API Service
 * 
 * 完整集成后端 API，支持：
 * - JWT 认证
 * - 错误码映射
 * - 幂等性请求
 * - 审计日志追踪
 */

import { ApiResponse } from '../types';

// API 基础配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

/**
 * 标准错误码映射 (契约对齐)
 */
const ERROR_CODE_MAP: Record<number, string> = {
  40001: '请求参数校验失败，请检查输入',
  40100: '会话已过期，请重新登录',
  40101: '用户名或密码错误',
  40300: '权限不足，无法执行该操作',
  40400: '请求的资源不存在',
  40901: '数据冲突：工号或关键字段已存在',
  40902: '重复提交：该操作正在处理中',
  50000: '服务器内部错误，请稍后重试',
};

/**
 * 生成唯一请求ID (用于幂等性和追踪)
 */
export const generateRequestId = (): string => {
  return 'req-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9);
};

/**
 * 获取存储的 Token
 */
const getToken = (): string | null => {
  return localStorage.getItem('admin_token');
};

/**
 * 存储 Token
 */
export const setToken = (token: string): void => {
  localStorage.setItem('admin_token', token);
};

/**
 * 清除 Token
 */
export const clearToken = (): void => {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
};

/**
 * 获取当前用户信息
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('admin_user');
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * 检查用户权限
 */
export const hasPermission = (permission: string): boolean => {
  const user = getCurrentUser();
  if (!user) return false;
  if (user.roles?.includes('SUPER_ADMIN')) return true;
  return user.permissions?.includes(permission) || false;
};

/**
 * 检查用户角色
 */
export const hasRole = (role: string): boolean => {
  const user = getCurrentUser();
  return user?.roles?.includes(role) || false;
};

/**
 * API 请求错误
 */
export class ApiError extends Error {
  code: number;
  traceId?: string;

  constructor(code: number, message: string, traceId?: string) {
    super(message);
    this.code = code;
    this.traceId = traceId;
    this.name = 'ApiError';
  }
}

/**
 * 核心 API Service
 */
export class ApiService {
  /**
   * 通用请求方法
   */
  private static async request<T>(
    path: string,
    method: string,
    body?: any,
    options: { idempotent?: boolean; timeout?: number } = {}
  ): Promise<ApiResponse<T>> {
    const traceId = generateRequestId();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Trace-Id': traceId,
    };

    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (options.idempotent) {
      headers['X-Request-Id'] = traceId;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      options.timeout || 30000
    );

    try {
      const response = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      // 处理 401 未授权
      if (response.status === 401) {
        clearToken();
        window.location.href = '/#/login';
        throw new ApiError(401, data.message || '登录已过期，请重新登录', data.traceId);
      }

      // 处理其他 HTTP 错误
      if (!response.ok) {
        const errorMsg = ERROR_CODE_MAP[data.code] || data.message || '请求失败';
        throw new ApiError(data.code || response.status, errorMsg, data.traceId);
      }

      // 业务错误码处理
      if (data.code !== 0 && data.code !== undefined) {
        const errorMsg = ERROR_CODE_MAP[data.code] || data.message || '操作失败';
        throw new ApiError(data.code, errorMsg, data.traceId);
      }

      return data;
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new ApiError(408, '请求超时，请检查网络连接', traceId);
      }

      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(0, error.message || '网络错误', traceId);
    }
  }

  // HTTP 方法封装
  static get<T>(path: string) {
    return this.request<T>(path, 'GET');
  }

  static post<T>(path: string, body: any, idempotent = true) {
    return this.request<T>(path, 'POST', body, { idempotent });
  }

  static put<T>(path: string, body: any) {
    return this.request<T>(path, 'PUT', body);
  }

  static patch<T>(path: string, body: any) {
    return this.request<T>(path, 'PATCH', body);
  }

  static delete<T>(path: string) {
    return this.request<T>(path, 'DELETE');
  }

  // ============================================================
  // 认证 API
  // ============================================================
  static auth = {
    login: (username: string, password: string) =>
      ApiService.post<{
        accessToken: string;
        expiresIn: number;
        user: { id: string; username: string; name: string; roles: string[] };
      }>('/auth/login', { username, password }, false),

    logout: () => ApiService.post('/auth/logout', {}),

    refresh: () => ApiService.post<{ accessToken: string }>('/auth/refresh', {}),
  };

  // ============================================================
  // 人员管理 API (HR)
  // ============================================================
  static hr = {
    // 档案
    getArchives: (params?: Record<string, any>) =>
      ApiService.get<{ list: any[]; total: number; page: number; pageSize: number }>(
        `/hr/archives${params ? '?' + new URLSearchParams(params).toString() : ''}`
      ),

    getArchive: (id: string) => ApiService.get<any>(`/hr/archives/${id}`),

    createArchive: (data: any) => ApiService.post<any>('/hr/archives', data),

    updateArchive: (id: string, data: any) => ApiService.put<any>(`/hr/archives/${id}`, data),

    deleteArchive: (id: string) => ApiService.delete<any>(`/hr/archives/${id}`),

    importArchives: (data: any[], duplicatePolicy = 'skip') =>
      ApiService.post<any>('/hr/archives/import', { data, duplicatePolicy }),

    // 审批
    getApprovals: (params?: Record<string, any>) =>
      ApiService.get<{ list: any[]; total: number }>(
        `/hr/approvals${params ? '?' + new URLSearchParams(params).toString() : ''}`
      ),

    passApproval: (id: string) => ApiService.post<any>(`/hr/approvals/${id}/pass`, {}),

    rejectApproval: (id: string, rejectReason: string) =>
      ApiService.post<any>(`/hr/approvals/${id}/reject`, { rejectReason }),

    batchApproval: (ids: string[], action: 'pass' | 'reject', rejectReason?: string) =>
      ApiService.post<any>('/hr/approvals/batch', { ids, action, rejectReason }),

    // 黑名单
    getBlacklist: (params?: Record<string, any>) =>
      ApiService.get<{ list: any[]; total: number }>(
        `/hr/blacklist${params ? '?' + new URLSearchParams(params).toString() : ''}`
      ),

    addToBlacklist: (data: { userId: string; reason: string; type: string; deadline?: string }) =>
      ApiService.post<any>('/hr/blacklist', data),

    liftBlacklist: (id: string, liftReason: string) =>
      ApiService.put<any>(`/hr/blacklist/${id}/lift`, { liftReason }),
  };

  // ============================================================
  // 组织架构 API
  // ============================================================
  static org = {
    getTree: () => ApiService.get<any[]>('/org/tree'),

    createDepartment: (data: any) => ApiService.post<any>('/org/departments', data),

    updateDepartment: (id: string, data: any) => ApiService.put<any>(`/org/departments/${id}`, data),

    deleteDepartment: (id: string) => ApiService.delete<any>(`/org/departments/${id}`),

    moveDepartment: (deptId: string, targetParentId: string) =>
      ApiService.put<any>('/org/move', { deptId, targetParentId }),
  };

  // ============================================================
  // 账户管理 API
  // ============================================================
  static account = {
    getAccounts: (params?: Record<string, any>) =>
      ApiService.get<{ list: any[]; total: number }>(
        `/account${params ? '?' + new URLSearchParams(params).toString() : ''}`
      ),

    getBalance: (userId: string) => ApiService.get<{ userId: string; balance: number }>(`/account/${userId}/balance`),

    topUp: (userId: string, amount: number) => ApiService.post<any>(`/account/${userId}/topup`, { amount }),

    freeze: (userId: string) => ApiService.put<any>(`/account/${userId}/freeze`, {}),

    unfreeze: (userId: string) => ApiService.put<any>(`/account/${userId}/unfreeze`, {}),

    adjust: (userId: string, amount: number, reason: string) =>
      ApiService.post<any>(`/account/${userId}/adjust`, { amount, reason }),
  };

  // ============================================================
  // 交易管理 API
  // ============================================================
  static trade = {
    getTransactions: (params?: Record<string, any>) =>
      ApiService.get<{ list: any[]; total: number }>(
        `/trade/transactions${params ? '?' + new URLSearchParams(params).toString() : ''}`
      ),

    getTransaction: (id: string) => ApiService.get<any>(`/trade/transactions/${id}`),

    correct: (id: string, reason: string) => ApiService.post<any>(`/trade/transactions/${id}/correct`, { reason }),

    export: (params?: Record<string, any>) =>
      ApiService.post<{ jobId: string }>('/trade/transactions/export', params),
  };

  // ============================================================
  // 退款管理 API
  // ============================================================
  static refund = {
    getRefunds: (params?: Record<string, any>) =>
      ApiService.get<{ list: any[]; total: number }>(
        `/refund${params ? '?' + new URLSearchParams(params).toString() : ''}`
      ),

    approve: (id: string) => ApiService.post<any>(`/refund/${id}/approve`, {}),

    reject: (id: string, rejectReason: string) => ApiService.post<any>(`/refund/${id}/reject`, { rejectReason }),
  };

  // ============================================================
  // 申诉管理 API
  // ============================================================
  static appeal = {
    getAppeals: (params?: Record<string, any>) =>
      ApiService.get<{ list: any[]; total: number }>(
        `/appeal${params ? '?' + new URLSearchParams(params).toString() : ''}`
      ),

    accept: (id: string) => ApiService.post<any>(`/appeal/${id}/accept`, {}),

    reject: (id: string, reason: string) => ApiService.post<any>(`/appeal/${id}/reject`, { reason }),

    resolve: (id: string, resolution: string) => ApiService.post<any>(`/appeal/${id}/resolve`, { resolution }),
  };

  // ============================================================
  // 菜品管理 API
  // ============================================================
  static dish = {
    getDishes: (params?: Record<string, any>) =>
      ApiService.get<{ list: any[]; total: number }>(
        `/dish${params ? '?' + new URLSearchParams(params).toString() : ''}`
      ),

    getDish: (id: string) => ApiService.get<any>(`/dish/${id}`),

    createDish: (data: any) => ApiService.post<any>('/dish', data),

    updateDish: (id: string, data: any) => ApiService.put<any>(`/dish/${id}`, data),

    deleteDish: (id: string) => ApiService.delete<any>(`/dish/${id}`),

    publish: (id: string) => ApiService.post<any>(`/dish/${id}/publish`, {}),

    unpublish: (id: string) => ApiService.post<any>(`/dish/${id}/unpublish`, {}),

    batchPublish: (ids: string[]) => ApiService.post<any>('/dish/batch-publish', { ids }),

    batchUnpublish: (ids: string[]) => ApiService.post<any>('/dish/batch-unpublish', { ids }),

    // 分类
    getCategories: () => ApiService.get<any[]>('/dish/categories'),

    createCategory: (data: any) => ApiService.post<any>('/dish/categories', data),

    updateCategory: (id: string, data: any) => ApiService.put<any>(`/dish/categories/${id}`, data),

    deleteCategory: (id: string) => ApiService.delete<any>(`/dish/categories/${id}`),
  };

  // ============================================================
  // 菜单管理 API
  // ============================================================
  static menu = {
    getMenus: (params?: Record<string, any>) =>
      ApiService.get<{ list: any[]; total: number }>(
        `/menu${params ? '?' + new URLSearchParams(params).toString() : ''}`
      ),

    getMenu: (id: string) => ApiService.get<any>(`/menu/${id}`),

    createMenu: (data: any) => ApiService.post<any>('/menu', data),

    updateMenu: (id: string, data: any) => ApiService.put<any>(`/menu/${id}`, data),

    deleteMenu: (id: string) => ApiService.delete<any>(`/menu/${id}`),

    publish: (id: string) => ApiService.post<any>(`/menu/${id}/publish`, {}),

    unpublish: (id: string) => ApiService.post<any>(`/menu/${id}/unpublish`, {}),

    addDishes: (id: string, dishIds: string[]) => ApiService.post<any>(`/menu/${id}/dishes`, { dishIds }),

    removeDish: (menuId: string, dishId: string) => ApiService.delete<any>(`/menu/${menuId}/dishes/${dishId}`),

    copy: (id: string, targetDate: string) => ApiService.post<any>(`/menu/${id}/copy`, { targetDate }),
  };

  // ============================================================
  // 通知反馈 API
  // ============================================================
  static notify = {
    // 反馈
    getFeedbacks: (params?: Record<string, any>) =>
      ApiService.get<{ list: any[]; total: number }>(
        `/notify/feedbacks${params ? '?' + new URLSearchParams(params).toString() : ''}`
      ),

    getFeedback: (id: string) => ApiService.get<any>(`/notify/feedbacks/${id}`),

    replyFeedback: (id: string, reply: string) => ApiService.post<any>(`/notify/feedbacks/${id}/reply`, { reply }),

    closeFeedback: (id: string) => ApiService.post<any>(`/notify/feedbacks/${id}/close`, {}),

    // 公告
    getNotices: (params?: Record<string, any>) =>
      ApiService.get<{ list: any[]; total: number }>(
        `/notify/notices${params ? '?' + new URLSearchParams(params).toString() : ''}`
      ),

    createNotice: (data: any) => ApiService.post<any>('/notify/notices', data),

    updateNotice: (id: string, data: any) => ApiService.put<any>(`/notify/notices/${id}`, data),

    deleteNotice: (id: string) => ApiService.delete<any>(`/notify/notices/${id}`),

    publishNotice: (id: string) => ApiService.post<any>(`/notify/notices/${id}/publish`, {}),
  };

  // ============================================================
  // 系统管理 API
  // ============================================================
  static system = {
    // 审计日志
    getAuditLogs: (params?: Record<string, any>) =>
      ApiService.get<{ list: any[]; total: number }>(
        `/system/audit-logs${params ? '?' + new URLSearchParams(params).toString() : ''}`
      ),

    getAuditLog: (id: string) => ApiService.get<any>(`/system/audit-logs/${id}`),

    // 角色
    getRoles: () => ApiService.get<any[]>('/system/roles'),

    createRole: (data: any) => ApiService.post<any>('/system/roles', data),

    updateRole: (id: string, data: any) => ApiService.put<any>(`/system/roles/${id}`, data),

    deleteRole: (id: string) => ApiService.delete<any>(`/system/roles/${id}`),

    assignPermissions: (roleId: string, permissionIds: string[]) =>
      ApiService.put<any>(`/system/roles/${roleId}/permissions`, { permissionIds }),

    // 权限
    getPermissions: () => ApiService.get<any[]>('/system/permissions'),

    // 管理员
    getAdmins: (params?: Record<string, any>) =>
      ApiService.get<{ list: any[]; total: number }>(
        `/system/admins${params ? '?' + new URLSearchParams(params).toString() : ''}`
      ),

    createAdmin: (data: any) => ApiService.post<any>('/system/admins', data),

    updateAdmin: (id: string, data: any) => ApiService.put<any>(`/system/admins/${id}`, data),

    deleteAdmin: (id: string) => ApiService.delete<any>(`/system/admins/${id}`),

    assignRoles: (adminId: string, roleIds: string[]) =>
      ApiService.put<any>(`/system/admins/${adminId}/roles`, { roleIds }),

    // 配置
    getConfigs: (group?: string) => ApiService.get<any[]>(`/system/configs${group ? `?group=${group}` : ''}`),

    updateConfig: (key: string, value: string) => ApiService.put<any>(`/system/configs/${key}`, { value }),
  };

  // ============================================================
  // 设备管理 API
  // ============================================================
  static device = {
    getDevices: (params?: Record<string, any>) =>
      ApiService.get<{ list: any[]; total: number }>(
        `/device${params ? '?' + new URLSearchParams(params).toString() : ''}`
      ),

    getDevice: (id: string) => ApiService.get<any>(`/device/${id}`),

    createDevice: (data: any) => ApiService.post<any>('/device', data),

    updateDevice: (id: string, data: any) => ApiService.put<any>(`/device/${id}`, data),

    deleteDevice: (id: string) => ApiService.delete<any>(`/device/${id}`),

    bindDevice: (id: string, canteenId: string) => ApiService.post<any>(`/device/${id}/bind`, { canteenId }),

    unbindDevice: (id: string) => ApiService.post<any>(`/device/${id}/unbind`, {}),

    sendCommand: (id: string, command: string, params?: any) =>
      ApiService.post<any>(`/device/${id}/command`, { command, params }),
  };

  // ============================================================
  // 报表 API
  // ============================================================
  static report = {
    getDailyStats: (date?: string) => ApiService.get<any>(`/report/daily${date ? `?date=${date}` : ''}`),

    getMonthlyStats: (month?: string) => ApiService.get<any>(`/report/monthly${month ? `?month=${month}` : ''}`),

    getConsumptionReport: (params?: Record<string, any>) =>
      ApiService.get<any>(`/report/consumption${params ? '?' + new URLSearchParams(params).toString() : ''}`),

    export: (type: string, params?: Record<string, any>) =>
      ApiService.post<{ jobId: string }>(`/report/${type}/export`, params),
  };
}

export default ApiService;
