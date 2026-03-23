const mongoose = require('mongoose');

const kuppiRecoSchema = new mongoose.Schema({
  msg_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatMessage', required: true },
  conv_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatConversation', required: true, index: true },
  session_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  subject_area: { type: String, required: true },
  status: { type: String, enum: ['pending', 'recommended', 'accepted', 'rejected'], default: 'pending' }
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

module.exports = mongoose.model('KuppiReco', kuppiRecoSchema);
