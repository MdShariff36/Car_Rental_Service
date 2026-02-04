const Booking = require("../models/Booking");
const Car = require("../models/Car");
const {
  successResponse,
  errorResponse,
  createdResponse,
} = require("../utils/response");
const { sendBookingConfirmation } = require("../utils/emailHelper");

// GET /api/bookings - Get user bookings
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { userId: req.userId },
      include: [
        {
          model: Car,
          as: "car",
          attributes: ["id", "name", "brand", "model", "imageUrl"],
        },
        { model: require("../models/Payment"), as: "payment" },
      ],
      order: [["createdAt", "DESC"]],
    });

    return successResponse(res, "Bookings fetched successfully", bookings);
  } catch (error) {
    console.error("Get bookings error:", error);
    return errorResponse(res, "Failed to fetch bookings", 500);
  }
};

// POST /api/bookings - Create booking
const createBooking = async (req, res) => {
  try {
    const { carId, pickupDate, dropoffDate, pickupLocation } = req.body;

    const car = await Car.findByPk(carId);
    if (!car) {
      return errorResponse(res, "Car not found", 404);
    }

    if (car.status !== "AVAILABLE") {
      return errorResponse(res, "Car is not available", 400);
    }

    const days = Math.ceil(
      (new Date(dropoffDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24),
    );
    const totalAmount = days * parseFloat(car.pricePerDay);

    const booking = await Booking.create({
      userId: req.userId,
      carId,
      pickupDate,
      dropoffDate,
      pickupLocation,
      totalDays: days,
      totalAmount,
    });

    await sendBookingConfirmation(req.user, booking, car);

    return createdResponse(res, "Booking created successfully", booking);
  } catch (error) {
    console.error("Create booking error:", error);
    return errorResponse(res, "Failed to create booking", 500);
  }
};

// PUT /api/bookings/:id/cancel - Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);

    if (!booking) {
      return errorResponse(res, "Booking not found", 404);
    }

    if (booking.userId !== req.userId && req.userRole !== "ADMIN") {
      return errorResponse(res, "Not authorized", 403);
    }

    booking.status = "CANCELLED";
    await booking.save();

    return successResponse(res, "Booking cancelled successfully", booking);
  } catch (error) {
    console.error("Cancel booking error:", error);
    return errorResponse(res, "Failed to cancel booking", 500);
  }
};

module.exports = { getUserBookings, createBooking, cancelBooking };
