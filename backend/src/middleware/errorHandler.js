const { errorResponse } = require("../utils/response");

const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  if (err.name === "SequelizeValidationError") {
    const messages = err.errors.map((e) => e.message).join(", ");
    return errorResponse(res, messages, 400);
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    const field = err.errors[0].path;
    return errorResponse(res, `${field} already exists`, 409);
  }

  if (err.name === "JsonWebTokenError") {
    return errorResponse(res, "Invalid token", 401);
  }

  if (err.name === "TokenExpiredError") {
    return errorResponse(res, "Token expired", 401);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  return errorResponse(res, message, statusCode);
};

module.exports = errorHandler;
