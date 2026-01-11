import { Storage } from "../base/storage.js";
import { CONFIG } from "../base/config.js";

export const AuthService = {
  login(email, password) {
    const user = { id: 1, email, role: "USER" }; // mock
    Storage.set(CONFIG.STORAGE_KEYS.USER, user);
    Storage.set(CONFIG.STORAGE_KEYS.TOKEN, "mock-jwt-token");
    return user;
  },

  logout() {
    Storage.clear();
    window.location.href = "/frontend/index.html";
  },

  getUser() {
    return Storage.get(CONFIG.STORAGE_KEYS.USER);
  },
};
