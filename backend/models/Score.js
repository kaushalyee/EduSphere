const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  attemptId: { type: mongoose.Schema.Types.ObjectId, ref: 'GameAttempt', required: true, unique: true },
  levelId: { type: String, required: true },
  scoreValue: { type: Number, required: true },
  moves: { type: Number, required: true },
  timeTaken: { type: Number, required: true }
}, { timestamps: true });

// Optimize purely for leaderboard query speed (scoreValue descending)
scoreSchema.index({ scoreValue: -1, levelId: 1 });

module.exports = mongoose.model('Score', scoreSchema);
