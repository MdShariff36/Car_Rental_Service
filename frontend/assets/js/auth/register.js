// ============================================================================
// FILE: assets/js/auth/register.js
// ============================================================================

/**
 * Register Page
 * New user registration
 */

import AuthService from "../services/auth.service.js";
import Validators from "../base/validators.js";
import Notifications from "../ui/notifications.js";
import Loader from "../ui/loader.js";
import AuthGuard from "../core/auth-guard.js";

const RegisterPage = {
  init() {
    // Redirect if already authenticated
    AuthGuard.redirectIfAuthenticated();

    this.setupRegisterForm();
    this.setupPasswordToggle();
  },

  setupRegisterForm() {
    const registerForm = document.getElementById("registerForm");

    if (!registerForm) return;

    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name")?.value;
      const email = document.getElementById("email")?.value;
      const phone = document.getElementById("phone")?.value;
      const password = document.getElementById("password")?.value;
      const confirmPassword = document.getElementById("confirmPassword")?.value;
      const role = document.getElementById("role")?.value || "USER";
      const agreeTerms = document.getElementById("agreeTerms")?.checked;

      // Validate name
      const nameValidation = Validators.required(name, "Name");
      if (!nameValidation.valid) {
        Notifications.error(nameValidation.message);
        return;
      }

      // Validate email
      const emailValidation = Validators.email(email);
      if (!emailValidation.valid) {
        Notifications.error(emailValidation.message);
        return;
      }

      // Validate phone
      const phoneValidation = Validators.phone(phone);
      if (!phoneValidation.valid) {
        Notifications.error(phoneValidation.message);
        return;
      }

      // Validate password
      const passwordValidation = Validators.password(password);
      if (!passwordValidation.valid) {
        Notifications.error(passwordValidation.message);
        return;
      }

      // Validate confirm password
      const confirmValidation = Validators.confirmPassword(
        password,
        confirmPassword,
      );
      if (!confirmValidation.valid) {
        Notifications.error(confirmValidation.message);
        return;
      }

      // Check terms
      if (!agreeTerms) {
        Notifications.error("Please agree to the terms and conditions");
        return;
      }

      await this.register({ name, email, phone, password, role });
    });
  },

  async register(userData) {
    Loader.show("Creating account...");

    try {
      const response = await AuthService.register(userData);

      Loader.hide();

      if (response.success) {
        Notifications.success("Account created successfully!");

        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = AuthGuard.getDashboardUrl();
        }, 1500);
      } else {
        Notifications.error(
          response.error || "Registration failed. Please try again.",
        );
      }
    } catch (error) {
      Loader.hide();
      Notifications.error("Registration error. Please try again.");
      console.error("Register error:", error);
    }
  },

  setupPasswordToggle() {
    const togglePassword = document.getElementById("togglePassword");
    const toggleConfirmPassword = document.getElementById(
      "toggleConfirmPassword",
    );
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    if (togglePassword && passwordInput) {
      togglePassword.addEventListener("click", () => {
        const type = passwordInput.type === "password" ? "text" : "password";
        passwordInput.type = type;
        togglePassword.textContent = type === "password" ? "👁️" : "🙈";
      });
    }

    if (toggleConfirmPassword && confirmPasswordInput) {
      toggleConfirmPassword.addEventListener("click", () => {
        const type =
          confirmPasswordInput.type === "password" ? "text" : "password";
        confirmPasswordInput.type = type;
        toggleConfirmPassword.textContent = type === "password" ? "👁️" : "🙈";
      });
    }
  },
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => RegisterPage.init());
} else {
  RegisterPage.init();
}

export default RegisterPage;
