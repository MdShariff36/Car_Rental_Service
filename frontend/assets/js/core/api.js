// FILE: assets/js/core/api.js

import { CONFIG } from "../base/config.js";
import { storage } from "../base/storage.js";
import { sleep } from "../base/helpers.js";

class API {
  constructor() {
    this.baseURL = CONFIG.API.BASE_URL;
    this.timeout = CONFIG.API.TIMEOUT;
  }

  async _fakeRequest(endpoint, options = {}) {
    await sleep(500 + Math.random() * 500);

    const token = storage.getToken();
    if (options.requireAuth && !token) {
      throw new Error("Unauthorized");
    }

    return {
      success: true,
      data: options.mockData || {},
      message: options.message || "Success",
    };
  }

  async request(endpoint, options = {}) {
    try {
      const {
        method = "GET",
        data = null,
        headers = {},
        requireAuth = true,
        mockData = null,
        message = "Success",
      } = options;

      const token = storage.getToken();
      if (requireAuth && !token) {
        throw new Error("Unauthorized");
      }

      return await this._fakeRequest(endpoint, {
        method,
        data,
        headers,
        requireAuth,
        mockData,
        message,
      });
    } catch (error) {
      console.error("API Request Error:", error);
      throw error;
    }
  }

  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "GET" });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: "POST", data });
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: "PUT", data });
  }

  async patch(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: "PATCH", data });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "DELETE" });
  }

  upload(endpoint, formData, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "POST",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
}

export const api = new API();
