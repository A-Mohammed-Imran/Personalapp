const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false,
    }
);

// CORE TABLES (v1.0)
const User = sequelize.define('User', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    full_name: { type: DataTypes.STRING },
    avatar_url: { type: DataTypes.TEXT },
}, { tableName: 'users', underscored: true, timestamps: true });

const CompletedTask = sequelize.define('CompletedTask', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    user_id: { type: DataTypes.CHAR(36), allowNull: false },
    task_id: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    completed_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
}, { tableName: 'completed_tasks', underscored: true, timestamps: false });

const Streak = sequelize.define('Streak', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    user_id: { type: DataTypes.CHAR(36), allowNull: false },
    task_id: { type: DataTypes.STRING, allowNull: false },
    current_streak: { type: DataTypes.INTEGER, defaultValue: 0 },
    longest_streak: { type: DataTypes.INTEGER, defaultValue: 0 },
    last_completed_date: { type: DataTypes.DATEONLY },
    total_completions: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'streaks', underscored: true, timestamps: false });

const UserPreference = sequelize.define('UserPreference', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    user_id: { type: DataTypes.CHAR(36), allowNull: false, unique: true },
    preferred_plan: { type: DataTypes.ENUM('planA', 'planB'), defaultValue: 'planA' },
    notifications_enabled: { type: DataTypes.BOOLEAN, defaultValue: true },
    theme: { type: DataTypes.ENUM('light', 'dark', 'auto'), defaultValue: 'auto' },
}, { tableName: 'user_preferences', underscored: true, timestamps: false });

// ANALYTICS & INSIGHTS (v2.0)
const DailyAnalytics = sequelize.define('DailyAnalytics', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    user_id: { type: DataTypes.CHAR(36), allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    total_tasks: { type: DataTypes.INTEGER, defaultValue: 0 },
    completed_tasks: { type: DataTypes.INTEGER, defaultValue: 0 },
    completion_rate: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0.00 },
    active_time_minutes: { type: DataTypes.INTEGER, defaultValue: 0 },
    plan_used: { type: DataTypes.ENUM('planA', 'planB', 'morning') },
}, { tableName: 'daily_analytics', underscored: true, timestamps: true });

const WeeklySummary = sequelize.define('WeeklySummary', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    user_id: { type: DataTypes.CHAR(36), allowNull: false },
    week_start_date: { type: DataTypes.DATEONLY, allowNull: false },
    week_end_date: { type: DataTypes.DATEONLY, allowNull: false },
    total_completions: { type: DataTypes.INTEGER, defaultValue: 0 },
    average_completion_rate: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0.00 },
    most_productive_day: { type: DataTypes.STRING(20) },
    total_active_days: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'weekly_summaries', underscored: true, timestamps: true, updatedAt: false });

// GOALS & ACHIEVEMENTS (v2.0)
const UserGoal = sequelize.define('UserGoal', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    user_id: { type: DataTypes.CHAR(36), allowNull: false },
    goal_type: { type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'custom'), allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    target_value: { type: DataTypes.INTEGER, allowNull: false },
    current_value: { type: DataTypes.INTEGER, defaultValue: 0 },
    start_date: { type: DataTypes.DATEONLY, allowNull: false },
    end_date: { type: DataTypes.DATEONLY },
    is_completed: { type: DataTypes.BOOLEAN, defaultValue: false },
    completed_at: { type: DataTypes.DATE },
}, { tableName: 'user_goals', underscored: true, timestamps: true });

const Achievement = sequelize.define('Achievement', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    user_id: { type: DataTypes.CHAR(36), allowNull: false },
    achievement_type: { type: DataTypes.STRING, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    icon: { type: DataTypes.STRING(50) },
    earned_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    metadata: { type: DataTypes.JSON },
}, { tableName: 'achievements', underscored: true, timestamps: false });

// NOTIFICATIONS & REMINDERS (v2.0)
const Notification = sequelize.define('Notification', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    user_id: { type: DataTypes.CHAR(36), allowNull: false },
    type: { type: DataTypes.ENUM('reminder', 'achievement', 'streak_risk', 'goal_progress', 'system'), allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
    action_url: { type: DataTypes.TEXT },
    metadata: { type: DataTypes.JSON },
    read_at: { type: DataTypes.DATE },
}, { tableName: 'notifications', underscored: true, timestamps: true, updatedAt: false });

