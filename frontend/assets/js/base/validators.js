// FILE: assets/js/base/validators.js

import { CONFIG } from "./config.js";

export const validateEmail = (email) => {
  if (!email) return { valid: false, message: "Email is required" };
  if (!CONFIG.VALIDATION.EMAIL_REGEX.test(email)) {
    return { valid: false, message: "Invalid email format" };
  }
  return { valid: true, message: "" };
};

export const validatePassword = (password) => {
  if (!password) return { valid: false, message: "Password is required" };
  if (password.length < CONFIG.VALIDATION.PASSWORD_MIN_LENGTH) {
    return {
      valid: false,
      message: `Password must be at least ${CONFIG.VALIDATION.PASSWORD_MIN_LENGTH} characters`,
    };
  }
  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      message: "Password must contain at least one uppercase letter",
    };
  }
  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      message: "Password must contain at least one lowercase letter",
    };
  }
  if (!/[0-9]/.test(password)) {
    return {
      valid: false,
      message: "Password must contain at least one number",
    };
  }
  return { valid: true, message: "" };
};

export const validateName = (name) => {
  if (!name) return { valid: false, message: "Name is required" };
  if (name.length < CONFIG.VALIDATION.NAME_MIN_LENGTH) {
    return {
      valid: false,
      message: `Name must be at least ${CONFIG.VALIDATION.NAME_MIN_LENGTH} characters`,
    };
  }
  if (name.length > CONFIG.VALIDATION.NAME_MAX_LENGTH) {
    return {
      valid: false,
      message: `Name must not exceed ${CONFIG.VALIDATION.NAME_MAX_LENGTH} characters`,
    };
  }
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    return {
      valid: false,
      message: "Name can only contain letters and spaces",
    };
  }
  return { valid: true, message: "" };
};

export const validatePhone = (phone) => {
  if (!phone) return { valid: false, message: "Phone number is required" };
  if (!CONFIG.VALIDATION.PHONE_REGEX.test(phone)) {
    return { valid: false, message: "Invalid phone number format" };
  }
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) {
    return { valid: false, message: "Phone number must be at least 10 digits" };
  }
  return { valid: true, message: "" };
};

export const validateRequired = (value, fieldName = "This field") => {
  if (!value || (typeof value === "string" && !value.trim())) {
    return { valid: false, message: `${fieldName} is required` };
  }
  return { valid: true, message: "" };
};

export const validateMinLength = (
  value,
  minLength,
  fieldName = "This field",
) => {
  if (!value || value.length < minLength) {
    return {
      valid: false,
      message: `${fieldName} must be at least ${minLength} characters`,
    };
  }
  return { valid: true, message: "" };
};

export const validateMaxLength = (
  value,
  maxLength,
  fieldName = "This field",
) => {
  if (value && value.length > maxLength) {
    return {
      valid: false,
      message: `${fieldName} must not exceed ${maxLength} characters`,
    };
  }
  return { valid: true, message: "" };
};

export const validateNumber = (value, fieldName = "This field") => {
  if (isNaN(value) || value === "") {
    return { valid: false, message: `${fieldName} must be a valid number` };
  }
  return { valid: true, message: "" };
};

export const validateMin = (value, min, fieldName = "This field") => {
  if (parseFloat(value) < min) {
    return { valid: false, message: `${fieldName} must be at least ${min}` };
  }
  return { valid: true, message: "" };
};

export const validateMax = (value, max, fieldName = "This field") => {
  if (parseFloat(value) > max) {
    return { valid: false, message: `${fieldName} must not exceed ${max}` };
  }
  return { valid: true, message: "" };
};

export const validateDate = (date, fieldName = "Date") => {
  if (!date) return { valid: false, message: `${fieldName} is required` };
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return {
      valid: false,
      message: `Invalid ${fieldName.toLowerCase()} format`,
    };
  }
  return { valid: true, message: "" };
};

export const validateDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime())) {
    return { valid: false, message: "Invalid start date" };
  }
  if (isNaN(end.getTime())) {
    return { valid: false, message: "Invalid end date" };
  }
  if (end <= start) {
    return { valid: false, message: "End date must be after start date" };
  }
  return { valid: true, message: "" };
};

export const validateURL = (url) => {
  if (!url) return { valid: false, message: "URL is required" };
  try {
    new URL(url);
    return { valid: true, message: "" };
  } catch (e) {
    return { valid: false, message: "Invalid URL format" };
  }
};

export const validateFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ["image/jpeg", "image/png", "image/jpg"],
  } = options;

  if (!file) return { valid: false, message: "File is required" };

  if (file.size > maxSize) {
    const sizeMB = Math.round(maxSize / (1024 * 1024));
    return { valid: false, message: `File size must not exceed ${sizeMB}MB` };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, message: "Invalid file type" };
  }

  return { valid: true, message: "" };
};

export const validateForm = (formData, rules) => {
  const errors = {};
  let isValid = true;

  Object.keys(rules).forEach((field) => {
    const fieldRules = rules[field];
    const value = formData[field];

    for (const rule of fieldRules) {
      const result = rule(value);
      if (!result.valid) {
        errors[field] = result.message;
        isValid = false;
        break;
      }
    }
  });

  return { isValid, errors };
};

export const showFieldError = (fieldId, message) => {
  const field = document.getElementById(fieldId);
  if (!field) return;

  field.classList.add("is-invalid");
  field.classList.remove("is-valid");

  let errorDiv = field.nextElementSibling;
  if (!errorDiv || !errorDiv.classList.contains("invalid-feedback")) {
    errorDiv = document.createElement("div");
    errorDiv.className = "invalid-feedback";
    field.parentNode?.insertBefore(errorDiv, field.nextSibling);
  }
  errorDiv.textContent = message;
};

export const showFieldSuccess = (fieldId) => {
  const field = document.getElementById(fieldId);
  if (!field) return;

  field.classList.add("is-valid");
  field.classList.remove("is-invalid");

  const errorDiv = field.nextElementSibling;
  if (errorDiv?.classList.contains("invalid-feedback")) {
    errorDiv.textContent = "";
  }
};

export const clearFieldValidation = (fieldId) => {
  const field = document.getElementById(fieldId);
  if (!field) return;

  field.classList.remove("is-valid", "is-invalid");

  const errorDiv = field.nextElementSibling;
  if (errorDiv?.classList.contains("invalid-feedback")) {
    errorDiv.textContent = "";
  }
};

export const clearFormValidation = (formId) => {
  const form = document.getElementById(formId);
  if (!form) return;

  form.querySelectorAll(".is-valid, .is-invalid").forEach((field) => {
    field.classList.remove("is-valid", "is-invalid");
  });

  form.querySelectorAll(".invalid-feedback").forEach((error) => {
    error.textContent = "";
  });
};
