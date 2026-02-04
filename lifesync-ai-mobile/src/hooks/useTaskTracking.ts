import { useState, useEffect, useCallback } from 'react';
import {
    getTodayCompletedTasks,
    toggleTaskCompletion,
    getTodayCompletionPercentage,
    getLinkedInStreak,
    isStreakAtRisk,
    getTimeUntilMidnight,
    LinkedInStreak,
} from '../services/taskTracking';

interface UseTaskTrackingReturn {
    completedTasks: string[];
    completionPercentage: number;
    linkedInStreak: LinkedInStreak;
    streakAtRisk: boolean;
    timeUntilMidnight: string;
    toggleTask: (taskId: string) => Promise<void>;
    isTaskCompleted: (taskId: string) => boolean;
    refreshTasks: () => Promise<void>;
}

export function useTaskTracking(totalTasks: number): UseTaskTrackingReturn {
    const [completedTasks, setCompletedTasks] = useState<string[]>([]);
    const [completionPercentage, setCompletionPercentage] = useState(0);
    const [linkedInStreak, setLinkedInStreak] = useState<LinkedInStreak>({
        currentStreak: 0,
        lastCompletedDate: '',
        longestStreak: 0,
        totalCompletions: 0,
    });
    const [streakAtRisk, setStreakAtRisk] = useState(false);
    const [timeUntilMidnight, setTimeUntilMidnight] = useState('');

    // Load tasks and streak data
    const refreshTasks = useCallback(async () => {
        try {
            const tasks = await getTodayCompletedTasks();
            setCompletedTasks(tasks);

            const percentage = await getTodayCompletionPercentage(totalTasks);
            setCompletionPercentage(percentage);

            const streak = await getLinkedInStreak();
            setLinkedInStreak(streak);
            setStreakAtRisk(isStreakAtRisk(streak));
            setTimeUntilMidnight(getTimeUntilMidnight());
        } catch (error) {
            console.error('Error refreshing tasks:', error);
        }
    }, [totalTasks]);

    // Initial load
    useEffect(() => {
        refreshTasks();
    }, [refreshTasks]);

    // Update time until midnight every minute
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeUntilMidnight(getTimeUntilMidnight());

            // Also check if streak is at risk
            const checkStreak = async () => {
                const streak = await getLinkedInStreak();
                setStreakAtRisk(isStreakAtRisk(streak));
            };
            checkStreak();
        }, 60000); // Every minute

        return () => clearInterval(interval);
    }, []);

    // Toggle task completion
    const toggleTask = useCallback(async (taskId: string) => {
        await toggleTaskCompletion(taskId);
        await refreshTasks();
    }, [refreshTasks]);

    // Check if a task is completed
    const isTaskCompleted = useCallback((taskId: string) => {
        return completedTasks.includes(taskId);
    }, [completedTasks]);

    return {
        completedTasks,
        completionPercentage,
        linkedInStreak,
        streakAtRisk,
        timeUntilMidnight,
        toggleTask,
        isTaskCompleted,
        refreshTasks,
    };
}
