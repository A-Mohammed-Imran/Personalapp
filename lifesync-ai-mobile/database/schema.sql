-- LifeSync AI Mobile - PostgreSQL Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can only read/update their own data
CREATE POLICY "Users can view own profile"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = id);

-- =====================================================
-- COMPLETED TASKS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.completed_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    task_id TEXT NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure one completion per task per day per user
    UNIQUE(user_id, task_id, date)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_completed_tasks_user_id ON public.completed_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_completed_tasks_date ON public.completed_tasks(date);
CREATE INDEX IF NOT EXISTS idx_completed_tasks_task_id ON public.completed_tasks(task_id);

-- Enable Row Level Security
ALTER TABLE public.completed_tasks ENABLE ROW LEVEL SECURITY;

-- Users can only access their own completed tasks
CREATE POLICY "Users can view own completed tasks"
    ON public.completed_tasks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own completed tasks"
    ON public.completed_tasks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own completed tasks"
    ON public.completed_tasks FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- STREAKS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.streaks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    task_id TEXT NOT NULL,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_completed_date DATE,
    total_completions INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure one streak record per task per user
    UNIQUE(user_id, task_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_streaks_user_id ON public.streaks(user_id);
CREATE INDEX IF NOT EXISTS idx_streaks_task_id ON public.streaks(task_id);

-- Enable Row Level Security
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;

-- Users can only access their own streaks
CREATE POLICY "Users can view own streaks"
    ON public.streaks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own streaks"
    ON public.streaks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own streaks"
    ON public.streaks FOR UPDATE
    USING (auth.uid() = user_id);

-- =====================================================
-- USER PREFERENCES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
    preferred_plan TEXT DEFAULT 'planA' CHECK (preferred_plan IN ('planA', 'planB')),
    notifications_enabled BOOLEAN DEFAULT TRUE,
    theme TEXT DEFAULT 'dark' CHECK (theme IN ('light', 'dark', 'auto')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON public.user_preferences(user_id);

-- Enable Row Level Security
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Users can only access their own preferences
CREATE POLICY "Users can view own preferences"
    ON public.user_preferences FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
    ON public.user_preferences FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
    ON public.user_preferences FOR UPDATE
    USING (auth.uid() = user_id);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_streaks_updated_at
    BEFORE UPDATE ON public.streaks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNCTION TO CREATE USER PROFILE ON SIGNUP
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    
    -- Create default preferences
    INSERT INTO public.user_preferences (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================
-- Uncomment to insert sample data for testing
/*
-- Insert a test user (you'll need to sign up first to get a real user ID)
-- Replace 'YOUR_USER_ID' with actual UUID from auth.users

INSERT INTO public.completed_tasks (user_id, task_id, date, completed_at)
VALUES 
    ('YOUR_USER_ID', 'peerup-english', CURRENT_DATE, NOW()),
    ('YOUR_USER_ID', 'linkedin-zip', CURRENT_DATE, NOW());

INSERT INTO public.streaks (user_id, task_id, current_streak, longest_streak, last_completed_date, total_completions)
VALUES 
    ('YOUR_USER_ID', 'linkedin-zip', 5, 10, CURRENT_DATE, 15);
*/
