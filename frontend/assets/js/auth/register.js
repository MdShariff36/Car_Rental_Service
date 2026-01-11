import { Storage } from "../base/storage.js";

const form = document.getElementById("registerForm");

form.addEventListener("submit", function (e) {
  e.preventDefault(); // 🔴 VERY IMPORTANT

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;

  if (!name || !email || !password) {
    alert("All fields are required");
    return;
  }

  const users = Storage.get("users") || [];

  const exists = users.some((u) => u.email === email);
  if (exists) {
    alert("Email already registered");
    return;
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    password, // frontend only (backend will hash)
    role,
  };

  users.push(newUser);
  Storage.set("users", users);

  alert("Registration successful. Please login.");
  window.location.href = "login.html";
});
