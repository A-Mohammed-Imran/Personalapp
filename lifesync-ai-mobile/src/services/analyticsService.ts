import api from '../config/api';

export interface DailyAnalytics {
    id?: string;
    user_id: string;
    date: string;
    total_tasks: number;
    completed_tasks: number;
    completion_rate: number;
    active_time_minutes: number;
    plan_used: 'planA' | 'planB' | 'morning';
    created_at?: string;
    updated_at?: string;
}

export interface WeeklySummary {
    id?: string;
    user_id: string;
    week_start_date: string;
    week_end_date: string;
    total_completions: number;
    average_completion_rate: number;
    most_productive_day: string;
    total_active_days: number;
    created_at?: string;
}

export interface Achievement {
    id?: string;
    user_id: string;
    achievement_type: string;
    title: string;
    description: string;
    icon: string;
    earned_at: string;
    metadata?: any;
}

export interface UserGoal {
    id?: string;
    user_id: string;
    goal_type: 'daily' | 'weekly' | 'monthly' | 'custom';
    title: string;
    description?: string;
    target_value: number;
    current_value: number;
    start_date: string;
    end_date?: string;
    is_completed: boolean;
    completed_at?: string;
    created_at?: string;
    updated_at?: string;
}

// Get daily analytics for a range
export async function getAnalyticsRange(startDate: string, endDate: string): Promise<DailyAnalytics[]> {
    try {
        const response = await api.get('/analytics/daily', { params: { startDate, endDate } });
        return response.data || [];
    } catch (error) {
        console.error('Error fetching analytics range:', error);
        return [];
    }
}

// Sync/Calculate daily analytics
export async function calculateDailyAnalytics(
    date: string,
    totalTasks: number,
    completedTasks: number,
    planUsed: 'planA' | 'planB' | 'morning'
): Promise<boolean> {
    try {
        await api.post(`/analytics/sync/${date}`, { totalTasks, planUsed });
        return true;
    } catch (error) {
        console.error('Error syncing analytics:', error);
        return false;
    }
}

// Goals
export async function getUserGoals(includeCompleted: boolean = false): Promise<UserGoal[]> {
    try {
        const response = await api.get('/goals');
        let goals = response.data || [];
        if (!includeCompleted) {
            goals = goals.filter((g: UserGoal) => !g.is_completed);
        }
        return goals;
    } catch (error) {
        console.error('Error fetching user goals:', error);
        return [];
    }
}

export async function createGoal(
    goalType: string,
    title: string,
    description: string,
    targetValue: number,
    startDate: string,
    endDate?: string
): Promise<UserGoal | null> {
    try {
        const response = await api.post('/goals', {
            goal_type: goalType,
            title,
            description,
            target_value: targetValue,
            start_date: startDate,
            end_date: endDate
        });
        return response.data;
    } catch (error) {
        console.error('Error creating goal:', error);
        return null;
    }
}

export async function updateGoalProgress(goalId: string, newValue: number): Promise<boolean> {
    try {
        await api.patch(`/goals/${goalId}`, { current_value: newValue });
        return true;
    } catch (error) {
        console.error('Error updating goal progress:', error);
        return false;
    }
}

// Achievements
export async function getUserAchievements(): Promise<Achievement[]> {
    try {
        const response = await api.get('/goals/achievements');
        return response.data || [];
    } catch (error) {
        console.error('Error fetching achievements:', error);
        return [];
    }
}
