// FILE: assets/js/services/user.service.js

import { storage } from "../base/storage.js";
import { generateId } from "../base/helpers.js";

class UserService {
  async getAllUsers() {
    await new Promise((resolve) => setTimeout(resolve, 300));

    return storage.get("users", []);
  }

  async getUserById(id) {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const users = storage.get("users", []);
    const user = users.find((u) => u.id === id);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  async updateUser(id, userData) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const users = storage.get("users", []);
    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      throw new Error("User not found");
    }

    users[userIndex] = { ...users[userIndex], ...userData };
    storage.set("users", users);

    const currentUser = storage.getUser();
    if (currentUser?.id === id) {
      storage.setUser(users[userIndex]);
    }

    return users[userIndex];
  }

  async deleteUser(id) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const users = storage.get("users", []);
    const filteredUsers = users.filter((u) => u.id !== id);

    storage.set("users", filteredUsers);
    return true;
  }

  async getUserStats() {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const users = storage.get("users", []);

    return {
      total: users.length,
      users: users.filter((u) => u.role === "user").length,
      hosts: users.filter((u) => u.role === "host").length,
      admins: users.filter((u) => u.role === "admin").length,
    };
  }

  async searchUsers(searchTerm) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const users = storage.get("users", []);
    const term = searchTerm.toLowerCase();

    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.phone?.toLowerCase().includes(term),
    );
  }

  async getCurrentUserProfile() {
    const user = storage.getUser();
    if (!user) {
      throw new Error("Not authenticated");
    }

    return this.getUserById(user.id);
  }

  async updateCurrentUserProfile(profileData) {
    const user = storage.getUser();
    if (!user) {
      throw new Error("Not authenticated");
    }

    return this.updateUser(user.id, profileData);
  }
}

export const userService = new UserService();
