// FILE: frontend/assets/js/auth/register.js
import { register } from "../services/auth.service.js";
import { setToken, setUser } from "../base/storage.js";

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");

  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister);
  }
});

async function handleRegister(event) {
  event.preventDefault();

  // Show loading state
  const submitBtn = event.target.querySelector("button[type='submit']");
  const originalText = submitBtn.innerText;
  submitBtn.innerText = "Creating Account...";
  submitBtn.disabled = true;

  try {
    // Collect form data
    const formData = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      password: document.getElementById("password").value.trim(),
      role: document.getElementById("role").value,
      license: document.getElementById("license").value.trim(),
      address: document.getElementById("address").value.trim(),
    };

    // Validate password
    if (formData.password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    // Call backend API
    const response = await register(formData);

    // Store token and user data
    if (response.token) {
      setToken(response.token);
      setUser(response.user);
    }

    // Show success message
    alert(
      response.message || "Registration successful! Redirecting to login...",
    );

    // Redirect to login page
    window.location.href = "../login.html";
  } catch (error) {
    console.error("Registration error:", error);
    alert(error.message || "Registration failed. Please try again.");

    // Reset button
    submitBtn.innerText = originalText;
    submitBtn.disabled = false;
  }
}
