/**
 * 智慧食堂 H5 API Service
 * 
 * 完整集成后端 API，支持：
 * - 微信登录
 * - JWT 认证
 * - 错误码映射
 * - 幂等性请求
 * 
 * Version: 3.2.0 - Full Backend Integration
 */

import { ErrorCode } from './service';

// API 基础配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

export interface UnifiedResponse<T> {
  ok: boolean;
  data?: T;
  message?: string;
  errorCode?: ErrorCode;
  traceId?: string;
  rawCode?: number | string;
}

export interface PaginatedResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * 错误码映射
 */
const ERROR_CODE_MAP: Record<string, string> = {
  'UNAUTHORIZED': '请先登录',
  'FORBIDDEN': '权限不足',
  'NET_ERROR': '网络连接失败，请检查网络',
  'TIMEOUT': '请求超时，请重试',
  'SERVER_ERROR': '服务器繁忙，请稍后重试',
  'DUPLICATE_SUBMIT': '请勿重复提交',
  'E001': '余额不足',
  'E3001': '预约已满',
  'E3002': '预约时间已过',
  'E4001': '优惠券已领完',
  'E4002': '您已领取过该优惠券',
};

/**
 * H5 API Client
 */
class H5ApiClient {
  private static instance: H5ApiClient;
  private constructor() { }

  static getInstance(): H5ApiClient {
    if (!H5ApiClient.instance) H5ApiClient.instance = new H5ApiClient();
    return H5ApiClient.instance;
  }

  private generateRequestId(): string {
    return 'h5-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9);
  }

  private getToken(): string | null {
    return localStorage.getItem('h5_token');
  }

  setToken(token: string): void {
    localStorage.setItem('h5_token', token);
  }

  clearToken(): void {
    localStorage.removeItem('h5_token');
    localStorage.removeItem('h5_user');
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('h5_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  setCurrentUser(user: any): void {
    localStorage.setItem('h5_user', JSON.stringify(user));
  }

  private mapRawCodeToErrorCode(code: number | string): ErrorCode {
    const codeStr = String(code);
    const mapping: Record<string, ErrorCode> = {
      '401': 'UNAUTHORIZED',
      '403': 'FORBIDDEN',
      '10001': 'UNAUTHORIZED',
      '10002': 'FORBIDDEN',
      '20001': 'E001',
      '30001': 'E3001',
      '30002': 'E3002',
      '40001': 'E4001',
      '40002': 'E4002',
      '429': 'DUPLICATE_SUBMIT',
      '500': 'SERVER_ERROR',
    };
    return mapping[codeStr] || 'SERVER_ERROR';
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<UnifiedResponse<T>> {
    const token = this.getToken();
    const headers = new Headers(options.headers);

    headers.set('Content-Type', 'application/json');

    if (token) headers.set('Authorization', `Bearer ${token}`);

    // 幂等性：针对 mutating 操作注入 X-Request-Id
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method || '')) {
      if (!headers.has('X-Request-Id')) {
        headers.set('X-Request-Id', this.generateRequestId());
      }
    }

    headers.set('X-Trace-Id', this.generateRequestId());

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) {
          this.clearToken();
          return { ok: false, errorCode: 'UNAUTHORIZED', message: ERROR_CODE_MAP['UNAUTHORIZED'] };
        }
        if (response.status === 403) return { ok: false, errorCode: 'FORBIDDEN', message: ERROR_CODE_MAP['FORBIDDEN'] };
        if (response.status === 429) return { ok: false, errorCode: 'DUPLICATE_SUBMIT', message: ERROR_CODE_MAP['DUPLICATE_SUBMIT'] };
        return { ok: false, errorCode: 'SERVER_ERROR', message: `服务器错误 (${response.status})` };
      }

      const rawData = await response.json();

      // 处理标准响应格式
      if ('code' in rawData) {
        const isSuccess = rawData.code === 0 || rawData.code === 200;
        return {
          ok: isSuccess,
          data: rawData.data,
          message: rawData.message,
          traceId: rawData.traceId,
          rawCode: rawData.code,
          errorCode: isSuccess ? undefined : this.mapRawCodeToErrorCode(rawData.code)
        };
      }

      return { ok: true, data: rawData as T };

    } catch (error: any) {
      if (error.name === 'AbortError') return { ok: false, errorCode: 'TIMEOUT', message: ERROR_CODE_MAP['TIMEOUT'] };
      return { ok: false, errorCode: 'NET_ERROR', message: ERROR_CODE_MAP['NET_ERROR'] };
    }
  }

  // HTTP 方法封装
  get<T>(path: string) {
    return this.request<T>(path, { method: 'GET' });
  }

  post<T>(path: string, body?: any) {
    return this.request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined });
  }

  put<T>(path: string, body: any) {
    return this.request<T>(path, { method: 'PUT', body: JSON.stringify(body) });
  }

  delete<T>(path: string) {
    return this.request<T>(path, { method: 'DELETE' });
  }
}

export const apiClient = H5ApiClient.getInstance();

// ============================================================
// H5 业务 API - 与后端 API 完全对齐
// ============================================================

