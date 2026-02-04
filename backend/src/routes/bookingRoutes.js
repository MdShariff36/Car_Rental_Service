const express = require("express");
const router = express.Router();
const {
  getUserBookings,
  createBooking,
  cancelBooking,
} = require("../controllers/bookingController");
const { authenticate } = require("../middleware/authMiddleware");
const { bookingLimiter } = require("../middleware/rateLimiter");

router.get("/", authenticate, getUserBookings);
router.post("/", authenticate, bookingLimiter, createBooking);
router.put("/:id/cancel", authenticate, cancelBooking);

module.exports = router;
