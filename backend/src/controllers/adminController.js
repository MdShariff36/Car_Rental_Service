const User = require("../models/User");
const Car = require("../models/Car");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const { successResponse, errorResponse } = require("../utils/response");
const { generateToken } = require("../utils/tokenHelper");
const { sequelize } = require("../config/db");
const { Op } = require("sequelize");

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, "Email and password are required", 400);
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return errorResponse(res, "Invalid email or password", 401);
    }

    if (user.role !== "ADMIN") {
      return errorResponse(
        res,
        "Access denied. Admin privileges required",
        403,
      );
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return errorResponse(res, "Invalid email or password", 401);
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return successResponse(
      res,
      {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      "Admin login successful",
    );
  } catch (error) {
    console.error("Admin login error:", error);
    return errorResponse(res, error.message, 500);
  }
};

const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalCars = await Car.count();
    const activeBookings = await Booking.count({
      where: { status: ["confirmed", "ongoing"] },
    });

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);

    const monthlyRevenue = await Payment.sum("amount", {
      where: {
        status: "completed",
        createdAt: { [Op.gte]: firstDayOfMonth },
      },
    });

    const recentBookings = await Booking.findAll({
      limit: 10,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"],
        },
        {
          model: Car,
          as: "car",
          attributes: ["id", "name", "brand", "model"],
        },
      ],
    });

    const recentUsers = await User.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
      attributes: ["id", "name", "email", "role", "createdAt"],
    });

    const recentActivity = [
      ...recentBookings.map((b) => ({
        type: "booking",
        id: b.id,
        user: b.user?.name,
        car: b.car?.name,
        status: b.status,
        date: b.createdAt,
      })),
      ...recentUsers.map((u) => ({
        type: "registration",
        id: u.id,
        user: u.name,
        email: u.email,
        role: u.role,
        date: u.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    return successResponse(
      res,
      {
        totalUsers,
        totalCars,
        activeBookings,
        monthlyRevenue: monthlyRevenue || 0,
        recentActivity,
      },
      "Admin dashboard data retrieved successfully",
    );
  } catch (error) {
    console.error("Get admin dashboard error:", error);
    return errorResponse(res, error.message, 500);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: users } = await User.findAndCountAll({
      attributes: { exclude: ["password", "resetToken", "resetTokenExpiry"] },
      limit: parseInt(limit),
      offset,
      order: [["createdAt", "DESC"]],
    });

    return successResponse(
      res,
      {
        users,
        totalPages: Math.ceil(count / parseInt(limit)),
        currentPage: parseInt(page),
        totalUsers: count,
      },
      "Users retrieved successfully",
    );
  } catch (error) {
    console.error("Get all users error:", error);
    return errorResponse(res, error.message, 500);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (parseInt(id) === req.user.id) {
      return errorResponse(res, "Cannot delete your own account", 400);
    }

    const user = await User.findByPk(id);
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    await user.destroy();

    return successResponse(res, null, "User deleted successfully");
  } catch (error) {
    console.error("Delete user error:", error);
    return errorResponse(res, error.message, 500);
  }
};

const getAllCarsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: cars } = await Car.findAndCountAll({
      include: [
        {
          model: User,
          as: "host",
          attributes: ["id", "name", "email"],
        },
      ],
      limit: parseInt(limit),
      offset,
      order: [["createdAt", "DESC"]],
    });

    return successResponse(
      res,
      {
        cars,
        totalPages: Math.ceil(count / parseInt(limit)),
        currentPage: parseInt(page),
        totalCars: count,
      },
      "Cars retrieved successfully",
    );
  } catch (error) {
    console.error("Get all cars admin error:", error);
    return errorResponse(res, error.message, 500);
  }
};

const createCarAdmin = async (req, res) => {
  try {
    const {
      name,
      brand,
      model,
      category,
      year,
      seats,
      transmission,
      fuelType,
      luggage,
      pricePerDay,
      description,
      features,
      imageUrl,
      images,
      hostId,
    } = req.body;

    if (!name || !pricePerDay) {
      return errorResponse(res, "Name and price per day are required", 400);
    }

    const car = await Car.create({
      name,
      brand,
      model,
      category,
      year,
      seats,
      transmission,
      fuelType,
      luggage,
      pricePerDay,
      description,
      features,
      imageUrl,
      images,
      hostId,
      status: "available",
    });

    return successResponse(res, car, "Car created successfully", 201);
  } catch (error) {
    console.error("Create car admin error:", error);
    return errorResponse(res, error.message, 500);
  }
};

const updateCarAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const car = await Car.findByPk(id);
    if (!car) {
      return errorResponse(res, "Car not found", 404);
    }

    const {
      name,
      brand,
      model,
      category,
      year,
      seats,
      transmission,
      fuelType,
      luggage,
      pricePerDay,
      description,
      features,
      imageUrl,
      images,
      status,
      hostId,
    } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (brand !== undefined) updateData.brand = brand;
    if (model !== undefined) updateData.model = model;
    if (category !== undefined) updateData.category = category;
    if (year !== undefined) updateData.year = year;
    if (seats !== undefined) updateData.seats = seats;
    if (transmission !== undefined) updateData.transmission = transmission;
    if (fuelType !== undefined) updateData.fuelType = fuelType;
    if (luggage !== undefined) updateData.luggage = luggage;
    if (pricePerDay !== undefined) updateData.pricePerDay = pricePerDay;
    if (description !== undefined) updateData.description = description;
    if (features !== undefined) updateData.features = features;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (images !== undefined) updateData.images = images;
    if (status !== undefined) updateData.status = status;
    if (hostId !== undefined) updateData.hostId = hostId;

    await car.update(updateData);

    return successResponse(res, car, "Car updated successfully");
  } catch (error) {
    console.error("Update car admin error:", error);
    return errorResponse(res, error.message, 500);
  }
};

const deleteCarAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const car = await Car.findByPk(id);
    if (!car) {
      return errorResponse(res, "Car not found", 404);
    }

    await car.destroy();

    return successResponse(res, null, "Car deleted successfully");
  } catch (error) {
    console.error("Delete car admin error:", error);
    return errorResponse(res, error.message, 500);
  }
};

const getAllBookingsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 12, status } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (status) {
      where.status = status;
    }

    const { count, rows: bookings } = await Booking.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "phone"],
        },
        {
          model: Car,
          as: "car",
        },
        {
          model: Payment,
          as: "payment",
        },
      ],
      limit: parseInt(limit),
      offset,
      order: [["createdAt", "DESC"]],
    });

    return successResponse(
      res,
      {
        bookings,
        totalPages: Math.ceil(count / parseInt(limit)),
        currentPage: parseInt(page),
        totalBookings: count,
      },
      "Bookings retrieved successfully",
    );
  } catch (error) {
    console.error("Get all bookings admin error:", error);
    return errorResponse(res, error.message, 500);
  }
};

const updateBookingAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return errorResponse(res, "Status is required", 400);
    }

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return errorResponse(res, "Booking not found", 404);
    }

    await booking.update({ status });

    if (status === "cancelled") {
      const car = await Car.findByPk(booking.carId);
      if (car) {
        await car.update({ status: "available" });
      }
    }

    return successResponse(res, booking, "Booking updated successfully");
  } catch (error) {
    console.error("Update booking admin error:", error);
    return errorResponse(res, error.message, 500);
  }
};

const getAdminReports = async (req, res) => {
  try {
    const revenueByMonth = await Payment.findAll({
      attributes: [
        [
          sequelize.fn("DATE_TRUNC", "month", sequelize.col("createdAt")),
          "month",
        ],
        [sequelize.fn("SUM", sequelize.col("amount")), "revenue"],
      ],
      where: {
        status: "completed",
        createdAt: {
          [Op.gte]: new Date(new Date().getFullYear(), 0, 1),
        },
      },
      group: [sequelize.fn("DATE_TRUNC", "month", sequelize.col("createdAt"))],
      order: [
        [
          sequelize.fn("DATE_TRUNC", "month", sequelize.col("createdAt")),
          "ASC",
        ],
      ],
      raw: true,
    });

    const bookingsByMonth = await Booking.findAll({
      attributes: [
        [
          sequelize.fn("DATE_TRUNC", "month", sequelize.col("createdAt")),
          "month",
        ],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date().getFullYear(), 0, 1),
        },
      },
      group: [sequelize.fn("DATE_TRUNC", "month", sequelize.col("createdAt"))],
      order: [
        [
          sequelize.fn("DATE_TRUNC", "month", sequelize.col("createdAt")),
          "ASC",
        ],
      ],
      raw: true,
    });

    const topCars = await Booking.findAll({
      attributes: [
        "carId",
        [sequelize.fn("COUNT", sequelize.col("Booking.id")), "bookingCount"],
      ],
      include: [
        {
          model: Car,
          as: "car",
          attributes: ["id", "name", "brand", "model", "imageUrl"],
        },
      ],
      group: ["carId", "car.id"],
      order: [[sequelize.fn("COUNT", sequelize.col("Booking.id")), "DESC"]],
      limit: 10,
    });

    return successResponse(
      res,
      {
        revenueByMonth,
        bookingsByMonth,
        topCars,
      },
      "Reports retrieved successfully",
    );
  } catch (error) {
    console.error("Get admin reports error:", error);
    return errorResponse(res, error.message, 500);
  }
};

const getAdminSettings = async (req, res) => {
  try {
    const settings = {
      commissionRate: 0.15,
      platformName: "Auto Prime",
      supportEmail: "support@autoprime.com",
      supportPhone: "+1-234-567-8900",
    };

    return successResponse(res, settings, "Settings retrieved successfully");
  } catch (error) {
    console.error("Get admin settings error:", error);
    return errorResponse(res, error.message, 500);
  }
};

const updateAdminSettings = async (req, res) => {
  try {
    const { commissionRate, platformName, supportEmail, supportPhone } =
      req.body;

    const settings = {
      commissionRate: commissionRate !== undefined ? commissionRate : 0.15,
      platformName: platformName || "Auto Prime",
      supportEmail: supportEmail || "support@autoprime.com",
      supportPhone: supportPhone || "+1-234-567-8900",
    };

    return successResponse(res, settings, "Settings updated successfully");
  } catch (error) {
    console.error("Update admin settings error:", error);
    return errorResponse(res, error.message, 500);
  }
};

module.exports = {
  adminLogin,
  getAdminDashboard,
  getAllUsers,
  deleteUser,
  getAllCarsAdmin,
  createCarAdmin,
  updateCarAdmin,
  deleteCarAdmin,
  getAllBookingsAdmin,
  updateBookingAdmin,
  getAdminReports,
  getAdminSettings,
  updateAdminSettings,
};
