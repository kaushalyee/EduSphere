const express = require("express");
const router = express.Router();
const companionController = require("../controllers/companionController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/", protect, companionController.getCompanions);
router.post("/buy", protect, companionController.buyCompanion);
router.put("/equip", protect, companionController.equipCompanion);

module.exports = router;
