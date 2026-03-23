const mongoose = require('mongoose');

const rewardTransactionSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  sourceType: { type: String, enum: ['session', 'quiz', 'improvement'], required: true },
  sourceId: { type: mongoose.Schema.Types.Mixed }, // Can reference different collections
  pointsEarned: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('RewardTransaction', rewardTransactionSchema);
