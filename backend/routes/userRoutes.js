const express = require("express");
const router = express.Router();
const { completeOnboarding, getWallet, getMe, updateProfile } = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

router.put("/onboarding", protect, completeOnboarding);
router.get("/wallet", protect, getWallet);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile); // ← new

module.exports = router;