/**
 * Auth Service - Handles all authentication-related backend operations
 * NO DOM manipulation - only data fetching
 */

const AuthService = (() => {
  /**
   * User login
   * POST /api/auth/login
   */
  const login = async (credentials) => {
    try {
      const response = await API.post("/auth/login", credentials);

      // Store token and user data
      if (response.token) {
        API.setToken(response.token);
      }
      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      return { success: true, data: response };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        status: error.status,
      };
    }
  };

  /**
   * User registration
   * POST /api/auth/register
   */
  const register = async (userData) => {
    try {
      const response = await API.post("/auth/register", userData);

      // Store token and user data if auto-login after registration
      if (response.token) {
        API.setToken(response.token);
      }
      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      return { success: true, data: response };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        status: error.status,
      };
    }
  };

  /**
   * User logout (local only - clear storage)
   */
  const logout = () => {
    API.clearAuth();
    return { success: true };
  };

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = () => {
    return API.isAuthenticated();
  };

  /**
   * Get current user from localStorage
   */
  const getCurrentUser = () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  };

  // Public API
  return {
    login,
    register,
    logout,
    isAuthenticated,
    getCurrentUser,
  };
})();

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = AuthService;
}
