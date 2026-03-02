/**
 * 智慧食堂 API Client
 * 
 * Type-safe API client generated from OpenAPI specification
 * 
 * Usage:
 * ```typescript
 * import { apiClient } from '@shared/api-client';
 * 
 * const users = await apiClient.hr.getArchives({ page: 1, pageSize: 20 });
 * await apiClient.account.adjustBalance('user-id', { amount: 100, reason: '调账', requestId: 'uuid' });
 * ```
 */

import type {
    ApiResponse,
    PageRequest,
    PageResponse,
    UserArchive,
    CreateUserArchiveRequest,
    UpdateUserArchiveRequest,
    RegistrationApproval,
    ApprovalBatchRequest,
    RejectRequest,
    BlacklistRecord,
    AddToBlacklistRequest,
    LiftBlacklistRequest,
    Department,
    CreateDepartmentRequest,
    MoveDepartmentRequest,
    Account,
    AdjustAccountRequest,
    WalletLog,
    Transaction,
    CorrectTransactionRequest,
    CheckoutRequest,
    CheckoutResponse,
    Order,
    RefundApplication,
    CreateRefundRequest,
    Appeal,
    Canteen,
    Reservation,
    CreateReservationRequest,
    ReservationCalendarDay,
    QueueTicket,
    Dish,
    CreateDishRequest,
    Device,
    BindDeviceRequest,
    SendCommandRequest,
    Announcement,
    Feedback,
    CreateFeedbackRequest,
    UserProfile,
    RegisterRequest,
    RechargeRequest,
    RechargeResponse,
    HomeData,
    UserCoupon,
    ActivateCouponRequest,
    AuditLog,
    Role,
    Permission,
    AdminUser,
} from '../api-types';

export interface ApiClientConfig {
    baseUrl: string;
    token?: string;
    onUnauthorized?: () => void;
    onError?: (error: ApiError) => void;
}

export class ApiError extends Error {
    constructor(
        public code: number,
        message: string,
        public traceId?: string
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

class BaseClient {
    constructor(protected config: ApiClientConfig) { }

    protected async request<T>(
        method: string,
        path: string,
        options?: {
            body?: unknown;
            query?: Record<string, unknown>;
        }
    ): Promise<T> {
        const url = new URL(path, this.config.baseUrl);

        if (options?.query) {
            Object.entries(options.query).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    url.searchParams.append(key, String(value));
                }
            });
        }

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (this.config.token) {
            headers['Authorization'] = `Bearer ${this.config.token}`;
        }

        const response = await fetch(url.toString(), {
            method,
            headers,
            body: options?.body ? JSON.stringify(options.body) : undefined,
        });

        const data: ApiResponse<T> = await response.json();

        if (data.code !== 0 && data.code !== 200) {
            const error = new ApiError(data.code, data.message, data.traceId);

            if (data.code === 401) {
                this.config.onUnauthorized?.();
            }

            this.config.onError?.(error);
            throw error;
        }

        return data.data;
    }

    protected get<T>(path: string, query?: Record<string, unknown>): Promise<T> {
        return this.request<T>('GET', path, { query });
    }

    protected post<T>(path: string, body?: unknown, query?: Record<string, unknown>): Promise<T> {
        return this.request<T>('POST', path, { body, query });
    }

    protected put<T>(path: string, body?: unknown): Promise<T> {
        return this.request<T>('PUT', path, { body });
    }

    protected delete<T>(path: string): Promise<T> {
        return this.request<T>('DELETE', path);
    }
}

// =============================================================================
// HR API Client
// =============================================================================

class HrClient extends BaseClient {
    async getArchives(params?: PageRequest & { keyword?: string; deptId?: string; status?: string }) {
        return this.get<PageResponse<UserArchive>>('/hr/archives', params);
    }

    async getArchive(id: string) {
        return this.get<UserArchive>(`/hr/archives/${id}`);
    }

    async createArchive(data: CreateUserArchiveRequest) {
        return this.post<UserArchive>('/hr/archives', data);
    }

    async updateArchive(id: string, data: UpdateUserArchiveRequest) {
        return this.put<UserArchive>(`/hr/archives/${id}`, data);
    }

    async deleteArchive(id: string) {
        return this.delete<void>(`/hr/archives/${id}`);
    }

    async getApprovals(params?: PageRequest & { status?: string }) {
        return this.get<PageResponse<RegistrationApproval>>('/hr/approvals', params);
    }

    async passApproval(id: string) {
        return this.post<void>(`/hr/approvals/${id}/pass`);
    }

    async rejectApproval(id: string, data: RejectRequest) {
        return this.post<void>(`/hr/approvals/${id}/reject`, data);
    }

    async batchApproval(data: ApprovalBatchRequest) {
        return this.post<{ success: number; failed: number }>('/hr/approvals/batch', data);
    }

    async getBlacklist(params?: PageRequest) {
        return this.get<PageResponse<BlacklistRecord>>('/hr/blacklist', params);
    }

