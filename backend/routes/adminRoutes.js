const router = require("express").Router();
const { protect, authorize } = require("../middlewares/authMiddleware");
const { getAllUsers, getDashboardStats, getAllListingsAdmin, deleteListingAdmin, deleteUser } = require("../controllers/adminController");

router.get("/users", protect, authorize("admin"), getAllUsers);
router.delete("/users/:id", protect, authorize("admin"), deleteUser);
router.get("/stats", protect, authorize("admin"), getDashboardStats);
router.get("/marketplace", protect, authorize("admin"), getAllListingsAdmin);
router.delete("/marketplace/:id", protect, authorize("admin"), deleteListingAdmin);

module.exports = router;