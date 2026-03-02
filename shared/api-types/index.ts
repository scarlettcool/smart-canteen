/**
 * 智慧食堂 API Types
 * 
 * Auto-generated from SPEC/03_API_CONTRACT.openapi.yaml
 * DO NOT EDIT MANUALLY - Run `npm run generate:types` to regenerate
 * 
 * @generated
 */

// =============================================================================
// Common Types
// =============================================================================

export interface ApiResponse<T = unknown> {
    code: number;
    message: string;
    data: T;
    traceId: string;
}

export interface PageRequest {
    page?: number;
    pageSize?: number;
}

export interface PageResponse<T> {
    list: T[];
    page: number;
    pageSize: number;
    total: number;
}

export interface IdempotentRequest {
    requestId: string;
}

// =============================================================================
// Enums
// =============================================================================

export type RegStatus = 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'FROZEN' | 'RESIGNED';
export type AdminStatus = 'ACTIVE' | 'DISABLED';
export type RegistrationStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';
export type DishPublishStatus = 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'UNPUBLISHED' | 'REJECTED';
export type OrderStatus = 'PENDING' | 'PAID' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED' | 'CORRECTED';
export type RefundStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'REFUNDED';
export type AppealStatus = 'SUBMITTED' | 'PENDING' | 'PROCESSING' | 'REJECTED' | 'RESOLVED';
export type AppealType = 'BREACH' | 'REFUND' | 'SERVICE' | 'OTHER';
export type ReservationStatus = 'PENDING' | 'USED' | 'EXPIRED' | 'CANCELLED';
export type QueueStatus = 'WAITING' | 'CALLING' | 'FINISHED' | 'SKIPPED';
export type BlacklistType = 'TEMPORARY' | 'PERMANENT';
export type BlacklistStatus = 'ACTIVE' | 'LIFTED';
export type DeviceType = 'POS' | 'RECHARGE_KIOSK' | 'GATE' | 'FACE_TERMINAL';
export type DeviceStatus = 'ONLINE' | 'OFFLINE' | 'ERROR';
export type WalletLogType = 'RECHARGE' | 'PAYMENT' | 'REFUND' | 'ADJUSTMENT' | 'TRANSFER' | 'CORRECTION';
export type PaymentMethod = 'BALANCE' | 'WECHAT' | 'CARD' | 'FACE' | 'CASH';
export type CouponType = 'CASH' | 'DISCOUNT';
export type UserCouponStatus = 'UNUSED' | 'USED' | 'EXPIRED';
export type FeedbackType = 'SUGGESTION' | 'COMPLAINT' | 'APPEAL';
export type FeedbackStatus = 'PENDING' | 'PROCESSING' | 'RESOLVED' | 'CLOSED';
export type ExportJobStatus = 'PROCESSING' | 'COMPLETED' | 'FAILED';
export type MealTypeCode = 'breakfast' | 'lunch' | 'dinner';

// =============================================================================
// Domain: HR (人事档案)
// =============================================================================

