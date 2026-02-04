// ═══════════════════════════════════════════════════════════════
// RATE LIMITER MIDDLEWARE
// Protect API endpoints from abuse
// ═══════════════════════════════════════════════════════════════

const rateLimit = require("express-rate-limit");

/**
 * General API rate limiter - 100 requests per 15 minutes
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: false,
});

/**
 * Auth endpoints rate limiter - 5 requests per 15 minutes
 * Stricter for login/register to prevent brute force
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later.",
  },
  skipSuccessfulRequests: false,
});

/**
 * Password reset rate limiter - 3 requests per hour
 */
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 requests per hour
  message: {
    success: false,
    message: "Too many password reset attempts, please try again later.",
  },
  skipSuccessfulRequests: false,
});

/**
 * Payment endpoints rate limiter - 10 requests per 15 minutes
 */
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: {
    success: false,
    message: "Too many payment requests, please try again later.",
  },
  skipSuccessfulRequests: false,
});

/**
 * Booking creation rate limiter - 20 requests per 15 minutes
 */
const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  message: {
    success: false,
    message: "Too many booking requests, please try again later.",
  },
  skipSuccessfulRequests: false,
});

/**
 * Contact form rate limiter - 3 requests per hour
 */
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 requests per hour
  message: {
    success: false,
    message: "Too many contact form submissions, please try again later.",
  },
  skipSuccessfulRequests: false,
});

module.exports = {
  generalLimiter,
  authLimiter,
  passwordResetLimiter,
  paymentLimiter,
  bookingLimiter,
  contactLimiter,
};
