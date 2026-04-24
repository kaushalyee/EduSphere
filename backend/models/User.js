const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ["student", "tutor", "admin"],
      required: true,
    },

    studentID: {
      type: String,
      trim: true,
      default: null,
      validate: {
        validator: function (v) {
          if (this.role !== "student") return true;
          return v && v.trim().length > 0;
        },
        message: "Student ID is required for students",
      },
    },

    year: {
      type: Number,
      default: null,
    },

    semester: {
      type: Number,
      default: null,
    },

    weakCategories: {
      type: [String],
      default: [],
    },

    // ── Updated: weighted weak topics 
    // Each entry: { topic: "OOP", weight: 0.85 }
    // weight = 1 - (percentage / 100) — lower score = higher weight
    // Old format [String] is supported in recommendationEngine via normalizeWeakTopics
    weakTopics: {
      type: [
        {
          topic: { type: String, required: true, trim: true },
          weight: { type: Number, required: true, min: 0, max: 1 },
        },
      ],
      default: [],
    },

    lastQuizScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    attemptsUsedToday: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastAttemptDate: {
      type: Date,
      default: null,
    },
    totalGP: {
      type: Number,
      default: 0,
    },
    lastGPReset: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);