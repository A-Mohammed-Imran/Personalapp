# 🏗️ LifeSync AI Mobile - Backend Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     LifeSync AI Mobile App                      │
│                      (React Native + Expo)                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   App.tsx    │    │  Components  │    │   Screens    │
│              │    │              │    │              │
│ - useAuth()  │    │ - Activity   │    │ - Dashboard  │
│ - Loading    │    │ - Progress   │    │              │
│ - Error      │    │ - Streak     │    │              │
└──────────────┘    └──────────────┘    └──────────────┘
                              │
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
            ┌──────────────┐    ┌──────────────┐
            │    Hooks     │    │   Services   │
            │              │    │              │
            │ - useAuth    │───▶│ - Auth       │
            │              │    │ - Database   │
            │              │    │ - Preferences│
            └──────────────┘    └──────────────┘
                                        │
                                        │
                                        ▼
                            ┌──────────────────────┐
                            │  Supabase Client     │
                            │  (supabase.ts)       │
                            │                      │
                            │ - Configuration      │
                            │ - TypeScript Types   │
                            └──────────────────────┘
                                        │
                                        │ HTTPS/WSS
                                        │
                    ┌───────────────────┴───────────────────┐
                    │                                       │
                    ▼                                       ▼
        ┌──────────────────────┐              ┌──────────────────────┐
        │   Supabase Auth      │              │  Supabase Realtime   │
        │                      │              │                      │
        │ - Email/Password     │              │ - WebSocket          │
        │ - Anonymous Auth     │              │ - Live Updates       │
        │ - Session Mgmt       │              │ - Subscriptions      │
        └──────────────────────┘              └──────────────────────┘
                    │                                       │
                    │                                       │
                    └───────────────────┬───────────────────┘
                                        │
                                        ▼
                        ┌──────────────────────────────┐
                        │   PostgreSQL Database        │
                        │   (Supabase Hosted)          │
                        │                              │
                        │  ┌────────────────────────┐  │
                        │  │ Tables:                │  │
                        │  │ • users                │  │
                        │  │ • completed_tasks      │  │
                        │  │ • streaks              │  │
                        │  │ • user_preferences     │  │
                        │  └────────────────────────┘  │
                        │                              │
                        │  ┌────────────────────────┐  │
                        │  │ Security:              │  │
                        │  │ • Row Level Security   │  │
                        │  │ • Policies             │  │
                        │  │ • Triggers             │  │
                        │  └────────────────────────┘  │
                        └──────────────────────────────┘
```

---

## Data Flow

### 1. Authentication Flow
```
User Opens App
     │
     ▼
useAuth() Hook
     │
     ├─ Check Session
     │       │
     │       ├─ Session Exists ──▶ Load User Data
     │       │
     │       └─ No Session ──▶ Sign In Anonymously
     │
     ▼
App Renders
```

### 2. Task Completion Flow
```
User Taps Task
     │
     ▼
toggleTaskCompletion()
     │
     ├─ Check Current Status
     │
     ├─ Update Database (Supabase)
     │       │
     │       ▼
     │  INSERT/DELETE in completed_tasks
     │       │
     │       ▼
     │  Update streak (if LinkedIn task)
     │       │
     │       ▼
     │  Real-time broadcast
     │
     ▼
UI Updates Automatically
```

### 3. Real-time Sync Flow
```
Device A: Complete Task
     │
     ▼
Database Updated
     │
     ├─────────────────────────┐
     │                         │
     ▼                         ▼
Device A: Receives Update   Device B: Receives Update
     │                         │
     ▼                         ▼
