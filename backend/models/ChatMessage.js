const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  conv_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatConversation', required: true, index: true },
  role: { type: String, enum: ['user', 'system', 'assistant'], required: true },
  content: { type: String, required: true },
  issue_type: { type: String },
  modelUsed: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
