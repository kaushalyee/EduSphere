const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const quizResultRoutes = require("./routes/quizResultRoutes");
const userRoutes = require("./routes/userRoutes");
const marketplaceRoutes = require("./routes/marketplaceRoutes");
const engagementRewardRoutes = require("./routes/engagementRewardRoutes");
const progressRoutes = require("./routes/progressRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const comparisonRoutes = require("./routes/comparisonRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const gameRoutes = require("./routes/gameRoutes");
const rewardRoutes = require("./routes/rewardRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "EduSphere API is running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/quiz-results", quizResultRoutes);
app.use("/api/users", userRoutes);
app.use("/api/marketplace", marketplaceRoutes);
app.use("/api/constants", require("./routes/constantsRoutes"));
app.use("/api/session-requests", require("./routes/sessionRequestRoutes"));
app.use("/api/engagement-reward", engagementRewardRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/comparison", comparisonRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/rewards", rewardRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/activity", require("./routes/activityRoutes"));
app.use("/api/companions", require("./routes/companionRoutes"));
app.use("/api/leaderboard", require("./routes/leaderboardRoutes"));
// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  
  // Handle Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File size too large. Maximum limit is 20MB.'
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : {}
  });
});

module.exports = app;