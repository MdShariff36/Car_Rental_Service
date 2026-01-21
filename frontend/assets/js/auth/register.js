import { API_BASE } from "../base/config.js"; // Ensure config.js has: export const API_BASE = "http://localhost:8080/api";

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister);
  }
});

async function handleRegister(event) {
  event.preventDefault(); // Stop page reload

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
  if (formData.password.length < 6) {
    alert("Password must be at least 6 characters long.");
    return;
  }

  const submitBtn = document.querySelector("button[type='submit']");
  submitBtn.innerText = "Creating Account...";
  submitBtn.disabled = true;

  try {
    // 3. Send POST Request to Backend
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    // 4. Handle Success or Failure
    if (response.ok) {
      alert("Registration Successful! Please login.");
      window.location.href = "login.html";
    } else {
      alert(result.message || "Registration failed. Please try again.");
    }
  } catch (error) {
    console.error("Error during registration:", error);
    alert("Network error. Is the backend server running?");
  } finally {
    submitBtn.innerText = "Create Account";
    submitBtn.disabled = false;
  }
}
