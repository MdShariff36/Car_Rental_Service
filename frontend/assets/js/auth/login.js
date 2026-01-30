// ============================================================================
// FILE: assets/js/auth/login.js
// ============================================================================

/**
 * Login Page
 * User authentication
 */

import AuthService from "../services/auth.service.js";
import Validators from "../base/validators.js";
import Notifications from "../ui/notifications.js";
import Loader from "../ui/loader.js";
import AuthGuard from "../core/auth-guard.js";

const LoginPage = {
  init() {
    // Redirect if already authenticated
    AuthGuard.redirectIfAuthenticated();

    this.setupLoginForm();
    this.setupPasswordToggle();
  },

  setupLoginForm() {
    const loginForm = document.getElementById("loginForm");

    if (!loginForm) return;

    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email")?.value;
      const password = document.getElementById("password")?.value;

      // Validate email
      const emailValidation = Validators.email(email);
      if (!emailValidation.valid) {
        Notifications.error(emailValidation.message);
        return;
      }

      // Validate password
      const passwordValidation = Validators.required(password, "Password");
      if (!passwordValidation.valid) {
        Notifications.error(passwordValidation.message);
        return;
      }

      await this.login({ email, password });
    });
  },

  async login(credentials) {
    Loader.show("Logging in...");

    try {
      const response = await AuthService.login(credentials);

      Loader.hide();

      if (response.success) {
        Notifications.success("Login successful!");

        // Redirect based on role or to intended page
        const redirectUrl =
          sessionStorage.getItem("redirect_after_login") ||
          AuthGuard.getDashboardUrl();
        sessionStorage.removeItem("redirect_after_login");

        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 1000);
      } else {
        Notifications.error(
          response.error || "Login failed. Please check your credentials.",
        );
      }
    } catch (error) {
      Loader.hide();
      Notifications.error("Login error. Please try again.");
      console.error("Login error:", error);
    }
  },

  setupPasswordToggle() {
    const toggleBtn = document.getElementById("togglePassword");
    const passwordInput = document.getElementById("password");

    if (!toggleBtn || !passwordInput) return;

    toggleBtn.addEventListener("click", () => {
      const type = passwordInput.type === "password" ? "text" : "password";
      passwordInput.type = type;
      toggleBtn.textContent = type === "password" ? "👁️" : "🙈";
    });
  },
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => LoginPage.init());
} else {
  LoginPage.init();
}

export default LoginPage;
