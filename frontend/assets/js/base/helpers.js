// FILE: assets/js/base/helpers.js

import { VALIDATION, NOTIFICATION_DURATION } from "./config.js";

/**
 * Utility Helper Functions
 * Pure utility functions with no DOM manipulation
 */

// ============================================================
// String Utilities
// ============================================================

/**
 * Capitalize first letter of a string
 */
export function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Convert string to title case
 */
export function toTitleCase(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str, maxLength = 50) {
  if (!str || str.length <= maxLength) return str;
  return str.substring(0, maxLength) + "...";
}

/**
 * Generate slug from string
 */
export function slugify(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Remove special characters
 */
export function sanitize(str) {
  if (!str) return "";
  return str.replace(/[<>\"']/g, "");
}

// ============================================================
// Number Utilities
// ============================================================

/**
 * Format number to currency (Indian Rupees)
 */
export function formatCurrency(amount, includeCurrency = true) {
  if (amount === null || amount === undefined)
    return includeCurrency ? "₹0" : "0";

  const formatted = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(amount);

  return includeCurrency ? `₹${formatted}` : formatted;
}

/**
 * Format number with commas
 */
export function formatNumber(num) {
  if (num === null || num === undefined) return "0";
  return new Intl.NumberFormat("en-IN").format(num);
}

/**
 * Round to decimal places
 */
export function roundTo(num, decimals = 2) {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value, total) {
  if (!total || total === 0) return 0;
  return roundTo((value / total) * 100, 2);
}

/**
 * Generate random number between min and max
 */
export function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ============================================================
// Date & Time Utilities
// ============================================================

/**
 * Format date to readable string
 */
export function formatDate(dateString, format = "long") {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (format === "short") {
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  if (format === "long") {
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  return date.toLocaleDateString("en-IN");
}

/**
 * Format time to 12-hour format
 */
export function formatTime(timeString) {
  if (!timeString) return "";

  const [hours, minutes] = timeString.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;

  return `${formattedHour}:${minutes} ${ampm}`;
}

/**
 * Format datetime to readable string
 */
export function formatDateTime(dateString, timeString) {
  return `${formatDate(dateString, "short")}, ${formatTime(timeString)}`;
}

/**
 * Calculate difference in days between two dates
 */
export function daysDifference(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Calculate difference in hours between two datetimes
 */
export function hoursDifference(startDate, startTime, endDate, endTime) {
  const start = new Date(`${startDate}T${startTime}`);
  const end = new Date(`${endDate}T${endTime}`);
  const diffTime = Math.abs(end - start);
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
  return diffHours;
}

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Get date after N days
 */
export function getDateAfterDays(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Check if date is in the past
 */
export function isPastDate(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

/**
 * Check if date is today
 */
export function isToday(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

// ============================================================
// Validation Utilities
// ============================================================

/**
 * Validate email
 */
export function isValidEmail(email) {
  if (!email) return false;
  return VALIDATION.EMAIL_REGEX.test(email);
}

/**
 * Validate phone number (Indian)
 */
export function isValidPhone(phone) {
  if (!phone) return false;
  const cleaned = phone.replace(/\D/g, "");
  return VALIDATION.PHONE_REGEX.test(cleaned);
}

/**
 * Validate password
 */
export function isValidPassword(password) {
  if (!password) return false;
  return (
    password.length >= VALIDATION.PASSWORD_MIN_LENGTH &&
    VALIDATION.PASSWORD_REGEX.test(password)
  );
}

/**
 * Get password strength
 */
export function getPasswordStrength(password) {
  if (!password) return { strength: 0, text: "Weak", color: "#dc3545" };

  let strength = 0;

  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  if (strength <= 2) return { strength: 25, text: "Weak", color: "#dc3545" };
  if (strength === 3) return { strength: 50, text: "Fair", color: "#ffc107" };
  if (strength === 4) return { strength: 75, text: "Good", color: "#28a745" };
  return { strength: 100, text: "Strong", color: "#28a745" };
}

/**
 * Validate driving license number
 */
export function isValidLicense(license) {
  if (!license) return false;
  return VALIDATION.LICENSE_REGEX.test(license);
}

/**
 * Validate card number
 */
export function isValidCardNumber(cardNumber) {
  if (!cardNumber) return false;
  const cleaned = cardNumber.replace(/\D/g, "");
  return VALIDATION.CARD_NUMBER_REGEX.test(cleaned);
}

/**
 * Validate CVV
 */
export function isValidCVV(cvv) {
  if (!cvv) return false;
  return VALIDATION.CVV_REGEX.test(cvv);
}

/**
 * Validate UPI ID
 */
export function isValidUPI(upi) {
  if (!upi) return false;
  return VALIDATION.UPI_REGEX.test(upi);
}

// ============================================================
// Array Utilities
// ============================================================

/**
 * Shuffle array
 */
export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Remove duplicates from array
 */
export function uniqueArray(array) {
  return [...new Set(array)];
}

/**
 * Group array by key
 */
export function groupBy(array, key) {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
}

/**
 * Sort array by key
 */
export function sortBy(array, key, order = "asc") {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (order === "asc") {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    } else {
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    }
  });
}

/**
 * Chunk array into smaller arrays
 */
export function chunkArray(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

// ============================================================
// Object Utilities
// ============================================================

/**
 * Deep clone object
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if object is empty
 */
export function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}

/**
 * Merge objects
 */
export function mergeObjects(...objects) {
  return Object.assign({}, ...objects);
}

/**
 * Pick keys from object
 */
export function pickKeys(obj, keys) {
  return keys.reduce((result, key) => {
    if (obj.hasOwnProperty(key)) {
      result[key] = obj[key];
    }
    return result;
  }, {});
}

/**
 * Omit keys from object
 */
export function omitKeys(obj, keys) {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result;
}

// ============================================================
// URL & Query Utilities
// ============================================================

/**
 * Get query parameter from URL
 */
export function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

/**
 * Get all query parameters as object
 */
export function getAllQueryParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const params = {};
  for (const [key, value] of urlParams) {
    params[key] = value;
  }
  return params;
}

/**
 * Build query string from object
 */
export function buildQueryString(params) {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      queryParams.append(key, value);
    }
  });
  return queryParams.toString();
}

/**
 * Update URL with query params without reload
 */
export function updateURL(params) {
  const queryString = buildQueryString(params);
  const newURL = queryString
    ? `${window.location.pathname}?${queryString}`
    : window.location.pathname;

  window.history.pushState({}, "", newURL);
}

/**
 * Replace endpoint parameters
 */
export function replaceEndpointParams(endpoint, params) {
  let url = endpoint;
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`:${key}`, value);
  });
  return url;
}

