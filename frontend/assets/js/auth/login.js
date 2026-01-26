import { login } from "../services/auth.service.js";
import { validateEmail, validatePassword } from "../base/validators.js";
import { getUser } from "../base/storage.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("form");

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }
});

async function handleLogin(event) {
  event.preventDefault();

  const email = document.querySelector("input[type='email']").value.trim();
  const password = document
    .querySelector("input[type='password']")
    .value.trim();

  // Validation
  if (!validateEmail(email)) {
    alert("Please enter a valid email address");
    return;
  }

  if (!validatePassword(password)) {
    alert("Password must be at least 6 characters long");
    return;
  }

  const submitBtn = document.querySelector("button[type='submit']");
  const originalText = submitBtn.innerText;
  submitBtn.innerText = "Signing In...";
  submitBtn.disabled = true;

  try {
    const response = await login(email, password);

    console.log("Login response:", response);

    // Get user from storage (it was saved by the login service)
    const user = getUser();

    console.log("User from storage:", user);

    if (!user) {
      throw new Error("User data not found after login");
    }

    alert(response.message || "Login successful!");

    // Redirect based on user role
    setTimeout(() => {
      if (user.role === "ADMIN") {
        console.log("Redirecting to admin dashboard");
        window.location.href = "/admin/dashboard.html";
      } else if (user.role === "HOST") {
        console.log("Redirecting to host dashboard");
        window.location.href = "/host/dashboard.html";
      } else {
        console.log("Redirecting to user dashboard");
        window.location.href = "/user/dashboard.html";
      }
    }, 500);
  } catch (error) {
    console.error("Login error:", error);
    alert(error.message || "Login failed. Please check your credentials.");
  } finally {
    submitBtn.innerText = originalText;
    submitBtn.disabled = false;
  }
}
