const express = require("express");
const router = express.Router();
const {
  adminLogin,
  getDashboardStats,
  getAllUsers,
  getAllCars,
  getAllBookings,
} = require("../controllers/adminController");
const { authenticate } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");
const { authLimiter } = require("../middleware/rateLimiter");

router.post("/login", authLimiter, adminLogin);
router.get("/dashboard", authenticate, adminOnly, getDashboardStats);
router.get("/users", authenticate, adminOnly, getAllUsers);
router.get("/cars", authenticate, adminOnly, getAllCars);
router.get("/bookings", authenticate, adminOnly, getAllBookings);

module.exports = router;