export const h5Api = {
  // ======== 认证 ========
  auth: {
    /** 微信登录 */
    wechatLogin: (code: string, phone?: string) =>
      apiClient.post<{ accessToken: string; user: any }>('/auth/wechat/login', { code, phone }),

    /** 刷新 Token */
    refresh: () => apiClient.post<{ accessToken: string }>('/auth/refresh', {}),

    /** 登出 */
    logout: () => {
      apiClient.clearToken();
      return Promise.resolve({ ok: true });
    },
  },

  // ======== 用户 (对应 /user 端点) ========
  user: {
    /** 获取个人信息 */
    getProfile: () => apiClient.get<any>('/user/profile'),

    /** 更新个人信息 */
    updateProfile: (data: {
      name?: string;
      phone?: string;
      email?: string;
      avatar?: string;
      gender?: string;
      birthday?: string;
    }) => apiClient.put<any>('/user/profile', data),

    /** 获取余额 */
    getBalance: () => apiClient.get<{ balance: number }>('/user/balance'),

    /** 提交注册申请 */
    register: (data: {
      name: string;
      staffId: string;
      phone: string;
      departmentId?: string;
      email?: string;
      gender?: string;
      birthday?: string;
      idCard?: string;
    }) => apiClient.post<{ id: string; name: string; regStatus: string; message: string }>('/user/register', data),

    /** 获取注册状态 */
    getRegStatus: () => apiClient.get<{ status: string; rejectReason?: string }>('/user/reg-status'),

    /** 获取交易记录 */
    getTransactions: (params?: { page?: number; pageSize?: number; type?: string }) => {
      const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
      return apiClient.get<PaginatedResponse<any>>(`/user/transactions${query}`);
    },

    /** 获取交易详情 */
    getTransaction: (id: string) => apiClient.get<any>(`/user/transactions/${id}`),
  },

  // ======== 预约 (对应 /user/reservations) ========
  reservation: {
    /** 获取我的预约列表 */
    getMyList: () => apiClient.get<any[]>('/user/reservations'),

    /** 获取预约详情 */
    getDetail: (id: string) => apiClient.get<any>(`/user/reservations/${id}`),

    /** 提交预约 */
    create: (data: { canteenId: string; date: string; mealType: string; dishes?: string[] }) =>
      apiClient.post<any>('/user/reservations', data),

    /** 取消预约 */
    cancel: (id: string) => apiClient.post<any>(`/user/reservations/${id}/cancel`, {}),
  },

  // ======== 优惠券 (对应 /user/coupons) ========
  coupon: {
    /** 获取我的优惠券 */
    getMyList: (status?: 'valid' | 'used' | 'expired') => {
      const query = status ? `?status=${status}` : '';
      return apiClient.get<any[]>(`/user/coupons${query}`);
    },

    /** 领取优惠券 */
    claim: (templateId: string) => apiClient.post<any>(`/user/coupons/${templateId}/claim`, {}),
  },

  // ======== 菜单 (公开端点) ========
  menu: {
    /** 获取今日菜单 */
    getTodayMenu: (canteenId: string) => apiClient.get<any>(`/menu/today/${canteenId}`),
  },

  // ======== 公告 (公开端点) ========
  notice: {
    /** 获取公开公告列表 */
    getPublicList: (params?: { canteenId?: string; limit?: number }) => {
      const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
      return apiClient.get<any[]>(`/notify/notices/public${query}`);
    },

    /** 获取公告详情 */
    getDetail: (id: string) => apiClient.get<any>(`/notify/notices/${id}`),
  },

  // ======== 反馈 ========
  feedback: {
    /** 获取我的反馈列表 */
    getMyList: () => apiClient.get<any[]>('/notify/feedbacks/my'),

    /** 获取反馈详情 */
    getDetail: (id: string) => apiClient.get<any>(`/notify/feedbacks/${id}`),

    /** 提交反馈 */
    submit: (data: { type: string; title: string; content: string; images?: string[] }) =>
      apiClient.post<any>('/notify/feedbacks', data),
  },

  // ======== 退款 ========
  refund: {
    /** 获取我的退款申请 */
    getMyList: () => apiClient.get<PaginatedResponse<any>>('/refund?my=true'),

    /** 获取退款详情 */
    getDetail: (id: string) => apiClient.get<any>(`/refund/${id}`),

    /** 申请退款 */
    create: (data: { orderId: string; amount: number; reason: string }) =>
      apiClient.post<any>('/refund', data),
  },

  // ======== 申诉 ========
  appeal: {
    /** 获取我的申诉 */
    getMyList: () => apiClient.get<PaginatedResponse<any>>('/appeal?my=true'),

    /** 获取申诉详情 */
    getDetail: (id: string) => apiClient.get<any>(`/appeal/${id}`),

    /** 提交申诉 */
    submit: (data: { type: string; content: string; relatedId?: string; images?: string[] }) =>
      apiClient.post<any>('/appeal', data),
  },

  // ======== 餐厅 (公开端点) ========
  canteen: {
    /** 获取餐厅列表 */
    getList: () => apiClient.get<any[]>('/canteen'),

    /** 获取餐厅详情 */
    getDetail: (id: string) => apiClient.get<any>(`/canteen/${id}`),
  },

  // ======== 菜品 (公开端点) ========
  dish: {
    /** 获取菜品详情 */
    getDetail: (id: string) => apiClient.get<any>(`/dish/${id}/public`),

    /** 获取菜品列表 */
    getList: (params?: { canteenId?: string; categoryId?: string }) => {
      const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
      return apiClient.get<any[]>(`/dish/public${query}`);
    },
  },
};

export default h5Api;
