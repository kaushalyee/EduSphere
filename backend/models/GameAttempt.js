const mongoose = require('mongoose');

const gameAttemptSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  transaction_id: { type: mongoose.Schema.Types.ObjectId, ref: 'RewardTransaction', required: true },
  status: { type: String, enum: ['used', 'unused'], default: 'unused' },
  unlockedAt: { type: Date, default: Date.now },
  usedAt: { type: Date }
}, { timestamps: false });

module.exports = mongoose.model('GameAttempt', gameAttemptSchema);
