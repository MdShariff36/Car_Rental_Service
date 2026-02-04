// ═══════════════════════════════════════════════════════════════
// ROLE MIDDLEWARE
// Role-based access control (RBAC)
// ═══════════════════════════════════════════════════════════════

const { errorResponse } = require("../utils/response");

/**
 * Check if user has required role(s)
 * @param {string|Array} roles - Required role(s)
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, "Authentication required", 401);
    }

    const userRole = req.userRole || req.user.role;

    if (!roles.includes(userRole)) {
      return errorResponse(
        res,
        `Access denied. Required role: ${roles.join(" or ")}`,
        403,
      );
    }

    next();
  };
};

/**
 * Admin only access
 */
const adminOnly = (req, res, next) => {
  if (!req.user) {
    return errorResponse(res, "Authentication required", 401);
  }

  if (req.userRole !== "ADMIN" && req.user.role !== "ADMIN") {
    return errorResponse(res, "Admin access required", 403);
  }

  next();
};

/**
 * Host or Admin access
 */
const hostOrAdmin = (req, res, next) => {
  if (!req.user) {
    return errorResponse(res, "Authentication required", 401);
  }

  const userRole = req.userRole || req.user.role;

  if (userRole !== "HOST" && userRole !== "ADMIN") {
    return errorResponse(res, "Host or Admin access required", 403);
  }

  next();
};

/**
 * Check if user owns the resource or is admin
 */
const ownerOrAdmin = (resourceUserIdField = "userId") => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, "Authentication required", 401);
    }

    const userRole = req.userRole || req.user.role;
    const resourceUserId =
      req[resourceUserIdField] || req.params[resourceUserIdField];

    if (userRole === "ADMIN" || req.userId === parseInt(resourceUserId)) {
      return next();
    }

    return errorResponse(
      res,
      "Access denied. You can only access your own resources.",
      403,
    );
  };
};

module.exports = {
  authorize,
  adminOnly,
  hostOrAdmin,
  ownerOrAdmin,
};
