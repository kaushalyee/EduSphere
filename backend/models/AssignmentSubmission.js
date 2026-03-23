const mongoose = require("mongoose");

const assignmentSubmissionSchema = new mongoose.Schema(
  {
    requirementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssignmentRequirement",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["submitted", "graded", "late"],
      default: "submitted",
    },
    grade: {
      type: Number,
      default: null,
      min: 0,
    },
    tutorFeedback: {
      type: String,
      trim: true,
      default: "",
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

assignmentSubmissionSchema.index({ requirementId: 1 });
assignmentSubmissionSchema.index({ studentId: 1 });

module.exports = mongoose.model("AssignmentSubmission", assignmentSubmissionSchema);