// ============================================================
// Calculation Utilities
// ============================================================

/**
 * Calculate booking price
 */
export function calculateBookingPrice(pricePerDay, days, gstRate = 0.18) {
  const basePrice = pricePerDay * days;
  const gst = basePrice * gstRate;
  const total = basePrice + gst;

  return {
    basePrice: roundTo(basePrice, 2),
    gst: roundTo(gst, 2),
    total: roundTo(total, 2),
  };
}

/**
 * Calculate discount amount
 */
export function calculateDiscount(amount, discountPercent) {
  return roundTo((amount * discountPercent) / 100, 2);
}

/**
 * Calculate trip duration
 */
export function calculateTripDuration(startDate, startTime, endDate, endTime) {
  const start = new Date(`${startDate}T${startTime}`);
  const end = new Date(`${endDate}T${endTime}`);

  const diffMs = end - start;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(
    (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );

  return {
    days: diffDays,
    hours: diffHours,
    totalHours: Math.ceil(diffMs / (1000 * 60 * 60)),
    formatted:
      diffDays > 0
        ? `${diffDays} day${diffDays > 1 ? "s" : ""}${diffHours > 0 ? ` ${diffHours}h` : ""}`
        : `${diffHours} hour${diffHours > 1 ? "s" : ""}`,
  };
}

// ============================================================
// Formatting Utilities
// ============================================================

/**
 * Format card number with spaces
 */
export function formatCardNumber(cardNumber) {
  const cleaned = cardNumber.replace(/\D/g, "");
  return cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
}

/**
 * Format phone number
 */
export function formatPhoneNumber(phone) {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
}

/**
 * Format file size
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

// ============================================================
// ID & Token Utilities
// ============================================================

/**
 * Generate unique ID
 */
export function generateUniqueId(prefix = "") {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 9);
  return prefix
    ? `${prefix}_${timestamp}_${randomStr}`
    : `${timestamp}_${randomStr}`;
}

