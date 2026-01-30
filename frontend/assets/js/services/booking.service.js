// ============================================================================
// FILE: assets/js/services/booking.service.js
// ============================================================================

/**
 * Booking Service
 * Handles booking operations
 */

import API from "../core/api.js";

const BookingService = {
  /**
   * Create new booking
   */
  async createBooking(bookingData) {
    return await API.post("/bookings", bookingData);
  },

  /**
   * Get booking by ID
   */
  async getBookingById(bookingId) {
    return await API.get(`/bookings/${bookingId}`);
  },

  /**
   * Get user's bookings
   */
  async getUserBookings(status = null) {
    const query = status ? `?status=${status}` : "";
    return await API.get(`/bookings/my-bookings${query}`);
  },

  /**
   * Update booking
   */
  async updateBooking(bookingId, updateData) {
    return await API.put(`/bookings/${bookingId}`, updateData);
  },

  /**
   * Cancel booking
   */
  async cancelBooking(bookingId, reason = "") {
    return await API.post(`/bookings/${bookingId}/cancel`, { reason });
  },

  /**
   * Confirm booking
   */
  async confirmBooking(bookingId) {
    return await API.post(`/bookings/${bookingId}/confirm`);
  },

  /**
   * Complete booking
   */
  async completeBooking(bookingId) {
    return await API.post(`/bookings/${bookingId}/complete`);
  },

  /**
   * Calculate booking price
   */
  async calculatePrice(bookingData) {
    return await API.post("/bookings/calculate-price", bookingData);
  },

  /**
   * Get booking invoice
   */
  async getInvoice(bookingId) {
    return await API.get(`/bookings/${bookingId}/invoice`);
  },

  /**
   * Download invoice PDF
   */
  downloadInvoice(bookingId) {
    const baseUrl = window.CONFIG?.API_BASE_URL || "http://localhost:8080/api";
    window.open(`${baseUrl}/bookings/${bookingId}/invoice/download`, "_blank");
  },
};

export default BookingService;
