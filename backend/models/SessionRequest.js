const mongoose = require("mongoose");

const sessionRequestSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    topic: {
      type: String,
      required: true,
      trim: true,
    },

    preferredMode: {
      type: String,
      enum: ["online", "offline", "any"],
      default: "any",
    },

    preferredTime: {
      type: String,
      required: true,
      enum: [
        "Weekday Morning",
        "Weekday Afternoon",
        "Weekday Evening",
        "Weekend Morning",
        "Weekend Afternoon",
        "Weekend Evening",
      ],
    },

    preferredDate: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "fulfilled"],
      default: "pending",
    },

    matchedSessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SessionRequest", sessionRequestSchema);