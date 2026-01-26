import { register } from "../services/auth.service.js";
import {
  validateEmail,
  validatePassword,
  validatePhone,
} from "../base/validators.js";

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");

  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister);
  }
});

async function handleRegister(event) {
  event.preventDefault();

  // 1. Collect Data
  const formData = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    password: document.getElementById("password").value.trim(),
    role: document.getElementById("role").value, // "USER" or "HOST"
    license: document.getElementById("license").value.trim(),
    address: document.getElementById("address").value.trim(),
  };

  // 2. Validation
  if (!formData.name || formData.name.length < 2) {
    alert("Please enter a valid name (at least 2 characters)");
    return;
  }

  if (!validateEmail(formData.email)) {
    alert("Please enter a valid email address");
    return;
  }

  if (!validatePhone(formData.phone)) {
    alert("Please enter a valid 10-digit phone number");
    return;
  }

  if (!validatePassword(formData.password)) {
    alert("Password must be at least 6 characters long");
    return;
  }

  if (!formData.license) {
    alert("Please enter your license number");
    return;
  }

  // 3. Terms checkbox validation
  const termsCheckbox = document.getElementById("terms");
  if (termsCheckbox && !termsCheckbox.checked) {
    alert("Please accept the Terms & Conditions");
    return;
  }

  const submitBtn = document.querySelector("button[type='submit']");
  const originalText = submitBtn.innerText;
  submitBtn.innerText = "Creating Account...";
  submitBtn.disabled = true;

  try {
    // 4. Send POST Request to Backend
    const response = await register(formData);

    // 5. Handle Success
    alert(response.message || "Registration Successful! Please login.");

    // Redirect to login page
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1000);
  } catch (error) {
    console.error("Registration error:", error);
    alert(error.message || "Registration failed. Please try again.");
  } finally {
    submitBtn.innerText = originalText;
    submitBtn.disabled = false;
  }
}
