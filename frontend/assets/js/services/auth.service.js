// FILE: assets/js/services/auth.service.js

const AuthService = {
  /**
   * Get stored JWT token
   */
  getToken() {
    return localStorage.getItem("authToken");
  },

  /**
   * Set JWT token
   */
  setToken(token) {
    localStorage.setItem("authToken", token);
  },

  /**
   * Remove JWT token
   */
  removeToken() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
  },

  /**
   * Get current user from localStorage
   */
  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Set current user
   */
  setCurrentUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
    if (user.role) {
      localStorage.setItem("userRole", user.role);
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.getToken();
  },

  /**
   * Get user role
   */
  getUserRole() {
    return localStorage.getItem("userRole");
  },

  /**
   * Check if user has specific role
   */
  hasRole(role) {
    return this.getUserRole() === role;
  },

  /**
   * Logout user
   */
  async logout() {
    try {
      const token = this.getToken();
      if (token) {
        await fetch("http://localhost:8080/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      this.removeToken();
      window.location.href = "/login.html";
    }
  },

  /**
   * Redirect to login
   */
  redirectToLogin(returnUrl = null) {
    const url = returnUrl
      ? `/login.html?returnUrl=${encodeURIComponent(returnUrl)}`
      : "/login.html";
    window.location.href = url;
  },

  /**
   * Get return URL from query params
   */
  getReturnUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("returnUrl") || "/user/dashboard.html";
  },
};

if (typeof window !== "undefined") {
  window.AuthService = AuthService;
}
