const mongoose = require("mongoose");

const kuppiRecoSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recommendedTopic: {
      type: String,
      required: true,
      trim: true,
    },
    suggestedTutors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // If recommendation resulted in a session booking
    resultingSessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      default: null,
    },
    reasoning: {
      type: String,
      trim: true,
      default: "", // e.g., "Based on low quiz scores in DSA"
    },
    status: {
      type: String,
      enum: ["new", "viewed", "actioned", "dismissed"],
      default: "new",
    },
  },
  { timestamps: true }
);

kuppiRecoSchema.index({ studentId: 1 });
kuppiRecoSchema.index({ status: 1 });

module.exports = mongoose.model("KuppiReco", kuppiRecoSchema);
