/**
 * Booking Service - Handles all booking-related backend operations
 * NO DOM manipulation - only data fetching
 */

const BookingService = (() => {
  /**
   * Create a new booking
   * POST /api/bookings
   */
  const createBooking = async (bookingData) => {
    try {
      const booking = await API.post("/bookings", bookingData);
      return { success: true, data: booking };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        status: error.status,
      };
    }
  };

  /**
   * Get user's bookings
   * GET /api/bookings (requires authentication)
   */
  const getUserBookings = async () => {
    try {
      const bookings = await API.get("/bookings");
      return { success: true, data: bookings };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        status: error.status,
      };
    }
  };

  /**
   * Get booking by ID
   * GET /api/bookings/{id}
   */
  const getBookingById = async (bookingId) => {
    try {
      const booking = await API.get(`/bookings/${bookingId}`);
      return { success: true, data: booking };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        status: error.status,
      };
    }
  };

  /**
   * Cancel booking
   * DELETE /api/bookings/{id}
   */
  const cancelBooking = async (bookingId) => {
    try {
      const result = await API.delete(`/bookings/${bookingId}`);
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        status: error.status,
      };
    }
  };

  // Public API
  return {
    createBooking,
    getUserBookings,
    getBookingById,
    cancelBooking,
  };
})();

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = BookingService;
}
