import api from '../config/api';

export interface Notification {
    id?: string;
    user_id: string;
    type: 'reminder' | 'achievement' | 'streak_risk' | 'goal_progress' | 'system';
    title: string;
    message: string;
    is_read: boolean;
    action_url?: string;
    metadata?: any;
    created_at?: string;
    read_at?: string;
}

export interface Reminder {
    id?: string;
    user_id: string;
    task_id: string;
    reminder_time: string;
    days_of_week: number[];
    is_enabled: boolean;
    message?: string;
}

export interface DailyNote {
    id?: string;
    user_id: string;
    date: string;
    mood?: 'excellent' | 'good' | 'neutral' | 'bad' | 'terrible';
    energy_level?: number;
    note_content?: string;
    tags?: string[];
}

// Notifications
export async function getNotifications(): Promise<Notification[]> {
    try {
        const response = await api.get('/notifications');
        return response.data || [];
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return [];
    }
}

export async function markNotificationRead(notificationId: string): Promise<boolean> {
    try {
        await api.patch(`/notifications/${notificationId}/read`);
        return true;
    } catch (error) {
        console.error('Error marking notification read:', error);
        return false;
    }
}

// Reminders
export async function getReminders(): Promise<Reminder[]> {
    try {
        const response = await api.get('/notifications/reminders');
        return response.data || [];
    } catch (error) {
        console.error('Error fetching reminders:', error);
        return [];
    }
}

export async function saveReminder(reminder: Partial<Reminder>): Promise<boolean> {
    try {
        await api.post('/notifications/reminders', reminder);
        return true;
    } catch (error) {
        console.error('Error saving reminder:', error);
        return false;
    }
}

// Daily Notes / Journal
export async function getDailyNote(date: string): Promise<DailyNote | null> {
    try {
        const response = await api.get(`/notes/${date}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching daily note:', error);
        return null;
    }
}

export async function saveDailyNote(note: Partial<DailyNote>): Promise<boolean> {
    try {
        await api.post('/notes', note);
        return true;
    } catch (error) {
        console.error('Error saving daily note:', error);
        return false;
    }
}
