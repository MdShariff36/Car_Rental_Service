// FILE: assets/js/core/api.js

/**
 * API Service Module
 * Handles all HTTP requests with authentication, error handling, and response formatting
 */

import { API_CONFIG, API_ENDPOINTS, ERROR_MESSAGES } from "../base/config.js";
import { getAuthToken, removeAuthToken } from "../base/storage.js";
import { replaceEndpointParams, getErrorMessage } from "../base/helpers.js";

// ============================================================
// Request Configuration
// ============================================================

/**
 * Build request headers
 */
function buildHeaders(customHeaders = {}) {
  const headers = { ...API_CONFIG.HEADERS };

  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return { ...headers, ...customHeaders };
}

/**
 * Build full URL
 */
function buildURL(endpoint) {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  return `${API_CONFIG.BASE_URL}/${cleanEndpoint}`;
}

/**
 * Create request options
 */
function createRequestOptions(method, body = null, customHeaders = {}) {
  const options = {
    method,
    headers: buildHeaders(customHeaders),
  };

  if (body) {
    if (body instanceof FormData) {
      // Don't set Content-Type for FormData, browser will set it with boundary
      delete options.headers["Content-Type"];
      options.body = body;
    } else {
      options.body = JSON.stringify(body);
    }
  }

  return options;
}

// ============================================================
// Response Handlers
// ============================================================

/**
 * Handle API response
 */
async function handleResponse(response) {
  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");

  // Get response data
  const data = isJson ? await response.json() : await response.text();

  // Handle success
  if (response.ok) {
    return {
      success: true,
      data: isJson ? data : { message: data },
      status: response.status,
    };
  }

  // Handle errors
  return handleErrorResponse(response.status, data);
}

/**
 * Handle error responses
 */
function handleErrorResponse(status, data) {
  let errorMessage = ERROR_MESSAGES.SERVER_ERROR;

  switch (status) {
    case 400:
      errorMessage = data?.message || ERROR_MESSAGES.VALIDATION_ERROR;
      break;
    case 401:
      errorMessage = ERROR_MESSAGES.UNAUTHORIZED;
      removeAuthToken(); // Clear invalid token
      break;
    case 403:
      errorMessage = ERROR_MESSAGES.FORBIDDEN;
      break;
    case 404:
      errorMessage = ERROR_MESSAGES.NOT_FOUND;
      break;
    case 500:
    case 502:
    case 503:
      errorMessage = ERROR_MESSAGES.SERVER_ERROR;
      break;
    default:
      errorMessage = data?.message || ERROR_MESSAGES.SERVER_ERROR;
  }

  return {
    success: false,
    error: errorMessage,
    status,
    data: data?.data || null,
  };
}

/**
 * Handle network errors
 */
function handleNetworkError(error) {
  console.error("Network error:", error);

  return {
    success: false,
    error: ERROR_MESSAGES.NETWORK_ERROR,
    status: 0,
    data: null,
  };
}

// ============================================================
// Core Request Methods
// ============================================================

/**
 * Make HTTP request
 */
async function request(method, endpoint, body = null, customHeaders = {}) {
  try {
    const url = buildURL(endpoint);
    const options = createRequestOptions(method, body, customHeaders);

    const response = await fetch(url, options);
    return await handleResponse(response);
  } catch (error) {
    return handleNetworkError(error);
  }
}

/**
 * GET request
 */
export async function get(endpoint, params = null) {
  let url = endpoint;

  if (params) {
    const queryString = new URLSearchParams(params).toString();
    url = `${endpoint}?${queryString}`;
  }

  return request("GET", url);
}

/**
 * POST request
 */
export async function post(endpoint, body = null) {
  return request("POST", endpoint, body);
}

/**
 * PUT request
 */
export async function put(endpoint, body = null) {
  return request("PUT", endpoint, body);
}

/**
 * PATCH request
 */
export async function patch(endpoint, body = null) {
  return request("PATCH", endpoint, body);
}

/**
 * DELETE request
 */
export async function del(endpoint) {
  return request("DELETE", endpoint);
}

/**
 * Upload file (multipart/form-data)
 */
export async function upload(endpoint, formData) {
  return request("POST", endpoint, formData);
}

// ============================================================
// Authentication API
// ============================================================

/**
 * Login
 */
export async function login(credentials) {
  return post(API_ENDPOINTS.LOGIN, credentials);
}

/**
 * Register
 */
export async function register(userData) {
  return post(API_ENDPOINTS.REGISTER, userData);
}

/**
 * Logout
 */
export async function logout() {
  const response = await post(API_ENDPOINTS.LOGOUT);
  removeAuthToken(); // Always clear token
  return response;
}

/**
 * Forgot password
 */
export async function forgotPassword(email) {
  return post(API_ENDPOINTS.FORGOT_PASSWORD, { email });
}

