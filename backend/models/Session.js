const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    tutorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
  "Programming Languages",
    "Data Structures & Algorithms",
    "Mathematics",
    "Operating Systems",
    "Database Management",
    "Computer Networks",
    "Software Engineering",
    "Object-Oriented Programming",
    "Web Development",
    "System Design",
    "Cybersecurity",
    "DevOps & Cloud",
    "AI & Machine Learning",
    "Theory of Computation",
      ],
      trim: true,
    },

    topic: {
      type: String,
      required: true,
      trim: true,
    },
    targetYear: {
      type: Number,
      default: null,
    },

    targetSemester: {
      type: Number,
      default: null,
    },

    date: {
      type: Date,
      required: true,
    },

    time: {
      type: String,
      required: true,
      trim: true,
    },

    duration: {
      type: Number,
      default: 60,
      min: 30,
    },

    mode: {
      type: String,
      enum: ["online", "offline"],
      required: true,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    meetingLink: {
      type: String,
      default: "",
      trim: true,
    },

    quizLink: {
      type: String,
      default: "",
      trim: true,
    },

    capacity: {
      type: Number,
      default: null,
      min: 1,
    },

    registeredCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["upcoming", "completed", "cancelled"],
      default: "upcoming",
    },

    completedAt: {
      type: Date,
      default: null,
    },
        isArchived: {
      type: Boolean,
      default: false,
    },
 
    archivedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", sessionSchema);