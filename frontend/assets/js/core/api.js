// ============================================================================
// FILE: assets/js/core/api.js
// ============================================================================

/**
 * API Service
 * Handles all HTTP requests to the backend
 */

import CONFIG from "../base/config.js";
import Storage from "../base/storage.js";

const API = {
  /**
   * Base fetch wrapper with error handling
   */
  async request(endpoint, options = {}) {
    const url = `${CONFIG.API_BASE_URL}${endpoint}`;

    // Default headers
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // Add auth token if available
    const token = Storage.getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Merge options
    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);

      // Handle 401 Unauthorized
      if (response.status === 401) {
        Storage.logout();
        window.location.href = "/login.html";
        throw new Error("Unauthorized - Please login again");
      }

      // Parse JSON response
      const data = await response.json();

      // Check if response is successful
      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }

      return { success: true, data };
    } catch (error) {
      console.error("API Request Error:", error);
      return { success: false, error: error.message };
    }
  },

  /**
   * GET request
   */
  async get(endpoint) {
    return this.request(endpoint, {
      method: "GET",
    });
  },

  /**
   * POST request
   */
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * PUT request
   */
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * DELETE request
   */
  async delete(endpoint) {
    return this.request(endpoint, {
      method: "DELETE",
    });
  },

  /**
   * Upload file
   */
  async upload(endpoint, formData) {
    const token = Storage.getAuthToken();
    const headers = {};

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      return { success: true, data };
    } catch (error) {
      console.error("Upload Error:", error);
      return { success: false, error: error.message };
    }
  },
};

export default API;
