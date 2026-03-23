const mongoose = require('mongoose');

const assignmentRequirementSchema = new mongoose.Schema({
  subjectId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  gradeRange: { type: String },
  requireReferences: { type: Boolean, default: false },
  minReference: { type: Number, default: 0 },
  mCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('AssignmentRequirement', assignmentRequirementSchema);
