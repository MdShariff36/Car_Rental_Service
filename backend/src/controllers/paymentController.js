const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const Car = require("../models/Car");
const User = require("../models/User");
const { successResponse, errorResponse } = require("../utils/response");
const { sendBookingConfirmationEmail } = require("../utils/emailHelper");

const createPayment = async (req, res) => {
  try {
    const { bookingId, amount, method, cardNumber } = req.body;
    const userId = req.user.id;

    if (!bookingId || !amount || !method) {
      return errorResponse(
        res,
        "Booking ID, amount, and payment method are required",
        400,
      );
    }

    const booking = await Booking.findByPk(bookingId, {
      include: [
        {
          model: Car,
          as: "car",
        },
      ],
    });

    if (!booking) {
      return errorResponse(res, "Booking not found", 404);
    }

    if (booking.userId !== userId) {
      return errorResponse(res, "Unauthorized to pay for this booking", 403);
    }

    if (booking.status === "confirmed") {
      return errorResponse(res, "Booking is already paid", 400);
    }

    let cardLast4 = null;
    if (cardNumber && cardNumber.length >= 4) {
      cardLast4 = cardNumber.slice(-4);
    }

    const payment = await Payment.create({
      userId,
      bookingId,
      amount,
      method,
      status: "completed",
      cardLast4,
    });

    await booking.update({
      status: "confirmed",
      paymentId: payment.id,
    });

    const user = await User.findByPk(userId);
    if (user && booking.car) {
      await sendBookingConfirmationEmail(user.email, {
        carName: booking.car.name,
        pickupDate: booking.pickupDate,
        dropoffDate: booking.dropoffDate,
        pickupLocation: booking.pickupLocation,
        totalAmount: amount,
      });
    }

    return successResponse(res, payment, "Payment processed successfully", 201);
  } catch (error) {
    console.error("Create payment error:", error);
    return errorResponse(res, error.message, 500);
  }
};

const getUserPayments = async (req, res) => {
  try {
    const userId = req.user.id;

    const payments = await Payment.findAll({
      where: { userId },
      include: [
        {
          model: Booking,
          as: "booking",
          include: [
            {
              model: Car,
              as: "car",
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return successResponse(
      res,
      payments,
      "User payments retrieved successfully",
    );
  } catch (error) {
    console.error("Get user payments error:", error);
    return errorResponse(res, error.message, 500);
  }
};

const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findByPk(id, {
      include: [
        {
          model: Booking,
          as: "booking",
          include: [
            {
              model: Car,
              as: "car",
            },
            {
              model: User,
              as: "user",
              attributes: ["id", "name", "email", "phone"],
            },
          ],
        },
      ],
    });

    if (!payment) {
      return errorResponse(res, "Payment not found", 404);
    }

    return successResponse(res, payment, "Payment retrieved successfully");
  } catch (error) {
    console.error("Get payment by ID error:", error);
    return errorResponse(res, error.message, 500);
  }
};

const refundPayment = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findByPk(id, {
      include: [
        {
          model: Booking,
          as: "booking",
        },
      ],
    });

    if (!payment) {
      return errorResponse(res, "Payment not found", 404);
    }

    if (payment.status === "refunded") {
      return errorResponse(res, "Payment is already refunded", 400);
    }

    if (payment.status !== "completed") {
      return errorResponse(res, "Only completed payments can be refunded", 400);
    }

    await payment.update({ status: "refunded" });

    if (payment.booking) {
      await payment.booking.update({ status: "cancelled" });

      const car = await Car.findByPk(payment.booking.carId);
      if (car) {
        await car.update({ status: "available" });
      }
    }

    return successResponse(res, payment, "Payment refunded successfully");
  } catch (error) {
    console.error("Refund payment error:", error);
    return errorResponse(res, error.message, 500);
  }
};

module.exports = {
  createPayment,
  getUserPayments,
  getPaymentById,
  refundPayment,
};
