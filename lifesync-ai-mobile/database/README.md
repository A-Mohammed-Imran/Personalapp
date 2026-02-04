# LifeSync AI Mobile - Backend Setup Guide

## 🚀 PostgreSQL Database with Supabase

This guide will help you set up the PostgreSQL backend for LifeSync AI Mobile using Supabase.

---

## 📋 Prerequisites

- A Supabase account (free tier available)
- Node.js and npm installed
- Expo CLI installed

---

## 🔧 Setup Instructions

### Step 1: Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and sign up/login
2. Click **"New Project"**
3. Fill in the details:
   - **Name**: `lifesync-ai-mobile`
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your location
4. Click **"Create new project"** and wait for setup to complete (~2 minutes)

### Step 2: Get Your API Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

### Step 3: Configure Environment Variables

Create a `.env` file in the root of your project:

```bash
# In: c:\imran\Tite\Personalapp\lifesync-ai-mobile\.env

EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important**: Add `.env` to your `.gitignore` to keep credentials secure!

### Step 4: Run Database Migrations

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy the entire contents of `database/schema.sql`
4. Paste it into the SQL editor
5. Click **"Run"** to execute the migration
6. You should see: ✅ Success messages for all tables created

### Step 5: Verify Database Setup

In Supabase dashboard:
1. Go to **Table Editor**
2. You should see these tables:
   - ✅ `users`
   - ✅ `completed_tasks`
   - ✅ `streaks`
   - ✅ `user_preferences`

---

## 🗄️ Database Schema

### Tables Overview

#### 1. **users**
Stores user profile information
- `id` (UUID, Primary Key)
- `email` (Text, Unique)
- `full_name` (Text, Nullable)
- `avatar_url` (Text, Nullable)
- `created_at`, `updated_at` (Timestamps)

#### 2. **completed_tasks**
Tracks daily task completions
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → users)
- `task_id` (Text) - e.g., 'linkedin-zip', 'peerup-english'
- `completed_at` (Timestamp)
- `date` (Date) - YYYY-MM-DD format
- Unique constraint: One completion per task per day per user

#### 3. **streaks**
Manages streak tracking (e.g., LinkedIn Zip game)
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → users)
- `task_id` (Text)
- `current_streak` (Integer)
- `longest_streak` (Integer)
- `last_completed_date` (Date)
- `total_completions` (Integer)
- Unique constraint: One streak record per task per user

#### 4. **user_preferences**
Stores user settings
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → users)
- `preferred_plan` ('planA' | 'planB')
- `notifications_enabled` (Boolean)
- `theme` ('light' | 'dark' | 'auto')

---

## 🔐 Security Features

### Row Level Security (RLS)
All tables have RLS enabled with policies ensuring:
- ✅ Users can only access their own data
- ✅ No cross-user data leakage
- ✅ Automatic user isolation

### Authentication
- Email/Password authentication
- Anonymous authentication (for guest users)
- Password reset functionality
- Automatic session management

---

## 🔄 Real-time Features

The app supports real-time updates using Supabase Realtime:

```typescript
// Subscribe to task updates
subscribeToTaskUpdates(userId, () => {
  // Refresh UI when tasks change
});

// Subscribe to streak updates
subscribeToStreakUpdates(userId, () => {
  // Refresh streak display
});
```

---

## 📱 Using the Services

### Authentication

```typescript
import { signUp, signIn, signOut } from './src/services/authService';

// Sign up
const { user, error } = await signUp('email@example.com', 'password', 'Full Name');

// Sign in
const { user, error } = await signIn('email@example.com', 'password');

// Sign in anonymously (guest mode)
const { user, error } = await signInAnonymously();

// Sign out
await signOut();
```

### Task Tracking

```typescript
import {
  markTaskCompleted,
  getTodayCompletedTasks,
  toggleTaskCompletion,
} from './src/services/databaseService';

// Mark task as completed
await markTaskCompleted('linkedin-zip');

