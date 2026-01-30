// ============================================================================
// AUTO PRIME RENTAL - SERVICES LAYER
// All service files for API communication
// ============================================================================

// ============================================================================
// FILE: assets/js/services/auth.service.js
// ============================================================================

/**
 * Authentication Service
 * Handles login, register, and auth operations
 */

import API from "../core/api.js";
import Storage from "../base/storage.js";

const AuthService = {
  /**
   * Login user
   */
  async login(credentials) {
    const response = await API.post("/auth/login", credentials);

    if (response.success) {
      Storage.setAuthToken(response.data.token);
      Storage.setUserData(response.data.user);
    }

    return response;
  },

  /**
   * Register new user
   */
  async register(userData) {
    const response = await API.post("/auth/register", userData);

    if (response.success) {
      Storage.setAuthToken(response.data.token);
      Storage.setUserData(response.data.user);
    }

    return response;
  },

  /**
   * Logout user
   */
  async logout() {
    try {
      await API.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      Storage.logout();
    }
  },

  /**
   * Get current user profile
   */
  async getProfile() {
    return await API.get("/auth/profile");
  },

  /**
   * Update user profile
   */
  async updateProfile(profileData) {
    const response = await API.put("/auth/profile", profileData);

    if (response.success) {
      Storage.setUserData(response.data.user);
    }

    return response;
  },

  /**
   * Change password
   */
  async changePassword(passwordData) {
    return await API.post("/auth/change-password", passwordData);
  },

  /**
   * Request password reset
   */
  async forgotPassword(email) {
    return await API.post("/auth/forgot-password", { email });
  },

  /**
   * Reset password with token
   */
  async resetPassword(token, newPassword) {
    return await API.post("/auth/reset-password", { token, newPassword });
  },

  /**
   * Verify email
   */
  async verifyEmail(token) {
    return await API.post("/auth/verify-email", { token });
  },
};

export default AuthService;
