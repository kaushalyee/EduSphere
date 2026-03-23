const express = require("express");
const router = express.Router();

const {
  createSession,
  getMySessions,
} = require("../controllers/sessionController");

const { protect, authorize } = require("../middlewares/authMiddleware");

router.post("/", protect, authorize("tutor"), createSession);
router.get("/my-sessions", protect, authorize("tutor"), getMySessions);

module.exports = router;