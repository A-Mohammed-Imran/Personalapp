-- LifeSync AI Mobile - MySQL Schema (v1.0 + v2.0 Combined)
-- Translated from PostgreSQL (Supabase)

CREATE DATABASE IF NOT EXISTS lifesync_db;
USE lifesync_db;

-- =====================================================
-- CORE TABLES (v1.0)
-- =====================================================

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Completed Tasks Table
CREATE TABLE IF NOT EXISTS completed_tasks (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    task_id VARCHAR(100) NOT NULL,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    date DATE NOT NULL,
    UNIQUE KEY idx_unique_task_user_date (user_id, task_id, date),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Streaks Table
CREATE TABLE IF NOT EXISTS streaks (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    task_id VARCHAR(100) NOT NULL,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_completed_date DATE,
    total_completions INTEGER DEFAULT 0,
    UNIQUE KEY idx_unique_streak_user_task (user_id, task_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User Preferences Table
CREATE TABLE IF NOT EXISTS user_preferences (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL UNIQUE,
    preferred_plan ENUM('planA', 'planB') DEFAULT 'planA',
    notifications_enabled BOOLEAN DEFAULT TRUE,
    theme ENUM('light', 'dark', 'auto') DEFAULT 'auto',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================
-- ANALYTICS & INSIGHTS (v2.0)
-- =====================================================

-- Daily Analytics Table
CREATE TABLE IF NOT EXISTS daily_analytics (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    date DATE NOT NULL,
    total_tasks INTEGER DEFAULT 0,
    completed_tasks INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0.00,
    active_time_minutes INTEGER DEFAULT 0,
    plan_used ENUM('planA', 'planB', 'morning'),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY idx_unique_analytics_user_date (user_id, date),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Weekly Summary Table
CREATE TABLE IF NOT EXISTS weekly_summaries (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    week_start_date DATE NOT NULL,
    week_end_date DATE NOT NULL,
    total_completions INTEGER DEFAULT 0,
    average_completion_rate DECIMAL(5,2) DEFAULT 0.00,
    most_productive_day VARCHAR(20),
    total_active_days INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY idx_unique_summary_user_week (user_id, week_start_date),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================
-- GOALS & ACHIEVEMENTS (v2.0)
-- =====================================================

-- User Goals Table
CREATE TABLE IF NOT EXISTS user_goals (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    goal_type ENUM('daily', 'weekly', 'monthly', 'custom') NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_value INTEGER NOT NULL,
    current_value INTEGER DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Achievements Table
CREATE TABLE IF NOT EXISTS achievements (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    achievement_type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    metadata JSON,
    UNIQUE KEY idx_unique_achievement_user_type (user_id, achievement_type),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================
-- NOTIFICATIONS & REMINDERS (v2.0)
-- =====================================================

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    type ENUM('reminder', 'achievement', 'streak_risk', 'goal_progress', 'system') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    metadata JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    read_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Reminders Table
CREATE TABLE IF NOT EXISTS reminders (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    task_id VARCHAR(100) NOT NULL,
    reminder_time TIME NOT NULL,
    days_of_week JSON, -- JSON array like [1, 2, 3]
    is_enabled BOOLEAN DEFAULT TRUE,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================
-- SOCIAL & COLLABORATION (v2.0)
-- =====================================================

-- Connections Table
CREATE TABLE IF NOT EXISTS user_connections (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    friend_id CHAR(36) NOT NULL,
    status ENUM('pending', 'accepted', 'blocked') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    accepted_at DATETIME,
    UNIQUE KEY idx_unique_connection (user_id, friend_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (friend_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Shared Challenges Table
CREATE TABLE IF NOT EXISTS shared_challenges (
    id CHAR(36) PRIMARY KEY,
    creator_id CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    task_id VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Challenge Participants Table
CREATE TABLE IF NOT EXISTS challenge_participants (
    id CHAR(36) PRIMARY KEY,
    challenge_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    current_progress INTEGER DEFAULT 0,
    UNIQUE KEY idx_unique_participant (challenge_id, user_id),
    FOREIGN KEY (challenge_id) REFERENCES shared_challenges(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================
-- NOTES & JOURNAL (v2.0)
-- =====================================================

-- Daily Notes Table
CREATE TABLE IF NOT EXISTS daily_notes (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    date DATE NOT NULL,
    mood ENUM('excellent', 'good', 'neutral', 'bad', 'terrible'),
    energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 5),
    note_content TEXT,
    tags JSON, -- JSON array of strings
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY idx_unique_note_user_date (user_id, date),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================
-- CUSTOM TASKS (v2.0)
-- =====================================================

-- Custom Tasks Table
CREATE TABLE IF NOT EXISTS custom_tasks (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    task_id VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(20),
    url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY idx_unique_custom_task (user_id, task_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
