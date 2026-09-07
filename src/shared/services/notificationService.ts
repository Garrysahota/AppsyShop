import { PermissionsAndroid, Platform } from 'react-native';
import {
  AuthorizationStatus,
  getMessaging,
  getToken,
  onMessage,
  RemoteMessage,
  requestPermission,
} from '@react-native-firebase/messaging';

class NotificationService {
  
  async requestPermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'Enable Drop Alerts',
            message: 'Get notified instantly when exclusive sneakers, flash sales, and order updates drop!',
            buttonPositive: 'Allow',
            buttonNegative: 'Not Now',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const messaging = getMessaging();
        const authStatus = await requestPermission(messaging);
        const enabled =
          authStatus === AuthorizationStatus.AUTHORIZED ||
          authStatus === AuthorizationStatus.PROVISIONAL;
        return enabled;
      }
    } catch (error) {
      console.warn('[Notifications] Permission request error:', error);
      return false;
    }
  }

  async getFCMToken(): Promise<string | null> {
    try {
      const messaging = getMessaging();
      const token = await getToken(messaging);
      console.log('[Notifications] FCM Token:', token);
      return token;
    } catch (error) {
      console.log('[Notifications] FCM token unavailable in current environment:', error);
      return null;
    }
  }

  onForegroundMessage(callback: (message: RemoteMessage) => void) {
    try {
      const messaging = getMessaging();
      return onMessage(messaging, async remoteMessage => {
        console.log('[Notifications] Foreground message received:', remoteMessage);
        callback(remoteMessage);
      });
    } catch (err) {
      console.warn('[Notifications] Failed to attach message listener:', err);
      return () => {};
    }
  }
}

export const notificationService = new NotificationService();
export default notificationService;
