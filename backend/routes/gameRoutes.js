const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  getDailyStatus,
  resetDailyAttempts,
  submitScore,
  getLeaderboard,
  getWeeklyAttempts,
} = require("../controllers/gameController");

const router = express.Router();

// Game module routes (prefixed with /game)
router.get("/status", protect, getDailyStatus);
router.post("/reset", protect, resetDailyAttempts);
router.post("/submit", protect, submitScore);

// Leaderboard route
router.get("/leaderboard", protect, getLeaderboard);
router.get("/weekly-attempts", protect, getWeeklyAttempts);

module.exports = router;
