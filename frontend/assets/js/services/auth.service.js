import { api } from "../core/api.js";
import { setToken, setUser, clear } from "../base/storage.js";

export const login = async (email, password) => {
  const data = await api("/auth/login", "POST", { email, password });
  setToken(data.token);
  setUser(data.user);
  return data.user;
};

export const register = async (userData) =>
  api("/auth/register", "POST", userData);

export const logout = () => {
  clear();
  window.location.href = "/login.html";
};
