const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  unlockGame,
  completeGame,
  getDailyStatus,
  resetDailyAttempts,
  submitScore,
  getLeaderboard,
} = require("../controllers/gameController");

const router = express.Router();

// Game module routes (prefixed with /game)
router.get("/status", protect, getDailyStatus);
router.post("/reset", protect, resetDailyAttempts);
router.post("/unlock", protect, unlockGame);
router.post("/complete", protect, completeGame);
router.post("/submit", protect, submitScore);

// Leaderboard route
router.get("/leaderboard", protect, getLeaderboard);

module.exports = router;
