const express = require('express');
const Session = require('../models/Session');
const jwt = require('jsonwebtoken'); // If using JWT for auth
const router = express.Router();

// Save session data (with token-based auth)
router.post('/saveSessionData', async (req, res) => {
  const { userId, tab, completionTime, status, focusTime, shortBreak, longBreak, cycleCount } = req.body;

  // Check if the required fields are present
  if (!userId || !tab || !completionTime || !status || focusTime === undefined || shortBreak === undefined || longBreak === undefined) {
    return res.status(400).json({ success: false, message: 'Invalid data' });
  }

  try {
    // Verify the token if it's passed
    const token = req.headers['authorization']?.split(' ')[1];  // Get token from the authorization header
    if (!token) {
      return res.status(401).json({ success: false, message: 'Token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Decode the token
    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    // Create a new session
    const newSession = new Session({
      userId,
      tab,
      completionTime,
      status,
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



// Get session history for a user (no token-based auth)
router.get('/history', async (req, res) => {
    try {
        // Assuming you can pass a userId in the query string
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required' });
        }

        const sessions = await Session.find({ userId }).sort({ createdAt: -1 }); // Sort by most recent session
        
        if (!sessions || sessions.length === 0) {
            return res.status(404).json({ success: false, message: 'No session history found' });
        }

        const formattedSessions = sessions.map(session => ({
            id: session._id,
            tab: session.tab,
            status: session.status,
            focusTime: session.focusTime,
            shortBreak: session.shortBreak,
            longBreak: session.longBreak,
            cycleCount: session.cycleCount,
            completionTime: session.createdAt.toISOString(),
        }));

        res.status(200).json({ success: true, sessions: formattedSessions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
