// ============================================================================
// FILE: assets/js/services/admin.service.js
// ============================================================================

/**
 * Admin Service
 * Handles admin-specific operations
 */

import API from "../core/api.js";

const AdminService = {
  /**
   * Get admin dashboard stats
   */
  async getDashboardStats() {
    return await API.get("/admin/dashboard/stats");
  },

  /**
   * Get all users
   */
  async getUsers(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    return await API.get(`/admin/users?${queryString}`);
  },

  /**
   * Get user by ID
   */
  async getUserById(userId) {
    return await API.get(`/admin/users/${userId}`);
  },

  /**
   * Update user
   */
  async updateUser(userId, userData) {
    return await API.put(`/admin/users/${userId}`, userData);
  },

  /**
   * Delete user
   */
  async deleteUser(userId) {
    return await API.delete(`/admin/users/${userId}`);
  },

  /**
   * Suspend user
   */
  async suspendUser(userId, reason) {
    return await API.post(`/admin/users/${userId}/suspend`, { reason });
  },

  /**
   * Activate user
   */
  async activateUser(userId) {
    return await API.post(`/admin/users/${userId}/activate`);
  },

  /**
   * Get all bookings
   */
  async getBookings(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    return await API.get(`/admin/bookings?${queryString}`);
  },

  /**
   * Get all cars
   */
  async getCars(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    return await API.get(`/admin/cars?${queryString}`);
  },

  /**
   * Approve car
   */
  async approveCar(carId) {
    return await API.post(`/admin/cars/${carId}/approve`);
  },

  /**
   * Reject car
   */
  async rejectCar(carId, reason) {
    return await API.post(`/admin/cars/${carId}/reject`, { reason });
  },

  /**
   * Get reports
   */
  async getReports(type, period) {
    return await API.get(`/admin/reports/${type}?period=${period}`);
  },

  /**
   * Get system settings
   */
  async getSettings() {
    return await API.get("/admin/settings");
  },

  /**
   * Update settings
   */
  async updateSettings(settings) {
    return await API.put("/admin/settings", settings);
  },

  /**
   * Get payment transactions
   */
  async getTransactions(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    return await API.get(`/admin/transactions?${queryString}`);
  },
};

export default AdminService;
