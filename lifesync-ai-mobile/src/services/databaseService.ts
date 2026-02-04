import api from '../config/api';

export interface LinkedInStreak {
    current_streak: number;
    last_completed_date: string;
    longest_streak: number;
    total_completions: number;
}

export const getTodayCompletedTasks = async (): Promise<string[]> => {
    try {
        const response = await api.get('/tasks/today');
        return response.data;
    } catch (error) {
        console.error('Error getting today completed tasks:', error);
        return [];
    }
};

export const markTaskCompleted = async (taskId: string): Promise<void> => {
    try {
        await api.post('/tasks/toggle', { task_id: taskId });
    } catch (error) {
        console.error('Error marking task completed:', error);
    }
};

export const toggleTaskCompletion = async (taskId: string): Promise<boolean> => {
    try {
        const response = await api.post('/tasks/toggle', { task_id: taskId });
        return response.data.completed;
    } catch (error) {
        console.error('Error toggling task completion:', error);
        return false;
    }
};

export const getTodayCompletionPercentage = async (totalTasks: number): Promise<number> => {
    const completedTasks = await getTodayCompletedTasks();
    if (totalTasks === 0) return 0;
    return Math.round((completedTasks.length / totalTasks) * 100);
};

export const getLinkedInStreak = async (): Promise<LinkedInStreak> => {
    try {
        const response = await api.get('/tasks/streaks');
        const streaks = response.data;
        const linkedinStreak = streaks.find((s: any) => s.task_id === 'linkedin-zip');

        return linkedinStreak || {
            current_streak: 0,
            last_completed_date: '',
            longest_streak: 0,
            total_completions: 0,
        };
    } catch (error) {
        console.error('Error getting LinkedIn streak:', error);
        return {
            current_streak: 0,
            last_completed_date: '',
            longest_streak: 0,
            total_completions: 0,
        };
    }
};

export const isStreakAtRisk = (streak: LinkedInStreak): boolean => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const currentHour = now.getHours();

    // If not completed today and it's past 5 PM, streak is at risk
    return streak.last_completed_date !== today && currentHour >= 17 && streak.current_streak > 0;
};

export const getTimeUntilMidnight = (): string => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);

    const diff = midnight.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
};

export const getTodayDate = (): string => {
    return new Date().toISOString().split('T')[0];
};

export const subscribeToTaskUpdates = (userId: string, callback: () => void) => {
    // In a real MySQL app, we would use WebSockets (Socket.io)
    // For now, we'll return a no-op
    return () => { };
};

export const subscribeToStreakUpdates = (userId: string, callback: () => void) => {
    return () => { };
};
