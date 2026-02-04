import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_STORAGE_KEY = '@lifesync_completed_tasks';
const STREAK_STORAGE_KEY = '@lifesync_linkedin_streak';

export interface CompletedTask {
    taskId: string;
    completedAt: string; // ISO date string
    date: string; // YYYY-MM-DD format
}

export interface LinkedInStreak {
    currentStreak: number;
    lastCompletedDate: string; // YYYY-MM-DD format
    longestStreak: number;
    totalCompletions: number;
}

// Get today's date in YYYY-MM-DD format
export function getTodayDate(): string {
    const now = new Date();
    return now.toISOString().split('T')[0];
}

// Get completed tasks for today
export async function getTodayCompletedTasks(): Promise<string[]> {
    try {
        const tasksJson = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
        if (!tasksJson) return [];

        const tasks: CompletedTask[] = JSON.parse(tasksJson);
        const today = getTodayDate();

        return tasks
            .filter(task => task.date === today)
            .map(task => task.taskId);
    } catch (error) {
        console.error('Error getting completed tasks:', error);
        return [];
    }
}

// Mark a task as completed
export async function markTaskCompleted(taskId: string): Promise<void> {
    try {
        const tasksJson = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
        const tasks: CompletedTask[] = tasksJson ? JSON.parse(tasksJson) : [];

        const today = getTodayDate();
        const now = new Date().toISOString();

        // Check if already completed today
        const alreadyCompleted = tasks.some(
            task => task.taskId === taskId && task.date === today
        );

        if (!alreadyCompleted) {
            tasks.push({
                taskId,
                completedAt: now,
                date: today,
            });

            await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));

            // Update LinkedIn streak if it's the LinkedIn task
            if (taskId === 'linkedin-zip') {
                await updateLinkedInStreak();
            }
        }
    } catch (error) {
        console.error('Error marking task completed:', error);
    }
}

// Toggle task completion
export async function toggleTaskCompletion(taskId: string): Promise<boolean> {
    try {
        const tasksJson = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
        let tasks: CompletedTask[] = tasksJson ? JSON.parse(tasksJson) : [];

        const today = getTodayDate();
        const taskIndex = tasks.findIndex(
            task => task.taskId === taskId && task.date === today
        );

        if (taskIndex >= 0) {
            // Task is completed, uncomplete it
            tasks.splice(taskIndex, 1);
            await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));

            // Update LinkedIn streak if it's the LinkedIn task
            if (taskId === 'linkedin-zip') {
                await updateLinkedInStreak();
            }

            return false;
        } else {
            // Task is not completed, complete it
            await markTaskCompleted(taskId);
            return true;
        }
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

// Get LinkedIn streak data
export async function getLinkedInStreak(): Promise<LinkedInStreak> {
    try {
        const streakJson = await AsyncStorage.getItem(STREAK_STORAGE_KEY);
        if (!streakJson) {
            return {
                currentStreak: 0,
                lastCompletedDate: '',
                longestStreak: 0,
                totalCompletions: 0,
            };
        }
        return JSON.parse(streakJson);
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

// Update LinkedIn streak
async function updateLinkedInStreak(): Promise<void> {
    try {
        const completedTasks = await getTodayCompletedTasks();
        const isCompletedToday = completedTasks.includes('linkedin-zip');
        const streak = await getLinkedInStreak();
        const today = getTodayDate();

        if (isCompletedToday) {
            // Task completed today
            if (streak.lastCompletedDate === today) {
                // Already counted for today
                return;
            }

            const yesterday = getYesterdayDate();

            if (streak.lastCompletedDate === yesterday || streak.lastCompletedDate === '') {
                // Continue streak or start new streak
                streak.currentStreak += 1;
            } else {
                // Streak broken, start new
                streak.currentStreak = 1;
            }

            streak.lastCompletedDate = today;
            streak.totalCompletions += 1;

            if (streak.currentStreak > streak.longestStreak) {
                streak.longestStreak = streak.currentStreak;
            }
        } else {
            // Task not completed today
            const yesterday = getYesterdayDate();

            if (streak.lastCompletedDate !== today && streak.lastCompletedDate !== yesterday) {
                // Streak broken
                streak.currentStreak = 0;
            }
        }

        await AsyncStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(streak));
    } catch (error) {
        console.error('Error updating LinkedIn streak:', error);
    }
}

// Get yesterday's date in YYYY-MM-DD format
function getYesterdayDate(): string {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
}

// Check if streak is at risk (not completed today and it's past a certain time)
export function isStreakAtRisk(streak: LinkedInStreak): boolean {
    const today = getTodayDate();
    const now = new Date();
    const currentHour = now.getHours();

    // If not completed today and it's past 5 PM, streak is at risk
    return streak.lastCompletedDate !== today && currentHour >= 17 && streak.currentStreak > 0;
}

// Get time remaining to maintain streak (until midnight)
export function getTimeUntilMidnight(): string {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);

    const diff = midnight.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
}
