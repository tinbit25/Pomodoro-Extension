const express = require('express');
const Session = require('../models/Session');
const router = express.Router();

// Save session data (without token-based auth)
router.post('/saveSessionData', async (req, res) => {
  const { userId, tab, focusTime, shortBreak, longBreak, cycleCount } = req.body;

  if (!userId || !tab || focusTime === undefined || shortBreak === undefined || longBreak === undefined) {
    return res.status(400).json({ success: false, message: 'Invalid data' });
  }

  try {
    const newSession = new Session({
      userId,
      tab,
      focusTime,
      shortBreak,
      longBreak,
      cycleCount,
    });

    await newSession.save();
    res.status(201).json({ success: true, message: 'Session data saved successfully', data: newSession });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error saving session data', error: error.message });
  }
});

// Get session history for a user (without token-based auth)
router.get('/history/:Id', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ success: false, message: 'User ID is required' });
  }

  try {
    const sessions = await Session.find({ userId }).sort({ createdAt: -1 });

    if (!sessions || sessions.length === 0) {
      return res.status(404).json({ success: false, message: 'No session history found' });
    }

    const formattedSessions = sessions.map(session => ({
      id: session._id,
      tab: session.tab,
      focusTime: session.focusTime,
      shortBreak: session.shortBreak,
      longBreak: session.longBreak,
      cycleCount: session.cycleCount,
      completionTime: session.createdAt ? session.createdAt.toISOString() : null,
    }));

    res.status(200).json({ success: true, sessions: formattedSessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
