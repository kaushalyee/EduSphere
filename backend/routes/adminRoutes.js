const router = require("express").Router();
const { protect, authorize } = require("../middlewares/authMiddleware");
const { getAllUsers } = require("../controllers/adminController");

router.get("/users", protect, authorize("admin"), getAllUsers);

module.exports = router;