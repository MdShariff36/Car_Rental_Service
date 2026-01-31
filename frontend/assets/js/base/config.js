// FILE: assets/js/base/config.js

/**
 * Application Configuration
 * Contains all constants and configuration settings
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: "http://localhost:8080/api",
  TIMEOUT: 30000,
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",

  // Users
  USER_PROFILE: "/users/profile",
  UPDATE_PROFILE: "/users/profile",
  CHANGE_PASSWORD: "/users/change-password",

  // Cars
  CARS: "/cars",
  CAR_DETAILS: "/cars/:id",
  POPULAR_CARS: "/cars/popular",
  SEARCH_CARS: "/cars/search",
  CAR_TYPES: "/cars/types",

  // Bookings
  BOOKINGS: "/bookings",
  BOOKING_DETAILS: "/bookings/:id",
  CREATE_BOOKING: "/bookings/create",
  CANCEL_BOOKING: "/bookings/:id/cancel",
  USER_BOOKINGS: "/users/bookings",

  // Payments
  PAYMENTS: "/payments",
  PROCESS_PAYMENT: "/payments/process",
  PAYMENT_STATUS: "/payments/:id/status",

  // Wishlist
  WISHLIST: "/users/wishlist",
  ADD_TO_WISHLIST: "/users/wishlist/add",
  REMOVE_FROM_WISHLIST: "/users/wishlist/remove/:id",

  // Newsletter
  NEWSLETTER_SUBSCRIBE: "/newsletter/subscribe",

  // Reviews
  REVIEWS: "/reviews",
  CAR_REVIEWS: "/reviews/car/:id",
  ADD_REVIEW: "/reviews/add",

  // Host
  HOST_CARS: "/host/cars",
  ADD_CAR: "/host/cars/add",
  UPDATE_CAR: "/host/cars/:id",
  DELETE_CAR: "/host/cars/:id",
  HOST_BOOKINGS: "/host/bookings",
  HOST_EARNINGS: "/host/earnings",

  // Admin
  ADMIN_USERS: "/admin/users",
  ADMIN_CARS: "/admin/cars",
  ADMIN_BOOKINGS: "/admin/bookings",
  ADMIN_REPORTS: "/admin/reports",
  ADMIN_SETTINGS: "/admin/settings",
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "autoprime_auth_token",
  USER_DATA: "autoprime_user_data",
  REMEMBER_ME: "autoprime_remember_me",
  SEARCH_PARAMS: "autoprime_search_params",
  WISHLIST: "autoprime_wishlist",
  COMPARE_CARS: "autoprime_compare_cars",
  THEME: "autoprime_theme",
  LANGUAGE: "autoprime_language",
};

// User Roles
export const USER_ROLES = {
  USER: "USER",
  HOST: "HOST",
  ADMIN: "ADMIN",
};

// Booking Status
export const BOOKING_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  ONGOING: "ONGOING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  REJECTED: "REJECTED",
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
};

// Payment Methods
export const PAYMENT_METHODS = {
  CARD: "card",
  UPI: "upi",
  NETBANKING: "netbanking",
  WALLET: "wallet",
};

// Car Types
export const CAR_TYPES = {
  HATCHBACK: "hatchback",
  SEDAN: "sedan",
  SUV: "suv",
  MPV: "mpv",
  LUXURY: "luxury",
  ELECTRIC: "electric",
};

// Transmission Types
export const TRANSMISSION_TYPES = {
  MANUAL: "manual",
  AUTOMATIC: "automatic",
  ALL: "all",
};

// Fuel Types
export const FUEL_TYPES = {
  PETROL: "petrol",
  DIESEL: "diesel",
  ELECTRIC: "electric",
  HYBRID: "hybrid",
};

// Validation Rules
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[6-9]\d{9}$/,
  LICENSE_REGEX: /^[A-Z]{2}-\d{2}-\d{4}-\d{7}$/,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  CARD_NUMBER_REGEX: /^\d{13,19}$/,
  CVV_REGEX: /^\d{3,4}$/,
  UPI_REGEX: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/,
};

// Date/Time Constants
export const DATE_TIME = {
  MIN_BOOKING_HOURS: 24,
  MAX_BOOKING_DAYS: 30,
  CANCELLATION_HOURS: 24,
  DEFAULT_PICKUP_TIME: "10:00",
  DEFAULT_DROP_TIME: "10:00",
  TIME_SLOTS: [
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
  ],
};

// Pricing Constants
export const PRICING = {
  GST_RATE: 0.18,
  SECURITY_DEPOSIT: 5000,
  LATE_RETURN_CHARGE_PER_HOUR: 200,
  EXTRA_KM_CHARGE: 12,
  DAILY_KM_LIMIT: 200,
  REFUEL_CHARGE_PER_LITER: 80,
  ADDITIONAL_DRIVER_CHARGE_PER_DAY: 200,
};

// Add-ons
export const ADDONS = {
  GPS: { id: "gps", name: "GPS Navigation", price: 200 },
  CHILD_SEAT: { id: "child-seat", name: "Child Safety Seat", price: 150 },
  WIFI: { id: "wifi", name: "Portable WiFi", price: 300 },
  DASHCAM: { id: "dashcam", name: "Dash Camera", price: 250 },
  EXTRA_INSURANCE: {
    id: "extra-insurance",
    name: "Extra Insurance",
    price: 500,
  },
  FUEL_PREPAID: { id: "fuel-prepaid", name: "Prepaid Fuel", price: 0 },
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 12,
  PAGE_SIZES: [12, 24, 36, 48],
};

// Sort Options
export const SORT_OPTIONS = {
  RELEVANCE: "relevance",
  PRICE_LOW: "price-low",
  PRICE_HIGH: "price-high",
  RATING: "rating",
  POPULAR: "popular",
  NEWEST: "newest",
};

// Cities List
export const CITIES = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Hyderabad",
  "Pune",
  "Kolkata",
  "Ahmedabad",
  "Jaipur",
  "Trichy",
];

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
};

// Notification Duration
export const NOTIFICATION_DURATION = {
  SHORT: 3000,
  MEDIUM: 5000,
  LONG: 8000,
};

// Counter Animation
export const COUNTER_ANIMATION = {
  DURATION: 2000,
  INCREMENT: 50,
};

// Testimonial Slider
export const TESTIMONIAL_SLIDER = {
  AUTO_PLAY: true,
  AUTO_PLAY_INTERVAL: 5000,
};

// Image Settings
export const IMAGE_SETTINGS = {
  MAX_SIZE_MB: 5,
  ACCEPTED_FORMATS: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  MAX_UPLOAD_COUNT: 10,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNAUTHORIZED: "You need to login to continue.",
  FORBIDDEN: "You do not have permission to access this resource.",
  NOT_FOUND: "The requested resource was not found.",
  SERVER_ERROR: "Server error. Please try again later.",
  VALIDATION_ERROR: "Please check your input and try again.",
  BOOKING_FAILED: "Booking failed. Please try again.",
  PAYMENT_FAILED: "Payment failed. Please try again.",
  SESSION_EXPIRED: "Your session has expired. Please login again.",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Login successful!",
  REGISTER_SUCCESS: "Registration successful!",
  BOOKING_SUCCESS: "Booking confirmed!",
  PAYMENT_SUCCESS: "Payment successful!",
  PROFILE_UPDATE: "Profile updated successfully!",
  PASSWORD_CHANGE: "Password changed successfully!",
  WISHLIST_ADD: "Added to wishlist!",
  WISHLIST_REMOVE: "Removed from wishlist!",
  NEWSLETTER_SUBSCRIBE: "Successfully subscribed to newsletter!",
  REVIEW_SUBMIT: "Review submitted successfully!",
};

// Routes
export const ROUTES = {
  HOME: "/index.html",
  CARS: "/cars.html",
  CAR_DETAILS: "/car-details.html",
  BOOKING: "/booking.html",
  BOOKING_CONFIRM: "/booking-confirm.html",
  LOGIN: "/login.html",
  REGISTER: "/register.html",
  FORGOT_PASSWORD: "/forgot-password.html",
  USER_DASHBOARD: "/user/dashboard.html",
  HOST_DASHBOARD: "/host/dashboard.html",
  ADMIN_DASHBOARD: "/admin/dashboard.html",
};

// App Info
export const APP_INFO = {
  NAME: "Auto Prime Rental",
  VERSION: "1.0.0",
  SUPPORT_EMAIL: "support@autoprime.com",
  SUPPORT_PHONE: "+91-9361261582",
  ADDRESS: "Main Road, Trichy, Tamil Nadu",
};

// Export all as default for convenience
export default {
  API_CONFIG,
  API_ENDPOINTS,
  STORAGE_KEYS,
  USER_ROLES,
  BOOKING_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHODS,
  CAR_TYPES,
  TRANSMISSION_TYPES,
  FUEL_TYPES,
  VALIDATION,
  DATE_TIME,
  PRICING,
  ADDONS,
  PAGINATION,
  SORT_OPTIONS,
  CITIES,
  NOTIFICATION_TYPES,
  NOTIFICATION_DURATION,
  COUNTER_ANIMATION,
  TESTIMONIAL_SLIDER,
  IMAGE_SETTINGS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  ROUTES,
  APP_INFO,
};
