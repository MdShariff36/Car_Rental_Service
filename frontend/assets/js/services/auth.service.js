/**
 * Authentication Service
 * Handles all authentication-related API calls
 *
 * NO DOM ACCESS - Pure API logic only
 *
 * Endpoints:
 * - POST /api/auth/register - User registration
 * - POST /api/auth/login - User login
 * - POST /api/auth/logout - User logout
 * - POST /api/auth/refresh - Refresh token
 * - POST /api/auth/forgot-password - Request password reset
 * - POST /api/auth/reset-password - Reset password with token
 * - GET /api/auth/verify-email/:token - Verify email address
 * - GET /api/auth/me - Get current user
 */

class AuthService {
  constructor() {
    this.baseURL = "/api/auth";
    this.useMockAPI = false; // Set to true for development without backend
  }

  /**
   * Get authorization headers
   * @returns {Object} Headers with auth token if available
   */
  getAuthHeaders() {
    const token = this.getToken();
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registration response
   */
  async register(userData) {
    if (this.useMockAPI) {
      return this.mockRegister(userData);
    }

    try {
      const response = await fetch(`${this.baseURL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Store token and user data
      if (data.token) {
        this.setToken(data.token);
      }
      if (data.user) {
        this.setUser(data.user);
      }

      return data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  /**
   * Login user
   * @param {Object} credentials - Email and password
   * @returns {Promise<Object>} Login response with token and user
   */
  async login(credentials) {
    if (this.useMockAPI) {
      return this.mockLogin(credentials);
    }

    try {
      const response = await fetch(`${this.baseURL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store token and user data
      if (data.token) {
        this.setToken(data.token);
      }
      if (data.user) {
        this.setUser(data.user);
      }

      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  /**
   * Logout user
   * @returns {Promise<Object>} Logout response
   */
  async logout() {
    if (this.useMockAPI) {
      return this.mockLogout();
    }

    try {
      const response = await fetch(`${this.baseURL}/logout`, {
        method: "POST",
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      // Clear local storage regardless of response
      this.clearAuth();

      if (!response.ok) {
        throw new Error(data.message || "Logout failed");
      }

      return data;
    } catch (error) {
      // Still clear auth even if request fails
      this.clearAuth();
      console.error("Logout error:", error);
      throw error;
    }
  }

  /**
   * Refresh authentication token
   * @returns {Promise<Object>} New token
   */
  async refreshToken() {
    if (this.useMockAPI) {
      return this.mockRefreshToken();
    }

    try {
      const response = await fetch(`${this.baseURL}/refresh`, {
        method: "POST",
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Token refresh failed");
      }

      if (data.token) {
        this.setToken(data.token);
      }

      return data;
    } catch (error) {
      console.error("Token refresh error:", error);
      throw error;
    }
  }

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise<Object>} Response
   */
  async forgotPassword(email) {
    if (this.useMockAPI) {
      return this.mockForgotPassword(email);
    }

    try {
      const response = await fetch(`${this.baseURL}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Password reset request failed");
      }

      return data;
    } catch (error) {
      console.error("Forgot password error:", error);
      throw error;
    }
  }

  /**
   * Reset password with token
   * @param {string} token - Reset token from email
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Response
   */
  async resetPassword(token, newPassword) {
    if (this.useMockAPI) {
      return this.mockResetPassword(token, newPassword);
    }

    try {
      const response = await fetch(`${this.baseURL}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password: newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Password reset failed");
      }

      return data;
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  }

  /**
   * Verify email with token
   * @param {string} token - Verification token
   * @returns {Promise<Object>} Response
   */
  async verifyEmail(token) {
    if (this.useMockAPI) {
      return this.mockVerifyEmail(token);
    }

    try {
      const response = await fetch(`${this.baseURL}/verify-email/${token}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Email verification failed");
      }

      return data;
    } catch (error) {
      console.error("Email verification error:", error);
      throw error;
    }
  }

  /**
   * Get current authenticated user
   * @returns {Promise<Object>} User data
   */
  async getCurrentUser() {
    if (this.useMockAPI) {
      return this.mockGetCurrentUser();
    }

    try {
      const response = await fetch(`${this.baseURL}/me`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to get user data");
      }

      if (data.user) {
        this.setUser(data.user);
      }

      return data;
    } catch (error) {
      console.error("Get current user error:", error);
      throw error;
    }
  }

  // ==================== Storage Methods ====================

  /**
   * Set authentication token
   * @param {string} token - JWT token
   */
  setToken(token) {
    try {
      localStorage.setItem("token", token);
    } catch (error) {
      console.error("Error saving token:", error);
    }
  }

  /**
   * Get authentication token
   * @returns {string|null} JWT token
   */
  getToken() {
    try {
      return localStorage.getItem("token");
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  }

  /**
   * Set user data
   * @param {Object} user - User object
   */
  setUser(user) {
    try {
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.error("Error saving user:", error);
    }
  }

  /**
   * Get user data
   * @returns {Object|null} User object
   */
  getUser() {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error("Error getting user:", error);
      return null;
    }
  }

  /**
   * Clear all authentication data
   */
  clearAuth() {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Error clearing auth:", error);
    }
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} True if token exists
   */
  isAuthenticated() {
    return !!this.getToken();
  }

  // ==================== Mock API Methods ====================

  mockRegister(userData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = {
          id: Math.floor(Math.random() * 10000),
          email: userData.email,
          name: `${userData.firstName} ${userData.lastName}`,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          role: userData.role || "USER",
          emailVerified: false,
          createdAt: new Date().toISOString(),
        };

        const mockToken =
          "mock-jwt-token-" + Math.random().toString(36).substr(2, 9);

        resolve({
          success: true,
          message: "Registration successful",
          user: mockUser,
          token: mockToken,
        });
      }, 1000);
    });
  }

  mockLogin(credentials) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate successful login
        if (credentials.email && credentials.password) {
          const mockUser = {
            id: 1,
            email: credentials.email,
            name: "John Doe",
            firstName: "John",
            lastName: "Doe",
            phone: "+91-9876543210",
            role: "USER",
            emailVerified: true,
            avatar: "assets/images/default-avatar.png",
          };

          const mockToken =
            "mock-jwt-token-" + Math.random().toString(36).substr(2, 9);

          resolve({
            success: true,
            message: "Login successful",
            user: mockUser,
            token: mockToken,
          });
        } else {
          reject(new Error("Invalid credentials"));
        }
      }, 1000);
    });
  }

  mockLogout() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "Logout successful",
        });
      }, 500);
    });
  }

  mockRefreshToken() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockToken =
          "mock-jwt-token-" + Math.random().toString(36).substr(2, 9);
        resolve({
          success: true,
          token: mockToken,
        });
      }, 500);
    });
  }

  mockForgotPassword(email) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: `Password reset link sent to ${email}`,
        });
      }, 1000);
    });
  }

  mockResetPassword(token, newPassword) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "Password reset successful",
        });
      }, 1000);
    });
  }

  mockVerifyEmail(token) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "Email verified successfully",
        });
      }, 1000);
    });
  }

  mockGetCurrentUser() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = this.getUser();
        resolve({
          success: true,
          user: user || {
            id: 1,
            email: "user@example.com",
            name: "John Doe",
            role: "USER",
          },
        });
      }, 500);
    });
  }
}

// Create singleton instance
const authService = new AuthService();

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = authService;
}

// Global access
if (typeof window !== "undefined") {
  window.authService = authService;
}
