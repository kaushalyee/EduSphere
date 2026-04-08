const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { getAttemptConfig, unlockAttempt } = require("../controllers/rewardAttemptController");

const router = express.Router();

router.get("/attempt-config", protect, getAttemptConfig);
router.post("/unlock-attempt", protect, unlockAttempt);

module.exports = router;
