// FILE: frontend/assets/js/services/auth.service.js
import { api } from "../core/api.js";

export const register = async (userData) => {
  return api("/auth/register", "POST", userData);
};

export const login = async (email, password) => {
  return api("/auth/login", "POST", { email, password });
};

// FILE: frontend/assets/js/services/booking.service.js
import { api } from "../core/api.js";

export const createBooking = (bookingData, userId, carId) =>
  api(`/bookings?userId=${userId}&carId=${carId}`, "POST", bookingData);

export const getUserBookings = (userId) => api(`/bookings/user/${userId}`);

export const getBookingById = (id) => api(`/bookings/${id}`);

export const updateBookingStatus = (id, status) =>
  api(`/bookings/${id}/status?status=${status}`, "PATCH");

// FILE: frontend/assets/js/services/contact.service.js
import { api } from "../core/api.js";

export const submitContactMessage = (messageData) =>
  api("/contact", "POST", messageData);

// FILE: frontend/assets/js/services/wishlist.service.js
import { api } from "../core/api.js";

export const getUserWishlist = (userId) => api(`/wishlist/user/${userId}`);

export const addToWishlist = (userId, carId) =>
  api(`/wishlist?userId=${userId}&carId=${carId}`, "POST");

export const removeFromWishlist = (id) => api(`/wishlist/${id}`, "DELETE");

// FILE: frontend/assets/js/services/review.service.js
import { api } from "../core/api.js";

export const getCarReviews = (carId) => api(`/reviews/car/${carId}`);

export const addReview = (reviewData, userId, carId) =>
  api(`/reviews?userId=${userId}&carId=${carId}`, "POST", reviewData);
