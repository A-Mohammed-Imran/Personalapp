import { useEffect, useState } from 'react';
import {
    getCurrentUser,
    onAuthStateChange,
    User,
} from '../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UseAuthReturn {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: Error | null;
}

/**
 * Custom hook for managing authentication state for MySQL backend
 */
export function useAuth(): UseAuthReturn {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function initializeAuth() {
            try {
                const token = await AsyncStorage.getItem('auth_token');
                if (token) {
                    const { user: currentUser, error: fetchError } = await getCurrentUser();
                    if (!fetchError) {
                        setUser(currentUser);
                    } else {
                        // Token might be invalid
                        await AsyncStorage.removeItem('auth_token');
                        setUser(null);
                    }
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error('Auth initialization error:', err);
                setError(err as Error);
            } finally {
                setIsLoading(false);
            }
        }

        initializeAuth();

        // Listen for auth state changes
        const unsubscribe = onAuthStateChange((newUser) => {
            setUser(newUser);
            setIsLoading(false);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return {
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
    };
}
