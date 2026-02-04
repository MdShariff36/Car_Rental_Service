// ═══════════════════════════════════════════════════════════════
// TOKEN HELPER UTILITIES
// JWT token generation and verification helpers
// ═══════════════════════════════════════════════════════════════

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const config = require("../config/env");

/**
 * Generate JWT access token
 * @param {Object} user - User object
 * @returns {string} JWT token
 */
const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

/**
 * Generate refresh token
 * @param {Object} user - User object
 * @returns {string} Refresh token
 */
const generateRefreshToken = (user) => {
  const payload = {
    id: user.id,
    type: "refresh",
  };

  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: "30d", // Refresh tokens last longer
  });
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

/**
 * Generate random verification token
 * @returns {string} Random token
 */
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

/**
 * Generate password reset token
 * @returns {Object} Token and expiry
 */
const generatePasswordResetToken = () => {
  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

  return { token, expiry };
};

/**
 * Hash token for storage
 * @param {string} token - Plain token
 * @returns {string} Hashed token
 */
const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

/**
 * Extract token from authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} Token or null
 */
const extractTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
};

/**
 * Decode token without verification
 * @param {string} token - JWT token
 * @returns {Object} Decoded token
 */
const decodeToken = (token) => {
  return jwt.decode(token);
};

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} True if expired
 */
const isTokenExpired = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      return true;
    }
    return decoded.exp < Date.now() / 1000;
  } catch (error) {
    return true;
  }
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  generateVerificationToken,
  generatePasswordResetToken,
  hashToken,
  extractTokenFromHeader,
  decodeToken,
  isTokenExpired,
};
