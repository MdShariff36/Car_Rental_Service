// FILE: assets/js/dashboards/user/profile.js

import { requireUser } from "../../../core/auth-guard.js";
import { initUserSidebar } from "../../../components/sidebar-user.js";
import { userService } from "../../../services/user.service.js";
import { authService } from "../../../services/auth.service.js";
import { storage } from "../../../base/storage.js";
import {
  validateEmail,
  validateName,
  validatePhone,
  validatePassword,
  showFieldError,
  showFieldSuccess,
  clearFormValidation,
} from "../../../base/validators.js";
import { showLoader, hideLoader } from "../../../ui/loader.js";
import { showNotification } from "../../../ui/notifications.js";

export const initProfile = () => {
  if (!requireUser()) return;

  initUserSidebar();
  loadProfile();
  setupProfileForm();
  setupPasswordForm();
};

const loadProfile = () => {
  const user = storage.getUser();

  const nameInput = document.querySelector("#name");
  const emailInput = document.querySelector("#email");
  const phoneInput = document.querySelector("#phone");

  if (nameInput) nameInput.value = user?.name || "";
  if (emailInput) emailInput.value = user?.email || "";
  if (phoneInput) phoneInput.value = user?.phone || "";
};

const setupProfileForm = () => {
  const form = document.querySelector("#profile-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    clearFormValidation("profile-form");

    const formData = new FormData(form);
    const profileData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
    };

    let isValid = true;

    const nameValidation = validateName(profileData.name);
    if (!nameValidation.valid) {
      showFieldError("name", nameValidation.message);
      isValid = false;
    } else {
      showFieldSuccess("name");
    }

    const emailValidation = validateEmail(profileData.email);
    if (!emailValidation.valid) {
      showFieldError("email", emailValidation.message);
      isValid = false;
    } else {
      showFieldSuccess("email");
    }

    const phoneValidation = validatePhone(profileData.phone);
    if (!phoneValidation.valid) {
      showFieldError("phone", phoneValidation.message);
      isValid = false;
    } else {
      showFieldSuccess("phone");
    }

    if (!isValid) return;

    showLoader();

    try {
      await authService.updateProfile(profileData);
      showNotification("Profile updated successfully", "success");
    } catch (error) {
      showNotification("Failed to update profile", "error");
    } finally {
      hideLoader();
    }
  });
};

const setupPasswordForm = () => {
  const form = document.querySelector("#password-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    clearFormValidation("password-form");

    const formData = new FormData(form);
    const oldPassword = formData.get("oldPassword");
    const newPassword = formData.get("newPassword");
    const confirmPassword = formData.get("confirmPassword");

    let isValid = true;

    const newPasswordValidation = validatePassword(newPassword);
    if (!newPasswordValidation.valid) {
      showFieldError("newPassword", newPasswordValidation.message);
      isValid = false;
    } else {
      showFieldSuccess("newPassword");
    }

    if (newPassword !== confirmPassword) {
      showFieldError("confirmPassword", "Passwords do not match");
      isValid = false;
    } else {
      showFieldSuccess("confirmPassword");
    }

    if (!isValid) return;

    showLoader();

    try {
      await authService.changePassword(oldPassword, newPassword);
      showNotification("Password changed successfully", "success");
      form.reset();
      clearFormValidation("password-form");
    } catch (error) {
      showNotification(error.message || "Failed to change password", "error");
    } finally {
      hideLoader();
    }
  });
};