/**
 * Generate booking reference
 */
export function generateBookingReference() {
  const year = new Date().getFullYear();
  const random = Math.floor(10000 + Math.random() * 90000);
  return `AP-${year}-${random}`;
}

// ============================================================
// Debounce & Throttle
// ============================================================

/**
 * Debounce function
 */
export function debounce(func, delay = 300) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * Throttle function
 */
export function throttle(func, limit = 300) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ============================================================
// Error Handling
// ============================================================

/**
 * Extract error message from error object
 */
export function getErrorMessage(error) {
  if (typeof error === "string") return error;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return "An unexpected error occurred";
}

/**
 * Check if error is network error
 */
export function isNetworkError(error) {
  return !error.response && error.message === "Network Error";
}

// ============================================================
// Miscellaneous
// ============================================================

/**
 * Sleep/delay function
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Copy to clipboard (returns promise)
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Check if user is on mobile
 */
export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
}

/**
 * Get notification duration based on type
 */
export function getNotificationDuration(type) {
  switch (type) {
    case "error":
      return NOTIFICATION_DURATION.LONG;
    case "warning":
      return NOTIFICATION_DURATION.MEDIUM;
    case "success":
    case "info":
    default:
      return NOTIFICATION_DURATION.SHORT;
  }
}

/**
 * Format rating
 */
export function formatRating(rating, maxRating = 5) {
  return `${roundTo(rating, 1)}/${maxRating}`;
}

/**
 * Get star rating string
 */
export function getStarRating(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  return (
    "⭐".repeat(fullStars) + (halfStar ? "½" : "") + "☆".repeat(emptyStars)
  );
}

// Export all as default
export default {
  // String
  capitalize,
  toTitleCase,
  truncate,
  slugify,
  sanitize,

  // Number
  formatCurrency,
  formatNumber,
  roundTo,
  calculatePercentage,
  randomNumber,

  // Date/Time
  formatDate,
  formatTime,
  formatDateTime,
  daysDifference,
  hoursDifference,
  getTodayDate,
  getDateAfterDays,
  isPastDate,
  isToday,

  // Validation
  isValidEmail,
  isValidPhone,
  isValidPassword,
  getPasswordStrength,
  isValidLicense,
  isValidCardNumber,
  isValidCVV,
  isValidUPI,

  // Array
  shuffleArray,
  uniqueArray,
  groupBy,
  sortBy,
  chunkArray,

  // Object
  deepClone,
  isEmptyObject,
  mergeObjects,
  pickKeys,
  omitKeys,

  // URL
  getQueryParam,
  getAllQueryParams,
  buildQueryString,
  updateURL,
  replaceEndpointParams,

  // Calculations
  calculateBookingPrice,
  calculateDiscount,
  calculateTripDuration,

  // Formatting
  formatCardNumber,
  formatPhoneNumber,
  formatFileSize,

  // ID/Token
  generateUniqueId,
  generateBookingReference,

  // Performance
  debounce,
  throttle,

  // Error
  getErrorMessage,
  isNetworkError,

  // Misc
  sleep,
  copyToClipboard,
  isMobile,
  getNotificationDuration,
  formatRating,
  getStarRating,
};
