const Car = require("../models/Car");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const { successResponse, errorResponse } = require("../utils/response");

// GET /api/host/dashboard - Get host dashboard
const getHostDashboard = async (req, res) => {
  try {
    const totalCars = await Car.count({ where: { hostId: req.userId } });
    const activeCars = await Car.count({
      where: { hostId: req.userId, status: "AVAILABLE" },
    });

    const cars = await Car.findAll({
      where: { hostId: req.userId },
      attributes: ["id"],
    });
    const carIds = cars.map((c) => c.id);

    const totalBookings = await Booking.count({ where: { carId: carIds } });
    const totalEarnings = await Payment.sum("amount", {
      where: { status: "COMPLETED" },
      include: [{ model: Booking, where: { carId: carIds } }],
    });

    return successResponse(res, "Dashboard data fetched", {
      totalCars,
      activeCars,
      totalBookings,
      totalEarnings: totalEarnings || 0,
    });
  } catch (error) {
    console.error("Host dashboard error:", error);
    return errorResponse(res, "Failed to fetch dashboard", 500);
  }
};

// GET /api/host/cars - Get host cars
const getHostCars = async (req, res) => {
  try {
    const cars = await Car.findAll({
      where: { hostId: req.userId },
      order: [["createdAt", "DESC"]],
    });

    return successResponse(res, "Cars fetched successfully", cars);
  } catch (error) {
    console.error("Get host cars error:", error);
    return errorResponse(res, "Failed to fetch cars", 500);
  }
};

// GET /api/host/earnings - Get earnings data
const getHostEarnings = async (req, res) => {
  try {
    const cars = await Car.findAll({
      where: { hostId: req.userId },
      attributes: ["id"],
    });
    const carIds = cars.map((c) => c.id);

    const earnings = await Payment.findAll({
      where: { status: "COMPLETED" },
      include: [
        {
          model: Booking,
          where: { carId: carIds },
          include: [{ model: Car, as: "car", attributes: ["name"] }],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return successResponse(res, "Earnings fetched successfully", earnings);
  } catch (error) {
    console.error("Get earnings error:", error);
    return errorResponse(res, "Failed to fetch earnings", 500);
  }
};

module.exports = { getHostDashboard, getHostCars, getHostEarnings };
