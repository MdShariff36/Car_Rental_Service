// ═══════════════════════════════════════════════════════════════
// AUTHENTICATION CONTROLLER
// Handles user registration, login, verification, password reset
// ═══════════════════════════════════════════════════════════════

const bcrypt = require("bcryptjs");
const User = require("../models/User");
const {
  successResponse,
  errorResponse,
  createdResponse,
} = require("../utils/response");
const {
  generateToken,
  generateVerificationToken,
  generatePasswordResetToken,
} = require("../utils/tokenHelper");
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
} = require("../utils/emailHelper");

/**
 * Register new user
 * POST /api/auth/register
 */
const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return errorResponse(res, "Name, email, and password are required", 400);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return errorResponse(res, "Email already registered", 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = generateVerificationToken();

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: role || "USER",
      verificationToken,
    });

    // Send verification email
    await sendVerificationEmail(user, verificationToken);

    // Generate JWT token
    const token = generateToken(user);

    return createdResponse(
      res,
      "Registration successful. Please check your email to verify your account.",
      {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
        },
      },
    );
  } catch (error) {
    console.error("Registration error:", error);
    return errorResponse(res, "Registration failed", 500);
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return errorResponse(res, "Email and password are required", 400);
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return errorResponse(res, "Invalid email or password", 401);
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return errorResponse(res, "Invalid email or password", 401);
    }

    // Generate JWT token
    const token = generateToken(user);

    return successResponse(res, "Login successful", {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse(res, "Login failed", 500);
  }
};

/**
 * Verify email
 * GET /api/auth/verify/:token
 */
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Find user with verification token
    const user = await User.findOne({ where: { verificationToken: token } });

    if (!user) {
      return errorResponse(res, "Invalid or expired verification token", 400);
    }

    // Update user verification status
    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    // Send welcome email
    await sendWelcomeEmail(user);

    return successResponse(res, "Email verified successfully");
  } catch (error) {
    console.error("Email verification error:", error);
    return errorResponse(res, "Email verification failed", 500);
  }
};

/**
 * Request password reset
 * POST /api/auth/forgot-password
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return errorResponse(res, "Email is required", 400);
    }

    // Find user
    const user = await User.findOne({ where: { email } });

    if (!user) {
      // Don't reveal if email exists or not
      return successResponse(
        res,
        "If the email exists, a password reset link has been sent",
      );
    }

    // Generate reset token
    const { token, expiry } = generatePasswordResetToken();

    // Save reset token
    user.resetToken = token;
    user.resetTokenExpiry = expiry;
    await user.save();

    // Send reset email
    await sendPasswordResetEmail(user, token);

    return successResponse(res, "Password reset link sent to your email");
  } catch (error) {
    console.error("Forgot password error:", error);
    return errorResponse(res, "Failed to process request", 500);
  }
};

/**
 * Reset password
 * POST /api/auth/reset-password/:token
 */
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return errorResponse(res, "New password is required", 400);
    }

    if (password.length < 6) {
      return errorResponse(res, "Password must be at least 6 characters", 400);
    }

    // Find user with valid reset token
    const user = await User.findOne({
      where: {
        resetToken: token,
      },
    });

    if (!user) {
      return errorResponse(res, "Invalid or expired reset token", 400);
    }

    // Check if token is expired
    if (user.resetTokenExpiry < new Date()) {
      return errorResponse(res, "Reset token has expired", 400);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and clear reset token
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    return successResponse(res, "Password reset successful");
  } catch (error) {
    console.error("Reset password error:", error);
    return errorResponse(res, "Failed to reset password", 500);
  }
};

/**
 * Logout user (client-side token removal)
 * POST /api/auth/logout
 */
const logout = async (req, res) => {
  try {
    return successResponse(res, "Logout successful");
  } catch (error) {
    console.error("Logout error:", error);
    return errorResponse(res, "Logout failed", 500);
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  logout,
};
