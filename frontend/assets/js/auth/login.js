import { Storage } from "../base/storage.js";
import { CONFIG } from "../base/config.js";

const form = document.getElementById("loginForm");

form.addEventListener("submit", function (e) {
  e.preventDefault(); // 🔴 VERY IMPORTANT

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const users = Storage.get("users") || [];

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    alert("Invalid email or password");
    return;
  }

  Storage.set(CONFIG.STORAGE_KEYS.USER, user);
  Storage.set(CONFIG.STORAGE_KEYS.TOKEN, "frontend-login-token");

  // Redirect based on role
  if (user.role === "ADMIN") {
    window.location.href = "admin/dashboard.html";
  } else if (user.role === "HOST") {
    window.location.href = "host/dashboard.html";
  } else {
    window.location.href = "user/dashboard.html";
  }
});
