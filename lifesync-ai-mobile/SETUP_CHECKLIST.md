# ✅ Backend Setup Checklist

Use this checklist to track your backend setup progress.

---

## 📋 Pre-Setup

- [ ] Node.js and npm installed
- [ ] Expo CLI installed (`npm install -g expo-cli`)
- [ ] Git installed (optional, for version control)
- [ ] Code editor ready (VS Code recommended)

---

## 🚀 Supabase Setup

### Create Project
- [ ] Go to [supabase.com](https://supabase.com)
- [ ] Sign up / Log in to account
- [ ] Click **"New Project"**
- [ ] Enter project details:
  - [ ] Name: `lifesync-ai-mobile`
  - [ ] Database password: _____________ (save this!)
  - [ ] Region: _____________ (choose closest)
- [ ] Click **"Create new project"**
- [ ] Wait for initialization (~2 minutes)

### Get API Credentials
- [ ] Go to **Settings** → **API**
- [ ] Copy **Project URL**: _________________________________
- [ ] Copy **anon/public key**: _________________________________
- [ ] Save these credentials securely

---

## 🔧 Local Configuration

### Environment Variables
- [ ] Navigate to project directory
- [ ] Copy `.env.example` to `.env`:
  ```bash
  cp .env.example .env
  ```
- [ ] Edit `.env` file
- [ ] Paste **Project URL** into `EXPO_PUBLIC_SUPABASE_URL`
- [ ] Paste **anon key** into `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Save `.env` file
- [ ] Verify `.env` is in `.gitignore` (already done ✅)

---

## 🗄️ Database Setup

### Run Migration
- [ ] Open Supabase dashboard
- [ ] Go to **SQL Editor**
- [ ] Click **"New Query"**
- [ ] Open `database/schema.sql` in your code editor
- [ ] Copy entire contents
- [ ] Paste into Supabase SQL Editor
- [ ] Click **"Run"** button
- [ ] Wait for success message

### Verify Tables Created
- [ ] Go to **Table Editor** in Supabase
- [ ] Verify these tables exist:
  - [ ] `users`
  - [ ] `completed_tasks`
  - [ ] `streaks`
  - [ ] `user_preferences`
- [ ] Click on each table to verify columns

### Verify Security
- [ ] Go to **Authentication** → **Policies**
- [ ] Verify RLS policies exist for:
  - [ ] `users` table
  - [ ] `completed_tasks` table
  - [ ] `streaks` table
  - [ ] `user_preferences` table

---

## 📱 App Configuration

### Install Dependencies
- [ ] Open terminal in project directory
- [ ] Run: `npm install`
- [ ] Verify `@supabase/supabase-js` installed
- [ ] Check for any errors

### Update App Code
- [ ] Verify `App.tsx` uses `useAuth()` hook (already done ✅)
- [ ] Verify `src/config/supabase.ts` exists (already done ✅)
- [ ] Verify `src/services/` folder has:
  - [ ] `authService.ts`
  - [ ] `databaseService.ts`
  - [ ] `userPreferencesService.ts`
- [ ] Verify `src/hooks/useAuth.ts` exists (already done ✅)

---

## 🧪 Testing

### Start Development Server
- [ ] Run: `npm start`
- [ ] Wait for QR code to appear
- [ ] Verify no errors in terminal

### Test on Device
- [ ] Install **Expo Go** app on phone
- [ ] Scan QR code
- [ ] Wait for app to load
- [ ] Verify loading screen appears
- [ ] Verify app loads successfully (no error screen)

### Test Authentication
- [ ] Check console logs for "signing in anonymously"
- [ ] Go to Supabase → **Authentication** tab
- [ ] Verify anonymous user created
- [ ] Note user ID: _________________________________

### Test Task Tracking
- [ ] In the app, complete a task
- [ ] Go to Supabase → **Table Editor** → `completed_tasks`
- [ ] Click **Refresh**
- [ ] Verify new row with your task appears
- [ ] Check `user_id` matches authenticated user

### Test Streak Tracking
- [ ] In the app, complete "LinkedIn Zip" task
- [ ] Go to Supabase → **Table Editor** → `streaks`
- [ ] Click **Refresh**
- [ ] Verify streak record created
- [ ] Check `current_streak` = 1

### Test Real-time Sync (Optional)
- [ ] Open app on second device
- [ ] Sign in (or use anonymous auth)
- [ ] Complete a task on Device 1
- [ ] Verify task appears on Device 2 automatically

---

## 📊 Verification Queries

### Run in Supabase SQL Editor

#### Check Users
```sql
SELECT * FROM users;
```
- [ ] Executed successfully
- [ ] Shows your user(s)

#### Check Today's Tasks
```sql
SELECT * FROM completed_tasks WHERE date = CURRENT_DATE;
```
- [ ] Executed successfully
- [ ] Shows completed tasks

#### Check Streaks
```sql
SELECT u.email, s.task_id, s.current_streak, s.longest_streak
FROM streaks s
JOIN users u ON s.user_id = u.id;
```
- [ ] Executed successfully
- [ ] Shows streak data

---

## 🔐 Security Verification

### Environment Variables
- [ ] `.env` file exists
- [ ] `.env` is in `.gitignore`
- [ ] `.env` contains correct Supabase URL
- [ ] `.env` contains correct anon key
- [ ] `.env` is NOT committed to git

### Row Level Security
- [ ] RLS enabled on `users` table
- [ ] RLS enabled on `completed_tasks` table
- [ ] RLS enabled on `streaks` table
- [ ] RLS enabled on `user_preferences` table

### Test Data Isolation
- [ ] Create second test user
- [ ] Verify User A cannot see User B's tasks
- [ ] Verify User B cannot see User A's streaks

---

## 📚 Documentation Review

- [ ] Read `BACKEND_SETUP.md` (quick summary)
- [ ] Read `database/README.md` (comprehensive guide)
- [ ] Bookmark `database/API_REFERENCE.md` (for development)
- [ ] Review `database/ARCHITECTURE.md` (system design)

---

## 🎯 Final Checks

### Functionality
- [ ] User can sign in (anonymous or email/password)
- [ ] User can complete tasks
- [ ] Tasks persist after app restart
- [ ] Streaks update correctly
- [ ] Real-time sync works (if tested)

### Performance
- [ ] App loads in < 3 seconds
- [ ] Task completion is instant
- [ ] No lag or freezing
- [ ] Database queries are fast

### Error Handling
- [ ] App shows loading state during auth
- [ ] App shows error if Supabase unreachable
- [ ] App handles network errors gracefully
- [ ] Console shows helpful error messages

---

## 🚀 Production Readiness

### Before Going Live
- [ ] Change database password (if using default)
- [ ] Enable database backups in Supabase
- [ ] Set up monitoring/alerts
- [ ] Test on multiple devices
- [ ] Test offline behavior
- [ ] Review RLS policies
- [ ] Enable 2FA on Supabase account
- [ ] Document any custom changes

### Optional Enhancements
- [ ] Set up custom email templates (password reset)
- [ ] Configure email provider (SendGrid, etc.)
- [ ] Add analytics tracking
- [ ] Set up error reporting (Sentry)
- [ ] Create admin dashboard
- [ ] Set up CI/CD pipeline

---

## 📝 Notes

### Issues Encountered
```
Date: _____________
Issue: _____________________________________________
Solution: __________________________________________

Date: _____________
Issue: _____________________________________________
Solution: __________________________________________
```

### Custom Modifications
```
Date: _____________
Change: ____________________________________________
Reason: ____________________________________________

Date: _____________
Change: ____________________________________________
Reason: ____________________________________________
```

---

## ✅ Completion

- [ ] All setup steps completed
- [ ] All tests passed
- [ ] Documentation reviewed
- [ ] App running successfully
- [ ] Backend fully functional

### Sign-off
```
Setup completed by: _____________________
Date: _____________
Time taken: _____________ minutes
```

---

## 🎉 Congratulations!

If all checkboxes are checked, your PostgreSQL backend is **100% ready**!

### Next Steps:
1. Start building features
2. Integrate with existing components
3. Test thoroughly
4. Deploy to production

### Resources:
- API Reference: `database/API_REFERENCE.md`
- Troubleshooting: `database/README.md`
- Supabase Dashboard: https://app.supabase.com

---

**Need help?** Check the documentation or Supabase Discord!
