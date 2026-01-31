/**
 * Login Form Handler
 * Handles user authentication and form validation
 */

// Import required modules
import { showLoader, hideLoader } from "../components/loader.js";
import { showNotification } from "../ui/notifications.js";
import { validateEmail } from "../base/validators.js";
import { setAuthToken, setUserData } from "../base/storage.js";
import API_CONFIG from "../base/config.js";

// DOM Elements
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const rememberMeCheckbox = document.getElementById("rememberMe");
const togglePasswordBtn = document.querySelector(".toggle-password");

/**
 * Initialize login page
 */
document.addEventListener("DOMContentLoaded", () => {
  initializePasswordToggle();
  initializeFormValidation();
  checkRememberedUser();
});

/**
 * Toggle password visibility
 */
function initializePasswordToggle() {
  if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener("click", () => {
      const type = passwordInput.type === "password" ? "text" : "password";
      passwordInput.type = type;
      togglePasswordBtn.textContent = type === "password" ? "👁️" : "🙈";
    });
  }
}

/**
 * Initialize form validation and submission
 */
function initializeFormValidation() {
  if (!loginForm) return;

  // Add input event listeners for real-time validation
  emailInput.addEventListener("blur", () => validateField(emailInput));
  passwordInput.addEventListener("blur", () => validateField(passwordInput));

  // Handle form submission
  loginForm.addEventListener("submit", handleLogin);
}

/**
 * Validate individual field
 * @param {HTMLInputElement} field - Input field to validate
 * @returns {boolean} - Validation result
 */
function validateField(field) {
  const value = field.value.trim();
  const fieldId = field.id;

  // Remove existing error
  clearFieldError(field);

  // Email validation
  if (fieldId === "email") {
    if (!value) {
      showFieldError(field, "Email address is required");
      return false;
    }
    if (!validateEmail(value)) {
      showFieldError(field, "Please enter a valid email address");
      return false;
    }
  }

  // Password validation
  if (fieldId === "password") {
    if (!value) {
      showFieldError(field, "Password is required");
      return false;
    }
    if (value.length < 6) {
      showFieldError(field, "Password must be at least 6 characters");
      return false;
    }
  }

  return true;
}

/**
 * Show error message for a field
 * @param {HTMLInputElement} field - Input field
 * @param {string} message - Error message
 */
function showFieldError(field, message) {
  // Add error class to input
  field.classList.add("input-error");

  // Create or update error message element
  const formGroup = field.closest(".form-group");
  let errorElement = formGroup.querySelector(".error-message");

  if (!errorElement) {
    errorElement = document.createElement("span");
    errorElement.className = "error-message";
    formGroup.appendChild(errorElement);
  }

  errorElement.textContent = message;
  errorElement.style.display = "block";
}

/**
 * Clear error message for a field
 * @param {HTMLInputElement} field - Input field
 */
function clearFieldError(field) {
  field.classList.remove("input-error");
  const formGroup = field.closest(".form-group");
  const errorElement = formGroup.querySelector(".error-message");
  if (errorElement) {
    errorElement.style.display = "none";
  }
}

/**
 * Clear all form errors
 */
function clearAllErrors() {
  document.querySelectorAll(".input-error").forEach((input) => {
    input.classList.remove("input-error");
  });
  document.querySelectorAll(".error-message").forEach((error) => {
    error.style.display = "none";
  });
}

/**
 * Validate entire form
 * @returns {boolean} - Validation result
 */
function validateForm() {
  clearAllErrors();

  const emailValid = validateField(emailInput);
  const passwordValid = validateField(passwordInput);

  return emailValid && passwordValid;
}

/**
 * Handle login form submission
 * @param {Event} e - Submit event
 */
async function handleLogin(e) {
  e.preventDefault();

  // Validate form
  if (!validateForm()) {
    return;
  }

  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const rememberMe = rememberMeCheckbox.checked;

  try {
    showLoader();

    // API call to login endpoint
    const response = await fetch(`${API_CONFIG.API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    hideLoader();

    if (response.ok && data.success) {
      // Store auth token and user data
      setAuthToken(data.token, rememberMe);
      setUserData(data.user);

      // Show success notification
      showNotification("Login successful! Redirecting...", "success");

      // Redirect based on user role
      setTimeout(() => {
        redirectUser(data.user.role);
      }, 1000);
    } else {
      // Show error message
      const errorMessage =
        data.message || "Invalid email or password. Please try again.";
      showNotification(errorMessage, "error");

      // Highlight email field for credential errors
      if (
        errorMessage.toLowerCase().includes("email") ||
        errorMessage.toLowerCase().includes("password") ||
        errorMessage.toLowerCase().includes("credentials")
      ) {
        showFieldError(emailInput, "Invalid credentials");
      }
    }
  } catch (error) {
    hideLoader();
    console.error("Login error:", error);
    showNotification(
      "Unable to connect to server. Please try again later.",
      "error",
    );
  }
}

/**
 * Redirect user based on role
 * @param {string} role - User role
 */
function redirectUser(role) {
  switch (role) {
    case "ADMIN":
      window.location.href = "../admin/dashboard.html";
      break;
    case "HOST":
      window.location.href = "../host/dashboard.html";
      break;
    case "USER":
    default:
      window.location.href = "../user/dashboard.html";
      break;
  }
}

/**
 * Check if user credentials are remembered
 */
function checkRememberedUser() {
  const rememberedEmail = localStorage.getItem("rememberedEmail");
  if (rememberedEmail) {
    emailInput.value = rememberedEmail;
    rememberMeCheckbox.checked = true;
  }
}
