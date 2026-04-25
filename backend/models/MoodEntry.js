const mongoose = require('mongoose');

const moodEntrySchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mood: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  note: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

moodEntrySchema.index({ studentId: 1, date: -1 });

module.exports = mongoose.model('MoodEntry', moodEntrySchema);
