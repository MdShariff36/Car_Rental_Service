// ============================================================================
// FILE: assets/js/services/user.service.js
// ============================================================================

/**
 * User Service
 * Handles user-specific operations
 */

import API from "../core/api.js";

const UserService = {
  /**
   * Get user dashboard stats
   */
  async getDashboardStats() {
    return await API.get("/user/dashboard/stats");
  },

  /**
   * Get user profile
   */
  async getProfile() {
    return await API.get("/user/profile");
  },

  /**
   * Update profile
   */
  async updateProfile(profileData) {
    return await API.put("/user/profile", profileData);
  },

  /**
   * Upload profile picture
   */
  async uploadProfilePicture(file) {
    const formData = new FormData();
    formData.append("avatar", file);
    return await API.upload("/user/profile/avatar", formData);
  },

  /**
   * Get user bookings
   */
  async getBookings(status = null) {
    const query = status ? `?status=${status}` : "";
    return await API.get(`/user/bookings${query}`);
  },

  /**
   * Get user payments
   */
  async getPayments() {
    return await API.get("/user/payments");
  },

  /**
   * Get wishlist
   */
  async getWishlist() {
    return await API.get("/user/wishlist");
  },

  /**
   * Get notifications
   */
  async getNotifications() {
    return await API.get("/user/notifications");
  },

  /**
   * Mark notification as read
   */
  async markNotificationRead(notificationId) {
    return await API.put(`/user/notifications/${notificationId}/read`);
  },

  /**
   * Delete account
   */
  async deleteAccount(password) {
    return await API.post("/user/delete-account", { password });
  },
};

export default UserService;
