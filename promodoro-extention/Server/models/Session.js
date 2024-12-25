const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  tab: {
    type: String,
    required: true,
  },
  completionTime: {
    type: Date,
    default: Date.now,
  },
  cycleCount: {
    type: Number,
    default: 0,
  },
  focusTime: {
    type: Number,
    required: true,
  },
  shortBreak: {
    type: Number,
    required: true,
  },
  longBreak: {
    type: Number,
    required: true,
  },
}, { timestamps: true }); 

const Session = mongoose.model('Session', sessionSchema);
module.exports = Session;