    async addToBlacklist(data: AddToBlacklistRequest) {
        return this.post<BlacklistRecord>('/hr/blacklist', data);
    }

    async liftBlacklist(id: string, data: LiftBlacklistRequest) {
        return this.put<void>(`/hr/blacklist/${id}/lift`, data);
    }
}

// =============================================================================
// ORG API Client
// =============================================================================

class OrgClient extends BaseClient {
    async getTree() {
        return this.get<Department[]>('/org/tree');
    }

    async createDepartment(data: CreateDepartmentRequest) {
        return this.post<Department>('/org/departments', data);
    }

    async updateDepartment(id: string, data: Partial<CreateDepartmentRequest>) {
        return this.put<Department>(`/org/departments/${id}`, data);
    }

    async deleteDepartment(id: string) {
        return this.delete<void>(`/org/departments/${id}`);
    }

    async moveDepartment(data: MoveDepartmentRequest) {
        return this.put<void>('/org/move', data);
    }
}

// =============================================================================
// Account API Client
// =============================================================================

class AccountClient extends BaseClient {
    async getList(params?: PageRequest & { keyword?: string }) {
        return this.get<PageResponse<Account>>('/account/list', params);
    }

    async getAccount(id: string) {
        return this.get<Account>(`/account/${id}`);
    }

    async adjustBalance(id: string, data: AdjustAccountRequest) {
        return this.post<{ transactionId: string; balanceAfter: number }>(`/account/${id}/adjust`, data);
    }

    async freeze(id: string) {
        return this.post<void>(`/account/${id}/freeze`);
    }

    async unfreeze(id: string) {
        return this.post<void>(`/account/${id}/unfreeze`);
    }

    async getLedger(id: string, params?: PageRequest & { startDate?: string; endDate?: string }) {
        return this.get<PageResponse<WalletLog>>(`/ledger/logs`, { ...params, userId: id });
    }
}

// =============================================================================
// Trade API Client
// =============================================================================

class TradeClient extends BaseClient {
    async getTransactions(params: { startDate: string; endDate: string } & PageRequest) {
        return this.get<PageResponse<Transaction>>('/trade/transactions', params);
    }

    async getTransaction(id: string) {
        return this.get<Transaction>(`/trade/transactions/${id}`);
    }

    async correctTransaction(id: string, data: CorrectTransactionRequest) {
        return this.post<void>(`/trade/transactions/${id}/correct`, data);
    }

    async checkout(data: CheckoutRequest) {
        return this.post<CheckoutResponse>('/trade/checkout', data);
    }

    async getOrders(params?: PageRequest & { status?: string }) {
        return this.get<PageResponse<Order>>('/trade/orders', params);
    }

    async getOrder(id: string) {
        return this.get<Order>(`/trade/orders/${id}`);
    }
}

// =============================================================================
// Refund API Client
// =============================================================================

class RefundClient extends BaseClient {
    async getApplications(params?: PageRequest & { status?: string }) {
        return this.get<PageResponse<RefundApplication>>('/refund/applications', params);
    }

    async getApplication(id: string) {
        return this.get<RefundApplication>(`/refund/applications/${id}`);
    }

    async createApplication(data: CreateRefundRequest) {
        return this.post<RefundApplication>('/refund/applications', data);
    }

    async approve(id: string) {
        return this.post<void>(`/refund/applications/${id}/approve`);
    }

    async reject(id: string, data: RejectRequest) {
        return this.post<void>(`/refund/applications/${id}/reject`, data);
    }
}

// =============================================================================
// Appeal API Client
// =============================================================================

class AppealClient extends BaseClient {
    async getList(params?: PageRequest & { status?: string }) {
        return this.get<PageResponse<Appeal>>('/appeal/list', params);
    }

    async getAppeal(id: string) {
        return this.get<Appeal>(`/appeal/${id}`);
    }

    async accept(id: string) {
        return this.post<void>(`/appeal/${id}/accept`);
    }

    async reject(id: string, data: RejectRequest) {
        return this.post<void>(`/appeal/${id}/reject`, data);
    }

    async resolve(id: string, resolution?: string) {
        return this.post<void>(`/appeal/${id}/resolve`, { resolution });
    }
}

// =============================================================================
// Menu API Client
// =============================================================================

class MenuClient extends BaseClient {
    async getCanteens() {
        return this.get<Canteen[]>('/menu/canteens');
    }

    async getCanteen(id: string) {
        return this.get<Canteen>(`/menu/canteens/${id}`);
    }

    async getDishes(canteenId: string, category?: string) {
        return this.get<Dish[]>('/dish/list', { canteenId, category });
    }

    async getReservationCalendar(params?: { month?: string }) {
        return this.get<ReservationCalendarDay[]>('/menu/reservation-calendar', params);
    }

    async createReservation(data: CreateReservationRequest) {
        return this.post<Reservation[]>('/menu/reservations', data);
    }

