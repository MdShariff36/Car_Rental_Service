import { api } from "../core/api.js";

// This sends the POST request to http://localhost:8080/api/auth/register
export const register = async (userData) => {
  return api("/auth/register", "POST", userData);
};

export const login = async (email, password) => {
  // ... your existing login logic
};
