-- LifeSync AI Mobile - Enhanced Database Schema v2.0
-- Run this SQL in your Supabase SQL Editor AFTER running schema.sql

-- =====================================================
-- ANALYTICS & INSIGHTS
-- =====================================================

-- Daily Analytics Table
CREATE TABLE IF NOT EXISTS public.daily_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_tasks INTEGER DEFAULT 0,
    completed_tasks INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0.00,
    active_time_minutes INTEGER DEFAULT 0,
    plan_used TEXT CHECK (plan_used IN ('planA', 'planB', 'morning')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_daily_analytics_user_date ON public.daily_analytics(user_id, date);

-- Weekly Summary Table
CREATE TABLE IF NOT EXISTS public.weekly_summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    week_start_date DATE NOT NULL,
    week_end_date DATE NOT NULL,
    total_completions INTEGER DEFAULT 0,
    average_completion_rate DECIMAL(5,2) DEFAULT 0.00,
    most_productive_day TEXT,
    total_active_days INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, week_start_date)
);

CREATE INDEX IF NOT EXISTS idx_weekly_summaries_user ON public.weekly_summaries(user_id);

-- =====================================================
-- GOALS & ACHIEVEMENTS
-- =====================================================

-- User Goals Table
CREATE TABLE IF NOT EXISTS public.user_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    goal_type TEXT NOT NULL CHECK (goal_type IN ('daily', 'weekly', 'monthly', 'custom')),
    title TEXT NOT NULL,
    description TEXT,
    target_value INTEGER NOT NULL,
    current_value INTEGER DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_goals_user_id ON public.user_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_goals_type ON public.user_goals(goal_type);

-- Achievements/Badges Table
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    achievement_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB,
    
    UNIQUE(user_id, achievement_type)
);

CREATE INDEX IF NOT EXISTS idx_achievements_user ON public.achievements(user_id);

-- =====================================================
-- NOTIFICATIONS & REMINDERS
-- =====================================================

-- User Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('reminder', 'achievement', 'streak_risk', 'goal_progress', 'system')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    read_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(user_id, is_read);

-- Custom Reminders Table
CREATE TABLE IF NOT EXISTS public.reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    task_id TEXT NOT NULL,
    reminder_time TIME NOT NULL,
    days_of_week INTEGER[] DEFAULT ARRAY[1,2,3,4,5,6,7], -- 1=Monday, 7=Sunday
    is_enabled BOOLEAN DEFAULT TRUE,
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reminders_user ON public.reminders(user_id);

-- =====================================================
-- SOCIAL & COLLABORATION
-- =====================================================

-- Friends/Connections Table
CREATE TABLE IF NOT EXISTS public.user_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    friend_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    accepted_at TIMESTAMPTZ,
    
    UNIQUE(user_id, friend_id),
    CHECK (user_id != friend_id)
);

CREATE INDEX IF NOT EXISTS idx_connections_user ON public.user_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_connections_status ON public.user_connections(status);

-- Shared Streaks/Challenges Table
CREATE TABLE IF NOT EXISTS public.shared_challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    task_id TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_challenges_creator ON public.shared_challenges(creator_id);

-- Challenge Participants Table
CREATE TABLE IF NOT EXISTS public.challenge_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenge_id UUID NOT NULL REFERENCES public.shared_challenges(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    current_progress INTEGER DEFAULT 0,
    
    UNIQUE(challenge_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_participants_challenge ON public.challenge_participants(challenge_id);

-- =====================================================
-- NOTES & JOURNAL
-- =====================================================

-- Daily Notes/Journal Table
CREATE TABLE IF NOT EXISTS public.daily_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    mood TEXT CHECK (mood IN ('excellent', 'good', 'neutral', 'bad', 'terrible')),
    energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 5),
    note_content TEXT,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_daily_notes_user_date ON public.daily_notes(user_id, date);

-- =====================================================
-- CUSTOM TASKS & TEMPLATES
-- =====================================================

-- Custom Tasks Table
CREATE TABLE IF NOT EXISTS public.custom_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    task_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT,
    url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, task_id)
);

CREATE INDEX IF NOT EXISTS idx_custom_tasks_user ON public.custom_tasks(user_id);

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Daily Analytics
ALTER TABLE public.daily_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analytics"
    ON public.daily_analytics FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics"
    ON public.daily_analytics FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analytics"
    ON public.daily_analytics FOR UPDATE
    USING (auth.uid() = user_id);

-- Weekly Summaries
ALTER TABLE public.weekly_summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own summaries"
    ON public.weekly_summaries FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own summaries"
    ON public.weekly_summaries FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- User Goals
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own goals"
    ON public.user_goals FOR ALL
    USING (auth.uid() = user_id);

-- Achievements
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements"
    ON public.achievements FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
    ON public.achievements FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own notifications"
    ON public.notifications FOR ALL
    USING (auth.uid() = user_id);

-- Reminders
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own reminders"
    ON public.reminders FOR ALL
    USING (auth.uid() = user_id);

