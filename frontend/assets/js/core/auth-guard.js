// ============================================================================
// FILE: assets/js/core/auth-guard.js
// ============================================================================

/**
 * Authentication Guard
 * Protects routes and checks user permissions
 */

import Storage from "../base/storage.js";
import CONFIG from "../base/config.js";

const AuthGuard = {
  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return Storage.isAuthenticated();
  },

  /**
   * Get current user role
   */
  getUserRole() {
    return Storage.getUserRole();
  },

  /**
   * Require authentication for page
   */
  requireAuth() {
    if (!this.isAuthenticated()) {
      // Store intended destination
      sessionStorage.setItem("redirect_after_login", window.location.pathname);
      window.location.href = "/login.html";
      return false;
    }
    return true;
  },

  /**
   * Require specific role
   */
  requireRole(requiredRole) {
    if (!this.requireAuth()) return false;

    const userRole = this.getUserRole();
    if (userRole !== requiredRole) {
      window.location.href = "/index.html";
      return false;
    }
    return true;
  },

  /**
   * Require any of the specified roles
   */
  requireAnyRole(roles = []) {
    if (!this.requireAuth()) return false;

    const userRole = this.getUserRole();
    if (!roles.includes(userRole)) {
      window.location.href = "/index.html";
      return false;
    }
    return true;
  },

  /**
   * Redirect if already authenticated
   */
  redirectIfAuthenticated() {
    if (this.isAuthenticated()) {
      const userRole = this.getUserRole();

      switch (userRole) {
        case CONFIG.ROLES.ADMIN:
          window.location.href = "/admin/dashboard.html";
          break;
        case CONFIG.ROLES.HOST:
          window.location.href = "/host/dashboard.html";
          break;
        default:
          window.location.href = "/user/dashboard.html";
      }
    }
  },

  /**
   * Get user dashboard URL
   */
  getDashboardUrl() {
    const userRole = this.getUserRole();

    switch (userRole) {
      case CONFIG.ROLES.ADMIN:
        return "/admin/dashboard.html";
      case CONFIG.ROLES.HOST:
        return "/host/dashboard.html";
      default:
        return "/user/dashboard.html";
    }
  },
};

export default AuthGuard;
