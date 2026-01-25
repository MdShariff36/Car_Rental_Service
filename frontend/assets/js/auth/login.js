// FILE: frontend/assets/js/auth/login.js
import { login } from "../services/auth.service.js";
import { setToken, setUser } from "../base/storage.js";
import { validateEmail, validatePassword } from "../base/validators.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("form");

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }
});

async function handleLogin(event) {
  event.preventDefault();

  const emailInput = event.target.querySelector("input[type='email']");
  const passwordInput = event.target.querySelector("input[type='password']");
  const submitBtn = event.target.querySelector("button[type='submit']");

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  // Validate inputs
  if (!validateEmail(email)) {
    alert("Please enter a valid email address");
    return;
  }

  if (!validatePassword(password)) {
    alert("Password must be at least 6 characters");
    return;
  }

  // Show loading state
  const originalText = submitBtn.innerText;
  submitBtn.innerText = "Signing In...";
  submitBtn.disabled = true;

  try {
    // Call backend API
    const response = await login(email, password);

    // Store token and user data
    setToken(response.token);
    setUser(response.user);

    // Show success message
    alert(response.message || "Login successful!");

    // Redirect based on user role
    const user = response.user;

    if (user.role === "ADMIN") {
      window.location.href = "../admin/dashboard.html";
    } else if (user.role === "HOST") {
      window.location.href = "../host/dashboard.html";
    } else {
      window.location.href = "../user/dashboard.html";
    }
  } catch (error) {
    console.error("Login error:", error);
    alert(error.message || "Login failed. Please check your credentials.");

    // Reset button
    submitBtn.innerText = originalText;
    submitBtn.disabled = false;
  }
}
