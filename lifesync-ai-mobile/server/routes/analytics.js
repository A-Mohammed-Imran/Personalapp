const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { DailyAnalytics, WeeklySummary, CompletedTask, UserGoal, Streak, sequelize } = require('../models');
const auth = require('../middleware/auth');
const { Op } = require('sequelize');

// Get daily analytics for a range
router.get('/daily', auth, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const analytics = await DailyAnalytics.findAll({
            where: {
                user_id: req.user.id,
                date: {
                    [Op.between]: [startDate || '2000-01-01', endDate || new Date().toISOString().split('T')[0]]
                }
            },
            order: [['date', 'ASC']]
        });
        res.json(analytics);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Get latest weekly summary
router.get('/weekly/latest', auth, async (req, res) => {
    try {
        const summary = await WeeklySummary.findOne({
            where: { user_id: req.user.id },
            order: [['week_start_date', 'DESC']]
        });
        res.json(summary);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Recalculate daily analytics (can be triggered after task toggle)
router.post('/sync/:date', auth, async (req, res) => {
    try {
        const { date } = req.params;
        const completedCount = await CompletedTask.count({
            where: { user_id: req.user.id, date }
        });

        // Assuming total tasks is passed or fixed per plan
        const totalTasks = req.body.totalTasks || 10;
        const completionRate = (completedCount / totalTasks) * 100;

        const [analytics, created] = await DailyAnalytics.findOrCreate({
            where: { user_id: req.user.id, date },
            defaults: {
                id: uuidv4(),
                total_tasks: totalTasks,
                completed_tasks: completedCount,
                completion_rate: completionRate,
                plan_used: req.body.planUsed || 'planA'
            }
        });

        if (!created) {
            analytics.completed_tasks = completedCount;
            analytics.completion_rate = completionRate;
            if (req.body.planUsed) analytics.plan_used = req.body.planUsed;
            await analytics.save();
        }

        res.json(analytics);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
