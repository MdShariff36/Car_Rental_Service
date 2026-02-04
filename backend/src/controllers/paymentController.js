const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const { v4: uuidv4 } = require("uuid");
const {
  successResponse,
  errorResponse,
  createdResponse,
} = require("../utils/response");

// POST /api/payments - Create payment
const createPayment = async (req, res) => {
  try {
    const { bookingId, amount, method, cardLast4, cardBrand } = req.body;

    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      return errorResponse(res, "Booking not found", 404);
    }

    if (booking.userId !== req.userId) {
      return errorResponse(res, "Not authorized", 403);
    }

    const payment = await Payment.create({
      userId: req.userId,
      bookingId,
      amount,
      method,
      cardLast4,
      cardBrand,
      transactionId: uuidv4(),
      status: "COMPLETED",
    });

    booking.paymentStatus = "PAID";
    booking.status = "CONFIRMED";
    await booking.save();

    return createdResponse(res, "Payment successful", payment);
  } catch (error) {
    console.error("Payment error:", error);
    return errorResponse(res, "Payment failed", 500);
  }
};

// GET /api/payments - Get user payments
const getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      where: { userId: req.userId },
      include: [{ model: Booking, as: "booking" }],
      order: [["createdAt", "DESC"]],
    });

    return successResponse(res, "Payments fetched successfully", payments);
  } catch (error) {
    console.error("Get payments error:", error);
    return errorResponse(res, "Failed to fetch payments", 500);
  }
};

module.exports = { createPayment, getUserPayments };
