// FILE: assets/js/services/user.service.js

const UserService = {
  /**
   * Get current user profile
   */
  async getProfile() {
    const token = AuthService.getToken();
    const response = await fetch("http://localhost:8080/api/users/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch profile");
    }

    return await response.json();
  },

  /**
   * Update user profile
   */
  async updateProfile(userData) {
    const token = AuthService.getToken();
    const response = await fetch("http://localhost:8080/api/users/me", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update profile");
    }

    const updatedUser = await response.json();
    AuthService.setCurrentUser(updatedUser);
    return updatedUser;
  },

  /**
   * Change password
   */
  async changePassword(currentPassword, newPassword) {
    const token = AuthService.getToken();
    const response = await fetch(
      "http://localhost:8080/api/users/me/password",
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to change password");
    }

    return await response.json();
  },
};

if (typeof window !== "undefined") {
  window.UserService = UserService;
}
