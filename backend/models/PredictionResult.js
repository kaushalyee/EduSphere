const mongoose = require('mongoose');

const predictionResultSchema = new mongoose.Schema({
  submissionId: { type: mongoose.Schema.Types.ObjectId, ref: 'AssignmentSubmission', required: true, unique: true },
  predictScore: { type: Number, required: true },
  feedback: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('PredictionResult', predictionResultSchema);
