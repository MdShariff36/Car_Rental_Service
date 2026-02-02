// FILE: assets/js/admin/login.js

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("adminLoginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const submitBtn = loginForm.querySelector(".submit-btn");

  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      showNotification("Please enter email and password", "error");
      return;
    }

    setLoadingState(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Check if user is admin
      if (data.user.role !== "ADMIN") {
        throw new Error("Access denied. Admin access only.");
      }

      // Store auth data
      AuthService.setToken(data.token);
      AuthService.setCurrentUser(data.user);

      showNotification("Login successful", "success");

      setTimeout(() => {
        window.location.href = "/admin/dashboard.html";
      }, 1000);
    } catch (error) {
      console.error("Admin login error:", error);
      showNotification(error.message || "Login failed", "error");
    } finally {
      setLoadingState(false);
    }
  });

  function setLoadingState(loading) {
    if (loading) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="btn-text">Logging in...</span>';
      emailInput.disabled = true;
      passwordInput.disabled = true;
    } else {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span class="btn-text">Login</span>';
      emailInput.disabled = false;
      passwordInput.disabled = false;
    }
  }

  function showNotification(message, type) {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
            </div>
        `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
  }
});
