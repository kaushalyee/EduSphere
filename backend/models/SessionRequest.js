const mongoose = require("mongoose");

const sessionRequestSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requestedTutorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // Null means open to any tutor
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    urgency: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed", "cancelled"],
      default: "pending",
    },
    acceptedSessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      default: null,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

sessionRequestSchema.index({ studentId: 1 });
sessionRequestSchema.index({ requestedTutorId: 1 });
sessionRequestSchema.index({ status: 1 });

module.exports = mongoose.model("SessionRequest", sessionRequestSchema);
