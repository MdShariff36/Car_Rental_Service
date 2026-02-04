const express = require("express");
const router = express.Router();
const {
  getUserDashboard,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");
const { authenticate } = require("../middleware/authMiddleware");

router.get("/dashboard", authenticate, getUserDashboard);
router.get("/profile", authenticate, getUserProfile);
router.put("/profile", authenticate, updateUserProfile);

module.exports = router;
