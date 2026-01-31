/**
 * Booking Service
 * Handles all booking-related API calls
 *
 * NO DOM ACCESS - Pure API logic only
 *
 * Endpoints:
 * - GET /api/bookings - Get all user bookings
 * - GET /api/bookings/:id - Get single booking
 * - POST /api/bookings - Create new booking
 * - PUT /api/bookings/:id - Update booking
 * - DELETE /api/bookings/:id - Cancel booking
 * - GET /api/bookings/:id/invoice - Get booking invoice
 * - POST /api/bookings/:id/extend - Extend booking
 * - POST /api/bookings/calculate-price - Calculate booking price
 * - GET /api/bookings/upcoming - Get upcoming bookings
 * - GET /api/bookings/past - Get past bookings
 */

class BookingService {
  constructor() {
    this.baseURL = "/api/bookings";
    this.useMockAPI = false; // Set to true for development without backend
  }

  /**
   * Get authorization headers
   * @returns {Object} Headers with auth token if available
   */
  getAuthHeaders() {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Get all user bookings
   * @param {Object} filters - Filter parameters (status, page, limit)
   * @returns {Promise<Object>} Bookings list
   */
  async getBookings(filters = {}) {
    if (this.useMockAPI) {
      return this.mockGetBookings(filters);
    }

    try {
      const queryParams = new URLSearchParams();

      Object.keys(filters).forEach((key) => {
        if (filters[key] !== undefined && filters[key] !== null) {
          queryParams.append(key, filters[key]);
        }
      });

      const url = queryParams.toString()
        ? `${this.baseURL}?${queryParams}`
        : this.baseURL;

      const response = await fetch(url, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch bookings");
      }

      return data;
    } catch (error) {
      console.error("Get bookings error:", error);
      throw error;
    }
  }

  /**
   * Get single booking by ID
   * @param {number} bookingId - Booking ID
   * @returns {Promise<Object>} Booking details
   */
  async getBookingById(bookingId) {
    if (this.useMockAPI) {
      return this.mockGetBookingById(bookingId);
    }

    try {
      const response = await fetch(`${this.baseURL}/${bookingId}`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch booking");
      }

      return data;
    } catch (error) {
      console.error("Get booking error:", error);
      throw error;
    }
  }

  /**
   * Create new booking
   * @param {Object} bookingData - Booking details
   * @returns {Promise<Object>} Created booking
   */
  async createBooking(bookingData) {
    if (this.useMockAPI) {
      return this.mockCreateBooking(bookingData);
    }

    try {
      const response = await fetch(this.baseURL, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create booking");
      }

      return data;
    } catch (error) {
      console.error("Create booking error:", error);
      throw error;
    }
  }

  /**
   * Update booking
   * @param {number} bookingId - Booking ID
   * @param {Object} updateData - Updated booking details
   * @returns {Promise<Object>} Updated booking
   */
  async updateBooking(bookingId, updateData) {
    if (this.useMockAPI) {
      return this.mockUpdateBooking(bookingId, updateData);
    }

    try {
      const response = await fetch(`${this.baseURL}/${bookingId}`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update booking");
      }

      return data;
    } catch (error) {
      console.error("Update booking error:", error);
      throw error;
    }
  }

  /**
   * Cancel booking
   * @param {number} bookingId - Booking ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise<Object>} Cancellation confirmation
   */
  async cancelBooking(bookingId, reason = "") {
    if (this.useMockAPI) {
      return this.mockCancelBooking(bookingId, reason);
    }

    try {
      const response = await fetch(`${this.baseURL}/${bookingId}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ reason }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to cancel booking");
      }

      return data;
    } catch (error) {
      console.error("Cancel booking error:", error);
      throw error;
    }
  }

  /**
   * Get booking invoice
   * @param {number} bookingId - Booking ID
   * @returns {Promise<Object>} Invoice data
   */
  async getInvoice(bookingId) {
    if (this.useMockAPI) {
      return this.mockGetInvoice(bookingId);
    }

    try {
      const response = await fetch(`${this.baseURL}/${bookingId}/invoice`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to get invoice");
      }

      return data;
    } catch (error) {
      console.error("Get invoice error:", error);
      throw error;
    }
  }

  /**
   * Extend booking
   * @param {number} bookingId - Booking ID
   * @param {string} newEndDate - New end date (ISO format)
   * @returns {Promise<Object>} Updated booking
   */
  async extendBooking(bookingId, newEndDate) {
    if (this.useMockAPI) {
      return this.mockExtendBooking(bookingId, newEndDate);
    }

    try {
      const response = await fetch(`${this.baseURL}/${bookingId}/extend`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ newEndDate }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to extend booking");
      }

      return data;
    } catch (error) {
      console.error("Extend booking error:", error);
      throw error;
    }
  }

  /**
   * Calculate booking price
   * @param {Object} priceData - Pricing parameters
   * @returns {Promise<Object>} Price breakdown
   */
  async calculatePrice(priceData) {
    if (this.useMockAPI) {
      return this.mockCalculatePrice(priceData);
    }

    try {
      const response = await fetch(`${this.baseURL}/calculate-price`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(priceData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to calculate price");
      }

      return data;
    } catch (error) {
      console.error("Calculate price error:", error);
      throw error;
    }
  }

  /**
   * Get upcoming bookings
   * @param {number} limit - Number of bookings to fetch
   * @returns {Promise<Object>} Upcoming bookings
   */
  async getUpcomingBookings(limit = 10) {
    if (this.useMockAPI) {
      return this.mockGetUpcomingBookings(limit);
    }

    try {
      const response = await fetch(`${this.baseURL}/upcoming?limit=${limit}`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch upcoming bookings");
      }

      return data;
    } catch (error) {
      console.error("Get upcoming bookings error:", error);
      throw error;
    }
  }

  /**
   * Get past bookings
   * @param {number} page - Page number
   * @param {number} limit - Bookings per page
   * @returns {Promise<Object>} Past bookings
   */
  async getPastBookings(page = 1, limit = 10) {
    if (this.useMockAPI) {
      return this.mockGetPastBookings(page, limit);
    }

    try {
      const queryParams = new URLSearchParams({ page, limit });
      const response = await fetch(`${this.baseURL}/past?${queryParams}`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch past bookings");
      }

      return data;
    } catch (error) {
      console.error("Get past bookings error:", error);
      throw error;
    }
  }

  // ==================== Helper Methods ====================

  /**
   * Calculate trip duration in days
   * @param {string} startDate - Start date
   * @param {string} endDate - End date
   * @returns {number} Duration in days
   */
  calculateDuration(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  /**
   * Format booking reference number
   * @param {number} id - Booking ID
   * @returns {string} Formatted reference
   */
  formatBookingReference(id) {
    const year = new Date().getFullYear();
    return `AP-${year}-${String(id).padStart(5, "0")}`;
  }

  // ==================== Mock API Methods ====================

  mockGetBookings(filters) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockBookings = this.generateMockBookings(5);

        let filteredBookings = mockBookings;
        if (filters.status) {
          filteredBookings = filteredBookings.filter(
            (b) => b.status === filters.status,
          );
        }

        resolve({
          success: true,
          bookings: filteredBookings,
          total: filteredBookings.length,
          page: filters.page || 1,
          totalPages: Math.ceil(
            filteredBookings.length / (filters.limit || 10),
          ),
        });
      }, 800);
    });
  }

  mockGetBookingById(bookingId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          booking: {
            id: bookingId,
            bookingRef: this.formatBookingReference(bookingId),
            carId: 1,
            carName: "Hyundai Creta",
            carImage: "creta.jpg",
            startDate: "2026-02-01T10:00:00Z",
            endDate: "2026-02-05T10:00:00Z",
            pickupLocation: "Trichy, Tamil Nadu",
            dropLocation: "Trichy, Tamil Nadu",
            totalAmount: 10500,
            status: "confirmed",
            paymentStatus: "paid",
            createdAt: new Date().toISOString(),
          },
        });
      }, 600);
    });
  }

  mockCreateBooking(bookingData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const bookingId = Math.floor(Math.random() * 10000);
        resolve({
          success: true,
          message: "Booking created successfully",
          booking: {
            id: bookingId,
            bookingRef: this.formatBookingReference(bookingId),
            ...bookingData,
            status: "confirmed",
            paymentStatus: "paid",
            createdAt: new Date().toISOString(),
          },
        });
      }, 1500);
    });
  }

  mockUpdateBooking(bookingId, updateData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "Booking updated successfully",
          booking: {
            id: bookingId,
            ...updateData,
            updatedAt: new Date().toISOString(),
          },
        });
      }, 1000);
    });
  }

  mockCancelBooking(bookingId, reason) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "Booking cancelled successfully",
          bookingId,
          refundAmount: 5000,
          refundStatus: "processing",
        });
      }, 1000);
    });
  }

  mockGetInvoice(bookingId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          invoice: {
            bookingId,
            bookingRef: this.formatBookingReference(bookingId),
            invoiceNumber: `INV-${bookingId}`,
            date: new Date().toISOString(),
            items: [
              { description: "Car Rental (3 days)", amount: 7500 },
              { description: "GPS", amount: 600 },
              { description: "GST (18%)", amount: 1458 },
            ],
            subtotal: 8100,
            tax: 1458,
            total: 10500,
          },
        });
      }, 800);
    });
  }

  mockExtendBooking(bookingId, newEndDate) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "Booking extended successfully",
          booking: {
            id: bookingId,
            endDate: newEndDate,
            additionalAmount: 2500,
          },
        });
      }, 1000);
    });
  }

  mockCalculatePrice(priceData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const { carId, startDate, endDate, addons = [] } = priceData;
        const days = this.calculateDuration(startDate, endDate);
        const pricePerDay = 2500;
        const basePrice = days * pricePerDay;

        let addonsTotal = 0;
        addons.forEach((addon) => {
          addonsTotal += addon.price * days;
        });

        const subtotal = basePrice + addonsTotal;
        const gst = subtotal * 0.18;
        const total = subtotal + gst;

        resolve({
          success: true,
          pricing: {
            days,
            pricePerDay,
            basePrice,
            addons: addonsTotal,
            subtotal,
            gst,
            total,
            breakdown: [
              { item: "Base Rent", amount: basePrice },
              { item: "Add-ons", amount: addonsTotal },
              { item: "GST (18%)", amount: gst },
            ],
          },
        });
      }, 600);
    });
  }

  mockGetUpcomingBookings(limit) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockBookings = this.generateMockBookings(limit).filter(
          (b) => new Date(b.startDate) > new Date(),
        );

        resolve({
          success: true,
          bookings: mockBookings,
        });
      }, 600);
    });
  }

  mockGetPastBookings(page, limit) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockBookings = this.generateMockBookings(limit).map((b) => ({
          ...b,
          status: "completed",
          endDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        }));

        resolve({
          success: true,
          bookings: mockBookings,
          page,
          totalPages: 3,
          total: 30,
        });
      }, 800);
    });
  }

  generateMockBookings(count) {
    const statuses = ["confirmed", "pending", "completed", "cancelled"];
    const cars = ["Hyundai Creta", "Maruti Swift", "Toyota Fortuner"];

    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      bookingRef: this.formatBookingReference(i + 1),
      carId: i + 1,
      carName: cars[i % 3],
      carImage: "car.jpg",
      startDate: new Date(
        Date.now() + (i + 1) * 24 * 60 * 60 * 1000,
      ).toISOString(),
      endDate: new Date(
        Date.now() + (i + 4) * 24 * 60 * 60 * 1000,
      ).toISOString(),
      pickupLocation: "Trichy, Tamil Nadu",
      dropLocation: "Trichy, Tamil Nadu",
      totalAmount: 10500 + i * 1000,
      status: statuses[i % 4],
      paymentStatus: "paid",
      createdAt: new Date().toISOString(),
    }));
  }
}

// Create singleton instance
const bookingService = new BookingService();

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = bookingService;
}

// Global access
if (typeof window !== "undefined") {
  window.bookingService = bookingService;
}
