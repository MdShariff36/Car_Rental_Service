/**
 * Registration Form Handler
 * Handles user registration with comprehensive validation
 */

// Import required modules
import { showLoader, hideLoader } from "../components/loader.js";
import { showNotification } from "../ui/notifications.js";
import { validateEmail, validatePhone } from "../base/validators.js";
import { setAuthToken, setUserData } from "../base/storage.js";
import API_CONFIG from "../base/config.js";

// DOM Elements
const registerForm = document.getElementById("registerForm");
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const licenseNumberInput = document.getElementById("licenseNumber");
const licenseExpiryInput = document.getElementById("licenseExpiry");
const roleRadios = document.querySelectorAll('input[name="role"]');
const acceptTermsCheckbox = document.getElementById("acceptTerms");
const newsletterCheckbox = document.getElementById("newsletter");
const togglePasswordBtn = document.getElementById("togglePassword");
const submitBtn = document.getElementById("submitBtn");

// Password strength elements
const passwordStrengthContainer = document.getElementById("passwordStrength");
const strengthFill = passwordStrengthContainer?.querySelector(".strength-fill");
const strengthText = passwordStrengthContainer?.querySelector(".strength-text");
const passwordRequirements = {
  length: document.getElementById("req-length"),
  upper: document.getElementById("req-upper"),
  lower: document.getElementById("req-lower"),
  number: document.getElementById("req-number"),
};

/**
 * Initialize registration page
 */
document.addEventListener("DOMContentLoaded", () => {
  initializePasswordToggle();
  initializePasswordStrength();
  initializeFormValidation();
  setMinLicenseExpiryDate();
});

/**
 * Toggle password visibility
 */
function initializePasswordToggle() {
  if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener("click", () => {
      const type = passwordInput.type === "password" ? "text" : "password";
      passwordInput.type = type;
      confirmPasswordInput.type = type;
      togglePasswordBtn.textContent = type === "password" ? "👁️" : "🙈";
    });
  }
}

/**
 * Initialize password strength indicator
 */
function initializePasswordStrength() {
  if (!passwordInput || !passwordStrengthContainer) return;

  passwordInput.addEventListener("input", () => {
    const password = passwordInput.value;
    updatePasswordStrength(password);
  });
}

/**
 * Update password strength indicator
 * @param {string} password - Password value
 */
function updatePasswordStrength(password) {
  const requirements = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };

  // Update requirement indicators
  Object.keys(requirements).forEach((key) => {
    const element = passwordRequirements[key];
    if (element) {
      if (requirements[key]) {
        element.classList.add("met");
        element.innerHTML = `✓ ${element.textContent.replace("✓ ", "")}`;
      } else {
        element.classList.remove("met");
        element.textContent = element.textContent.replace("✓ ", "");
      }
    }
  });

  // Calculate strength
  const metRequirements = Object.values(requirements).filter(Boolean).length;
  let strength = 0;
  let strengthLabel = "Weak";
  let strengthColor = "#ef4444";

  if (metRequirements === 4) {
    strength = 100;
    strengthLabel = "Strong";
    strengthColor = "#10b981";
  } else if (metRequirements === 3) {
    strength = 75;
    strengthLabel = "Good";
    strengthColor = "#3b82f6";
  } else if (metRequirements === 2) {
    strength = 50;
    strengthLabel = "Fair";
    strengthColor = "#f59e0b";
  } else if (metRequirements === 1) {
    strength = 25;
    strengthLabel = "Weak";
    strengthColor = "#ef4444";
  }

  // Update strength bar
  if (strengthFill) {
    strengthFill.style.width = `${strength}%`;
    strengthFill.style.backgroundColor = strengthColor;
  }

  if (strengthText) {
    strengthText.textContent = strengthLabel;
    strengthText.style.color = strengthColor;
  }
}

/**
 * Set minimum license expiry date to today
 */
function setMinLicenseExpiryDate() {
  if (licenseExpiryInput) {
    const today = new Date().toISOString().split("T")[0];
    licenseExpiryInput.min = today;
  }
}

/**
 * Initialize form validation and submission
 */