// Get today's completed tasks
const tasks = await getTodayCompletedTasks(); // ['linkedin-zip', 'peerup-english']

// Toggle task completion
const isNowCompleted = await toggleTaskCompletion('linkedin-zip');
```

### Streak Tracking

```typescript
import { getLinkedInStreak, isStreakAtRisk } from './src/services/databaseService';

// Get streak data
const streak = await getLinkedInStreak();
console.log(streak.current_streak); // 5
console.log(streak.longest_streak); // 10

// Check if streak is at risk
const atRisk = isStreakAtRisk(streak); // true if not completed today after 5 PM
```

---

## 🔄 Migration from AsyncStorage

The new database service is a **drop-in replacement** for the old AsyncStorage-based `taskTracking.ts`:

### Before (AsyncStorage):
```typescript
import { markTaskCompleted } from './src/services/taskTracking';
```

### After (PostgreSQL):
```typescript
import { markTaskCompleted } from './src/services/databaseService';
```

**All function signatures remain the same!** 🎉

---

## 🧪 Testing the Backend

### Test Authentication
1. Run your app: `npm start`
2. Sign up with a test email
3. Check Supabase **Authentication** tab - you should see your user

### Test Task Completion
1. Complete a task in the app
2. Check Supabase **Table Editor** → `completed_tasks`
3. You should see a new row with your task

### Test Streaks
1. Complete the LinkedIn Zip task
2. Check **Table Editor** → `streaks`
3. You should see `current_streak: 1`

---

## 📊 Monitoring & Analytics

### Supabase Dashboard Features:
- **Table Editor**: View and edit data
- **SQL Editor**: Run custom queries
- **Logs**: Monitor API requests and errors
- **Database**: View performance metrics
- **Authentication**: Manage users

### Useful SQL Queries:

```sql
-- Get all tasks completed today
SELECT * FROM completed_tasks 
WHERE date = CURRENT_DATE 
ORDER BY completed_at DESC;

-- Get top streaks
SELECT u.email, s.task_id, s.current_streak, s.longest_streak
FROM streaks s
JOIN users u ON s.user_id = u.id
ORDER BY s.current_streak DESC;

-- Get user activity summary
SELECT 
  u.email,
  COUNT(DISTINCT ct.date) as active_days,
  COUNT(ct.id) as total_completions
FROM users u
LEFT JOIN completed_tasks ct ON u.id = ct.user_id
GROUP BY u.id, u.email;
```

---

## 🚨 Troubleshooting

### Issue: "Invalid API key"
**Solution**: Double-check your `.env` file has correct credentials from Supabase dashboard

### Issue: "Row Level Security policy violation"
**Solution**: Ensure user is authenticated before making database calls

### Issue: "Relation does not exist"
**Solution**: Run the `schema.sql` migration in Supabase SQL Editor

### Issue: "No rows returned"
**Solution**: Check if user is signed in and has data in the database

---

## 🔐 Security Best Practices

1. ✅ Never commit `.env` file to git
2. ✅ Use environment variables for API keys
3. ✅ Enable RLS on all tables
4. ✅ Validate user input on client side
5. ✅ Use Supabase's built-in auth (don't roll your own)
6. ✅ Regularly backup your database

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase React Native Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

## 🎯 Next Steps

1. ✅ Set up Supabase project
2. ✅ Run database migrations
3. ✅ Configure environment variables
4. ⬜ Update app to use new database service
5. ⬜ Test authentication flow
6. ⬜ Test task tracking
7. ⬜ Test real-time updates
8. ⬜ Deploy to production

---

## 💡 Pro Tips

- Use Supabase's **Table Editor** for quick data inspection
- Enable **Realtime** on tables for live updates
- Use **Database Webhooks** for external integrations
- Set up **Database Backups** in production
- Monitor **API usage** to stay within free tier limits

---

**Need help?** Check the Supabase Discord or open an issue on GitHub!
