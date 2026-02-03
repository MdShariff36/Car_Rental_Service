const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, bookingController.createBooking);
router.get("/user", authMiddleware, bookingController.getUserBookings);
router.get("/:id", authMiddleware, bookingController.getBookingById);
router.put("/:id/cancel", authMiddleware, bookingController.cancelBooking);

module.exports = router;
