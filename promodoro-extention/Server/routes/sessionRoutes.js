
const express = require('express');
const Session = require('../models/Session');
const User = require('../models/userModel');
const mongoose = require('mongoose'); 
const router = express.Router();

// Save session data
router.post('/saveSessionData', async (req, res) => {
  const { userId, tab, focusTime, shortBreak, longBreak, cycleCount } = req.body;

  if (!userId || !tab || focusTime === undefined || shortBreak === undefined || longBreak === undefined) {
    return res.status(400).json({ success: false, message: 'Invalid data' });
  }

  try {
    
    const userObjectId = new mongoose.Types.ObjectId(userId); // Use new keyword

    // Validate userId exists
    const userExists = await User.findById(userObjectId);
    if (!userExists) {
      return res.status(404).json({ success: false, message: 'User  not found' });
    }

    const newSession = new Session({ userId: userObjectId, tab, focusTime, shortBreak, longBreak, cycleCount });
    await newSession.save();

    res.status(201).json({ success: true, message: 'Session data saved successfully', data: newSession });
  } catch (error) {
    console.error("Error saving session data:", error); // Log the error for debugging
    res.status(500).json({ success: false, message: 'Error saving session data', error: error.message });
  }
});


router.get('/history', async (req, res) => {
  const { userId } = req.query;

  // Validate userId
  if (!userId) {
    return res.status(400).json({ success: false, message: 'User  ID is required' });
  }

  try {
    
    const userObjectId = new mongoose.Types.ObjectId(userId);

    
    const sessions = await Session.find({ userId: userObjectId }).sort({ createdAt: -1 });

    if (!sessions || sessions.length === 0) {
      return res.status(404).json({ success: false, message: 'No session history found' });
    }

    // Format session data
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
    console.error("Error fetching session history:", error); // Log the error for debugging
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
});

module.exports = router;