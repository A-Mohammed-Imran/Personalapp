import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATION_SCHEDULED_KEY = '@lifesync_notification_scheduled';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    // Newer Expo notification behavior fields
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Request notification permissions
export async function requestNotificationPermissions(): Promise<boolean> {
  if (!Device.isDevice) {
    console.log('Notifications only work on physical devices');
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Failed to get notification permissions');
    return false;
  }

  // Android requires a notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('morning-mode', {
      name: 'Morning Mode Alerts',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#6366f1',
      sound: 'default',
    });
  }

  return true;
}

// Schedule the 6:30 AM notification
export async function scheduleMorningEndNotification(): Promise<string | null> {
  try {
    // Check if already scheduled today
    const scheduledDate = await AsyncStorage.getItem(NOTIFICATION_SCHEDULED_KEY);
    const today = new Date().toDateString();
    
    if (scheduledDate === today) {
      console.log('Morning notification already scheduled for today');
      return null;
    }

    // Cancel any existing morning notifications
    await cancelMorningNotification();

    // Calculate next 6:30 AM
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(6, 30, 0, 0);

    // If it's already past 6:30 AM, schedule for tomorrow
    if (now >= scheduledTime) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    // Schedule the notification
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '🌅 Morning Mode Ended!',
        body: 'English Language session complete! Time to switch to your daily plan.',
        data: { type: 'morning-end' },
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: scheduledTime,
      },
    });

    // Save that we've scheduled for today
    await AsyncStorage.setItem(NOTIFICATION_SCHEDULED_KEY, today);

    console.log(`Morning notification scheduled for ${scheduledTime.toLocaleString()}`);
    return notificationId;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return null;
  }
}

// Schedule daily recurring notification at 6:30 AM
export async function scheduleDailyMorningNotification(): Promise<string | null> {
  try {
    // Cancel existing notifications first
    await cancelAllNotifications();

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '🌅 Morning Mode Ended!',
        body: 'English Language session complete! Time to switch to your daily plan.',
        data: { type: 'morning-end' },
        sound: 'default',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 6,
        minute: 30,
      },
    });

    console.log('Daily morning notification scheduled for 6:30 AM');
    return notificationId;
  } catch (error) {
    console.error('Error scheduling daily notification:', error);
    return null;
  }
}

// Cancel morning notification
export async function cancelMorningNotification(): Promise<void> {
  try {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    
    for (const notification of scheduledNotifications) {
      if (notification.content.data?.type === 'morning-end') {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    }
  } catch (error) {
    console.error('Error canceling notification:', error);
  }
}

// Cancel all scheduled notifications
export async function cancelAllNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error canceling all notifications:', error);
  }
}

// Get all scheduled notifications (for debugging)
export async function getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
  return await Notifications.getAllScheduledNotificationsAsync();
}

// Send an immediate test notification
export async function sendTestNotification(): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🧪 Test Notification',
      body: 'LifeSync AI notifications are working!',
      data: { type: 'test' },
    },
    trigger: null, // Immediate
  });
}

// Add notification listeners
export function addNotificationListeners(
  onNotificationReceived?: (notification: Notifications.Notification) => void,
  onNotificationResponse?: (response: Notifications.NotificationResponse) => void
) {
  const receivedSubscription = Notifications.addNotificationReceivedListener(
    (notification) => {
      console.log('Notification received:', notification);
      onNotificationReceived?.(notification);
    }
  );

  const responseSubscription = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      console.log('Notification response:', response);
      onNotificationResponse?.(response);
    }
  );

  return () => {
    receivedSubscription.remove();
    responseSubscription.remove();
  };
}
