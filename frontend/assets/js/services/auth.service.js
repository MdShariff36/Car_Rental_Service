// FILE: assets/js/services/auth.service.js

import { api } from "../core/api.js";
import { storage } from "../base/storage.js";
import { generateId } from "../base/helpers.js";
import { CONFIG } from "../base/config.js";

class AuthService {
  async login(credentials) {
    const users = storage.get("users", []);

    const user = users.find(
      (u) =>
        u.email === credentials.email && u.password === credentials.password,
    );

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const token = generateId();
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    };

    storage.setToken(token);
    storage.setUser(userData);

    return { token, user: userData };
  }

  async register(userData) {
    const users = storage.get("users", []);

    const existingUser = users.find((u) => u.email === userData.email);
    if (existingUser) {
      throw new Error("Email already registered");
    }

    const newUser = {
      id: generateId(),
      ...userData,
      role: userData.role || CONFIG.AUTH.ROLES.USER,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    storage.set("users", users);

    return newUser;
  }

  async adminLogin(credentials) {
    const adminEmail = "admin@carrental.com";
    const adminPassword = "Admin@123";

    if (
      credentials.email === adminEmail &&
      credentials.password === adminPassword
    ) {
      const token = generateId();
      const userData = {
        id: "admin-1",
        name: "Admin",
        email: adminEmail,
        role: CONFIG.AUTH.ROLES.ADMIN,
      };

      storage.setToken(token);
      storage.setUser(userData);

      return { token, user: userData };
    }

    throw new Error("Invalid admin credentials");
  }

  logout() {
    storage.removeToken();
    storage.removeUser();
    storage.removeCart();
  }

  getCurrentUser() {
    return storage.getUser();
  }

  isAuthenticated() {
    return !!(storage.getToken() && storage.getUser());
  }

  async updateProfile(profileData) {
    const user = storage.getUser();
    if (!user) throw new Error("Not authenticated");

    const users = storage.get("users", []);
    const userIndex = users.findIndex((u) => u.id === user.id);

    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...profileData };
      storage.set("users", users);

      const updatedUser = { ...user, ...profileData };
      storage.setUser(updatedUser);

      return updatedUser;
    }

    throw new Error("User not found");
  }

  async changePassword(oldPassword, newPassword) {
    const user = storage.getUser();
    if (!user) throw new Error("Not authenticated");

    const users = storage.get("users", []);
    const userIndex = users.findIndex((u) => u.id === user.id);

    if (userIndex !== -1 && users[userIndex].password === oldPassword) {
      users[userIndex].password = newPassword;
      storage.set("users", users);
      return true;
    }

    throw new Error("Invalid old password");
  }

  async resetPassword(email) {
    const users = storage.get("users", []);
    const user = users.find((u) => u.email === email);

    if (!user) {
      throw new Error("Email not found");
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { message: "Password reset link sent to your email" };
  }
}

export const authService = new AuthService();
