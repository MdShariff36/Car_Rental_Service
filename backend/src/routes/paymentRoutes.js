const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const { paymentLimiter } = require("../middleware/rateLimiter");

router.post(
  "/",
  authMiddleware,
  paymentLimiter,
  paymentController.createPayment,
);
router.get("/user", authMiddleware, paymentController.getUserPayments);
router.get("/:id", authMiddleware, paymentController.getPaymentById);
router.post(
  "/:id/refund",
  authMiddleware,
  roleMiddleware("ADMIN"),
  paymentController.refundPayment,
);

module.exports = router;
