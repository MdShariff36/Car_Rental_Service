// ============================================================================
// AUTO PRIME RENTAL - PRODUCTION JAVASCRIPT
// ============================================================================
// This file contains ALL JavaScript modules for the Auto Prime Rental website
// Each section is clearly marked with FILE headers
// ============================================================================

// ============================================================================
// FILE: assets/js/base/config.js
// ============================================================================

/**
 * Global Configuration
 * Centralized app settings and constants
 */

const CONFIG = {
  // API Configuration
  API_BASE_URL: "http://localhost:8080/api",
  API_TIMEOUT: 30000,

  // Application Settings
  APP_NAME: "Auto Prime Rental",
  APP_VERSION: "1.0.0",

  // LocalStorage Keys
  STORAGE_KEYS: {
    AUTH_TOKEN: "auth_token",
    USER_DATA: "user_data",
    CART: "cart",
    THEME: "theme_preference",
    SEARCH_HISTORY: "search_history",
    WISHLIST: "wishlist",
  },

  // Pagination
  ITEMS_PER_PAGE: 9,

  // Date Formats
  DATE_FORMAT: "DD/MM/YYYY",
  TIME_FORMAT: "HH:mm",

  // Validation
  MIN_PASSWORD_LENGTH: 8,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/jpg", "image/png", "image/webp"],

  // User Roles
  ROLES: {
    USER: "USER",
    HOST: "HOST",
    ADMIN: "ADMIN",
  },

  // Booking Status
  BOOKING_STATUS: {
    PENDING: "PENDING",
    CONFIRMED: "CONFIRMED",
    CANCELLED: "CANCELLED",
    COMPLETED: "COMPLETED",
  },

  // Payment Status
  PAYMENT_STATUS: {
    PENDING: "PENDING",
    SUCCESS: "SUCCESS",
    FAILED: "FAILED",
    REFUNDED: "REFUNDED",
  },
};

// Make CONFIG available globally
if (typeof window !== "undefined") {
  window.CONFIG = CONFIG;
}

export default CONFIG;
