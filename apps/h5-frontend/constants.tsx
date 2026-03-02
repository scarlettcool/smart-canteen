
import React from 'react';
import { DateOption, Canteen, Dish, Order, Coupon } from './types';

export const MOCK_CANTEENS: Canteen[] = [
  { id: '1', name: '第一餐厅 (行政楼)', location: '行政办公楼B1层', status: 'open', distance: '100m' },
  { id: '2', name: '第二餐厅 (研发中心)', location: '研发大楼1层', status: 'open', distance: '450m' },
  { id: '3', name: '清真风味餐厅', location: '生活服务区3层', status: 'closed', distance: '800m' },
];

export const MOCK_RESERVATION_DATES: DateOption[] = [
  { date: '25', day: '周一', status: 'expired' },
  { date: '26', day: '周二', status: 'available' },
  { date: '27', day: '周三', status: 'full' },
  { date: '28', day: '周四', status: 'available' },
  { date: '29', day: '周五', status: 'restricted' },
  { date: '30', day: '周六', status: 'available' },
  { date: '31', day: '周日', status: 'available' },
];

export const MOCK_DISHES: Dish[] = [
  { 
    id: 'd1', 
    name: '宫保鸡丁套餐', 
    price: 18.0, 
    imageUrl: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=800&auto=format&fit=crop', 
    description: '经典川菜风味，精选鸡腿肉搭配脆皮花生，酸甜适度，咸鲜可口。', 
    tag: '经典', 
    category: '精品套餐' 
  },
  { 
    id: 'd2', 
    name: '农家小炒肉', 
    price: 16.0, 
    imageUrl: 'https://images.unsplash.com/photo-1512058560366-cd2427ffaa64?q=80&w=800&auto=format&fit=crop', 
    description: '地道湖南风味，精选新鲜猪五花配上线椒爆炒，锅气十足。', 
    tag: '下饭', 
    category: '精品套餐' 
  },
  { 
    id: 'd3', 
    name: '番茄炒蛋套餐', 
    price: 12.0, 
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop', 
    description: '家常必备，新鲜番茄与土鸡蛋的完美融合，汤汁拌饭一绝。', 
    tag: '健康', 
    category: '家常小炒' 
  },
  { 
    id: 'd4', 
    name: '蒜蓉手撕包菜', 
    price: 10.0, 
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop', 
    description: '清脆爽口，大火快炒保留包菜原有的鲜甜，微微带辣。', 
    tag: '清淡', 
    category: '家常小炒' 
  },
];

export const MOCK_SPECIALS: Dish[] = [
  { 
    id: 's1', 
    name: '红烧狮子头', 
    price: 20.0, 
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop', 
    description: '主厨秘制肉丸，慢火炖煮3小时，入口即化，汤浓味美。', 
    tag: '招牌', 
    category: '特色菜' 
  },
  { 
    id: 's2', 
    name: '金牌白斩鸡', 
    price: 28.0, 
    imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=800&auto=format&fit=crop', 
    description: '选用优质三黄鸡，皮爽肉滑，配上秘制姜蓉蘸料。', 
    tag: '限时', 
    category: '特色菜' 
  },
];

export const MOCK_ORDERS: Order[] = [
  { id: 'o1', type: 'dine-in', title: '午餐点餐 - 第一餐厅', amount: 18.0, status: 'completed', date: '2023-10-24 12:30', canteenName: '第一餐厅' },
  { id: 'o2', type: 'reservation', title: '晚餐预约 - 第二餐厅', amount: 0, status: 'pending', date: '2023-10-25 18:00', canteenName: '第二餐厅' },
  { id: 'o3', type: 'dine-in', title: '早餐点餐 - 第一餐厅', amount: 12.0, status: 'completed', date: '2023-10-24 08:15', canteenName: '第一餐厅' },
  { id: 'o4', type: 'dine-in', title: '咖啡消费 - 瑞幸咖啡', amount: 18.5, status: 'cancelled', date: '2023-10-23 15:40' },
];

export const MOCK_COUPONS: Coupon[] = [
  { id: 'c1', title: '新人满减券', value: '5', expiry: '2023-12-31', type: 'cash', rules: '满20元可用，不与其他优惠同享。仅限午餐时段使用。' },
  { id: 'c2', title: '午餐8折优惠', value: '8折', expiry: '2023-11-15', type: 'discount', rules: '最高抵扣10元。仅限第一餐厅使用。' },
];
