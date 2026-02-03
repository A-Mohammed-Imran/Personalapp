import { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import {
  requestNotificationPermissions,
  scheduleDailyMorningNotification,
  addNotificationListeners,
  getScheduledNotifications,
} from '../services/notifications';

interface UseNotificationsReturn {
  permissionGranted: boolean;
  isScheduled: boolean;
  scheduledNotifications: Notifications.NotificationRequest[];
  requestPermissions: () => Promise<void>;
  scheduleNotification: () => Promise<void>;
}

export function useNotifications(): UseNotificationsReturn {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledNotifications, setScheduledNotifications] = useState<Notifications.NotificationRequest[]>([]);

  // Setup notifications on mount
  useEffect(() => {
    const setup = async () => {
      // Request permissions
      const granted = await requestNotificationPermissions();
      setPermissionGranted(granted);

      if (granted) {
        // Schedule daily notification
        await scheduleDailyMorningNotification();
        setIsScheduled(true);

        // Get scheduled notifications
        const notifications = await getScheduledNotifications();
        setScheduledNotifications(notifications);
      }
    };

    setup();

    // Add notification listeners
    const cleanup = addNotificationListeners(
      (notification) => {
        // Handle notification received while app is open
        console.log('Notification received in foreground:', notification.request.content.title);
      },
      (response) => {
        // Handle user tapping on notification
        const data = response.notification.request.content.data;
        if (data?.type === 'morning-end') {
          console.log('User tapped morning end notification');
          // Could navigate to a specific screen here
        }
      }
    );

    return cleanup;
  }, []);

  const requestPermissions = async () => {
    const granted = await requestNotificationPermissions();
    setPermissionGranted(granted);
  };

  const scheduleNotification = async () => {
    if (permissionGranted) {
      await scheduleDailyMorningNotification();
      setIsScheduled(true);
      const notifications = await getScheduledNotifications();
      setScheduledNotifications(notifications);
    }
  };

  return {
    permissionGranted,
    isScheduled,
    scheduledNotifications,
    requestPermissions,
    scheduleNotification,
  };
}
