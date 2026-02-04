const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { CompletedTask, Streak } = require('../models');
const auth = require('../middleware/auth');
const { Op } = require('sequelize');

// Get today's completed tasks
router.get('/today', auth, async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const tasks = await CompletedTask.findAll({
            where: {
                user_id: req.user.id,
                date: today
            }
        });
        res.json(tasks.map(t => t.task_id));
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Toggle task completion
router.post('/toggle', auth, async (req, res) => {
    try {
        const { task_id } = req.body;
        const today = new Date().toISOString().split('T')[0];

        const existingTask = await CompletedTask.findOne({
            where: {
                user_id: req.user.id,
                task_id,
                date: today
            }
        });

        if (existingTask) {
            await existingTask.destroy();
            // Update streak logic would go here if needed for un-marking
            return res.json({ completed: false });
        } else {
            await CompletedTask.create({
                id: uuidv4(),
                user_id: req.user.id,
                task_id,
                date: today
            });

            // Simple streak update example for LinkedIn Zip
            if (task_id === 'linkedin-zip') {
                let streak = await Streak.findOne({ where: { user_id: req.user.id, task_id } });
                if (!streak) {
                    streak = await Streak.create({
                        id: uuidv4(),
                        user_id: req.user.id,
                        task_id,
                        current_streak: 1,
                        longest_streak: 1,
                        total_completions: 1,
                        last_completed_date: today
                    });
                } else {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    const yesterdayStr = yesterday.toISOString().split('T')[0];

                    if (streak.last_completed_date === yesterdayStr) {
                        streak.current_streak += 1;
                    } else if (streak.last_completed_date !== today) {
                        streak.current_streak = 1;
                    }

                    streak.total_completions += 1;
                    if (streak.current_streak > streak.longest_streak) {
                        streak.longest_streak = streak.current_streak;
                    }
                    streak.last_completed_date = today;
                    await streak.save();
                }
            }

            return res.json({ completed: true });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Get streaks
router.get('/streaks', auth, async (req, res) => {
    try {
        const streaks = await Streak.findAll({ where: { user_id: req.user.id } });
        res.json(streaks);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
