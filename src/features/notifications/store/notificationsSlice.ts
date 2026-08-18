/**
 * Notifications Slice — AppsyShop
 * Manages notification alerts, unread states, filtering, and deep-link actions.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationCategory, NotificationItem, NotificationsState } from '../types';

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    category: 'drops',
    title: '⚡ EXCLUSIVE DROP LIVE',
    message:
      'Travis Scott x Air Jordan 1 Low OG Reverse Mocha is now live in your zone! Only 2 pairs left in warehouse.',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    timeAgo: '2m ago',
    isRead: false,
    targetScreen: 'ProductDetail',
    targetParams: { productId: 'snk-1' },
    iconType: 'flame',
  },
  {
    id: 'notif-2',
    category: 'orders',
    title: '🚀 RIDER EN ROUTE (6 MINS)',
    message:
      'Rider Marcus Vance is speeding your way with Order #SNK-9042. Estimated drop in 6 minutes.',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    timeAgo: '15m ago',
    isRead: false,
    targetScreen: 'Orders',
    iconType: 'truck',
  },
  {
    id: 'notif-3',
    category: 'promos',
    title: '🏷️ VIP DROP PROMO UNLOCKED',
    message:
      'Use code "VIPDROP10" at checkout for 10% off any deadstock sneakers copped today.',
    timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    timeAgo: '2h ago',
    isRead: false,
    targetScreen: 'Cart',
    iconType: 'tag',
  },
  {
    id: 'notif-4',
    category: 'drops',
    title: '🔥 RESTOCK ALERT: PANDA DUNKS',
    message:
      'Nike Dunk Low "Panda Retro" restocked in US Men\'s 9, 9.5 and 10 at Manhattan hub.',
    timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    timeAgo: '5h ago',
    isRead: true,
    targetScreen: 'ProductDetail',
    targetParams: { productId: 'snk-2' },
    iconType: 'zap',
  },
  {
    id: 'notif-5',
    category: 'orders',
    title: '🛡️ NFC AUTHENTICITY VERIFIED',
    message:
      'Your previous drop Nike Dunk Low Panda passed our 12-point authentication protocol.',
    timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    timeAgo: 'Yesterday',
    isRead: true,
    targetScreen: 'Orders',
    iconType: 'sparkles',
  },
];

const initialState: NotificationsState = {
  items: INITIAL_NOTIFICATIONS,
  selectedCategory: 'all',
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<NotificationCategory>) => {
      state.selectedCategory = action.payload;
    },

    markAsRead: (state, action: PayloadAction<string>) => {
      const item = state.items.find(n => n.id === action.payload);
      if (item) {
        item.isRead = true;
      }
    },

    markAllAsRead: state => {
      state.items.forEach(n => {
        n.isRead = true;
      });
    },

    deleteNotification: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(n => n.id !== action.payload);
    },

    clearAllNotifications: state => {
      state.items = [];
    },
  },
});

export const {
  setSelectedCategory,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
