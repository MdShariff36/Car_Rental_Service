const User = require("../models/User");
const { successResponse, errorResponse } = require("../utils/response");
const { generateToken } = require("../utils/tokenHelper");
const {
  sendPasswordResetEmail,
  sendWelcomeEmail,
} = require("../utils/emailHelper");
const crypto = require("crypto");

const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return errorResponse(res, "Name, email, and password are required", 400);
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return errorResponse(res, "Email already registered", 409);
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    await sendWelcomeEmail(email, name);

    return successResponse(
      res,
      {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          avatar: user.avatar,
        },
      },
      "User registered successfully",
      201,
    );
  } catch (error) {
    console.error("Register error:", error);
    return errorResponse(res, error.message, 500);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, "Email and password are required", 400);
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return errorResponse(res, "Invalid email or password", 401);
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
          phone: user.phone,
          role: user.role,
          avatar: user.avatar,
        },
      },
      "Login successful",
    );
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse(res, error.message, 500);
  }
};

const verify = async (req, res) => {
  try {
    const user = req.user;

    return successResponse(
      res,
      {
        valid: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          avatar: user.avatar,
        },
      },
      "Token is valid",
    );
  } catch (error) {
    console.error("Verify error:", error);
    return errorResponse(res, error.message, 500);
  }
};

const logout = async (req, res) => {
  try {
    return successResponse(res, null, "Logged out successfully");
  } catch (error) {
    console.error("Logout error:", error);
    return errorResponse(res, error.message, 500);
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return errorResponse(res, "Email is required", 400);
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return successResponse(
        res,
        null,
        "If the email exists, a reset link has been sent",
      );
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000);

    await user.update({
      resetToken,
      resetTokenExpiry,
    });

    await sendPasswordResetEmail(email, resetToken);

    return successResponse(res, null, "Password reset email sent");
  } catch (error) {
    console.error("Forgot password error:", error);
    return errorResponse(res, error.message, 500);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return errorResponse(res, "Token and new password are required", 400);
    }

    const user = await User.findOne({
      where: {
        resetToken: token,
      },
    });

    if (!user) {
      return errorResponse(res, "Invalid or expired reset token", 400);
    }

    if (new Date() > user.resetTokenExpiry) {
      return errorResponse(res, "Reset token has expired", 400);
    }

    await user.update({
      password: newPassword,
      resetToken: null,
      resetTokenExpiry: null,
    });

    return successResponse(res, null, "Password reset successful");
  } catch (error) {
    console.error("Reset password error:", error);
    return errorResponse(res, error.message, 500);
  }
};

module.exports = {
  register,
  login,
  verify,
  logout,
  forgotPassword,
  resetPassword,
};
