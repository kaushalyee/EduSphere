const router = require("express").Router();
const { protect, authorize } = require("../middlewares/authMiddleware");
const {
  getAllUsers,
  getDashboardStats,
  getAllListingsAdmin,
  deleteListingAdmin,
  deleteUser,
  getPendingVerifications,
  getAllVerifications,
  approveStudent,
  rejectStudent,
  requestResubmission,
} = require("../controllers/adminController");

router.get("/users", protect, authorize("admin"), getAllUsers);
router.delete("/users/:id", protect, authorize("admin"), deleteUser);
router.get("/stats", protect, authorize("admin"), getDashboardStats);
router.get("/marketplace", protect, authorize("admin"), getAllListingsAdmin);
router.delete("/marketplace/:id", protect, authorize("admin"), deleteListingAdmin);

// Verification routes
router.get("/verifications/pending", protect, authorize("admin"), getPendingVerifications);
router.get("/verifications/all", protect, authorize("admin"), getAllVerifications);
router.put("/verifications/:id/approve", protect, authorize("admin"), approveStudent);
router.put("/verifications/:id/reject", protect, authorize("admin"), rejectStudent);
router.put("/verifications/:id/resubmit", protect, authorize("admin"), requestResubmission);

module.exports = router;