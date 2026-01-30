// ============================================================================
// FILE: assets/js/services/host.service.js
// ============================================================================

/**
 * Host Service
 * Handles host-specific operations
 */

import API from "../core/api.js";

const HostService = {
  /**
   * Get host dashboard stats
   */
  async getDashboardStats() {
    return await API.get("/host/dashboard/stats");
  },

  /**
   * Get host cars
   */
  async getCars() {
    return await API.get("/host/cars");
  },

  /**
   * Add new car
   */
  async addCar(carData) {
    return await API.post("/host/cars", carData);
  },

  /**
   * Update car
   */
  async updateCar(carId, carData) {
    return await API.put(`/host/cars/${carId}`, carData);
  },

  /**
   * Delete car
   */
  async deleteCar(carId) {
    return await API.delete(`/host/cars/${carId}`);
  },

  /**
   * Upload car images
   */
  async uploadCarImages(carId, files) {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });
    return await API.upload(`/host/cars/${carId}/images`, formData);
  },

  /**
   * Get car bookings
   */
  async getCarBookings(carId = null) {
    const query = carId ? `?carId=${carId}` : "";
    return await API.get(`/host/bookings${query}`);
  },

  /**
   * Get earnings
   */
  async getEarnings(period = "month") {
    return await API.get(`/host/earnings?period=${period}`);
  },

  /**
   * Get payout history
   */
  async getPayouts() {
    return await API.get("/host/payouts");
  },

  /**
   * Request payout
   */
  async requestPayout(amount) {
    return await API.post("/host/payouts/request", { amount });
  },

  /**
   * Update car availability
   */
  async updateAvailability(carId, availability) {
    return await API.put(`/host/cars/${carId}/availability`, availability);
  },

  /**
   * Get reviews for host cars
   */
  async getReviews() {
    return await API.get("/host/reviews");
  },
};

export default HostService;
