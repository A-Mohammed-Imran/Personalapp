# 🔧 Quick Fix: Supabase Setup

## ⚠️ Error Fixed

The error **"Invalid supabaseUrl"** has been resolved. The app now shows a helpful setup screen instead of crashing.

---

## 📋 What You Need to Do

### **Step 1: Create Supabase Account** (2 minutes)

1. Go to **https://supabase.com**
2. Click **"Start your project"**
3. Sign up with GitHub, Google, or Email

### **Step 2: Create New Project** (2 minutes)

1. Click **"New Project"**
2. Fill in details:
   - **Name**: `lifesync-ai-mobile`
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to you
3. Click **"Create new project"**
4. Wait ~2 minutes for setup to complete

### **Step 3: Get API Credentials** (1 minute)

1. In your Supabase dashboard, click **Settings** (gear icon)
2. Click **API** in the sidebar
3. You'll see two important values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string of characters)
4. Keep this page open!

### **Step 4: Update .env File** (1 minute)

1. Open your project folder: `lifesync-ai-mobile`
2. Find the **`.env`** file (it's in the root folder)
3. Open it in any text editor
4. Replace the placeholder values:

```env
# Before (placeholders):
EXPO_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=placeholder-key-replace-with-actual-key

# After (your actual values):
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

5. **Save the file**

### **Step 5: Restart Expo** (30 seconds)

1. Go to your terminal where `npm start` is running
2. Press **`r`** to reload
3. Or stop (Ctrl+C) and run `npm start` again

---

## ✅ Verification

After restarting, you should see:
- ✅ No more red error screen
- ✅ App loads with a loading spinner
- ✅ Then shows the main dashboard

---

## 🗄️ Database Setup (Optional - Do Later)

Once the app is running, you can set up the database:

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy contents of `database/schema.sql`
4. Paste and click **"Run"**
5. Verify tables created in **Table Editor**

---

## 🆘 Troubleshooting

### Still seeing error after restart?

**Check your .env file:**
```bash
# Make sure there are NO spaces around the = sign
# ✅ Correct:
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co

# ❌ Wrong:
EXPO_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
```

### Can't find .env file?

It's located at:
```
lifesync-ai-mobile/
  ├── .env          ← HERE
  ├── App.tsx
  ├── package.json
  └── ...
```

If it doesn't exist, I already created it for you. Just edit it with your credentials.

### App still shows setup screen?

1. Double-check your Supabase URL starts with `https://`
2. Make sure you copied the **anon** key, not the **service_role** key
3. Restart Expo completely (stop and `npm start` again)

---

## 📸 Visual Guide

### Where to find API credentials in Supabase:

```
Supabase Dashboard
  └── Settings (⚙️ gear icon)
      └── API
          ├── Project URL: https://xxxxx.supabase.co  ← Copy this
          └── Project API keys
              └── anon public: eyJhbG...  ← Copy this
```

---

## 🎯 Quick Summary

1. ✅ Create Supabase account
2. ✅ Create project: "lifesync-ai-mobile"
3. ✅ Get URL & anon key from Settings → API
4. ✅ Edit `.env` file with your credentials
5. ✅ Restart Expo (press 'r' in terminal)

**Total time**: ~5 minutes

---

## 💡 What Changed?

I've updated the app to:
- ✅ Show a helpful setup screen instead of crashing
- ✅ Provide step-by-step instructions
- ✅ Validate Supabase credentials
- ✅ Give clear error messages

Now when Supabase isn't configured, you'll see a beautiful dark-themed setup screen with instructions instead of a red error!

---

**Need help?** Check the setup screen in the app - it has all the instructions! 🚀
