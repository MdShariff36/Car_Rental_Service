import { api } from "../core/api.js";
import { ENDPOINTS } from "../base/config.js";
import { setToken, setUser, clear } from "../base/storage.js";

/**
 * Register a new user
 */
export const register = async (userData) => {
  try {
    const response = await api(ENDPOINTS.REGISTER, "POST", userData, false);

    // Save token and user data
    if (response.token) {
      setToken(response.token);
      setUser(response.user);
    }

    return response;
  } catch (error) {
    throw new Error(error.message || "Registration failed");
  }
};

/**
 * Login user
 */
export const login = async (email, password) => {
  try {
    const response = await api(
      ENDPOINTS.LOGIN,
      "POST",
      { email, password },
      false,
    );

    // Save token and user data
    if (response.token) {
      setToken(response.token);
      setUser(response.user);
    }

    return response;
  } catch (error) {
    throw new Error(error.message || "Login failed");
  }
};

/**
 * Logout user
 */
export const logout = () => {
  clear();
  window.location.href = "/index.html";
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getToken();
};
