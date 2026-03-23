const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  balance: { type: Number, default: 0, min: 0 }
}, { timestamps: { createdAt: false, updatedAt: 'last_updated' } });

module.exports = mongoose.model('Wallet', walletSchema);
