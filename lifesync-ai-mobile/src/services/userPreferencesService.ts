import api from '../config/api';

export interface UserPreferences {
    preferred_plan: 'planA' | 'planB';
    notifications_enabled: boolean;
    theme: 'light' | 'dark' | 'auto';
}

export const getUserPreferences = async (): Promise<UserPreferences | null> => {
    try {
        const response = await api.get('/preferences');
        return response.data;
    } catch (error) {
        console.error('Error getting user preferences:', error);
        return null;
    }
};

export const updatePreferredPlan = async (plan: 'planA' | 'planB'): Promise<void> => {
    try {
        await api.put('/preferences', { preferred_plan: plan });
    } catch (error) {
        console.error('Error updating preferred plan:', error);
    }
};

export const updateNotificationsEnabled = async (enabled: boolean): Promise<void> => {
    try {
        await api.put('/preferences', { notifications_enabled: enabled });
    } catch (error) {
        console.error('Error updating notifications enabled:', error);
    }
};

export const updateTheme = async (theme: 'light' | 'dark' | 'auto'): Promise<void> => {
    try {
        await api.put('/preferences', { theme });
    } catch (error) {
        console.error('Error updating theme:', error);
    }
};

export const updateAllPreferences = async (preferences: Partial<UserPreferences>): Promise<void> => {
    try {
        await api.put('/preferences', preferences);
    } catch (error) {
        console.error('Error updating all preferences:', error);
    }
};

export const subscribeToPreferenceUpdates = (userId: string, callback: () => void) => {
    // WebSockets placeholder
    return () => { };
};
