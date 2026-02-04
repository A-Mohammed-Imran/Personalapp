# 🐬 LifeSync AI - MySQL Migration Guide

The project has been migrated from Supabase (PostgreSQL) to a custom **Node.js + Express + MySQL** backend.

## 🏗️ Architecture Change
- **Old**: React Native → Supabase (Direct Cloud DB)
- **New**: React Native → Node.js API (Express) → MySQL

## 🚀 Getting Started

### 1. Database Setup
1. Open your MySQL client (MySQL Workbench, phpMyAdmin, or CLI).
2. Run the schema script located at: `/server/database/mysql_schema.sql`.
   - This will create the `lifesync_db` database and all necessary tables.

### 2. Server Configuration
1. Navigate to the `server/` directory.
2. Open the `.env` file.
3. Update the following variables with your MySQL credentials:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=your_password
   DB_NAME=lifesync_db
   ```
4. Install server dependencies:
   ```bash
   cd server
   npm install
   ```
5. Start the server:
   ```bash
   node index.js
   ```
   The server will run on `http://localhost:5000`.

### 3. Mobile App Configuration
1. The app now uses Axios to communicate with the backend.
2. Configuration is in `src/config/api.ts`.
3. **If testing on a physical device**:
   - Change `localhost` in `src/config/api.ts` to your machine's local IP address (e.g., `http://192.168.1.5:5000/api`).
   - Ensure both your machine and device are on the same Wi-Fi network.

## 📁 Key Changes
- **Backend**: Created `/server` directory with Express/Sequelize setup.
- **Models**: Core models (User, CompletedTask, Streak, Preference) implemented in `server/models/index.js`.
- **API**: Authentication, Tasks, and Preferences routes implemented in `server/routes/`.
- **Services**: `authService`, `databaseService`, and `userPreferencesService` reworked to use API calls instead of Supabase SDK.

## 🚧 Upcoming Tasks
- Implement Analytics and Goals in the MySQL backend (schema is ready).
- Add Socket.io for real-time updates (replaces Supabase real-time).
- Implement mood tracking and journal API endpoints.

🎉 **Migration complete! You are now running on MySQL.**
