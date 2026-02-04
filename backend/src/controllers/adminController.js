const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Car = require("../models/Car");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const { successResponse, errorResponse } = require("../utils/response");
const { generateToken } = require("../utils/tokenHelper");

// POST /api/admin/login - Admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email, role: "ADMIN" } });
    if (!user) {
      return errorResponse(res, "Invalid credentials", 401);
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return errorResponse(res, "Invalid credentials", 401);
    }

    const token = generateToken(user);

    return successResponse(res, "Login successful", {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return errorResponse(res, "Login failed", 500);
  }
};

// GET /api/admin/dashboard - Get dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalCars = await Car.count();
    const totalBookings = await Booking.count();
    const totalRevenue = await Payment.sum("amount", {
      where: { status: "COMPLETED" },
    });

    return successResponse(res, "Stats fetched", {
      totalUsers,
      totalCars,
      totalBookings,
      totalRevenue: totalRevenue || 0,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return errorResponse(res, "Failed to fetch stats", 500);
  }
};

// GET /api/admin/users - Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    });

    return successResponse(res, "Users fetched successfully", users);
  } catch (error) {
    console.error("Get users error:", error);
    return errorResponse(res, "Failed to fetch users", 500);
  }
};

// GET /api/admin/cars - Get all cars
const getAllCars = async (req, res) => {
  try {
    const cars = await Car.findAll({
      include: [{ model: User, as: "host", attributes: ["name", "email"] }],
      order: [["createdAt", "DESC"]],
    });

    return successResponse(res, "Cars fetched successfully", cars);
  } catch (error) {
    console.error("Get cars error:", error);
    return errorResponse(res, "Failed to fetch cars", 500);
  }
};

// GET /api/admin/bookings - Get all bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        { model: User, as: "user", attributes: ["name", "email"] },
        { model: Car, as: "car", attributes: ["name", "brand", "model"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    return successResponse(res, "Bookings fetched successfully", bookings);
  } catch (error) {
    console.error("Get bookings error:", error);
    return errorResponse(res, "Failed to fetch bookings", 500);
  }
};

module.exports = {
  adminLogin,
  getDashboardStats,
  getAllUsers,
  getAllCars,
  getAllBookings,
};
