const User = require("../models/User");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const { successResponse, errorResponse } = require("../utils/response");
const bcrypt = require("bcryptjs");

// GET /api/user/dashboard - Get user dashboard
const getUserDashboard = async (req, res) => {
  try {
    const bookings = await Booking.count({ where: { userId: req.userId } });
    const activeBookings = await Booking.count({
      where: { userId: req.userId, status: "CONFIRMED" },
    });
    const totalSpent = await Payment.sum("amount", {
      where: { userId: req.userId, status: "COMPLETED" },
    });

    return successResponse(res, "Dashboard data fetched", {
      totalBookings: bookings,
      activeBookings,
      totalSpent: totalSpent || 0,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return errorResponse(res, "Failed to fetch dashboard", 500);
  }
};

// GET /api/user/profile - Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ["password"] },
    });

    return successResponse(res, "Profile fetched successfully", user);
  } catch (error) {
    console.error("Get profile error:", error);
    return errorResponse(res, "Failed to fetch profile", 500);
  }
};

// PUT /api/user/profile - Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    const { name, phone, avatar, currentPassword, newPassword } = req.body;

    if (newPassword) {
      if (!currentPassword) {
        return errorResponse(res, "Current password required", 400);
      }

      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return errorResponse(res, "Current password is incorrect", 400);
      }

      user.password = await bcrypt.hash(newPassword, 10);
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (avatar) user.avatar = avatar;

    await user.save();

    return successResponse(res, "Profile updated successfully", {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return errorResponse(res, "Failed to update profile", 500);
  }
};

module.exports = { getUserDashboard, getUserProfile, updateUserProfile };
