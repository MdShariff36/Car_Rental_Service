// API Configuration
export const API_BASE = "http://localhost:8080/api"; // Backend URL
export const APP_VERSION = "1.0.0";

export const ROLES = {
  USER: "USER",
  HOST: "HOST",
  ADMIN: "ADMIN",
};

// API Endpoints
export const ENDPOINTS = {
  // Auth
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",

  // Cars
  CARS: "/cars",
  CARS_AVAILABLE: "/cars/available",
  CARS_BY_TYPE: (type) => `/cars/type/${type}`,
  CARS_SEARCH: "/cars/search",

  // Bookings
  BOOKINGS: "/bookings",
  USER_BOOKINGS: (userId) => `/bookings/user/${userId}`,

  // Users
  USERS: "/users",
  USER_BY_ID: (id) => `/users/${id}`,

  // Payments
  PAYMENTS: "/payments",
  PROCESS_PAYMENT: (id) => `/payments/${id}/process`,

  // Wishlist
  WISHLIST: "/wishlist",
  USER_WISHLIST: (userId) => `/wishlist/user/${userId}`,

  // Reviews
  CAR_REVIEWS: (carId) => `/reviews/car/${carId}`,

  // Contact
  CONTACT: "/contact",
};
