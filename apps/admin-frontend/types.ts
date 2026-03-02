
export enum UserRole {
  ADMIN = 'ADMIN',
  FINANCE = 'FINANCE',
  OPERATOR = 'OPERATOR',
  CANTEEN_MANAGER = 'CANTEEN_MANAGER'
}

export interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  children?: MenuItem[];
  permissions?: string[];
}

export interface PageMetadata {
  title: string;
  description: string;
  breadcrumb: string[];
}

export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message?: string;
  traceId: string;
}

export interface UserArchive {
  id: string;
  staffId: string;
  name: string;
  deptName: string;
  phone: string;
  status: 'active' | 'suspended' | 'resigned';
  balance: number;
  createTime: string;
}

// --- Sprint 2: Consumption Types ---

export interface TradeRecord {
  id: string;
  staffId: string;
  name: string;
  amount: number;
  type: 'consumption' | 'recharge' | 'refund' | 'adjustment';
  method: 'balance' | 'wechat' | 'card' | 'face';
  canteen: string;
  deviceId?: string;
  status: 'success' | 'fail' | 'processing' | 'corrected';
  timestamp: string;
  traceId: string;
}

export interface RefundApplication {
  id: string;
  tradeId: string;
  applicant: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  applyTime: string;
  auditTime?: string;
  auditor?: string;
}

export interface DeviceInfo {
  id: string;
  name: string;
  type: 'pos' | 'recharge_kiosk' | 'gate';
  ip: string;
  status: 'online' | 'offline' | 'error';
  lastHeartbeat: string;
  canteen: string;
  version: string;
}

// --- Sprint 3: Dish & Canteen Management ---

export interface Dish {
  id: string;
  name: string;
  category: string;
  price: number;
  calories: number;
  image?: string;
  status: 'available' | 'sold_out' | 'discontinued';
  tags: string[];
}

export interface Reservation {
  id: string;
  staffId: string;
  dishName: string;
  canteenName: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  date: string;
  status: 'reserved' | 'completed' | 'canceled' | 'no_show';
}

// --- Sprint 4: System & Security ---

export interface AuditLog {
  id: string;
  operator: string;
  action: string;
  module: string;
  ip: string;
  status: 'success' | 'fail';
  timestamp: string;
  details: string;
}

export interface Role {
  id: string;
  name: string;
  code: string;
  description: string;
  permissions: string[];
  memberCount: number;
}
