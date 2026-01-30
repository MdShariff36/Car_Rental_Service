// ============================================================================
// FILE: assets/js/base/storage.js
// ============================================================================

/**
 * LocalStorage Manager
 * Handles all localStorage operations with error handling
 */

const Storage = {
  /**
   * Set item in localStorage
   */
  set(key, value) {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error(`Error saving to localStorage (${key}):`, error);
      return false;
    }
  },

  /**
   * Get item from localStorage
   */
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return defaultValue;
    }
  },

  /**
   * Remove item from localStorage
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage (${key}):`, error);
      return false;
    }
  },

  /**
   * Clear all localStorage
   */
  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error("Error clearing localStorage:", error);
      return false;
    }
  },

  /**
   * Check if key exists
   */
  has(key) {
    return localStorage.getItem(key) !== null;
  },

  /**
   * Get auth token
   */
  getAuthToken() {
    return this.get(window.CONFIG?.STORAGE_KEYS?.AUTH_TOKEN || "auth_token");
  },

  /**
   * Set auth token
   */
  setAuthToken(token) {
    return this.set(
      window.CONFIG?.STORAGE_KEYS?.AUTH_TOKEN || "auth_token",
      token,
    );
  },

  /**
   * Remove auth token
   */
  removeAuthToken() {
    return this.remove(window.CONFIG?.STORAGE_KEYS?.AUTH_TOKEN || "auth_token");
  },

  /**
   * Get user data
   */
  getUserData() {
    return this.get(window.CONFIG?.STORAGE_KEYS?.USER_DATA || "user_data");
  },

  /**
   * Set user data
   */
  setUserData(userData) {
    return this.set(
      window.CONFIG?.STORAGE_KEYS?.USER_DATA || "user_data",
      userData,
    );
  },

  /**
   * Remove user data
   */
  removeUserData() {
    return this.remove(window.CONFIG?.STORAGE_KEYS?.USER_DATA || "user_data");
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return this.has(window.CONFIG?.STORAGE_KEYS?.AUTH_TOKEN || "auth_token");
  },

  /**
   * Get current user role
   */
  getUserRole() {
    const userData = this.getUserData();
    return userData?.role || null;
  },

  /**
   * Logout - clear all auth data
   */
  logout() {
    this.removeAuthToken();
    this.removeUserData();
  },
};

export default Storage;
