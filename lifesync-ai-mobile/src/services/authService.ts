import api from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
}

export const signUp = async (email: string, password: string, fullName?: string) => {
    try {
        const response = await api.post('/auth/register', { email, password, full_name: fullName });
        const { token, user } = response.data;
        await AsyncStorage.setItem('auth_token', token);
        return { user, error: null };
    } catch (error: any) {
        return { user: null, error: error.response?.data?.error || error.message };
    }
};

export const signIn = async (email: string, password: string) => {
    try {
        const response = await api.post('/auth/login', { email, password });
        const { token, user } = response.data;
        await AsyncStorage.setItem('auth_token', token);
        return { user, error: null };
    } catch (error: any) {
        return { user: null, error: error.response?.data?.error || error.message };
    }
};

export const signOut = async () => {
    await AsyncStorage.removeItem('auth_token');
};

export const getCurrentUser = async (): Promise<{ user: User | null; error: any }> => {
    try {
        const response = await api.get('/auth/me');
        return { user: response.data, error: null };
    } catch (error: any) {
        return { user: null, error: error.response?.data?.error || error.message };
    }
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
    // This is a simpler version of Supabase's listener
    // In a real app, you might use an Event Emitter or a state management library
    const checkAuth = async () => {
        const { user } = await getCurrentUser();
        callback(user);
    };
    checkAuth();

    // Return a dummy unsubscribe
    return () => { };
};
