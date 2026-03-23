const mongoose = require("mongoose");

const assignmentRequirementSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    tutorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    maxScore: {
      type: Number,
      default: 100,
      min: 1,
    },
    attachmentUrl: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

assignmentRequirementSchema.index({ sessionId: 1 });
assignmentRequirementSchema.index({ tutorId: 1 });

module.exports = mongoose.model("AssignmentRequirement", assignmentRequirementSchema);
