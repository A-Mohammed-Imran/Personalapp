# 📘 LifeSync AI Mobile - Backend API Reference

Complete reference for all backend services and database operations.

---

## 🔐 Authentication Service
**File**: `src/services/authService.ts`

### `signUp(email, password, fullName?)`
Create a new user account.

```typescript
import { signUp } from './src/services/authService';

const { user, session, error } = await signUp(
  'user@example.com',
  'securePassword123',
  'John Doe' // optional
);

if (error) {
  console.error('Sign up failed:', error.message);
} else {
  console.log('User created:', user.id);
}
```

**Returns**: `{ user, session, error }`

---

### `signIn(email, password)`
Sign in existing user.

```typescript
import { signIn } from './src/services/authService';

const { user, session, error } = await signIn(
  'user@example.com',
  'securePassword123'
);
```

**Returns**: `{ user, session, error }`

---

### `signInAnonymously()`
Sign in as anonymous user (no email/password required).

```typescript
import { signInAnonymously } from './src/services/authService';

const { user, session, error } = await signInAnonymously();
```

**Returns**: `{ user, session, error }`

---

### `signOut()`
Sign out current user.

```typescript
import { signOut } from './src/services/authService';

const { error } = await signOut();
```

**Returns**: `{ error }`

---

### `getCurrentSession()`
Get current authentication session.

```typescript
import { getCurrentSession } from './src/services/authService';

const session = await getCurrentSession();
if (session) {
  console.log('User is signed in');
}
```

**Returns**: `Session | null`

---

### `getCurrentUser()`
Get current authenticated user.

```typescript
import { getCurrentUser } from './src/services/authService';

const user = await getCurrentUser();
if (user) {
  console.log('User ID:', user.id);
  console.log('Email:', user.email);
}
```

**Returns**: `User | null`

---

### `resetPassword(email)`
Send password reset email.

```typescript
import { resetPassword } from './src/services/authService';

const { error } = await resetPassword('user@example.com');
```

**Returns**: `{ error }`

---

### `updatePassword(newPassword)`
Update current user's password.

```typescript
import { updatePassword } from './src/services/authService';

const { error } = await updatePassword('newSecurePassword123');
```

**Returns**: `{ error }`

---

### `onAuthStateChange(callback)`
Listen to authentication state changes.

```typescript
import { onAuthStateChange } from './src/services/authService';

const unsubscribe = onAuthStateChange((session) => {
  if (session) {
    console.log('User signed in:', session.user.id);
  } else {
    console.log('User signed out');
  }
});

// Cleanup
unsubscribe();
```

**Returns**: Unsubscribe function

---

## 📊 Database Service
**File**: `src/services/databaseService.ts`

### `getTodayCompletedTasks()`
Get list of task IDs completed today.

```typescript
import { getTodayCompletedTasks } from './src/services/databaseService';

const completedTasks = await getTodayCompletedTasks();
// Returns: ['linkedin-zip', 'peerup-english', ...]
```

**Returns**: `string[]`

---

### `getCompletedTasks(startDate?, endDate?)`
Get all completed tasks with optional date range.

```typescript
import { getCompletedTasks } from './src/services/databaseService';

// Get all completed tasks
const allTasks = await getCompletedTasks();

// Get tasks for specific date range
const tasksThisWeek = await getCompletedTasks('2026-02-01', '2026-02-07');
```

**Returns**: `CompletedTask[]`

```typescript
interface CompletedTask {
  id: string;
  user_id: string;
  task_id: string;
  completed_at: string;
  date: string; // YYYY-MM-DD
  created_at: string;
}
```

---

### `markTaskCompleted(taskId)`
Mark a task as completed for today.

```typescript
import { markTaskCompleted } from './src/services/databaseService';

const success = await markTaskCompleted('linkedin-zip');
if (success) {
  console.log('Task marked as completed!');
}
```

**Returns**: `boolean`

---

### `unmarkTaskCompleted(taskId)`
Remove task completion for today.

```typescript
import { unmarkTaskCompleted } from './src/services/databaseService';

const success = await unmarkTaskCompleted('linkedin-zip');
```

**Returns**: `boolean`

---

### `toggleTaskCompletion(taskId)`
Toggle task completion status for today.

```typescript
import { toggleTaskCompletion } from './src/services/databaseService';

const isNowCompleted = await toggleTaskCompletion('linkedin-zip');
if (isNowCompleted) {
  console.log('Task is now completed');
} else {
  console.log('Task is now uncompleted');
}
```

