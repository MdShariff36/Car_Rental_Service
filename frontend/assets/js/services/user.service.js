/**
 * User Service - Handles user-related backend operations
 * NO DOM manipulation - only data fetching
 */

const UserService = (() => {
  /**
   * Get current user profile
   * GET /api/users/me
   */
  const getCurrentUserProfile = async () => {
    try {
      const user = await API.get("/users/me");

      // Update local storage with fresh user data
      localStorage.setItem("user", JSON.stringify(user));

      return { success: true, data: user };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        status: error.status,
      };
    }
  };

  /**
   * Update user profile
   * PUT /api/users/me
   */
  const updateProfile = async (userData) => {
    try {
      const user = await API.put("/users/me", userData);

      // Update local storage
      localStorage.setItem("user", JSON.stringify(user));

      return { success: true, data: user };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        status: error.status,
      };
    }
  };

  /**
   * Change password
   * PUT /api/users/me/password
   */
  const changePassword = async (passwordData) => {
    try {
      const result = await API.put("/users/me/password", passwordData);
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
    getCurrentUserProfile,
    updateProfile,
    changePassword,
  };
})();

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = UserService;
}
