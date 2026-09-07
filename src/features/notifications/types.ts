export type NotificationCategory = 'all' | 'drops' | 'orders' | 'promos';

export interface NotificationItem {
  id: string;
  category: 'drops' | 'orders' | 'promos';
  title: string;
  message: string;
  timestamp: string;
  timeAgo: string;
  isRead: boolean;
  targetScreen?: 'ProductDetail' | 'Orders' | 'Cart';
  targetParams?: Record<string, any>;
  iconType: 'flame' | 'truck' | 'tag' | 'sparkles' | 'zap';
}

export interface NotificationsState {
  items: NotificationItem[];
  selectedCategory: NotificationCategory;
}
