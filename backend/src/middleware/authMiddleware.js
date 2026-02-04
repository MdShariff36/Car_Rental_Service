// ═══════════════════════════════════════════════════════════════
// AUTHENTICATION MIDDLEWARE
// JWT token verification and user authentication
// ═══════════════════════════════════════════════════════════════

const jwt = require("jsonwebtoken");
const config = require("../config/env");
const User = require("../models/User");
const { errorResponse } = require("../utils/response");

/**
 * Verify JWT token and authenticate user
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(
        res,
        "No token provided. Authorization required.",
        401,
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt.secret);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return errorResponse(res, "Token expired. Please login again.", 401);
      }
      if (error.name === "JsonWebTokenError") {
        return errorResponse(res, "Invalid token. Please login again.", 401);
      }
      throw error;
    }

    // Find user
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return errorResponse(res, "User not found. Please login again.", 401);
    }

    // Attach user to request object
    req.user = user;
    req.userId = user.id;
    req.userRole = user.role;

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return errorResponse(res, "Authentication failed", 500);
  }
};

/**
 * Optional authentication - doesn't fail if no token
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(); // Continue without authentication
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      const user = await User.findByPk(decoded.id, {
        attributes: { exclude: ["password"] },
      });

      if (user) {
        req.user = user;
        req.userId = user.id;
        req.userRole = user.role;
      }
    } catch (error) {
      // Ignore token errors for optional auth
    }

    next();
  } catch (error) {
    console.error("Optional auth error:", error);
    next(); // Continue even if error
  }
};

module.exports = { authenticate, optionalAuth };