function initializeFormValidation() {
  if (!registerForm) return;

  // Add blur event listeners for validation
  const fields = [
    firstNameInput,
    lastNameInput,
    emailInput,
    phoneInput,
    passwordInput,
    confirmPasswordInput,
    licenseNumberInput,
    licenseExpiryInput,
  ];

  fields.forEach((field) => {
    if (field) {
      field.addEventListener("blur", () => validateField(field));
    }
  });

  // Handle form submission
  registerForm.addEventListener("submit", handleRegistration);
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

  // First Name validation
  if (fieldId === "firstName") {
    if (!value) {
      showFieldError(field, "First name is required");
      return false;
    }
    if (value.length < 2) {
      showFieldError(field, "First name must be at least 2 characters");
      return false;
    }
  }

  // Last Name validation
  if (fieldId === "lastName") {
    if (!value) {
      showFieldError(field, "Last name is required");
      return false;
    }
    if (value.length < 2) {
      showFieldError(field, "Last name must be at least 2 characters");
      return false;
    }
  }

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

  // Phone validation
  if (fieldId === "phone") {
    if (!value) {
      showFieldError(field, "Phone number is required");
      return false;
    }
    if (!validatePhone(value)) {
      showFieldError(field, "Please enter a valid phone number");
      return false;
    }
  }

  // Password validation
  if (fieldId === "password") {
    if (!value) {
      showFieldError(field, "Password is required");
      return false;
    }
    if (value.length < 8) {
      showFieldError(field, "Password must be at least 8 characters");
      return false;
    }
    if (!/[A-Z]/.test(value)) {
      showFieldError(
        field,
        "Password must contain at least one uppercase letter",
      );
      return false;
    }
    if (!/[a-z]/.test(value)) {
      showFieldError(
        field,
        "Password must contain at least one lowercase letter",
      );
      return false;
    }
    if (!/[0-9]/.test(value)) {
      showFieldError(field, "Password must contain at least one number");
      return false;
    }
  }

  // Confirm Password validation
  if (fieldId === "confirmPassword") {
    if (!value) {
      showFieldError(field, "Please confirm your password");
      return false;
    }
    if (value !== passwordInput.value) {
      showFieldError(field, "Passwords do not match");
      return false;
    }
  }

  // License Number validation
  if (fieldId === "licenseNumber") {
    if (!value) {
      showFieldError(field, "License number is required");
      return false;
    }
    // Basic format validation (adjust based on your requirements)
    if (value.length < 8) {
      showFieldError(field, "Please enter a valid license number");
      return false;
    }
  }

  // License Expiry validation
  if (fieldId === "licenseExpiry") {
    if (!value) {
      showFieldError(field, "License expiry date is required");
      return false;
    }
    const expiryDate = new Date(value);
    const today = new Date();
    if (expiryDate <= today) {
      showFieldError(field, "License must be valid (not expired)");
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

  const firstNameValid = validateField(firstNameInput);
  const lastNameValid = validateField(lastNameInput);
  const emailValid = validateField(emailInput);
  const phoneValid = validateField(phoneInput);
  const passwordValid = validateField(passwordInput);
  const confirmPasswordValid = validateField(confirmPasswordInput);
  const licenseNumberValid = validateField(licenseNumberInput);
  const licenseExpiryValid = validateField(licenseExpiryInput);

  // Check terms acceptance
  if (!acceptTermsCheckbox.checked) {
    showNotification("Please accept the terms and conditions", "error");
    return false;
  }

  return (
    firstNameValid &&
    lastNameValid &&
    emailValid &&
    phoneValid &&
    passwordValid &&
    confirmPasswordValid &&
    licenseNumberValid &&
    licenseExpiryValid
  );
}

/**
 * Get selected role
 * @returns {string} - Selected role
 */
function getSelectedRole() {
  const selectedRole = document.querySelector('input[name="role"]:checked');
  return selectedRole ? selectedRole.value : "USER";
}

/**
 * Handle registration form submission
 * @param {Event} e - Submit event
 */
async function handleRegistration(e) {
  e.preventDefault();

  // Validate form
  if (!validateForm()) {
    return;
  }

  // Disable submit button to prevent double submission
  submitBtn.disabled = true;
  submitBtn.textContent = "Creating Account...";

  const registrationData = {
    firstName: firstNameInput.value.trim(),
    lastName: lastNameInput.value.trim(),
    email: emailInput.value.trim(),
    phone: phoneInput.value.trim(),
    password: passwordInput.value,
    licenseNumber: licenseNumberInput.value.trim(),
    licenseExpiry: licenseExpiryInput.value,
    role: getSelectedRole(),
    newsletter: newsletterCheckbox.checked,
  };

  try {
    showLoader();

    // API call to registration endpoint
    const response = await fetch(`${API_CONFIG.API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registrationData),
    });

    const data = await response.json();

    hideLoader();

    if (response.ok && data.success) {
      // Store auth token and user data
      setAuthToken(data.token);
      setUserData(data.user);

      // Show success notification
      showNotification(
        "Registration successful! Redirecting to your dashboard...",
        "success",
      );

      // Redirect based on user role
      setTimeout(() => {
        redirectUser(data.user.role);
      }, 1500);
    } else {
      // Show error message
      const errorMessage =
        data.message || "Registration failed. Please try again.";
      showNotification(errorMessage, "error");

      // Handle specific field errors
      if (data.errors) {
        Object.keys(data.errors).forEach((field) => {
          const fieldElement = document.getElementById(field);
          if (fieldElement) {
            showFieldError(fieldElement, data.errors[field]);
          }
        });
      }

      // Re-enable submit button
      submitBtn.disabled = false;
      submitBtn.textContent = "Create Account";
    }
  } catch (error) {
    hideLoader();
    console.error("Registration error:", error);
    showNotification(
      "Unable to connect to server. Please try again later.",
      "error",
    );

    // Re-enable submit button
    submitBtn.disabled = false;
    submitBtn.textContent = "Create Account";
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
