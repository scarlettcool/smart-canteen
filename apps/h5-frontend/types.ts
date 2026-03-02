
export type TabType = 'home' | 'orders' | 'coupons' | 'profile';

export type ReservationStatus = 'available' | 'full' | 'expired' | 'restricted';

export interface DateOption {
  date: string;
  day: string;
  status: ReservationStatus;
}

export interface Canteen {
  id: string;
  name: string;
  location: string;
  status: 'open' | 'closed';
  distance: string;
}

export interface Order {
  id: string;
  type: 'dine-in' | 'reservation';
  title: string;
  amount: number;
  status: 'completed' | 'pending' | 'cancelled';
  date: string;
  canteenName?: string;
}

export interface Dish {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  tag: string;
  category: string;
}

export interface Coupon {
  id: string;
  title: string;
  value: string;
  expiry: string;
  type: 'discount' | 'cash';
  rules: string;
}