export interface UserArchive {
    id: string;
    staffId: string;
    name: string;
    phone: string;
    avatar?: string;
    deptId?: string;
    deptName?: string;
    canteenId?: string;
    siteId?: string;
    regStatus: RegStatus;
    status: UserStatus;
    balance: number;
    birthday?: string;
    retiredDate?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateUserArchiveRequest {
    name: string;
    staffId: string;
    phone: string;
    deptId?: string;
    birthday?: string;
    customAttributes?: Record<string, unknown>;
}

export interface UpdateUserArchiveRequest extends Partial<CreateUserArchiveRequest> { }

export interface ImportArchiveRequest {
    file: File;
    duplicatePolicy: 'skip' | 'overwrite' | 'merge';
}

export interface ImportResult {
    total: number;
    success: number;
    failed: number;
    errors: Array<{ row: number; field: string; message: string }>;
}

// =============================================================================
// Domain: Approval (审批)
// =============================================================================

export interface RegistrationApproval {
    id: string;
    userId?: string;
    name: string;
    phone: string;
    staffId: string;
    deptId?: string;
    deptName?: string;
    idPhoto?: string;
    status: RegistrationStatus;
    rejectReason?: string;
    approvedBy?: string;
    approvedAt?: string;
    createdAt: string;
}

export interface ApprovalBatchRequest {
    ids: string[];
    action: 'pass' | 'reject';
    rejectReason?: string; // Required when action is 'reject'
}

export interface RejectRequest {
    rejectReason: string;
}

// =============================================================================
// Domain: Blacklist (黑名单)
// =============================================================================

export interface BlacklistRecord {
    id: string;
    userId: string;
    userName: string;
    type: BlacklistType;
    reason: string;
    deadline?: string;
    status: BlacklistStatus;
    liftReason?: string;
    liftedBy?: string;
    liftedAt?: string;
    createdBy: string;
    createdAt: string;
}

export interface AddToBlacklistRequest {
    userId: string;
    reason: string;
    type: BlacklistType;
    deadline?: string;
}

export interface LiftBlacklistRequest {
    liftReason: string;
}

// =============================================================================
// Domain: ORG (组织架构)
// =============================================================================

export interface Department {
    id: string;
    parentId?: string;
    name: string;
    managerId?: string;
    managerName?: string;
    canteenId?: string;
    siteId?: string;
    sortOrder: number;
    children?: Department[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateDepartmentRequest {
    name: string;
    parentId?: string;
    managerId?: string;
}

export interface MoveDepartmentRequest {
    deptId: string;
    targetParentId: string;
}

export interface OrgChangeRecord {
    id: string;
    departmentId: string;
    changeType: 'CREATE' | 'UPDATE' | 'DELETE' | 'MOVE';
    beforeValue?: Record<string, unknown>;
    afterValue?: Record<string, unknown>;
    operatorId: string;
    operatorName?: string;
    createdAt: string;
}

// =============================================================================
// Domain: ACCOUNT (账户管理)
// =============================================================================

export interface Account {
    id: string;
    userId: string;
    userName: string;
    staffId: string;
    balance: number;
    frozenAt?: string;
    status: UserStatus;
    deptId?: string;
    deptName?: string;
}

export interface AdjustAccountRequest extends IdempotentRequest {
    amount: number;
    reason: string;
}

export interface WalletLog {
    id: string;
    userId: string;
    amount: number;
    type: WalletLogType;
    method?: PaymentMethod;
    relatedOrder?: string;
    balanceAfter: number;
    remark?: string;
    createdAt: string;
}

// =============================================================================
// Domain: TRADE (交易管理)
// =============================================================================

export interface Transaction {
    id: string;
    orderNo: string;
    userId: string;
    userName: string;
    canteenId: string;
    canteenName: string;
    totalAmount: number;
    paidAmount?: number;
    status: OrderStatus;
    payMethod?: PaymentMethod;
    pickupCode?: string;
    paidAt?: string;
    completedAt?: string;
    createdAt: string;
}

export interface CorrectTransactionRequest {
    reason: string;
}

export interface CheckoutRequest extends IdempotentRequest {
    canteenId: string;
    items: Array<{ dishId: string; quantity: number }>;
    totalAmount: number;
}

export interface CheckoutResponse {
    orderId: string;
    orderNo: string;
    pickupCode: string;
    paidAmount: number;
    balanceAfter: number;
}

export interface Order {
    id: string;
    orderNo: string;
    userId: string;
    canteenId: string;
    canteenName: string;
    totalAmount: number;
    paidAmount?: number;
    status: OrderStatus;
    payMethod?: PaymentMethod;
    pickupCode?: string;
    remark?: string;
    items: OrderItem[];
    paidAt?: string;
    completedAt?: string;
    createdAt: string;
}

export interface OrderItem {
    id: string;
    dishId: string;
    dishName: string;
    price: number;
    quantity: number;
    subtotal: number;
}

// =============================================================================
// Domain: REFUND (退款管理)
// =============================================================================

export interface RefundApplication {
    id: string;
    orderId: string;
    orderNo: string;
    applicantId: string;
    applicantName: string;
    amount: number;
    reason: string;
    status: RefundStatus;
    applyTime: string;
    auditTime?: string;
    auditorId?: string;
    auditorName?: string;
    auditRemark?: string;
    rejectReason?: string;
    executedAt?: string;
}

export interface CreateRefundRequest extends IdempotentRequest {
    orderId: string;
    amount: number;
    reason: string;
}

// =============================================================================
// Domain: APPEAL (申诉管理)
// =============================================================================

export interface Appeal {
    id: string;
    userId: string;
    userName: string;
    type: AppealType;
    relatedId?: string;
    content: string;
    images?: string[];
    status: AppealStatus;
    rejectReason?: string;
    resolution?: string;
    handlerId?: string;
    handlerName?: string;
    handledAt?: string;
    createdAt: string;
}

// =============================================================================
// Domain: MENU (餐厅菜单)
// =============================================================================

export interface Canteen {
    id: string;
    name: string;
    location: string;
    siteId?: string;
    isOpen: boolean;
    openHours?: { start: string; end: string }[];
    sortOrder: number;
    createdAt: string;
}

export interface Reservation {
    id: string;
    userId: string;
    mealTypeId: string;
    mealTypeName: string;
    mealDate: string;
    status: ReservationStatus;
    usedAt?: string;
    cancelledAt?: string;
    createdAt: string;
}

export interface CreateReservationRequest {
    mealType: MealTypeCode;
    dates: string[];
}

export interface ReservationCalendarDay {
    date: string;
    mealTypes: Array<{
        type: MealTypeCode;
        capacity: number;
        reserved: number;
        available: boolean;
        userReserved: boolean;
    }>;
}

export interface QueueTicket {
    id: string;
    queueNumber: string;
    serviceType: string;
    status: QueueStatus;
    waitingCount: number;
    estimatedWaitMinutes: number;
    createdAt: string;
}

// =============================================================================
// Domain: DISH (菜品管理)
// =============================================================================

export interface Dish {
    id: string;
    canteenId: string;
    canteenName: string;
    categoryId?: string;
    categoryName?: string;
    name: string;
    description?: string;
    imageUrl?: string;
    price: number;
    stock: number;
    tags?: string[];
    publishStatus: DishPublishStatus;
    isAvailable: boolean;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateDishRequest {
    name: string;
    price: number;
    canteenId: string;
    categoryId?: string;
    description?: string;
    tags?: string[];
}

export interface DishCategory {
    id: string;
    name: string;
    sortOrder: number;
}

// =============================================================================
// Domain: DEVICE (设备管理)
// =============================================================================

export interface Device {
    id: string;
    sn: string;
    name: string;
    type: DeviceType;
    ip?: string;
    canteenId: string;
    canteenName: string;
    siteId?: string;
    status: DeviceStatus;
    version?: string;
    lastHeartbeat?: string;
    createdAt: string;
}

export interface BindDeviceRequest {
    sn: string;
    canteenId: string;
    name?: string;
}

export interface SendCommandRequest {
    command: string;
    params?: Record<string, unknown>;
}

// =============================================================================
// Domain: NOTIFY (通知公告)
// =============================================================================

export interface Announcement {
    id: string;
    title: string;
    content: string;
    type: string;
    isTop: boolean;
    isPublished: boolean;
    publishedAt?: string;
    expireAt?: string;
    canteenId?: string;
    siteId?: string;
    createdBy: string;
    createdAt: string;
}

export interface Feedback {
    id: string;
    userId: string;
    userName: string;
    type: FeedbackType;
    content: string;
    relatedId?: string;
    images?: string[];
    status: FeedbackStatus;
    reply?: string;
    repliedBy?: string;
    repliedAt?: string;
    createdAt: string;
}

export interface CreateFeedbackRequest {
    type: FeedbackType;
    content: string;
    relatedId?: string;
    images?: string[];
}

// =============================================================================
// Domain: USER (用户端)
// =============================================================================

export interface UserProfile {
    id: string;
    staffId: string;
    name: string;
    phone: string;
    avatar?: string;
    deptId?: string;
    deptName?: string;
    regStatus: RegStatus;
    status: UserStatus;
    balance: number;
}

export interface RegisterRequest {
    name: string;
    phone: string;
    staffId: string;
    deptId?: string;
    idPhoto?: string;
}

export interface RechargeRequest extends IdempotentRequest {
    amount: number;
}

export interface RechargeResponse {
    transactionId: string;
    amount: number;
    balanceAfter: number;
}

export interface HomeData {
    user: UserProfile;
    balance: number;
    todayOrders: number;
    pendingReservations: number;
    announcements: Announcement[];
}

// =============================================================================
// Domain: COUPON (优惠券)
// =============================================================================

export interface UserCoupon {
    id: string;
    templateId: string;
    templateName: string;
    type: CouponType;
    value: number;
    minAmount?: number;
    maxDiscount?: number;
    status: UserCouponStatus;
    expireAt: string;
    createdAt: string;
}

export interface ActivateCouponRequest {
    code: string;
}

// =============================================================================
// Domain: REPORT (报表)
// =============================================================================

export interface ReportQuery {
    startDate: string;
    endDate: string;
    deptId?: string;
    canteenId?: string;
    userId?: string;
}

export interface ExportJob {
    id: string;
    type: string;
    status: ExportJobStatus;
    params?: Record<string, unknown>;
    fileUrl?: string;
    errorMsg?: string;
    totalCount?: number;
    createdBy: string;
    createdAt: string;
    completedAt?: string;
}

// =============================================================================
// Domain: SYSTEM (系统设置)
// =============================================================================

export interface AuditLog {
    id: string;
    traceId: string;
    operatorId: string;
    operatorName?: string;
    module: string;
    action: string;
    targetType?: string;
    targetId?: string;
    targetName?: string;
    beforeValue?: Record<string, unknown>;
    afterValue?: Record<string, unknown>;
    ip?: string;
    userAgent?: string;
    createdAt: string;
}

export interface Role {
    id: string;
    code: string;
    name: string;
    description?: string;
    isSystem: boolean;
    permissions: string[];
    createdAt: string;
}

export interface Permission {
    id: string;
    code: string;
    name: string;
    module: string;
    description?: string;
}

export interface AdminUser {
    id: string;
    username: string;
    name: string;
    phone?: string;
    email?: string;
    avatar?: string;
    deptId?: string;
    canteenId?: string;
    siteId?: string;
    status: AdminStatus;
    roles: Role[];
    lastLoginAt?: string;
    createdAt: string;
}

export interface SystemConfig {
    id: string;
    key: string;
    value: unknown;
    module: string;
    remark?: string;
    updatedBy?: string;
    updatedAt: string;
}

export interface CustomAttribute {
    id: string;
    entityType: string;
    fieldName: string;
    fieldType: string;
    label: string;
    options?: unknown;
    isRequired: boolean;
    sortOrder: number;
}

export interface Dictionary {
    id: string;
    category: string;
    code: string;
    name: string;
    sortOrder: number;
    isActive: boolean;
}

export interface Holiday {
    id: string;
    date: string;
    name: string;
    type: 'holiday' | 'workday';
}
