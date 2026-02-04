import api from '../config/api';

export interface LinkedInStreak {
    currentStreak: number;
    lastCompletedDate: string; // YYYY-MM-DD format
    longestStreak: number;
    totalCompletions: number;
}

// Get completed tasks for today from MySQL API
export async function getTodayCompletedTasks(): Promise<string[]> {
    try {
        const response = await api.get('/tasks/today');
        return response.data; // API returns array of task_ids
    } catch (error) {
        console.error('Error getting completed tasks:', error);
        return [];
    }
}

// Toggle task completion via MySQL API
export async function toggleTaskCompletion(taskId: string): Promise<boolean> {
    try {
        const response = await api.post('/tasks/toggle', { task_id: taskId });
        return response.data.completed;
    } catch (error) {
        console.error('Error toggling task:', error);
        return false;
    }
}

// Calculate completion percentage for today
export async function getTodayCompletionPercentage(totalTasks: number): Promise<number> {
    const completedTasks = await getTodayCompletedTasks();
    if (totalTasks === 0) return 0;
    return Math.round((completedTasks.length / totalTasks) * 100);
}

// Get LinkedIn streak data from MySQL API
export async function getLinkedInStreak(): Promise<LinkedInStreak> {
    try {
        const response = await api.get('/tasks/streaks');
        const streaks = response.data;
        const streak = streaks.find((s: any) => s.task_id === 'linkedin-zip');

        if (!streak) {
            return {
                currentStreak: 0,
                lastCompletedDate: '',
                longestStreak: 0,
                totalCompletions: 0,
            };
        }

        return {
            currentStreak: streak.current_streak,
            lastCompletedDate: streak.last_completed_date,
            longestStreak: streak.longest_streak,
            totalCompletions: streak.total_completions,
        };
    } catch (error) {
        console.error('Error getting LinkedIn streak:', error);
        return {
            currentStreak: 0,
            lastCompletedDate: '',
            longestStreak: 0,
            totalCompletions: 0,
        };
    }
}

// Utils (Same as before)
export function getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
}

export function isStreakAtRisk(streak: LinkedInStreak): boolean {
    const today = getTodayDate();
    const now = new Date();
    const currentHour = now.getHours();
    return streak.lastCompletedDate !== today && currentHour >= 17 && streak.currentStreak > 0;
}

export function getTimeUntilMidnight(): string {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
}
