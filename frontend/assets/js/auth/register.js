import { Storage } from "../base/storage.js";
import { CONFIG } from "../base/config.js";

const form = document.getElementById("registerForm");

// Check if form exists to prevent "null" errors
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const license = document.getElementById("license").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;

    // Validation [cite: 2738-2747]
    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    const users = Storage.get("users") || [];
    if (users.some((u) => u.email === email)) {
      alert("Email already registered");
      return;
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      phone,
      license,
      password,
      role,
    };

    users.push(newUser);
    Storage.set("users", users);

    alert("Registration successful! Redirecting to login...");
    window.location.href = "login.html";
  });
}
