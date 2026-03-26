const express = require("express");
const router = express.Router();

const {
  createSession,
  getMySessions,
  getAllSessions,
  getSessionById,
  markSessionComplete,
  cancelSession,
  getCompletedSessions,
  getCancelledSessions,
} = require("../controllers/sessionController");

const { protect, authorize } = require("../middlewares/authMiddleware");

// Create session (Tutor)
router.post("/", protect, authorize("tutor"), createSession);

// Tutor - Active sessions
router.get("/my-sessions", protect, authorize("tutor"), getMySessions);

// Tutor - Completed sessions
router.get("/completed", protect, authorize("tutor"), getCompletedSessions);

// Tutor - Cancelled sessions
router.get("/cancelled", protect, authorize("tutor"), getCancelledSessions);

// Student - View all sessions
router.get("/", protect, getAllSessions);

// Get single session
router.get("/:id", protect, getSessionById);

// Mark complete
router.put("/:sessionId/complete", protect, authorize("tutor"), markSessionComplete);

// Cancel session
router.put("/:sessionId/cancel", protect, authorize("tutor"), cancelSession);

module.exports = router;