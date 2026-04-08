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

    weakTopics: {
      type: [String],
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);