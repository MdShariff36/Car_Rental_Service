// FILE: assets/js/dashboards/admin/login.js

import { authService } from "../../../services/auth.service.js";
import { requireGuest } from "../../../core/auth-guard.js";
import { CONFIG } from "../../../base/config.js";
import {
  validateEmail,
  validateRequired,
  showFieldError,
  clearFormValidation,
} from "../../../base/validators.js";
import { showLoader, hideLoader } from "../../../ui/loader.js";
import { showNotification } from "../../../ui/notifications.js";

export const initAdminLogin = () => {
  if (!requireGuest()) return;

  setupAdminLoginForm();
};

const setupAdminLoginForm = () => {
  const form = document.querySelector("#admin-login-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    clearFormValidation("admin-login-form");

    const formData = new FormData(form);
    const credentials = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    let isValid = true;

    const emailValidation = validateEmail(credentials.email);
    if (!emailValidation.valid) {
      showFieldError("email", emailValidation.message);
      isValid = false;
    }

    const passwordValidation = validateRequired(
      credentials.password,
      "Password",
    );
    if (!passwordValidation.valid) {
      showFieldError("password", passwordValidation.message);
      isValid = false;
    }

    if (!isValid) return;

    showLoader();

    try {
      await authService.adminLogin(credentials);
      showNotification("Admin login successful!", "success");

      setTimeout(() => {
        window.location.href = CONFIG.ROUTES.ADMIN_DASHBOARD;
      }, 1000);
    } catch (error) {
      showNotification(error.message || "Invalid admin credentials", "error");
    } finally {
      hideLoader();
    }
  });
};
