// This file is kept to maintain compatibility with existing imports 
// while transitioning from Supabase to MySQL.

export const isSupabaseConfigured = true;

// Mock Supabase client if needed (but prefer using the new api config)
export const supabase = {
  auth: {
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
    getSession: async () => ({ data: { session: null }, error: null }),
  }
};
