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
        "Programming",
        "Mathematics",
        "Networking",
        "DSA",
        "DBMS",
        "OOP",
        "Web Development",
        "Cyber Basics",
      ],
      trim: true,
    },

    topic: {
      type: String,
      required: true,
      trim: true,
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
      min: 1,
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", sessionSchema);