Both UIs Update Automatically
```

---

## File Structure

```
lifesync-ai-mobile/
│
├── src/
│   ├── config/
│   │   ├── supabase.ts          # Supabase client & types
│   │   └── schedule.ts          # Task schedules
│   │
│   ├── services/
│   │   ├── authService.ts       # Authentication logic
│   │   ├── databaseService.ts   # Task & streak operations
│   │   ├── userPreferencesService.ts  # User settings
│   │   ├── taskTracking.ts      # [DEPRECATED] Old AsyncStorage
│   │   └── notifications.ts     # Push notifications
│   │
│   ├── hooks/
│   │   └── useAuth.ts           # Auth state management
│   │
│   ├── components/
│   │   ├── ActivityCard.tsx
│   │   ├── DailyProgress.tsx
│   │   └── ...
│   │
│   └── screens/
│       └── DashboardScreen.tsx
│
├── database/
│   ├── schema.sql               # PostgreSQL schema
│   ├── README.md                # Setup guide
│   └── API_REFERENCE.md         # API documentation
│
├── App.tsx                      # Main app with auth
├── .env                         # Supabase credentials (gitignored)
├── .env.example                 # Template
└── BACKEND_SETUP.md             # Quick start guide
```

---

## Technology Stack

### Frontend
- **React Native** - Mobile framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **NativeWind** - Styling

### Backend
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Relational database
- **Row Level Security** - Data isolation
- **Realtime** - WebSocket subscriptions

### Authentication
- **Supabase Auth** - User management
- **Anonymous Auth** - Guest users
- **Email/Password** - Traditional auth

---

## Security Architecture

### Row Level Security (RLS)

```sql
-- Example: Users can only see their own tasks
CREATE POLICY "Users can view own completed tasks"
    ON public.completed_tasks FOR SELECT
    USING (auth.uid() = user_id);
```

### Data Isolation
```
User A (id: abc-123)
  ├─ Can access: completed_tasks WHERE user_id = 'abc-123'
  ├─ Can access: streaks WHERE user_id = 'abc-123'
  └─ Cannot access: Any data from User B

User B (id: def-456)
  ├─ Can access: completed_tasks WHERE user_id = 'def-456'
  ├─ Can access: streaks WHERE user_id = 'def-456'
  └─ Cannot access: Any data from User A
```

### API Key Security
- ✅ Keys stored in `.env` (gitignored)
- ✅ Environment variables in Expo
- ✅ Anon key is safe for client-side use
- ✅ RLS enforces data access rules

---

## Database Schema

### Entity Relationship Diagram

```
┌─────────────────┐
│   auth.users    │ (Supabase managed)
│                 │
│ • id (PK)       │
│ • email         │
│ • password      │
└────────┬────────┘
         │
         │ 1:1
         │
         ▼
┌─────────────────┐
│  public.users   │
│                 │
│ • id (PK, FK)   │
│ • email         │
│ • full_name     │
│ • avatar_url    │
└────────┬────────┘
         │
         ├─────────────────┬─────────────────┐
         │ 1:N             │ 1:N             │ 1:1
         │                 │                 │
         ▼                 ▼                 ▼
┌──────────────────┐  ┌──────────────┐  ┌─────────────────────┐
│ completed_tasks  │  │   streaks    │  │ user_preferences    │
│                  │  │              │  │                     │
│ • id (PK)        │  │ • id (PK)    │  │ • id (PK)           │
│ • user_id (FK)   │  │ • user_id    │  │ • user_id (FK)      │
│ • task_id        │  │ • task_id    │  │ • preferred_plan    │
│ • date           │  │ • current    │  │ • notifications     │
│ • completed_at   │  │ • longest    │  │ • theme             │
└──────────────────┘  │ • total      │  └─────────────────────┘
                      └──────────────┘
```

---

## API Layers

### Layer 1: Supabase Client
```typescript
// Low-level database access
const { data, error } = await supabase
  .from('completed_tasks')
  .select('*')
  .eq('user_id', userId);
