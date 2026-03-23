const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  session_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true, index: true },
  marks: { type: Number, required: true, min: 0 },
  percentage: { type: Number, required: true, min: 0, max: 100 },
  totalMarks: { type: Number, required: true, min: 0 }
}, { timestamps: true });

module.exports = mongoose.model('QuizResult', quizResultSchema);
