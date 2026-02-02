/**
 * Register Page (register.html)
 * REQUIRES BACKEND: POST /api/auth/register
 * Handles user registration
 */

(() => {
  "use strict";

  // Wait for DOM to be ready
  document.addEventListener("DOMContentLoaded", () => {
    console.log("Register page loaded");

    // Check if already logged in
    if (AuthService.isAuthenticated()) {
      window.location.href = "index.html";
      return;
    }

    // Initialize registration form
    initializeRegisterForm();
  });

  /**
   * Initialize registration form
   */
  function initializeRegisterForm() {
    const registerForm = document.getElementById("registerForm");
    if (!registerForm) return;

    registerForm.addEventListener("submit", handleRegisterSubmit);

    // Password validation on input
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    if (passwordInput && confirmPasswordInput) {
      confirmPasswordInput.addEventListener("input", () => {
        validatePasswordMatch();
      });
    }

    // Toggle password visibility
    setupPasswordToggles();
  }

  /**
   * Setup password visibility toggles
   */
  function setupPasswordToggles() {
    const toggles = document.querySelectorAll("[data-toggle-password]");

    toggles.forEach((toggle) => {
      toggle.addEventListener("click", () => {
        const targetId = toggle.getAttribute("data-toggle-password");
        const input = document.getElementById(targetId);

        if (input) {
          const type = input.type === "password" ? "text" : "password";
          input.type = type;
          toggle.classList.toggle("show");
        }
      });
    });
  }

  /**
   * Validate password match
   */
  function validatePasswordMatch() {
    const password = document.getElementById("password")?.value;
    const confirmPassword = document.getElementById("confirmPassword")?.value;
    const confirmInput = document.getElementById("confirmPassword");

    if (confirmPassword && password !== confirmPassword) {
      showFieldError("confirmPassword", "Passwords do not match");
      confirmInput?.classList.add("error");
      return false;
    } else {
      clearFieldError("confirmPassword");
      confirmInput?.classList.remove("error");
      return true;
    }
  }

  /**
   * Handle registration form submission
   * BACKEND CALL: POST /api/auth/register
   */
  async function handleRegisterSubmit(e) {
    e.preventDefault();

    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;

    // Get form data
    const formData = new FormData(e.target);
    const userData = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
      phone: formData.get("phone"),
    };

    // Validate form
    if (!validateForm(userData)) {
      return;
    }

    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML =
      '<span class="spinner"></span> Creating account...';

    // Clear previous errors
    clearErrors();

    try {
      // Remove confirmPassword from request (backend doesn't need it)
      const { confirmPassword, ...registrationData } = userData;

      // BACKEND REQUEST: Register user
      const result = await AuthService.register(registrationData);

      if (result.success) {
        console.log("Registration successful");

        // Show success message
        showNotification(
          "Account created successfully! Redirecting...",
          "success",
        );

        // Redirect after short delay
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1500);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Registration failed:", error);

      // Show error message
      const errorMessage =
        error.message || "Registration failed. Please try again.";
      showNotification(errorMessage, "error");

      // Show field-specific errors
      if (error.status === 409) {
        showFieldError("email", "Email already registered");
      }

      // Restore button
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
    }
  }

  /**
   * Validate registration form
   */
  function validateForm(userData) {
    let isValid = true;

    // Clear previous errors
    clearErrors();

    // Validate name
    if (!userData.name || userData.name.trim().length < 2) {
      showFieldError("name", "Name must be at least 2 characters");
      isValid = false;
    }

    // Validate email
    if (!userData.email || !isValidEmail(userData.email)) {
      showFieldError("email", "Please enter a valid email address");
      isValid = false;
    }

    // Validate password
    if (!userData.password || userData.password.length < 6) {
      showFieldError("password", "Password must be at least 6 characters");
      isValid = false;
    }

    // Validate password match
    if (userData.password !== userData.confirmPassword) {
      showFieldError("confirmPassword", "Passwords do not match");
      isValid = false;
    }

    // Validate phone (optional but must be valid if provided)
    if (userData.phone && !isValidPhone(userData.phone)) {
      showFieldError("phone", "Please enter a valid phone number");
      isValid = false;
    }

    return isValid;
  }

  /**
   * Validate email format
   */
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone format
   */
  function isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(phone);
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

    // Remove existing error if any
    clearFieldError(fieldName);

    const errorElement = document.createElement("span");
    errorElement.className = "field-error";
    errorElement.textContent = message;

    field.parentElement.appendChild(errorElement);
    field.classList.add("error");
  }

  /**
   * Clear specific field error
   */
  function clearFieldError(fieldName) {
    const field = document.getElementById(fieldName);
    if (!field) return;

    const existingError = field.parentElement.querySelector(".field-error");
    if (existingError) {
      existingError.remove();
    }
    field.classList.remove("error");
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
