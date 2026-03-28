const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  getMyWalletBalance,
  convertQuizToRP,
} = require("../controllers/engagementRewardController");

const router = express.Router();

router.get("/wallet/me", protect, getMyWalletBalance);
router.post("/quiz-rp/:quizResultId", protect, convertQuizToRP);

module.exports = router;
