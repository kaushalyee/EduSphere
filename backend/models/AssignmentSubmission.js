const mongoose = require('mongoose');

const assignmentSubmissionSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  requirementId: { type: mongoose.Schema.Types.ObjectId, ref: 'AssignmentRequirement', required: true, index: true },
  subjectId: { type: String, required: true },
  filePath: { type: String, required: true },
  wordCount: { type: Number, default: 0 },
  referenceCount: { type: Number, default: 0 },
  uploadedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('AssignmentSubmission', assignmentSubmissionSchema);
