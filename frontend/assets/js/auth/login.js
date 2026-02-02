/**
 * Login Page (login.html)
 * REQUIRES BACKEND: POST /api/auth/login
 * Handles user authentication
 */

(() => {
  "use strict";

  // Wait for DOM to be ready
  document.addEventListener("DOMContentLoaded", () => {
    console.log("Login page loaded");

    // Check if already logged in
    if (AuthService.isAuthenticated()) {
      redirectAfterLogin();
      return;
    }

    // Initialize login form
    initializeLoginForm();
  });

  /**
   * Initialize login form
   */
  function initializeLoginForm() {
    const loginForm = document.getElementById("loginForm");
    if (!loginForm) return;

    loginForm.addEventListener("submit", handleLoginSubmit);

    // Toggle password visibility
    const togglePassword = document.getElementById("togglePassword");
    const passwordInput = document.getElementById("password");

    if (togglePassword && passwordInput) {
      togglePassword.addEventListener("click", () => {
        const type = passwordInput.type === "password" ? "text" : "password";
        passwordInput.type = type;
        togglePassword.classList.toggle("show");
      });
    }
  }

  /**
   * Handle login form submission
   * BACKEND CALL: POST /api/auth/login
   */
  async function handleLoginSubmit(e) {
    e.preventDefault();

    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;

    // Get form data
    const formData = new FormData(e.target);
    const credentials = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    // Basic validation
    if (!credentials.email || !credentials.password) {
      showNotification("Please enter both email and password", "error");
      return;
    }

    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner"></span> Signing in...';

    // Clear previous errors
    clearErrors();

    try {
      // BACKEND REQUEST: Login
      const result = await AuthService.login(credentials);

      if (result.success) {
        console.log("Login successful");

        // Show success message
        showNotification("Login successful! Redirecting...", "success");

        // Redirect after short delay
        setTimeout(() => {
          redirectAfterLogin();
        }, 1000);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Login failed:", error);

      // Show error message
      const errorMessage = error.message || "Invalid email or password";
      showNotification(errorMessage, "error");

      // Show field-specific errors
      if (error.status === 401) {
        showFieldError("password", "Invalid credentials");
      }

      // Restore button
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
    }
  }

  /**
   * Redirect after successful login
   */
  function redirectAfterLogin() {
    // Check for redirect parameter
    const urlParams = new URLSearchParams(window.location.search);
    const redirectURL = urlParams.get("redirect");

    if (redirectURL) {
      window.location.href = decodeURIComponent(redirectURL);
    } else {
      window.location.href = "index.html";
    }
  }

  /**
   * Show notification message
   */
  function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add("show"), 100);

    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  /**
   * Show field-specific error
   */
  function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    if (!field) return;

    const errorElement = document.createElement("span");
    errorElement.className = "field-error";
    errorElement.textContent = message;

    field.parentElement.appendChild(errorElement);
    field.classList.add("error");
  }

  /**
   * Clear all error messages
   */
  function clearErrors() {
    document.querySelectorAll(".field-error").forEach((el) => el.remove());
    document
      .querySelectorAll(".error")
      .forEach((el) => el.classList.remove("error"));
  }
})();
