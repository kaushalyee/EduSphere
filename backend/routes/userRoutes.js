const express = require("express");
const router = express.Router();
const { completeOnboarding, getWallet } = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

router.put("/onboarding", protect, completeOnboarding);
router.get("/wallet", protect, getWallet);

module.exports = router;