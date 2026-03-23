const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  topic: { type: String, required: true },
  mode: { type: String, enum: ['online', 'in-person'], required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  capacity: { type: Number, required: true, min: 1 },
  category: { type: String, required: true },
  quizLink: { type: String },
  meetingLink: { type: String },
  description: { type: String },
  registerCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
