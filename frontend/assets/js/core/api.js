/**
 * Core API Module - Centralized HTTP client for backend communication
 * Base URL: http://localhost:8080/api
 */

const API = (() => {
  const BASE_URL = "http://localhost:8080/api";

  /**
   * Get auth token from localStorage
   */
  const getToken = () => {
    return localStorage.getItem("authToken");
  };

  /**
   * Set auth token in localStorage
   */
  const setToken = (token) => {
    if (token) {
      localStorage.setItem("authToken", token);
    } else {
      localStorage.removeItem("authToken");
    }
  };

  /**
   * Core request handler with error handling
   */
  const request = async (endpoint, options = {}) => {
    const url = `${BASE_URL}${endpoint}`;

    const config = {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    // Add auth token if available
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Add body for POST/PUT requests
    if (options.body) {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);

      // Handle non-JSON responses
      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      // Handle error responses
      if (!response.ok) {
        throw {
          status: response.status,
          message: data.message || data || "Request failed",
          data: data,
        };
      }

      return data;
    } catch (error) {
      // Network errors or JSON parse errors
      if (!error.status) {
        throw {
          status: 0,
          message: "Network error. Please check your connection.",
          data: null,
        };
      }
      throw error;
    }
  };

  /**
   * Public methods
   */
  return {
    // HTTP methods
    get: (endpoint, options = {}) =>
      request(endpoint, { ...options, method: "GET" }),

    post: (endpoint, body, options = {}) =>
      request(endpoint, { ...options, method: "POST", body }),

    put: (endpoint, body, options = {}) =>
      request(endpoint, { ...options, method: "PUT", body }),

    delete: (endpoint, options = {}) =>
      request(endpoint, { ...options, method: "DELETE" }),

    // Auth helpers
    getToken,
    setToken,

    // Check if user is authenticated
    isAuthenticated: () => !!getToken(),

    // Clear authentication
    clearAuth: () => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
    },
  };
})();

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = API;
}
