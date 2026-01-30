// ============================================================================
// FILE: assets/js/services/car.service.js
// ============================================================================

/**
 * Car Service
 * Handles all car-related API operations
 */

import API from "../core/api.js";

const CarService = {
  /**
   * Get all cars with filters
   */
  async getCars(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    return await API.get(`/cars?${queryString}`);
  },

  /**
   * Get car by ID
   */
  async getCarById(carId) {
    return await API.get(`/cars/${carId}`);
  },

  /**
   * Search cars
   */
  async searchCars(searchParams) {
    return await API.post("/cars/search", searchParams);
  },

  /**
   * Get popular cars
   */
  async getPopularCars(limit = 6) {
    return await API.get(`/cars/popular?limit=${limit}`);
  },

  /**
   * Get featured cars
   */
  async getFeaturedCars(limit = 8) {
    return await API.get(`/cars/featured?limit=${limit}`);
  },

  /**
   * Get cars by category
   */
  async getCarsByCategory(category) {
    return await API.get(`/cars/category/${category}`);
  },

  /**
   * Check car availability
   */
  async checkAvailability(carId, dateRange) {
    return await API.post(`/cars/${carId}/availability`, dateRange);
  },

  /**
   * Add car to wishlist
   */
  async addToWishlist(carId) {
    return await API.post(`/cars/${carId}/wishlist`);
  },

  /**
   * Remove car from wishlist
   */
  async removeFromWishlist(carId) {
    return await API.delete(`/cars/${carId}/wishlist`);
  },

  /**
   * Get user's wishlist
   */
  async getWishlist() {
    return await API.get("/cars/wishlist");
  },

  /**
   * Submit car review
   */
  async submitReview(carId, reviewData) {
    return await API.post(`/cars/${carId}/reviews`, reviewData);
  },

  /**
   * Get car reviews
   */
  async getReviews(carId) {
    return await API.get(`/cars/${carId}/reviews`);
  },
};

export default CarService;