```

### Layer 2: Service Functions
```typescript
// Business logic abstraction
const tasks = await getTodayCompletedTasks();
```

### Layer 3: React Hooks
```typescript
// State management
const { user, isAuthenticated } = useAuth();
```

### Layer 4: UI Components
```typescript
// User interface
<ActivityCard task={task} onComplete={handleComplete} />
```

---

## Performance Optimizations

### 1. Database Indexes
```sql
CREATE INDEX idx_completed_tasks_user_id ON completed_tasks(user_id);
CREATE INDEX idx_completed_tasks_date ON completed_tasks(date);
```

### 2. Query Optimization
- Only fetch today's tasks (not all history)
- Use `.single()` for unique records
- Limit results with `.limit()`

### 3. Real-time Subscriptions
- Subscribe only to user's own data
- Unsubscribe on component unmount
- Debounce rapid updates

### 4. Caching
- Supabase client caches session
- AsyncStorage for offline support
- React state for UI caching

---

## Scalability

### Current Capacity (Supabase Free Tier)
- ✅ 500 MB database storage
- ✅ 2 GB bandwidth/month
- ✅ 50,000 monthly active users
- ✅ Unlimited API requests

### Future Scaling Options
1. **Upgrade Supabase Plan** - More storage & bandwidth
2. **Edge Functions** - Serverless compute
3. **CDN** - Static asset delivery
4. **Database Replication** - Read replicas
5. **Connection Pooling** - Handle more concurrent users

---

## Monitoring & Analytics

### Built-in Supabase Tools
- **API Logs** - Request/response tracking
- **Database Logs** - SQL query monitoring
- **Auth Logs** - Sign-in/sign-up events
- **Performance Metrics** - Response times

### Custom Analytics Queries
```sql
-- Daily active users
SELECT COUNT(DISTINCT user_id) 
FROM completed_tasks 
WHERE date = CURRENT_DATE;

-- Most popular tasks
SELECT task_id, COUNT(*) as completions
FROM completed_tasks
GROUP BY task_id
ORDER BY completions DESC;

-- Streak leaderboard
SELECT u.email, s.current_streak
FROM streaks s
JOIN users u ON s.user_id = u.id
WHERE s.task_id = 'linkedin-zip'
ORDER BY s.current_streak DESC
LIMIT 10;
```

---

## Disaster Recovery

### Backup Strategy
1. **Automatic Backups** - Supabase daily backups (Pro plan)
2. **Manual Exports** - SQL dumps via dashboard
3. **Point-in-Time Recovery** - Restore to any moment

### Data Migration
```bash
# Export data
supabase db dump > backup.sql

# Import data
psql -h db.xxx.supabase.co -U postgres -d postgres < backup.sql
```

---

## Development Workflow

### Local Development
```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with Supabase credentials

# 3. Start dev server
npm start

# 4. Test on device
# Scan QR code with Expo Go
```

### Database Changes
```bash
# 1. Write SQL migration
# Edit database/schema.sql

# 2. Run in Supabase SQL Editor
# Copy & paste SQL

# 3. Verify in Table Editor
# Check tables created

# 4. Update TypeScript types
# Edit src/config/supabase.ts
```

---

## Testing Strategy

### Unit Tests
- Test service functions in isolation
- Mock Supabase client
- Verify data transformations

### Integration Tests
- Test auth flow end-to-end
- Verify database operations
- Check real-time subscriptions

### Manual Testing
- Test on physical device
- Verify offline behavior
- Check multi-device sync

---

## Deployment Checklist

- [ ] Create Supabase project
- [ ] Run database migrations
- [ ] Configure environment variables
- [ ] Test authentication
- [ ] Test task tracking
- [ ] Test real-time sync
- [ ] Enable RLS on all tables
- [ ] Set up database backups
- [ ] Configure email templates (for password reset)
- [ ] Build production app (EAS Build)

---

## Future Enhancements

### Phase 1: Core Features
- ✅ PostgreSQL database
- ✅ User authentication
- ✅ Task tracking
- ✅ Streak management
- ✅ Real-time sync

### Phase 2: Advanced Features
- ⬜ Social features (share streaks)
- ⬜ Analytics dashboard
- ⬜ Gamification (badges, levels)
- ⬜ Team collaboration
- ⬜ Export data (CSV, PDF)

### Phase 3: Enterprise Features
- ⬜ Admin panel
- ⬜ Custom task templates
- ⬜ API webhooks
- ⬜ Third-party integrations
- ⬜ White-label support

---

**Last Updated**: 2026-02-04
**Architecture Version**: 1.0.0
