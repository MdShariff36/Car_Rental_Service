// ============================================================================
// FILE: assets/js/base/validators.js
// ============================================================================

/**
 * Form Validation Functions
 * Reusable validators for form inputs
 */

const Validators = {
  /**
   * Validate required field
   */
  required(value, fieldName = "This field") {
    if (!value || value.trim() === "") {
      return { valid: false, message: `${fieldName} is required` };
    }
    return { valid: true, message: "" };
  },

  /**
   * Validate email
   */
  email(value) {
    if (!value) {
      return { valid: false, message: "Email is required" };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return { valid: false, message: "Please enter a valid email address" };
    }

    return { valid: true, message: "" };
  },

  /**
   * Validate phone number
   */
  phone(value) {
    if (!value) {
      return { valid: false, message: "Phone number is required" };
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(value)) {
      return {
        valid: false,
        message: "Please enter a valid 10-digit phone number",
      };
    }

    return { valid: true, message: "" };
  },

  /**
   * Validate password
   */
  password(value, minLength = 8) {
    if (!value) {
      return { valid: false, message: "Password is required" };
    }

    if (value.length < minLength) {
      return {
        valid: false,
        message: `Password must be at least ${minLength} characters long`,
      };
    }

    // Check for at least one uppercase, one lowercase, and one number
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      return {
        valid: false,
        message: "Password must contain uppercase, lowercase, and number",
      };
    }

    return { valid: true, message: "" };
  },

  /**
   * Validate confirm password
   */
  confirmPassword(password, confirmPassword) {
    if (!confirmPassword) {
      return { valid: false, message: "Please confirm your password" };
    }

    if (password !== confirmPassword) {
      return { valid: false, message: "Passwords do not match" };
    }

    return { valid: true, message: "" };
  },

  /**
   * Validate min length
   */
  minLength(value, length, fieldName = "This field") {
    if (!value || value.length < length) {
      return {
        valid: false,
        message: `${fieldName} must be at least ${length} characters`,
      };
    }
    return { valid: true, message: "" };
  },

  /**
   * Validate max length
   */
  maxLength(value, length, fieldName = "This field") {
    if (value && value.length > length) {
      return {
        valid: false,
        message: `${fieldName} must not exceed ${length} characters`,
      };
    }
    return { valid: true, message: "" };
  },

  /**
   * Validate number
   */
  number(value, fieldName = "This field") {
    if (!value) {
      return { valid: false, message: `${fieldName} is required` };
    }

    if (isNaN(value)) {
      return { valid: false, message: `${fieldName} must be a valid number` };
    }

    return { valid: true, message: "" };
  },

  /**
   * Validate min value
   */
  min(value, minValue, fieldName = "This field") {
    const num = parseFloat(value);
    if (isNaN(num) || num < minValue) {
      return {
        valid: false,
        message: `${fieldName} must be at least ${minValue}`,
      };
    }
    return { valid: true, message: "" };
  },

  /**
   * Validate max value
   */
  max(value, maxValue, fieldName = "This field") {
    const num = parseFloat(value);
    if (isNaN(num) || num > maxValue) {
      return {
        valid: false,
        message: `${fieldName} must not exceed ${maxValue}`,
      };
    }
    return { valid: true, message: "" };
  },

  /**
   * Validate date
   */
  date(value, fieldName = "Date") {
    if (!value) {
      return { valid: false, message: `${fieldName} is required` };
    }

    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return {
        valid: false,
        message: `Please enter a valid ${fieldName.toLowerCase()}`,
      };
    }

    return { valid: true, message: "" };
  },

  /**
   * Validate future date
   */
  futureDate(value, fieldName = "Date") {
    const dateValidation = this.date(value, fieldName);
    if (!dateValidation.valid) return dateValidation;

    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return {
        valid: false,
        message: `${fieldName} must be today or in the future`,
      };
    }

    return { valid: true, message: "" };
  },

  /**
   * Validate date range
   */
  dateRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      return { valid: false, message: "End date must be after start date" };
    }

    return { valid: true, message: "" };
  },

  /**
   * Show error message on input field
   */
  showError(inputElement, message) {
    if (!inputElement) return;

    // Remove existing error
    this.clearError(inputElement);

    // Add error class
    inputElement.classList.add("error");

    // Create error message element
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent = message;

    // Insert after input
    inputElement.parentNode.insertBefore(errorDiv, inputElement.nextSibling);
  },

  /**
   * Clear error message from input field
   */
  clearError(inputElement) {
    if (!inputElement) return;

    inputElement.classList.remove("error");

    const errorMessage =
      inputElement.parentNode.querySelector(".error-message");
    if (errorMessage) {
      errorMessage.remove();
    }
  },

  /**
   * Validate entire form
   */
  validateForm(formElement) {
    if (!formElement) return false;

    let isValid = true;
    const inputs = formElement.querySelectorAll(
      "input[required], textarea[required], select[required]",
    );

    inputs.forEach((input) => {
      const validation = this.required(
        input.value,
        input.placeholder || "This field",
      );
      if (!validation.valid) {
        this.showError(input, validation.message);
        isValid = false;
      }
    });

    return isValid;
  },
};

export default Validators;