**Returns**: `boolean` (true if now completed, false if now uncompleted)

---

### `getTodayCompletionPercentage(totalTasks)`
Calculate completion percentage for today.

```typescript
import { getTodayCompletionPercentage } from './src/services/databaseService';

const percentage = await getTodayCompletionPercentage(4);
// If 2 out of 4 tasks completed, returns 50
```

**Returns**: `number` (0-100)

---

### `getLinkedInStreak()`
Get LinkedIn Zip game streak data.

```typescript
import { getLinkedInStreak } from './src/services/databaseService';

const streak = await getLinkedInStreak();
if (streak) {
  console.log('Current streak:', streak.current_streak);
  console.log('Longest streak:', streak.longest_streak);
  console.log('Total completions:', streak.total_completions);
}
```

**Returns**: `LinkedInStreak | null`

```typescript
interface LinkedInStreak {
  id: string;
  user_id: string;
  task_id: string;
  current_streak: number;
  longest_streak: number;
  last_completed_date: string | null; // YYYY-MM-DD
  total_completions: number;
  created_at: string;
  updated_at: string;
}
```

---

### `isStreakAtRisk(streak)`
Check if streak is at risk (not completed today after 5 PM).

```typescript
import { getLinkedInStreak, isStreakAtRisk } from './src/services/databaseService';

const streak = await getLinkedInStreak();
const atRisk = isStreakAtRisk(streak);

if (atRisk) {
  console.log('⚠️ Complete LinkedIn Zip to maintain your streak!');
}
```

**Returns**: `boolean`

---

### `getTimeUntilMidnight()`
Get time remaining until midnight (streak deadline).

```typescript
import { getTimeUntilMidnight } from './src/services/databaseService';

const timeLeft = getTimeUntilMidnight();
console.log('Time left:', timeLeft); // "5h 23m"
```

**Returns**: `string`

---

### `getTodayDate()`
Get today's date in YYYY-MM-DD format.

```typescript
import { getTodayDate } from './src/services/databaseService';

const today = getTodayDate(); // "2026-02-04"
```

**Returns**: `string`

---

### `subscribeToTaskUpdates(userId, callback)`
Subscribe to real-time task completion updates.

```typescript
import { subscribeToTaskUpdates } from './src/services/databaseService';
import { getCurrentUser } from './src/services/authService';

const user = await getCurrentUser();
const unsubscribe = subscribeToTaskUpdates(user.id, () => {
  console.log('Tasks updated! Refresh UI...');
  // Reload task data
});

// Cleanup
unsubscribe();
```

**Returns**: Unsubscribe function

---

### `subscribeToStreakUpdates(userId, callback)`
Subscribe to real-time streak updates.

```typescript
import { subscribeToStreakUpdates } from './src/services/databaseService';
import { getCurrentUser } from './src/services/authService';

const user = await getCurrentUser();
const unsubscribe = subscribeToStreakUpdates(user.id, () => {
  console.log('Streak updated! Refresh UI...');
});

// Cleanup
unsubscribe();
```

**Returns**: Unsubscribe function

---

## ⚙️ User Preferences Service
**File**: `src/services/userPreferencesService.ts`

### `getUserPreferences()`
Get current user's preferences.

```typescript
import { getUserPreferences } from './src/services/userPreferencesService';

const prefs = await getUserPreferences();
if (prefs) {
  console.log('Preferred plan:', prefs.preferred_plan);
  console.log('Notifications:', prefs.notifications_enabled);
  console.log('Theme:', prefs.theme);
}
```

**Returns**: `UserPreferences | null`

```typescript
interface UserPreferences {
  id: string;
  user_id: string;
  preferred_plan: 'planA' | 'planB';
  notifications_enabled: boolean;
  theme: 'light' | 'dark' | 'auto';
  created_at: string;
  updated_at: string;
}
```

---

### `updatePreferredPlan(plan)`
Update user's preferred plan.

```typescript
import { updatePreferredPlan } from './src/services/userPreferencesService';

const success = await updatePreferredPlan('planB');
```

**Returns**: `boolean`

---

### `updateNotificationsEnabled(enabled)`
Update notification settings.

```typescript
import { updateNotificationsEnabled } from './src/services/userPreferencesService';

const success = await updateNotificationsEnabled(false);
```

**Returns**: `boolean`

---

### `updateTheme(theme)`
Update app theme.

