const mongoose = require('mongoose');

const sessionRequestSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  category: { type: String, required: true },
  topic: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  message: { type: String },
  preferredDate: { type: Date },
  preferredTime: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('SessionRequest', sessionRequestSchema);
