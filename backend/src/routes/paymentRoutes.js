const express = require("express");
const router = express.Router();
const {
  createPayment,
  getUserPayments,
} = require("../controllers/paymentController");
const { authenticate } = require("../middleware/authMiddleware");
const { paymentLimiter } = require("../middleware/rateLimiter");

router.post("/", authenticate, paymentLimiter, createPayment);
router.get("/", authenticate, getUserPayments);

module.exports = router;
