# 🚀 LifeSync AI Mobile - PostgreSQL Backend

> **Complete backend setup with Supabase for task tracking, streaks, and user management**

![Setup Guide](./backend_setup_guide.png)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Features](#features)
- [Documentation](#documentation)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Security](#security)
- [Support](#support)

---

## 🎯 Overview

LifeSync AI Mobile now has a **production-ready PostgreSQL backend** powered by Supabase. This provides:

- ✅ **User Authentication** - Email/password + anonymous auth
- ✅ **Task Tracking** - Daily task completion with history
- ✅ **Streak Management** - LinkedIn Zip game streak counter
- ✅ **User Preferences** - Plan selection, notifications, theme
- ✅ **Real-time Sync** - Multi-device synchronization
- ✅ **Secure Data** - Row Level Security (RLS) enabled

---

## ⚡ Quick Start

### Prerequisites
- Node.js & npm installed
- Expo CLI installed
- Supabase account (free tier works!)

### 5-Minute Setup

#### 1️⃣ Create Supabase Project
```bash
# Go to https://supabase.com
# Click "New Project"
# Name: lifesync-ai-mobile
# Choose password & region
```

#### 2️⃣ Get API Credentials
```bash
# In Supabase Dashboard:
# Settings → API
# Copy: Project URL & anon key
```

#### 3️⃣ Configure Environment
```bash
# Copy template
cp .env.example .env

# Edit .env with your credentials
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

#### 4️⃣ Run Database Migration
```bash
# In Supabase Dashboard:
# SQL Editor → New Query
# Copy contents of database/schema.sql
# Paste and click "Run"
```

#### 5️⃣ Launch App
```bash
npm start
```

**That's it!** Your backend is ready. 🎉

---

## 🌟 Features

### Authentication
- **Email/Password** - Traditional sign up/sign in
- **Anonymous Auth** - Guest mode (no email required)
- **Password Reset** - Email-based recovery
- **Session Management** - Automatic persistence

### Task Tracking
- **Daily Tasks** - Mark tasks as complete
- **Task History** - View past completions
- **Progress Tracking** - Completion percentage
- **Real-time Updates** - Sync across devices

### Streak Management
- **Current Streak** - Days in a row
- **Longest Streak** - Personal record
- **Total Completions** - Lifetime counter
- **Risk Warnings** - Alert if streak at risk

### User Preferences
- **Preferred Plan** - Plan A or Plan B
- **Notifications** - Enable/disable alerts
- **Theme** - Light, dark, or auto

### Real-time Sync
- **Multi-device** - Same data everywhere
- **Live Updates** - Changes sync instantly
- **Offline Support** - Coming soon

---

## 📚 Documentation

| Document | Description | Size |
|----------|-------------|------|
| **[BACKEND_SETUP.md](./BACKEND_SETUP.md)** | Complete setup summary | 12 KB |
| **[database/README.md](./database/README.md)** | Comprehensive setup guide | 9 KB |
| **[database/API_REFERENCE.md](./database/API_REFERENCE.md)** | All API functions | 15 KB |
| **[database/ARCHITECTURE.md](./database/ARCHITECTURE.md)** | System design & diagrams | 17 KB |
| **[database/schema.sql](./database/schema.sql)** | PostgreSQL schema | 7 KB |

---

## 🛠️ Tech Stack

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
- **JWT Tokens** - Secure sessions
- **Email/Password** - Traditional auth
- **Anonymous** - Guest access

---

## 📁 Project Structure

```
lifesync-ai-mobile/
│
├── src/
│   ├── config/
│   │   ├── supabase.ts          # Supabase client & types
│   │   └── schedule.ts          # Task schedules
│   │
│   ├── services/
│   │   ├── authService.ts       # Authentication
│   │   ├── databaseService.ts   # Task & streak tracking
│   │   └── userPreferencesService.ts  # User settings
│   │
│   ├── hooks/
│   │   └── useAuth.ts           # Auth state hook
│   │
│   ├── components/              # UI components
│   └── screens/                 # App screens
│
├── database/
│   ├── schema.sql               # PostgreSQL schema
│   ├── README.md                # Setup guide
│   ├── API_REFERENCE.md         # API docs
│   └── ARCHITECTURE.md          # System design
│
├── App.tsx                      # Main app entry
├── .env                         # Supabase credentials (gitignored)
├── .env.example                 # Template
└── BACKEND_SETUP.md             # This file
```

---

## 🔌 API Reference

### Quick Examples

#### Authentication
```typescript
import { useAuth } from './src/hooks/useAuth';

const { user, isAuthenticated, isLoading } = useAuth();
```

#### Task Tracking
```typescript
import { markTaskCompleted, getTodayCompletedTasks } from './src/services/databaseService';

// Mark task complete
await markTaskCompleted('linkedin-zip');

// Get completed tasks
const tasks = await getTodayCompletedTasks();
```

#### Streak Management
```typescript
import { getLinkedInStreak, isStreakAtRisk } from './src/services/databaseService';

const streak = await getLinkedInStreak();
console.log(streak.current_streak); // 5
```

**Full API Reference**: [database/API_REFERENCE.md](./database/API_REFERENCE.md)

---

## 🔐 Security

### Built-in Security Features

✅ **Row Level Security (RLS)**
- Users can only access their own data
- Automatic data isolation
- No cross-user data leakage

✅ **Encrypted Connections**
- HTTPS for API calls
- WSS for real-time subscriptions
- TLS 1.3 encryption

✅ **Secure Authentication**
- JWT tokens
- Session management
- Password hashing (bcrypt)

✅ **Environment Variables**
- API keys in `.env` (gitignored)
- No hardcoded credentials
- Secure key storage

### Security Best Practices

```typescript
// ✅ Good - Check authentication
const user = await getCurrentUser();
if (!user) return;

// ❌ Bad - No auth check
const tasks = await getTodayCompletedTasks();
```

---

## 🗄️ Database Schema

### Tables

#### users
```sql
- id (UUID, PK)
- email (Text, Unique)
- full_name (Text)
- avatar_url (Text)
```

#### completed_tasks
```sql
- id (UUID, PK)
- user_id (UUID, FK)
- task_id (Text)
- date (Date)
- UNIQUE(user_id, task_id, date)
```

#### streaks
```sql
- id (UUID, PK)
- user_id (UUID, FK)
- task_id (Text)
- current_streak (Integer)
- longest_streak (Integer)
- total_completions (Integer)
```

#### user_preferences
```sql
- id (UUID, PK)
- user_id (UUID, FK)
- preferred_plan (Text)
- notifications_enabled (Boolean)
- theme (Text)
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Sign up with email/password
- [ ] Sign in with credentials
- [ ] Complete a task
- [ ] Check task in Supabase Table Editor
- [ ] Complete LinkedIn Zip task
- [ ] Verify streak incremented
- [ ] Test on second device (real-time sync)
- [ ] Change preferences
- [ ] Verify preferences synced

### Database Verification

```sql
-- View all users
SELECT * FROM users;

-- View today's tasks
SELECT * FROM completed_tasks WHERE date = CURRENT_DATE;

-- View streaks
SELECT u.email, s.current_streak 
FROM streaks s 
JOIN users u ON s.user_id = u.id;
```

---

## 🚀 Deployment

### Supabase (Backend)
- ✅ Already deployed (cloud-hosted)
- ✅ Auto-scaling
- ✅ 99.9% uptime SLA

### Mobile App
```bash
# Development
npm start

# Production build (EAS)
eas build --platform android
eas build --platform ios
```

---

## 📊 Performance

### Database Optimizations
- ✅ Indexes on frequently queried columns
- ✅ Unique constraints prevent duplicates
- ✅ Efficient queries (only fetch needed data)

### Scalability
- **Free Tier**: 50,000 monthly active users
- **Bandwidth**: 2 GB/month
- **Storage**: 500 MB database
- **Requests**: Unlimited

---

## 🔧 Troubleshooting

### Common Issues

**"Invalid API key"**
→ Check `.env` file has correct Supabase credentials

**"No rows returned"**
→ Ensure user is authenticated (check `useAuth()`)

**"Relation does not exist"**
→ Run `database/schema.sql` in Supabase SQL Editor

**App not connecting**
→ Restart Expo dev server after adding `.env`

---

## 📞 Support

### Documentation
- **Setup Guide**: [database/README.md](./database/README.md)
- **API Reference**: [database/API_REFERENCE.md](./database/API_REFERENCE.md)
- **Architecture**: [database/ARCHITECTURE.md](./database/ARCHITECTURE.md)

### External Resources
- [Supabase Docs](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [React Native Supabase Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)

---

## 📈 Roadmap

### ✅ Phase 1: Core Backend (Complete)
- PostgreSQL database
- User authentication
- Task tracking
- Streak management
- Real-time sync

### ⬜ Phase 2: Advanced Features
- Social features (share streaks)
- Analytics dashboard
- Gamification (badges, levels)
- Export data (CSV, PDF)

### ⬜ Phase 3: Enterprise
- Admin panel
- Team collaboration
- API webhooks
- Third-party integrations

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🙏 Acknowledgments

- **Supabase** - Amazing backend platform
- **PostgreSQL** - Reliable database
- **Expo** - Great mobile development experience
- **React Native** - Cross-platform framework

---

## 📝 Changelog

### v1.0.0 (2026-02-04)
- ✅ Initial PostgreSQL backend setup
- ✅ Supabase integration
- ✅ Authentication service
- ✅ Task tracking service
- ✅ Streak management
- ✅ User preferences
- ✅ Real-time subscriptions
- ✅ Complete documentation

---

**Made with ❤️ for LifeSync AI Mobile**

**Backend Status**: ✅ Production Ready
**Setup Time**: ~5 minutes
**Documentation**: 50+ KB
**Lines of Code**: 1,500+

🎉 **Your PostgreSQL backend is ready to use!** 🎉