```typescript
import { updateTheme } from './src/services/userPreferencesService';

const success = await updateTheme('dark');
```

**Returns**: `boolean`

---

### `updateAllPreferences(preferences)`
Update multiple preferences at once.

```typescript
import { updateAllPreferences } from './src/services/userPreferencesService';

const success = await updateAllPreferences({
  preferred_plan: 'planA',
  notifications_enabled: true,
  theme: 'auto',
});
```

**Returns**: `boolean`

---

### `subscribeToPreferenceUpdates(userId, callback)`
Subscribe to real-time preference updates.

```typescript
import { subscribeToPreferenceUpdates } from './src/services/userPreferencesService';
import { getCurrentUser } from './src/services/authService';

const user = await getCurrentUser();
const unsubscribe = subscribeToPreferenceUpdates(user.id, () => {
  console.log('Preferences updated!');
});

// Cleanup
unsubscribe();
```

**Returns**: Unsubscribe function

---

## 🪝 Custom Hooks

### `useAuth()`
**File**: `src/hooks/useAuth.ts`

Manage authentication state with automatic anonymous sign-in.

```typescript
import { useAuth } from './src/hooks/useAuth';

function MyComponent() {
  const { user, session, isAuthenticated, isLoading, error } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen error={error} />;
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return <MainApp user={user} />;
}
```

**Returns**:
```typescript
{
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
}
```

---

## 🔄 Real-time Subscriptions

All subscription functions return an unsubscribe function. Always clean up subscriptions:

```typescript
useEffect(() => {
  const unsubscribe = subscribeToTaskUpdates(userId, handleUpdate);
  
  return () => {
    unsubscribe(); // Cleanup on unmount
  };
}, [userId]);
```

---

## 🛡️ Error Handling

All async functions handle errors internally and return `null`, `false`, or empty arrays on failure. Always check return values:

```typescript
// ✅ Good
const tasks = await getTodayCompletedTasks();
if (tasks.length > 0) {
  // Process tasks
}

// ✅ Good
const success = await markTaskCompleted('task-id');
if (success) {
  // Task marked successfully
} else {
  // Show error message
}

// ❌ Bad - No error checking
const tasks = await getTodayCompletedTasks();
tasks.forEach(task => { /* ... */ }); // Could crash if null
```

---

## 📝 TypeScript Types

All types are exported from their respective service files:

```typescript
import type { CompletedTask, LinkedInStreak } from './src/services/databaseService';
import type { UserPreferences } from './src/services/userPreferencesService';
import type { AuthResponse } from './src/services/authService';
```

---

## 🎯 Common Patterns

### Pattern 1: Check Authentication Before Database Calls
```typescript
const user = await getCurrentUser();
if (!user) {
  console.warn('User not authenticated');
  return;
}

// Proceed with database operations
const tasks = await getTodayCompletedTasks();
```

### Pattern 2: Real-time Updates with React
```typescript
function TaskList() {
  const [tasks, setTasks] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    loadTasks();
    
    if (user) {
      const unsubscribe = subscribeToTaskUpdates(user.id, loadTasks);
      return unsubscribe;
    }
  }, [user]);

  async function loadTasks() {
    const completedTasks = await getTodayCompletedTasks();
    setTasks(completedTasks);
  }

  return <View>{/* Render tasks */}</View>;
}
```

### Pattern 3: Optimistic UI Updates
```typescript
async function handleToggleTask(taskId: string) {
  // Update UI immediately
  setCompleted(prev => !prev);
  
  // Update database
  const success = await toggleTaskCompletion(taskId);
  
  // Revert if failed
  if (!success) {
    setCompleted(prev => !prev);
    showError('Failed to update task');
  }
}
```

---

## 🔍 Debugging

Enable detailed logging:

```typescript
// In your component
useEffect(() => {
  async function debug() {
    const user = await getCurrentUser();
    console.log('Current user:', user);
    
    const tasks = await getTodayCompletedTasks();
    console.log('Completed tasks:', tasks);
    
    const streak = await getLinkedInStreak();
    console.log('LinkedIn streak:', streak);
  }
  debug();
}, []);
```

Check Supabase logs in dashboard:
- **Logs** → **API** - View all API requests
- **Logs** → **Database** - View SQL queries

---

## 📚 Additional Resources

- [Supabase JavaScript Client Docs](https://supabase.com/docs/reference/javascript)
- [React Native Supabase Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Need help?** Check the full setup guide in `database/README.md`
