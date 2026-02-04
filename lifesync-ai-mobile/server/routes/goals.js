const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { UserGoal, Achievement } = require('../models');
const auth = require('../middleware/auth');

// Get all goals
router.get('/', auth, async (req, res) => {
    try {
        const goals = await UserGoal.findAll({
            where: { user_id: req.user.id },
            order: [['created_at', 'DESC']]
        });
        res.json(goals);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Create a goal
router.post('/', auth, async (req, res) => {
    try {
        const { goal_type, title, description, target_value, start_date, end_date } = req.body;
        const goal = await UserGoal.create({
            id: uuidv4(),
            user_id: req.user.id,
            goal_type,
            title,
            description,
            target_value,
            start_date,
            end_date
        });
        res.json(goal);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Update goal progress
router.patch('/:id', auth, async (req, res) => {
    try {
        const { current_value } = req.body;
        const goal = await UserGoal.findOne({ where: { id: req.params.id, user_id: req.user.id } });

        if (!goal) return res.status(404).json({ error: 'Goal not found' });

        goal.current_value = current_value;
        if (goal.current_value >= goal.target_value) {
            goal.is_completed = true;
            goal.completed_at = new Date();
        }
        await goal.save();
        res.json(goal);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Get achievements
router.get('/achievements', auth, async (req, res) => {
    try {
        const achievements = await Achievement.findAll({
            where: { user_id: req.user.id },
            order: [['earned_at', 'DESC']]
        });
        res.json(achievements);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
