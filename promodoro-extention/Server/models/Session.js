const mongoose = require('mongoose');
const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,  // Assuming userId is an ObjectId that references the User model
    required: true,
    ref: 'User'  // Reference to the User model
  },
  tab: {
    type: String,
    required: true,
  },
  completionTime: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Completed', 'Skipped'],
    required: true,
  },
  cycleCount: {
    type: Number,
    default: 0,
  },
  focusTime: {
    type: Number, // Duration in seconds
    required: true,
  },
  shortBreak: {
    type: Number, // Duration in seconds
    required: true,
  },
  longBreak: {
    type: Number, // Duration in seconds
    required: true,
  },
});

const Session = mongoose.model('Session', sessionSchema);
module.exports = Session;