/**
 * Reset password
 */
export async function resetPassword(token, newPassword) {
  return post(API_ENDPOINTS.RESET_PASSWORD, { token, newPassword });
}

// ============================================================
// User API
// ============================================================

/**
 * Get user profile
 */
export async function getUserProfile() {
  return get(API_ENDPOINTS.USER_PROFILE);
}

/**
 * Update user profile
 */
export async function updateUserProfile(userData) {
  return put(API_ENDPOINTS.UPDATE_PROFILE, userData);
}

/**
 * Change password
 */
export async function changePassword(passwordData) {
  return post(API_ENDPOINTS.CHANGE_PASSWORD, passwordData);
}

// ============================================================
// Cars API
// ============================================================

/**
 * Get all cars
 */
export async function getCars(params = {}) {
  return get(API_ENDPOINTS.CARS, params);
}

/**
 * Get car details
 */
export async function getCarDetails(carId) {
  const endpoint = replaceEndpointParams(API_ENDPOINTS.CAR_DETAILS, {
    id: carId,
  });
  return get(endpoint);
}

/**
 * Get popular cars
 */
export async function getPopularCars(limit = 6) {
  return get(API_ENDPOINTS.POPULAR_CARS, { limit });
}

/**
 * Search cars
 */
export async function searchCars(searchParams) {
  return get(API_ENDPOINTS.SEARCH_CARS, searchParams);
}

/**
 * Get car types
 */
export async function getCarTypes() {
  return get(API_ENDPOINTS.CAR_TYPES);
}

// ============================================================
// Bookings API
// ============================================================

/**
 * Get all bookings
 */
export async function getBookings(params = {}) {
  return get(API_ENDPOINTS.BOOKINGS, params);
}

/**
 * Get booking details
 */
export async function getBookingDetails(bookingId) {
  const endpoint = replaceEndpointParams(API_ENDPOINTS.BOOKING_DETAILS, {
    id: bookingId,
  });
  return get(endpoint);
}

/**
 * Create booking
 */
export async function createBooking(bookingData) {
  return post(API_ENDPOINTS.CREATE_BOOKING, bookingData);
}

/**
 * Cancel booking
 */
export async function cancelBooking(bookingId, reason = "") {
  const endpoint = replaceEndpointParams(API_ENDPOINTS.CANCEL_BOOKING, {
    id: bookingId,
  });
  return post(endpoint, { reason });
}

/**
 * Get user bookings
 */
export async function getUserBookings(status = null) {
  const params = status ? { status } : {};
  return get(API_ENDPOINTS.USER_BOOKINGS, params);
}

// ============================================================
// Payments API
// ============================================================

/**
 * Get payments
 */
export async function getPayments(params = {}) {
  return get(API_ENDPOINTS.PAYMENTS, params);
}

/**
 * Process payment
 */
export async function processPayment(paymentData) {
  return post(API_ENDPOINTS.PROCESS_PAYMENT, paymentData);
}

/**
 * Get payment status
 */
export async function getPaymentStatus(paymentId) {
  const endpoint = replaceEndpointParams(API_ENDPOINTS.PAYMENT_STATUS, {
    id: paymentId,
  });
  return get(endpoint);
}

// ============================================================
// Wishlist API
// ============================================================

/**
 * Get wishlist
 */
export async function getWishlist() {
  return get(API_ENDPOINTS.WISHLIST);
}

/**
 * Add to wishlist
 */
export async function addToWishlist(carId) {
  return post(API_ENDPOINTS.ADD_TO_WISHLIST, { carId });
}

/**
 * Remove from wishlist
 */
export async function removeFromWishlist(carId) {
  const endpoint = replaceEndpointParams(API_ENDPOINTS.REMOVE_FROM_WISHLIST, {
    id: carId,
  });
  return del(endpoint);
}

// ============================================================
// Newsletter API
// ============================================================

/**
 * Subscribe to newsletter
 */
export async function subscribeNewsletter(email) {
  return post(API_ENDPOINTS.NEWSLETTER_SUBSCRIBE, { email });
}

// ============================================================
// Reviews API
// ============================================================

/**
 * Get all reviews
 */
export async function getReviews(params = {}) {
  return get(API_ENDPOINTS.REVIEWS, params);
}

/**
 * Get car reviews
 */
export async function getCarReviews(carId) {
  const endpoint = replaceEndpointParams(API_ENDPOINTS.CAR_REVIEWS, {
    id: carId,
  });
  return get(endpoint);
}

/**
 * Add review
 */
export async function addReview(reviewData) {
  return post(API_ENDPOINTS.ADD_REVIEW, reviewData);
}

// ============================================================
// Host API
// ============================================================

/**
 * Get host cars
 */
