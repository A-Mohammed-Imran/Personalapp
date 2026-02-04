const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { Notification, Reminder } = require('../models');
const auth = require('../middleware/auth');

// Get all notifications
router.get('/', auth, async (req, res) => {
    try {
        const notifications = await Notification.findAll({
            where: { user_id: req.user.id },
            order: [['created_at', 'DESC']],
            limit: 50
        });
        res.json(notifications);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Mark notification as read
router.patch('/:id/read', auth, async (req, res) => {
    try {
        const notification = await Notification.findOne({
            where: { id: req.params.id, user_id: req.user.id }
        });
        if (!notification) return res.status(404).json({ error: 'Notification not found' });

        notification.is_read = true;
        notification.read_at = new Date();
        await notification.save();
        res.json(notification);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Get reminders
router.get('/reminders', auth, async (req, res) => {
    try {
        const reminders = await Reminder.findAll({
            where: { user_id: req.user.id }
        });
        res.json(reminders);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Add/Update reminder
router.post('/reminders', auth, async (req, res) => {
    try {
        const { task_id, reminder_time, days_of_week } = req.body;
        const [reminder, created] = await Reminder.findOrCreate({
            where: { user_id: req.user.id, task_id },
            defaults: {
                id: uuidv4(),
                reminder_time,
                days_of_week
            }
        });

        if (!created) {
            reminder.reminder_time = reminder_time;
            reminder.days_of_week = days_of_week;
            await reminder.save();
        }

        res.json(reminder);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
