const express = require("express");
const router = express.Router();
const { getTop3Leaderboard, resetLeaderboard } = require("../controllers/leaderboardController");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.get("/top3", protect, getTop3Leaderboard);
router.post("/reset", protect, authorize("admin"), resetLeaderboard);

module.exports = router;
