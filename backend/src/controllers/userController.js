const User = require("../models/User");
const Booking = require("../models/Booking");
const Car = require("../models/Car");
const Payment = require("../models/Payment");
const { successResponse, errorResponse } = require("../utils/response");
const bcrypt = require("bcryptjs");

const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await Booking.findAll({
      where: { userId },
      include: [
        {
          model: Car,
          as: "car",
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: 5,
    });

    const totalBookings = await Booking.count({ where: { userId } });

    const payments = await Payment.findAll({
      where: { userId, status: "completed" },
    });

    const totalSpent = payments.reduce(
      (sum, payment) => sum + payment.amount,
      0,
    );

    return successResponse(
      res,
      {
        recentBookings: bookings,
        totalBookings,
        totalSpent: totalSpent.toFixed(2),
      },
      "Dashboard data retrieved successfully",
    );
  } catch (error) {
    console.error("Get user dashboard error:", error);
    return errorResponse(res, error.message, 500);
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password", "resetToken", "resetTokenExpiry"] },
    });

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    return successResponse(res, user, "Profile retrieved successfully");
  } catch (error) {
    console.error("Get user profile error:", error);
    return errorResponse(res, error.message, 500);
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, avatar } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (avatar !== undefined) updateData.avatar = avatar;

    await user.update(updateData);

    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ["password", "resetToken", "resetTokenExpiry"] },
    });

    return successResponse(res, updatedUser, "Profile updated successfully");
  } catch (error) {
    console.error("Update user profile error:", error);
    return errorResponse(res, error.message, 500);
  }
};

const updateUserPassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return errorResponse(
        res,
        "Old password and new password are required",
        400,
      );
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    const isPasswordValid = await user.comparePassword(oldPassword);
    if (!isPasswordValid) {
      return errorResponse(res, "Current password is incorrect", 401);
    }

    await user.update({ password: newPassword });

    return successResponse(res, null, "Password updated successfully");
  } catch (error) {
    console.error("Update user password error:", error);
    return errorResponse(res, error.message, 500);
  }
};

module.exports = {
  getUserDashboard,
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
};
