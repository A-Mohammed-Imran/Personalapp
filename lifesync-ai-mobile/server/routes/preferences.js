const express = require('express');
const router = express.Router();
const { UserPreference } = require('../models');
const auth = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// Get user preferences
router.get('/', auth, async (req, res) => {
    try {
        let prefs = await UserPreference.findOne({ where: { user_id: req.user.id } });
        if (!prefs) {
            prefs = await UserPreference.create({
                id: uuidv4(),
                user_id: req.user.id,
                preferred_plan: 'planA',
                notifications_enabled: true,
                theme: 'auto'
            });
        }
        res.json(prefs);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Update preferences
router.put('/', auth, async (req, res) => {
    try {
        const { preferred_plan, notifications_enabled, theme } = req.body;
        let prefs = await UserPreference.findOne({ where: { user_id: req.user.id } });

        if (!prefs) {
            prefs = await UserPreference.create({
                id: uuidv4(),
                user_id: req.user.id,
                preferred_plan: preferred_plan || 'planA',
                notifications_enabled: notifications_enabled !== undefined ? notifications_enabled : true,
                theme: theme || 'auto'
            });
        } else {
            if (preferred_plan) prefs.preferred_plan = preferred_plan;
            if (notifications_enabled !== undefined) prefs.notifications_enabled = notifications_enabled;
            if (theme) prefs.theme = theme;
            await prefs.save();
        }

        res.json(prefs);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
