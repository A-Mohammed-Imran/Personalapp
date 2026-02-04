const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const { sequelize } = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'LifeSync API is running' });
});

// Auth Routes (Example)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/preferences', require('./routes/preferences'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/notes', require('./routes/notes'));

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Database Sync & Start Server
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ MySQL Connection established successfully.');

        // In production, you might not want to sync like this
        // await sequelize.sync({ alter: true });

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
    }
};

startServer();