    async cancelReservation(id: string) {
        return this.delete<void>(`/menu/reservations/${id}`);
    }

    async takeQueueNumber(serviceType?: string) {
        return this.post<QueueTicket>('/menu/queue/take', { serviceType });
    }
}

// =============================================================================
// Device API Client
// =============================================================================

class DeviceClient extends BaseClient {
    async getList(params?: PageRequest & { canteenId?: string; status?: string }) {
        return this.get<PageResponse<Device>>('/device/list', params);
    }

    async getDevice(id: string) {
        return this.get<Device>(`/device/${id}`);
    }

    async bind(data: BindDeviceRequest) {
        return this.post<Device>('/device/bind', data);
    }

    async unbind(id: string) {
        return this.post<void>(`/device/${id}/unbind`);
    }

    async sendCommand(id: string, data: SendCommandRequest) {
        return this.post<{ success: boolean }>(`/device/${id}/command`, data);
    }

    async restart(id: string) {
        return this.post<void>(`/device/${id}/restart`);
    }
}

// =============================================================================
// Notify API Client
// =============================================================================

class NotifyClient extends BaseClient {
    async getAnnouncements(params?: PageRequest) {
        return this.get<PageResponse<Announcement>>('/notify/announcements', params);
    }

    async getFeedbacks(params?: PageRequest & { status?: string }) {
        return this.get<PageResponse<Feedback>>('/notify/feedbacks', params);
    }

    async submitFeedback(data: CreateFeedbackRequest) {
        return this.post<Feedback>('/notify/user-feedback', data);
    }

    async replyFeedback(id: string, reply: string) {
        return this.post<void>(`/notify/feedbacks/${id}/reply`, { reply });
    }
}

// =============================================================================
// User API Client (H5)
// =============================================================================

class UserClient extends BaseClient {
    async getHome() {
        return this.get<HomeData>('/user/home');
    }

    async register(data: RegisterRequest) {
        return this.post<{ status: string }>('/user/register', data);
    }

    async getRegisterStatus() {
        return this.get<{ status: string; rejectReason?: string }>('/user/register/status');
    }

    async getProfile() {
        return this.get<UserProfile>('/user/profile');
    }

    async updateProfile(data: Partial<UserProfile>) {
        return this.put<UserProfile>('/user/profile', data);
    }

    async getBalance() {
        return this.get<{ balance: number }>('/user/balance');
    }

    async recharge(data: RechargeRequest) {
        return this.post<RechargeResponse>('/user/recharge', data);
    }

    async getCoupons(params?: { status?: string }) {
        return this.get<UserCoupon[]>('/user/coupons', params);
    }

    async activateCoupon(data: ActivateCouponRequest) {
        return this.post<UserCoupon>('/user/coupons/activate', data);
    }
}

// =============================================================================
// System API Client
// =============================================================================

class SystemClient extends BaseClient {
    async getAuditLogs(params?: PageRequest & { module?: string; startDate?: string; endDate?: string }) {
        return this.get<PageResponse<AuditLog>>('/system/audit-logs', params);
    }

    async getRoles() {
        return this.get<Role[]>('/system/roles');
    }

    async getPermissions() {
        return this.get<Permission[]>('/system/permissions');
    }

    async getAdmins(params?: PageRequest) {
        return this.get<PageResponse<AdminUser>>('/system/admins', params);
    }
}

// =============================================================================
// Main API Client
// =============================================================================

export class ApiClient {
    public hr: HrClient;
    public org: OrgClient;
    public account: AccountClient;
    public trade: TradeClient;
    public refund: RefundClient;
    public appeal: AppealClient;
    public menu: MenuClient;
    public device: DeviceClient;
    public notify: NotifyClient;
    public user: UserClient;
    public system: SystemClient;

    constructor(config: ApiClientConfig) {
        this.hr = new HrClient(config);
        this.org = new OrgClient(config);
        this.account = new AccountClient(config);
        this.trade = new TradeClient(config);
        this.refund = new RefundClient(config);
        this.appeal = new AppealClient(config);
        this.menu = new MenuClient(config);
        this.device = new DeviceClient(config);
        this.notify = new NotifyClient(config);
        this.user = new UserClient(config);
        this.system = new SystemClient(config);
    }

    setToken(token: string) {
        const config = { ...this.hr['config'], token };
        this.hr = new HrClient(config);
        this.org = new OrgClient(config);
        this.account = new AccountClient(config);
        this.trade = new TradeClient(config);
        this.refund = new RefundClient(config);
        this.appeal = new AppealClient(config);
        this.menu = new MenuClient(config);
        this.device = new DeviceClient(config);
        this.notify = new NotifyClient(config);
        this.user = new UserClient(config);
        this.system = new SystemClient(config);
    }
}

// Default export factory
export function createApiClient(config: ApiClientConfig): ApiClient {
    return new ApiClient(config);
}