-- User Connections
ALTER TABLE public.user_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own connections"
    ON public.user_connections FOR SELECT
    USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can create connections"
    ON public.user_connections FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own connections"
    ON public.user_connections FOR UPDATE
    USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Shared Challenges
ALTER TABLE public.shared_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active challenges"
    ON public.shared_challenges FOR SELECT
    USING (is_active = TRUE);

CREATE POLICY "Users can create challenges"
    ON public.shared_challenges FOR INSERT
    WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update own challenges"
    ON public.shared_challenges FOR UPDATE
    USING (auth.uid() = creator_id);

-- Challenge Participants
ALTER TABLE public.challenge_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view challenge members"
    ON public.challenge_participants FOR SELECT
    USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM public.challenge_participants cp 
            WHERE cp.challenge_id = challenge_participants.challenge_id 
            AND cp.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can join challenges"
    ON public.challenge_participants FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Daily Notes
ALTER TABLE public.daily_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own notes"
    ON public.daily_notes FOR ALL
    USING (auth.uid() = user_id);

-- Custom Tasks
ALTER TABLE public.custom_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own custom tasks"
    ON public.custom_tasks FOR ALL
    USING (auth.uid() = user_id);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update triggers for updated_at columns
CREATE TRIGGER update_daily_analytics_updated_at
    BEFORE UPDATE ON public.daily_analytics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_goals_updated_at
    BEFORE UPDATE ON public.user_goals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reminders_updated_at
    BEFORE UPDATE ON public.reminders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_notes_updated_at
    BEFORE UPDATE ON public.daily_notes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_tasks_updated_at
    BEFORE UPDATE ON public.custom_tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNCTIONS FOR ANALYTICS
-- =====================================================

-- Function to calculate daily analytics
CREATE OR REPLACE FUNCTION calculate_daily_analytics(p_user_id UUID, p_date DATE)
RETURNS VOID AS $$
DECLARE
    v_total_tasks INTEGER;
    v_completed_tasks INTEGER;
    v_completion_rate DECIMAL(5,2);
BEGIN
    -- Count total tasks for the day (from schedule)
    v_total_tasks := 4; -- Default, can be dynamic
    
    -- Count completed tasks
    SELECT COUNT(*) INTO v_completed_tasks
    FROM public.completed_tasks
    WHERE user_id = p_user_id AND date = p_date;
    
    -- Calculate completion rate
    v_completion_rate := (v_completed_tasks::DECIMAL / v_total_tasks) * 100;
    
    -- Insert or update analytics
    INSERT INTO public.daily_analytics (user_id, date, total_tasks, completed_tasks, completion_rate)
    VALUES (p_user_id, p_date, v_total_tasks, v_completed_tasks, v_completion_rate)
    ON CONFLICT (user_id, date) 
    DO UPDATE SET 
        completed_tasks = v_completed_tasks,
        completion_rate = v_completion_rate,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to award achievements
CREATE OR REPLACE FUNCTION check_and_award_achievements(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
    v_streak_count INTEGER;
    v_total_completions INTEGER;
BEGIN
    -- Check for streak achievements
    SELECT current_streak, total_completions INTO v_streak_count, v_total_completions
    FROM public.streaks
    WHERE user_id = p_user_id AND task_id = 'linkedin-zip';
    
    -- Award "First Streak" achievement
    IF v_streak_count >= 1 THEN
        INSERT INTO public.achievements (user_id, achievement_type, title, description, icon)
        VALUES (p_user_id, 'first_streak', 'First Streak!', 'Completed your first day streak', '🔥')
        ON CONFLICT (user_id, achievement_type) DO NOTHING;
    END IF;
    
    -- Award "Week Warrior" achievement
    IF v_streak_count >= 7 THEN
        INSERT INTO public.achievements (user_id, achievement_type, title, description, icon)
        VALUES (p_user_id, 'week_warrior', 'Week Warrior', 'Maintained a 7-day streak', '⚔️')
        ON CONFLICT (user_id, achievement_type) DO NOTHING;
    END IF;
    
    -- Award "Month Master" achievement
    IF v_streak_count >= 30 THEN
        INSERT INTO public.achievements (user_id, achievement_type, title, description, icon)
        VALUES (p_user_id, 'month_master', 'Month Master', 'Maintained a 30-day streak', '👑')
        ON CONFLICT (user_id, achievement_type) DO NOTHING;
    END IF;
    
    -- Award "Century Club" achievement
    IF v_total_completions >= 100 THEN
        INSERT INTO public.achievements (user_id, achievement_type, title, description, icon)
        VALUES (p_user_id, 'century_club', 'Century Club', 'Completed 100 tasks', '💯')
        ON CONFLICT (user_id, achievement_type) DO NOTHING;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Uncomment to insert sample achievements
/*
-- Example: Award test achievement
INSERT INTO public.achievements (user_id, achievement_type, title, description, icon)
VALUES ('YOUR_USER_ID', 'welcome', 'Welcome!', 'Started your LifeSync journey', '🎉');
*/
