// ============================================================================
// FILE: assets/js/dashboards/user/profile.js
// ============================================================================

/**
 * Profile Page
 * User profile management
 */

import UserService from "../../services/user.service.js";
import AuthService from "../../services/auth.service.js";
import Validators from "../../base/validators.js";
import Loader from "../../ui/loader.js";
import Notifications from "../../ui/notifications.js";
import AuthGuard from "../../core/auth-guard.js";
import Storage from "../../base/storage.js";
import SidebarUser from "../../components/sidebar-user.js";

const ProfilePage = {
  init() {
    if (!AuthGuard.requireRole("USER")) return;

    SidebarUser.init();

    this.loadProfile();
    this.setupProfileForm();
    this.setupPasswordForm();
    this.setupAvatarUpload();
  },

  async loadProfile() {
    Loader.show("Loading profile...");

    try {
      const response = await UserService.getProfile();

      Loader.hide();

      if (response.success && response.data) {
        this.populateProfileForm(response.data);
      }
    } catch (error) {
      Loader.hide();
      Notifications.error("Failed to load profile");
    }
  },

  populateProfileForm(userData) {
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const addressInput = document.getElementById("address");
    const avatarImg = document.getElementById("profileAvatar");

    if (nameInput) nameInput.value = userData.name || "";
    if (emailInput) emailInput.value = userData.email || "";
    if (phoneInput) phoneInput.value = userData.phone || "";
    if (addressInput) addressInput.value = userData.address || "";
    if (avatarImg && userData.avatar) avatarImg.src = userData.avatar;
  },

  setupProfileForm() {
    const profileForm = document.getElementById("profileForm");

    if (!profileForm) return;

    profileForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name")?.value;
      const phone = document.getElementById("phone")?.value;
      const address = document.getElementById("address")?.value;

      // Validate
      const nameValidation = Validators.required(name, "Name");
      if (!nameValidation.valid) {
        Notifications.error(nameValidation.message);
        return;
      }

      const phoneValidation = Validators.phone(phone);
      if (!phoneValidation.valid) {
        Notifications.error(phoneValidation.message);
        return;
      }

      await this.updateProfile({ name, phone, address });
    });
  },

  async updateProfile(profileData) {
    Loader.show("Updating profile...");

    try {
      const response = await UserService.updateProfile(profileData);

      Loader.hide();

      if (response.success) {
        Notifications.success("Profile updated successfully");

        // Update stored user data
        const currentUser = Storage.getUserData();
        Storage.setUserData({ ...currentUser, ...profileData });
      } else {
        Notifications.error(response.error || "Failed to update profile");
      }
    } catch (error) {
      Loader.hide();
      Notifications.error("Error updating profile");
    }
  },

  setupPasswordForm() {
    const passwordForm = document.getElementById("passwordForm");

    if (!passwordForm) return;

    passwordForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const currentPassword = document.getElementById("currentPassword")?.value;
      const newPassword = document.getElementById("newPassword")?.value;
      const confirmPassword =
        document.getElementById("confirmNewPassword")?.value;

      // Validate
      const currentValidation = Validators.required(
        currentPassword,
        "Current password",
      );
      if (!currentValidation.valid) {
        Notifications.error(currentValidation.message);
        return;
      }

      const newValidation = Validators.password(newPassword);
      if (!newValidation.valid) {
        Notifications.error(newValidation.message);
        return;
      }

      const confirmValidation = Validators.confirmPassword(
        newPassword,
        confirmPassword,
      );
      if (!confirmValidation.valid) {
        Notifications.error(confirmValidation.message);
        return;
      }

      await this.changePassword({ currentPassword, newPassword });
    });
  },

  async changePassword(passwordData) {
    Loader.show("Changing password...");

    try {
      const response = await AuthService.changePassword(passwordData);

      Loader.hide();

      if (response.success) {
        Notifications.success("Password changed successfully");
        document.getElementById("passwordForm")?.reset();
      } else {
        Notifications.error(response.error || "Failed to change password");
      }
    } catch (error) {
      Loader.hide();
      Notifications.error("Error changing password");
    }
  },

  setupAvatarUpload() {
    const avatarInput = document.getElementById("avatarInput");
    const uploadBtn = document.getElementById("uploadAvatarBtn");

    if (!avatarInput || !uploadBtn) return;

    uploadBtn.addEventListener("click", () => {
      avatarInput.click();
    });

    avatarInput.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Notifications.error("File size must be less than 5MB");
        return;
      }

      // Validate file type
      if (
        !["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          file.type,
        )
      ) {
        Notifications.error(
          "Please upload a valid image file (JPG, PNG, or WebP)",
        );
        return;
      }

      await this.uploadAvatar(file);
    });
  },

  async uploadAvatar(file) {
    Loader.show("Uploading avatar...");

    try {
      const response = await UserService.uploadProfilePicture(file);

      Loader.hide();

      if (response.success) {
        Notifications.success("Avatar updated successfully");

        // Update avatar display
        const avatarImg = document.getElementById("profileAvatar");
        if (avatarImg && response.data.avatarUrl) {
          avatarImg.src = response.data.avatarUrl;
        }

        // Update stored user data
        const currentUser = Storage.getUserData();
        Storage.setUserData({
          ...currentUser,
          avatar: response.data.avatarUrl,
        });
      } else {
        Notifications.error("Failed to upload avatar");
      }
    } catch (error) {
      Loader.hide();
      Notifications.error("Error uploading avatar");
    }
  },
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => ProfilePage.init());
} else {
  ProfilePage.init();
}

export default ProfilePage;