export async function getHostCars(params = {}) {
  return get(API_ENDPOINTS.HOST_CARS, params);
}

/**
 * Add car (host)
 */
export async function addHostCar(carData) {
  return post(API_ENDPOINTS.ADD_CAR, carData);
}

/**
 * Update car (host)
 */
export async function updateHostCar(carId, carData) {
  const endpoint = replaceEndpointParams(API_ENDPOINTS.UPDATE_CAR, {
    id: carId,
  });
  return put(endpoint, carData);
}

/**
 * Delete car (host)
 */
export async function deleteHostCar(carId) {
  const endpoint = replaceEndpointParams(API_ENDPOINTS.DELETE_CAR, {
    id: carId,
  });
  return del(endpoint);
}

/**
 * Get host bookings
 */
export async function getHostBookings(params = {}) {
  return get(API_ENDPOINTS.HOST_BOOKINGS, params);
}

/**
 * Get host earnings
 */
export async function getHostEarnings(params = {}) {
  return get(API_ENDPOINTS.HOST_EARNINGS, params);
}

// ============================================================
// Admin API
// ============================================================

/**
 * Get all users (admin)
 */
export async function getAdminUsers(params = {}) {
  return get(API_ENDPOINTS.ADMIN_USERS, params);
}

/**
 * Get all cars (admin)
 */
export async function getAdminCars(params = {}) {
  return get(API_ENDPOINTS.ADMIN_CARS, params);
}

/**
 * Get all bookings (admin)
 */
export async function getAdminBookings(params = {}) {
  return get(API_ENDPOINTS.ADMIN_BOOKINGS, params);
}

/**
 * Get reports (admin)
 */
export async function getAdminReports(params = {}) {
  return get(API_ENDPOINTS.ADMIN_REPORTS, params);
}

/**
 * Get/update settings (admin)
 */
export async function getAdminSettings() {
  return get(API_ENDPOINTS.ADMIN_SETTINGS);
}

export async function updateAdminSettings(settings) {
  return put(API_ENDPOINTS.ADMIN_SETTINGS, settings);
}

// ============================================================
// Batch Requests
// ============================================================

/**
 * Execute multiple requests in parallel
 */
export async function batchRequests(requests) {
  try {
    const promises = requests.map((req) => {
      const { method, endpoint, body } = req;

      switch (method.toUpperCase()) {
        case "GET":
          return get(endpoint, body);
        case "POST":
          return post(endpoint, body);
        case "PUT":
          return put(endpoint, body);
        case "PATCH":
          return patch(endpoint, body);
        case "DELETE":
          return del(endpoint);
        default:
          return Promise.resolve({ success: false, error: "Invalid method" });
      }
    });

    return await Promise.all(promises);
  } catch (error) {
    console.error("Batch request error:", error);
    return [];
  }
}

// ============================================================
// Request Interceptors
// ============================================================

let requestInterceptors = [];
let responseInterceptors = [];

/**
 * Add request interceptor
 */
export function addRequestInterceptor(interceptor) {
  requestInterceptors.push(interceptor);
}

/**
 * Add response interceptor
 */
export function addResponseInterceptor(interceptor) {
  responseInterceptors.push(interceptor);
}

/**
 * Clear all interceptors
 */
export function clearInterceptors() {
  requestInterceptors = [];
  responseInterceptors = [];
}

// ============================================================
// Health Check
// ============================================================

/**
 * Check API health
 */
export async function healthCheck() {
  try {
    const response = await fetch(API_CONFIG.BASE_URL + "/health");
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Export all as default
export default {
  // Core methods
  get,
  post,
  put,
  patch,
  del,
  upload,

  // Auth
  login,
  register,
  logout,
  forgotPassword,
  resetPassword,

  // User
  getUserProfile,
  updateUserProfile,
  changePassword,

  // Cars
  getCars,
  getCarDetails,
  getPopularCars,
  searchCars,
  getCarTypes,

  // Bookings
  getBookings,
  getBookingDetails,
  createBooking,
  cancelBooking,
  getUserBookings,

  // Payments
  getPayments,
  processPayment,
  getPaymentStatus,

  // Wishlist
  getWishlist,
  addToWishlist,
  removeFromWishlist,

  // Newsletter
  subscribeNewsletter,

  // Reviews
  getReviews,
  getCarReviews,
  addReview,

  // Host
  getHostCars,
  addHostCar,
  updateHostCar,
  deleteHostCar,
  getHostBookings,
  getHostEarnings,

  // Admin
  getAdminUsers,
  getAdminCars,
  getAdminBookings,
  getAdminReports,
  getAdminSettings,
  updateAdminSettings,

  // Utilities
  batchRequests,
  healthCheck,
  addRequestInterceptor,
  addResponseInterceptor,
  clearInterceptors,
};
