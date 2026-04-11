const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { getAttemptConfig, unlockAttempt } = require("../controllers/rewardAttemptController");
const { getTodayGP } = require("../controllers/rewardController");

const router = express.Router();

router.get("/attempt-config", protect, getAttemptConfig);
router.post("/unlock-attempt", protect, unlockAttempt);
router.get("/today", protect, getTodayGP);

module.exports = router;
