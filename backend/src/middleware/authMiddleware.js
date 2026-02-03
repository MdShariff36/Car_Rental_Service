const { verifyToken } = require("../utils/tokenHelper");
const { errorResponse } = require("../utils/response");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(res, "No token provided", 401);
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return errorResponse(res, "Invalid or expired token", 401);
    }

    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password", "resetToken", "resetTokenExpiry"] },
    });

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return errorResponse(res, "Authentication failed", 401);
  }
};

module.exports = authMiddleware;
