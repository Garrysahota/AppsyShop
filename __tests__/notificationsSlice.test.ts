import notificationsReducer, {
  markAllAsRead,
  markAsRead,
  setSelectedCategory,
  deleteNotification,
  clearAllNotifications,
} from '../src/features/notifications/store/notificationsSlice';
import { NotificationsState } from '../src/features/notifications/types';

describe('notificationsSlice', () => {
  const initialTestState: NotificationsState = {
    items: [
      {
        id: 'notif-1',
        category: 'drops',
        title: 'Drop Live',
        message: 'Travis Scott AJ1 Live',
        timestamp: '2026-08-18T20:00:00Z',
        timeAgo: '2m ago',
        isRead: false,
        iconType: 'flame',
      },
      {
        id: 'notif-2',
        category: 'orders',
        title: 'Rider En Route',
        message: 'Marcus Vance is 6 mins away',
        timestamp: '2026-08-18T19:50:00Z',
        timeAgo: '12m ago',
        isRead: false,
        iconType: 'truck',
      },
    ],
    selectedCategory: 'all',
  };

  it('should filter by category', () => {
    const newState = notificationsReducer(
      initialTestState,
      setSelectedCategory('drops'),
    );
    expect(newState.selectedCategory).toBe('drops');
  });

  it('should mark a specific notification as read', () => {
    const newState = notificationsReducer(
      initialTestState,
      markAsRead('notif-1'),
    );
    expect(newState.items[0].isRead).toBe(true);
    expect(newState.items[1].isRead).toBe(false);
  });

  it('should mark all notifications as read', () => {
    const newState = notificationsReducer(initialTestState, markAllAsRead());
    expect(newState.items.every(n => n.isRead)).toBe(true);
  });

  it('should delete a notification', () => {
    const newState = notificationsReducer(
      initialTestState,
      deleteNotification('notif-1'),
    );
    expect(newState.items.length).toBe(1);
    expect(newState.items[0].id).toBe('notif-2');
  });

  it('should clear all notifications', () => {
    const newState = notificationsReducer(
      initialTestState,
      clearAllNotifications(),
    );
    expect(newState.items.length).toBe(0);
  });
});