const Reminder = sequelize.define('Reminder', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    user_id: { type: DataTypes.CHAR(36), allowNull: false },
    task_id: { type: DataTypes.STRING, allowNull: false },
    reminder_time: { type: DataTypes.TIME, allowNull: false },
    days_of_week: { type: DataTypes.JSON },
    is_enabled: { type: DataTypes.BOOLEAN, defaultValue: true },
    message: { type: DataTypes.TEXT },
}, { tableName: 'reminders', underscored: true, timestamps: true });

// SOCIAL & COLLABORATION (v2.0)
const UserConnection = sequelize.define('UserConnection', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    user_id: { type: DataTypes.CHAR(36), allowNull: false },
    friend_id: { type: DataTypes.CHAR(36), allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'accepted', 'blocked'), defaultValue: 'pending' },
    accepted_at: { type: DataTypes.DATE },
}, { tableName: 'user_connections', underscored: true, timestamps: true, updatedAt: false });

const SharedChallenge = sequelize.define('SharedChallenge', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    creator_id: { type: DataTypes.CHAR(36), allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    task_id: { type: DataTypes.STRING, allowNull: false },
    start_date: { type: DataTypes.DATEONLY, allowNull: false },
    end_date: { type: DataTypes.DATEONLY, allowNull: false },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'shared_challenges', underscored: true, timestamps: true, updatedAt: false });

const ChallengeParticipant = sequelize.define('ChallengeParticipant', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    challenge_id: { type: DataTypes.CHAR(36), allowNull: false },
    user_id: { type: DataTypes.CHAR(36), allowNull: false },
    joined_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    current_progress: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'challenge_participants', underscored: true, timestamps: false });

// NOTES & JOURNAL (v2.0)
const DailyNote = sequelize.define('DailyNote', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    user_id: { type: DataTypes.CHAR(36), allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    mood: { type: DataTypes.ENUM('excellent', 'good', 'neutral', 'bad', 'terrible') },
    energy_level: {
        type: DataTypes.INTEGER,
        validate: { min: 1, max: 5 }
    },
    note_content: { type: DataTypes.TEXT },
    tags: { type: DataTypes.JSON },
}, { tableName: 'daily_notes', underscored: true, timestamps: true });

// CUSTOM TASKS (v2.0)
const CustomTask = sequelize.define('CustomTask', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    user_id: { type: DataTypes.CHAR(36), allowNull: false },
    task_id: { type: DataTypes.STRING, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    icon: { type: DataTypes.STRING(50) },
    color: { type: DataTypes.STRING(20) },
    url: { type: DataTypes.TEXT },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: TRUE },
}, { tableName: 'custom_tasks', underscored: true, timestamps: true });

// Associations
User.hasMany(CompletedTask, { foreignKey: 'user_id' });
User.hasMany(Streak, { foreignKey: 'user_id' });
User.hasOne(UserPreference, { foreignKey: 'user_id' });
User.hasMany(DailyAnalytics, { foreignKey: 'user_id' });
User.hasMany(WeeklySummary, { foreignKey: 'user_id' });
User.hasMany(UserGoal, { foreignKey: 'user_id' });
User.hasMany(Achievement, { foreignKey: 'user_id' });
User.hasMany(Notification, { foreignKey: 'user_id' });
User.hasMany(Reminder, { foreignKey: 'user_id' });
User.hasMany(UserConnection, { foreignKey: 'user_id' });
User.hasMany(DailyNote, { foreignKey: 'user_id' });
User.hasMany(CustomTask, { foreignKey: 'user_id' });

module.exports = {
    sequelize,
    User,
    CompletedTask,
    Streak,
    UserPreference,
    DailyAnalytics,
    WeeklySummary,
    UserGoal,
    Achievement,
    Notification,
    Reminder,
    UserConnection,
    SharedChallenge,
    ChallengeParticipant,
    DailyNote,
    CustomTask,
};
