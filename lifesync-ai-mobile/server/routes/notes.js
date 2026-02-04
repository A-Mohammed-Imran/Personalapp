const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { DailyNote } = require('../models');
const auth = require('../middleware/auth');

// Get notes for a date
router.get('/:date', auth, async (req, res) => {
    try {
        const note = await DailyNote.findOne({
            where: { user_id: req.user.id, date: req.params.date }
        });
        res.json(note);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Create/Update daily note (Mood Tracking)
router.post('/', auth, async (req, res) => {
    try {
        const { date, mood, energy_level, note_content, tags } = req.body;
        const [note, created] = await DailyNote.findOrCreate({
            where: { user_id: req.user.id, date },
            defaults: {
                id: uuidv4(),
                mood,
                energy_level,
                note_content,
                tags
            }
        });

        if (!created) {
            if (mood) note.mood = mood;
            if (energy_level) note.energy_level = energy_level;
            if (note_content) note.note_content = note_content;
            if (tags) note.tags = tags;
            await note.save();
        }

        res.json(note);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
