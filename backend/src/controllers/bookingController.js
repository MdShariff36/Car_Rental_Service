const Booking = require("../models/Booking");
const Car = require("../models/Car");
const User = require("../models/User");
const Payment = require("../models/Payment");
const { successResponse, errorResponse } = require("../utils/response");
const { sendBookingConfirmationEmail } = require("../utils/emailHelper");

const createBooking = async (req, res) => {
  try {
    const { carId, pickupDate, dropoffDate, pickupLocation } = req.body;
    const userId = req.user.id;

    if (!carId || !pickupDate || !dropoffDate) {
      return errorResponse(
        res,
        "Car ID, pickup date, and dropoff date are required",
        400,
      );
    }

    const car = await Car.findByPk(carId);
    if (!car) {
      return errorResponse(res, "Car not found", 404);
    }

    if (car.status !== "available") {
      return errorResponse(res, "Car is not available", 400);
    }

    const pickup = new Date(pickupDate);
    const dropoff = new Date(dropoffDate);
    const days = Math.ceil((dropoff - pickup) / (1000 * 60 * 60 * 24));

    if (days <= 0) {
      return errorResponse(res, "Invalid date range", 400);
    }

    const totalAmount = car.pricePerDay * days;

    const booking = await Booking.create({
      userId,
      carId,
      pickupDate,
      dropoffDate,
      pickupLocation,
      totalAmount,
      status: "pending",
    });

    await car.update({ status: "booked" });

    const bookingWithDetails = await Booking.findByPk(booking.id, {
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
    });

    return successResponse(
      res,
      bookingWithDetails,
      "Booking created successfully",
      201,
    );
  } catch (error) {
    console.error("Create booking error:", error);
    return errorResponse(res, error.message, 500);
  }
};

const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await Booking.findAll({
      where: { userId },
      include: [
        {
          model: Car,
          as: "car",
        },
        {
          model: Payment,
          as: "payment",
          attributes: ["id", "amount", "method", "status", "transactionId"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return successResponse(
      res,
      bookings,
      "User bookings retrieved successfully",
    );
  } catch (error) {
    console.error("Get user bookings error:", error);
    return errorResponse(res, error.message, 500);
  }
};

const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id, {
      include: [
        {
          model: Car,
          as: "car",
          include: [
            {
              model: User,
              as: "host",
              attributes: ["id", "name", "email", "phone"],
            },
          ],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "phone"],
        },
        {
          model: Payment,
          as: "payment",
        },
      ],
    });

    if (!booking) {
      return errorResponse(res, "Booking not found", 404);
    }

    return successResponse(res, booking, "Booking retrieved successfully");
  } catch (error) {
    console.error("Get booking by ID error:", error);
    return errorResponse(res, error.message, 500);
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const booking = await Booking.findByPk(id);

    if (!booking) {
      return errorResponse(res, "Booking not found", 404);
    }

    if (booking.userId !== userId && req.user.role !== "ADMIN") {
      return errorResponse(res, "Unauthorized to cancel this booking", 403);
    }

    if (booking.status === "cancelled") {
      return errorResponse(res, "Booking is already cancelled", 400);
    }

    if (booking.status === "completed") {
      return errorResponse(res, "Cannot cancel completed booking", 400);
    }

    await booking.update({ status: "cancelled" });

    const car = await Car.findByPk(booking.carId);
    if (car) {
      await car.update({ status: "available" });
    }

    return successResponse(res, booking, "Booking cancelled successfully");
  } catch (error) {
    console.error("Cancel booking error:", error);
    return errorResponse(res, error.message, 500);
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
};
