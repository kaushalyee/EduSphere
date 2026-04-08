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
router.get("/game/status", protect, getDailyStatus);
router.post("/game/reset", protect, resetDailyAttempts);
router.post("/game/unlock", protect, unlockGame);
router.post("/game/complete", protect, completeGame);
router.post("/game/submit", submitScore);

// Leaderboard route
router.get("/leaderboard", getLeaderboard);

module.exports = router;
